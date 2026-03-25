import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildBenchmarkReadiness,
  buildPersistedBenchmarkHistorySummary,
  buildPersistedBenchmarkReceipt,
  buildLiveBenchmarkPreflight,
  evaluateLiveBenchmarkProof,
  persistBenchmarkReceiptArtifacts,
} from "../scripts/cyborgclaw/voltaris-v2-live-benchmark-gate.ts";
import type { AuthProfileStore } from "../src/agents/auth-profiles/types.js";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map(async (dirPath) => {
      await fs.rm(dirPath, { recursive: true, force: true });
    }),
  );
});

function makeStore(overrides?: Partial<AuthProfileStore>): AuthProfileStore {
  return {
    version: 1,
    profiles: {},
    ...overrides,
  };
}

describe("buildLiveBenchmarkPreflight", () => {
  it("fails clearly when the live lane is disabled and auth state is absent", () => {
    const result = buildLiveBenchmarkPreflight({
      enabled: false,
      modelRef: "openai-codex/gpt-5.3-codex",
      authSourceStateDir: null,
      authStorePath: null,
      authStorePresent: false,
      authStore: null,
    });

    expect(result.ok).toBe(false);
    expect(result.failureReasons).toContain(
      "OPENCLAW_LIVE_BENCHMARK_ENABLED must be set to true before the live benchmark may run.",
    );
    expect(result.failureReasons).toContain(
      "No auth source state dir was provided or seeded. Supply --auth-source-state-dir or OPENCLAW_LIVE_BENCHMARK_AUTH_PROFILES_JSON.",
    );
    expect(result.failureReasons).toContain(
      "No auth-profiles store path could be resolved for the benchmark run.",
    );
  });

  it("accepts a ready provider profile and ignores disabled ones", () => {
    const result = buildLiveBenchmarkPreflight({
      enabled: true,
      modelRef: "openai-codex/gpt-5.3-codex",
      authSourceStateDir: "/tmp/openclaw-state",
      authStorePath: "/tmp/openclaw-state/agents/main/agent/auth-profiles.json",
      authStorePresent: true,
      authStore: makeStore({
        profiles: {
          ready: { type: "api_key", provider: "openai-codex", key: "sk-ready" },
          disabled: { type: "api_key", provider: "openai-codex", key: "sk-disabled" },
          other: { type: "api_key", provider: "anthropic", key: "sk-other" },
        },
        usageStats: {
          disabled: { disabledUntil: Date.now() + 60_000 },
        },
      }),
    });

    expect(result.ok).toBe(true);
    expect(result.providerId).toBe("openai-codex");
    expect(result.authProfileCount).toBe(3);
    expect(result.readyProfileCount).toBe(1);
    expect(result.readyProfileIds).toEqual(["ready"]);
    expect(result.failureReasons).toEqual([]);
  });

  it("rejects provider readiness when no eligible auth profile remains", () => {
    const result = buildLiveBenchmarkPreflight({
      enabled: true,
      modelRef: "openai-codex/gpt-5.3-codex",
      authSourceStateDir: "/tmp/openclaw-state",
      authStorePath: "/tmp/openclaw-state/agents/main/agent/auth-profiles.json",
      authStorePresent: true,
      authStore: makeStore({
        profiles: {
          disabled: { type: "api_key", provider: "openai-codex", key: "sk-disabled" },
        },
        usageStats: {
          disabled: { disabledUntil: Date.now() + 60_000 },
        },
      }),
    });

    expect(result.ok).toBe(false);
    expect(result.failureReasons).toContain(
      'No ready auth profiles were found for provider "openai-codex" in the auth store.',
    );
  });

  it("treats expired oauth profiles as not ready", () => {
    const result = buildLiveBenchmarkPreflight({
      enabled: true,
      modelRef: "openai-codex/gpt-5.3-codex",
      authSourceStateDir: "/tmp/openclaw-state",
      authStorePath: "/tmp/openclaw-state/agents/main/agent/auth-profiles.json",
      authStorePresent: true,
      authStore: makeStore({
        profiles: {
          expired: {
            type: "oauth",
            provider: "openai-codex",
            access: "expired-access",
            refresh: "expired-refresh",
            expires: Date.now() - 10_000,
          },
        },
      }),
    });

    expect(result.ok).toBe(false);
    expect(result.readyProfileCount).toBe(0);
    expect(result.failureReasons).toContain(
      'No ready auth profiles were found for provider "openai-codex" in the auth store.',
    );
  });

  it("surfaces explicit auth store read errors", () => {
    const result = buildLiveBenchmarkPreflight({
      enabled: true,
      modelRef: "openai-codex/gpt-5.3-codex",
      authSourceStateDir: null,
      authStorePath: "/tmp/missing-auth-profiles.json",
      authStorePresent: false,
      authStore: null,
      authSourceError:
        'Unable to read auth profile store from "/tmp/missing-auth-profiles.json": ENOENT',
    });

    expect(result.ok).toBe(false);
    expect(result.failureReasons).toContain(
      'Unable to read auth profile store from "/tmp/missing-auth-profiles.json": ENOENT',
    );
    expect(result.failureReasons).toContain(
      'Auth profile store is missing at "/tmp/missing-auth-profiles.json".',
    );
  });
});

describe("evaluateLiveBenchmarkProof", () => {
  it("hard-fails when the smoke executor or any assertion reports failure", () => {
    const result = evaluateLiveBenchmarkProof({
      ok: false,
      assertions: {
        validateStatus: true,
        runtimeCreatedNormalSession: false,
        workspaceBootstrapLoaded: "partial",
      },
    });

    expect(result.ok).toBe(false);
    expect(result.failedAssertions).toEqual([
      "runtimeCreatedNormalSession",
      "workspaceBootstrapLoaded",
    ]);
    expect(result.assertionCount).toBe(3);
    expect(result.passedAssertionCount).toBe(1);
    expect(result.failedAssertionCount).toBe(2);
    expect(result.failureReasons).toContain("The live smoke executor did not report ok=true.");
    expect(result.failureReasons).toContain(
      "Failed smoke assertions: runtimeCreatedNormalSession, workspaceBootstrapLoaded",
    );
  });

  it("surfaces a structured smoke error message and fails closed when assertions are missing", () => {
    const result = evaluateLiveBenchmarkProof({
      ok: false,
      error: {
        message: "live transcript proof failed",
      },
    });

    expect(result.ok).toBe(false);
    expect(result.smokeError).toBe("live transcript proof failed");
    expect(result.assertionCount).toBe(0);
    expect(result.failureReasons).toContain(
      "The live smoke executor failed: live transcript proof failed",
    );
    expect(result.failureReasons).toContain(
      "The live smoke executor did not report any proof assertions.",
    );
  });

  it("passes only when the smoke executor and every assertion are true", () => {
    const result = evaluateLiveBenchmarkProof({
      ok: true,
      assertions: {
        validateStatus: true,
        runtimeCreatedNormalSession: true,
      },
    });

    expect(result).toEqual({
      ok: true,
      failedAssertions: [],
      assertionCount: 2,
      passedAssertionCount: 2,
      failedAssertionCount: 0,
      smokeError: null,
      status: "pass",
      failureReasons: [],
    });
  });
});

describe("buildBenchmarkReadiness", () => {
  it("keeps preflight-only runs out of green promotion", () => {
    const preflight = buildLiveBenchmarkPreflight({
      enabled: true,
      modelRef: "openai-codex/gpt-5.3-codex",
      authSourceStateDir: "/tmp/openclaw-state",
      authStorePath: "/tmp/openclaw-state/agents/main/agent/auth-profiles.json",
      authStorePresent: true,
      authStore: makeStore({
        profiles: {
          ready: { type: "api_key", provider: "openai-codex", key: "sk-ready" },
        },
      }),
    });

    const readiness = buildBenchmarkReadiness({
      phase: "preflight",
      preflight,
      verdict: {
        ok: true,
        failedAssertions: [],
        assertionCount: 0,
        passedAssertionCount: 0,
        failedAssertionCount: 0,
        smokeError: null,
        status: "pass",
        failureReasons: [],
      },
    });

    expect(readiness.preflight.status).toBe("ready");
    expect(readiness.proof.status).toBe("not_run");
    expect(readiness.promotion.status).toBe("not_run");
  });

  it("blocks promotion cleanly when proof readiness fails", () => {
    const preflight = buildLiveBenchmarkPreflight({
      enabled: true,
      modelRef: "openai-codex/gpt-5.3-codex",
      authSourceStateDir: "/tmp/openclaw-state",
      authStorePath: "/tmp/openclaw-state/agents/main/agent/auth-profiles.json",
      authStorePresent: true,
      authStore: makeStore({
        profiles: {
          ready: { type: "api_key", provider: "openai-codex", key: "sk-ready" },
        },
      }),
    });
    const verdict = evaluateLiveBenchmarkProof({
      ok: false,
      assertions: {
        validateStatus: true,
        transcriptReplyMatchedPayload: false,
      },
      error: {
        message: "live transcript proof failed",
      },
    });

    const readiness = buildBenchmarkReadiness({
      phase: "run",
      preflight,
      verdict,
    });

    expect(readiness.preflight.status).toBe("ready");
    expect(readiness.proof.status).toBe("blocked");
    expect(readiness.proof.failedAssertionCount).toBe(1);
    expect(readiness.proof.smokeError).toBe("live transcript proof failed");
    expect(readiness.promotion.status).toBe("blocked");
  });

  it("reports proof as not-run when the run is blocked at preflight", () => {
    const preflight = buildLiveBenchmarkPreflight({
      enabled: false,
      modelRef: "openai-codex/gpt-5.3-codex",
      authSourceStateDir: null,
      authStorePath: null,
      authStorePresent: false,
      authStore: null,
    });

    const readiness = buildBenchmarkReadiness({
      phase: "run",
      preflight,
      verdict: {
        ok: false,
        failedAssertions: [],
        assertionCount: 0,
        passedAssertionCount: 0,
        failedAssertionCount: 0,
        smokeError: null,
        status: "fail",
        failureReasons: preflight.failureReasons,
      },
    });

    expect(readiness.preflight.status).toBe("blocked");
    expect(readiness.proof.status).toBe("not_run");
    expect(readiness.promotion.status).toBe("blocked");
  });
});

describe("persisted benchmark receipt artifacts", () => {
  it("sanitizes a passing run into a compact receipt", () => {
    const receipt = buildPersistedBenchmarkReceipt({
      ok: true,
      phase: "run",
      generatedAt: "2026-03-25T00:00:00.000Z",
      packRef: "examples/voltaris-v2-pack",
      profile: "voltaris-proof",
      modelRef: "openai-codex/gpt-5.3-codex",
      repeatRuns: 3,
      repeatDelayMs: 30000,
      greenRunCount: 3,
      preflight: {
        ok: true,
        modelRef: "openai-codex/gpt-5.3-codex",
        providerId: "openai-codex",
        enabled: true,
        authSourceStateDir: "/tmp/auth-source",
        authStorePath: "/tmp/auth-source/agents/main/agent/auth-profiles.json",
        authStorePresent: true,
        authProfileCount: 1,
        readyProfileCount: 1,
        readyProfileIds: ["proof"],
        failureReasons: [],
      },
      readiness: {
        preflight: {
          ok: true,
          status: "ready",
          summary: "Provider auth is ready.",
          providerId: "openai-codex",
          readyProfileCount: 1,
          readyProfileIds: ["proof"],
          failureReasons: [],
        },
        proof: {
          ok: true,
          status: "ready",
          summary: "Smoke proof passed.",
          assertionCount: 18,
          passedAssertionCount: 18,
          failedAssertionCount: 0,
          failedAssertions: [],
          smokeError: null,
          failureReasons: [],
        },
        promotion: {
          ok: true,
          status: "green",
          summary: "Promotion is green.",
          failureReasons: [],
        },
      },
      smoke: {
        runIndex: 3,
        ok: true,
        command: ["node", "smoke.js"],
        stdoutPath: "/tmp/stdout.log",
        stderrPath: "/tmp/stderr.log",
        reportCopyPath: "/tmp/smoke-report.json",
        proofRootCopyPath: "/tmp/smoke-proof",
        proof: {
          ok: true,
          runtimeSmoke: {
            evidenceSummary: {
              requestedProvider: "openai-codex",
              requestedModel: "gpt-5.3-codex",
              resolvedProvider: "openai-codex",
              resolvedModel: "gpt-5.3-codex",
              transcriptProvider: "openai-codex",
              transcriptModel: "gpt-5.3-codex",
              proofStatus: "ready",
            },
          },
        },
      },
      smokeRuns: [
        {
          runIndex: 1,
          ok: true,
          command: ["node", "smoke.js"],
          stdoutPath: null,
          stderrPath: null,
          reportCopyPath: null,
          proofRootCopyPath: null,
          proof: {
            ok: true,
            runtimeSmoke: {
              evidenceSummary: {
                requestedProvider: "openai-codex",
                requestedModel: "gpt-5.3-codex",
                resolvedProvider: "openai-codex",
                resolvedModel: "gpt-5.3-codex",
                transcriptProvider: "openai-codex",
                transcriptModel: "gpt-5.3-codex",
                proofStatus: "ready",
              },
            },
          },
        },
      ],
      verdict: {
        ok: true,
        failedAssertions: [],
        assertionCount: 18,
        passedAssertionCount: 18,
        failedAssertionCount: 0,
        smokeError: null,
        status: "pass",
        failureReasons: [],
      },
    });

    expect(receipt.contractVersion).toBe("openclaw.live-runtime-benchmark-receipt.v1");
    expect(receipt.promotionStatus).toBe("green");
    expect(receipt.latestRun).toMatchObject({
      runIndex: 3,
      requestedProvider: "openai-codex",
      transcriptModel: "gpt-5.3-codex",
    });
    expect(receipt.runs).toHaveLength(1);
    expect(receipt.runs[0]).not.toHaveProperty("stdoutPath");
  });

  it("keeps the last verified green receipt while appending later blocked runs to history", async () => {
    const persistDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-live-benchmark-persist-"));
    tempDirs.push(persistDir);

    const greenReport = {
      ok: true,
      phase: "run",
      generatedAt: "2026-03-25T00:00:00.000Z",
      packRef: "examples/voltaris-v2-pack",
      profile: "voltaris-proof",
      modelRef: "openai-codex/gpt-5.3-codex",
      repeatRuns: 2,
      repeatDelayMs: 0,
      greenRunCount: 2,
      preflight: {
        ok: true,
        modelRef: "openai-codex/gpt-5.3-codex",
        providerId: "openai-codex",
        enabled: true,
        authSourceStateDir: null,
        authStorePath: null,
        authStorePresent: true,
        authProfileCount: 1,
        readyProfileCount: 1,
        readyProfileIds: ["proof"],
        failureReasons: [],
      },
      readiness: {
        preflight: {
          ok: true,
          status: "ready",
          summary: "ready",
          providerId: "openai-codex",
          readyProfileCount: 1,
          readyProfileIds: ["proof"],
          failureReasons: [],
        },
        proof: {
          ok: true,
          status: "ready",
          summary: "ready",
          assertionCount: 4,
          passedAssertionCount: 4,
          failedAssertionCount: 0,
          failedAssertions: [],
          smokeError: null,
          failureReasons: [],
        },
        promotion: {
          ok: true,
          status: "green",
          summary: "green",
          failureReasons: [],
        },
      },
      verdict: {
        ok: true,
        failedAssertions: [],
        assertionCount: 4,
        passedAssertionCount: 4,
        failedAssertionCount: 0,
        smokeError: null,
        status: "pass",
        failureReasons: [],
      },
    };

    const blockedReport = {
      ...greenReport,
      ok: false,
      generatedAt: "2026-03-25T01:00:00.000Z",
      greenRunCount: 0,
      readiness: {
        ...greenReport.readiness,
        proof: {
          ...greenReport.readiness.proof,
          ok: false,
          status: "blocked",
          passedAssertionCount: 3,
          failedAssertionCount: 1,
          failedAssertions: ["transcriptReplyMatchedPayload"],
          failureReasons: ["Transcript proof failed."],
        },
        promotion: {
          ok: false,
          status: "blocked",
          summary: "blocked",
          failureReasons: ["Transcript proof failed."],
        },
      },
      verdict: {
        ok: false,
        failedAssertions: ["transcriptReplyMatchedPayload"],
        assertionCount: 4,
        passedAssertionCount: 3,
        failedAssertionCount: 1,
        smokeError: "Transcript proof failed.",
        status: "fail",
        failureReasons: ["Transcript proof failed."],
      },
    };

    await persistBenchmarkReceiptArtifacts(greenReport, persistDir);
    await persistBenchmarkReceiptArtifacts(blockedReport, persistDir);

    const latestGreen = JSON.parse(
      await fs.readFile(path.join(persistDir, "latest-green-receipt.json"), "utf8"),
    ) as { generatedAt: string; promotionStatus: string };
    const latestReceipt = JSON.parse(
      await fs.readFile(path.join(persistDir, "latest-receipt.json"), "utf8"),
    ) as { generatedAt: string; promotionStatus: string };
    const historyLines = (await fs.readFile(path.join(persistDir, "history.jsonl"), "utf8"))
      .trim()
      .split("\n");
    const greenHistoryLines = (
      await fs.readFile(path.join(persistDir, "green-history.jsonl"), "utf8")
    )
      .trim()
      .split("\n");
    const historySummary = JSON.parse(
      await fs.readFile(path.join(persistDir, "history-summary.json"), "utf8"),
    ) as {
      retainedHistoryCount: number;
      greenReceiptCount: number;
      blockedReceiptCount: number;
      consecutiveGreenCount: number;
      longestGreenStreak: number;
      eventCounts: Record<string, number>;
      runwayMaturityLabel: string;
    };

    expect(latestGreen.generatedAt).toBe("2026-03-25T00:00:00.000Z");
    expect(latestGreen.promotionStatus).toBe("green");
    expect(latestReceipt.generatedAt).toBe("2026-03-25T01:00:00.000Z");
    expect(latestReceipt.promotionStatus).toBe("blocked");
    expect(historyLines).toHaveLength(2);
    expect(greenHistoryLines).toHaveLength(1);
    expect(historySummary.retainedHistoryCount).toBe(2);
    expect(historySummary.greenReceiptCount).toBe(1);
    expect(historySummary.blockedReceiptCount).toBe(1);
    expect(historySummary.consecutiveGreenCount).toBe(0);
    expect(historySummary.longestGreenStreak).toBe(1);
    expect(historySummary.eventCounts).toEqual({ local_manual: 2 });
    expect(historySummary.runwayMaturityLabel).toBe("Ad hoc runway only");
  });

  it("trims retained history and reports the current green streak window", async () => {
    const persistDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-live-benchmark-persist-"));
    tempDirs.push(persistDir);

    const makeReport = (generatedAt: string, promotionStatus: "green" | "blocked") => ({
      ok: promotionStatus === "green",
      phase: "run",
      generatedAt,
      packRef: "examples/voltaris-v2-pack",
      profile: "voltaris-proof",
      modelRef: "openai-codex/gpt-5.3-codex",
      repeatRuns: 1,
      repeatDelayMs: 0,
      greenRunCount: promotionStatus === "green" ? 1 : 0,
      preflight: {
        ok: true,
        modelRef: "openai-codex/gpt-5.3-codex",
        providerId: "openai-codex",
        enabled: true,
        authSourceStateDir: null,
        authStorePath: null,
        authStorePresent: true,
        authProfileCount: 1,
        readyProfileCount: 1,
        readyProfileIds: ["proof"],
        failureReasons: [],
      },
      readiness: {
        preflight: {
          ok: true,
          status: "ready",
          summary: "ready",
          providerId: "openai-codex",
          readyProfileCount: 1,
          readyProfileIds: ["proof"],
          failureReasons: [],
        },
        proof: {
          ok: promotionStatus === "green",
          status: promotionStatus === "green" ? "ready" : "blocked",
          summary: promotionStatus,
          assertionCount: 4,
          passedAssertionCount: promotionStatus === "green" ? 4 : 3,
          failedAssertionCount: promotionStatus === "green" ? 0 : 1,
          failedAssertions: promotionStatus === "green" ? [] : ["proofStatus"],
          smokeError: promotionStatus === "green" ? null : "proofStatus",
          failureReasons: promotionStatus === "green" ? [] : ["proofStatus"],
        },
        promotion: {
          ok: promotionStatus === "green",
          status: promotionStatus,
          summary: promotionStatus,
          failureReasons: promotionStatus === "green" ? [] : ["proofStatus"],
        },
      },
      verdict: {
        ok: promotionStatus === "green",
        failedAssertions: promotionStatus === "green" ? [] : ["proofStatus"],
        assertionCount: 4,
        passedAssertionCount: promotionStatus === "green" ? 4 : 3,
        failedAssertionCount: promotionStatus === "green" ? 0 : 1,
        smokeError: promotionStatus === "green" ? null : "proofStatus",
        status: promotionStatus === "green" ? "pass" : "fail",
        failureReasons: promotionStatus === "green" ? [] : ["proofStatus"],
      },
    });

    const history: Parameters<typeof buildPersistedBenchmarkReceipt>[0][] = [
      makeReport("2026-03-25T00:00:00.000Z", "blocked"),
      makeReport("2026-03-25T01:00:00.000Z", "green"),
      makeReport("2026-03-25T02:00:00.000Z", "green"),
    ];

    for (const report of history) {
      await persistBenchmarkReceiptArtifacts(report, persistDir, 2);
    }

    const historyLines = (await fs.readFile(path.join(persistDir, "history.jsonl"), "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line) as { generatedAt: string; promotionStatus: string });
    const historySummary = JSON.parse(
      await fs.readFile(path.join(persistDir, "history-summary.json"), "utf8"),
    ) as ReturnType<typeof buildPersistedBenchmarkHistorySummary>;

    expect(historyLines).toHaveLength(2);
    expect(historyLines[0].generatedAt).toBe("2026-03-25T01:00:00.000Z");
    expect(historyLines[1].generatedAt).toBe("2026-03-25T02:00:00.000Z");
    expect(historySummary.retainedHistoryCount).toBe(2);
    expect(historySummary.retainedHistoryMax).toBe(2);
    expect(historySummary.greenReceiptCount).toBe(2);
    expect(historySummary.blockedReceiptCount).toBe(0);
    expect(historySummary.consecutiveGreenCount).toBe(2);
    expect(historySummary.longestGreenStreak).toBe(2);
    expect(historySummary.eventCounts).toEqual({ local_manual: 2 });
    expect(historySummary.runwayMaturityLabel).toBe("Ad hoc runway only");
  });

  it("reports scheduled runway health separately from interleaved preflight and manual receipts", () => {
    const makeReceipt = ({
      generatedAt,
      phase,
      eventName,
      ok,
      promotionStatus,
    }: {
      generatedAt: string;
      phase: "preflight" | "run";
      eventName: string;
      ok: boolean;
      promotionStatus: "green" | "blocked" | "not_run";
    }): ReturnType<typeof buildPersistedBenchmarkReceipt> => ({
      contractVersion: "openclaw.live-runtime-benchmark-receipt.v1",
      generatedAt,
      ok,
      phase,
      packRef: "examples/voltaris-v2-pack",
      profile: "voltaris-proof",
      modelRef: "openai-codex/gpt-5.3-codex",
      repeatRuns: 3,
      repeatDelayMs: 30000,
      greenRunCount: phase === "run" && promotionStatus === "green" && ok ? 3 : 0,
      providerId: "openai-codex",
      readyProfileCount: 1,
      readyProfileIds: ["proof"],
      preflightStatus: phase === "preflight" ? "ready" : "ready",
      proofStatus:
        phase === "preflight" ? "not_run" : promotionStatus === "green" ? "ready" : "blocked",
      promotionStatus,
      assertionCount: phase === "run" ? 4 : 0,
      passedAssertionCount: phase === "run" && promotionStatus === "green" ? 4 : 0,
      failedAssertionCount: phase === "run" && promotionStatus === "blocked" ? 1 : 0,
      failedAssertions: phase === "run" && promotionStatus === "blocked" ? ["proofStatus"] : [],
      failureReasons: phase === "run" && promotionStatus === "blocked" ? ["proofStatus"] : [],
      latestRun: null,
      runs: [],
      workflow: {
        eventName,
        runId: generatedAt,
        runAttempt: "1",
        sha: "deadbeef",
      },
    });

    const summary = buildPersistedBenchmarkHistorySummary(
      [
        makeReceipt({
          generatedAt: "2026-03-25T09:00:00.000Z",
          phase: "preflight",
          eventName: "schedule",
          ok: true,
          promotionStatus: "not_run",
        }),
        makeReceipt({
          generatedAt: "2026-03-25T09:05:00.000Z",
          phase: "run",
          eventName: "schedule",
          ok: true,
          promotionStatus: "green",
        }),
        makeReceipt({
          generatedAt: "2026-03-25T21:00:00.000Z",
          phase: "preflight",
          eventName: "schedule",
          ok: true,
          promotionStatus: "not_run",
        }),
        makeReceipt({
          generatedAt: "2026-03-25T21:05:00.000Z",
          phase: "run",
          eventName: "schedule",
          ok: true,
          promotionStatus: "green",
        }),
        makeReceipt({
          generatedAt: "2026-03-26T01:00:00.000Z",
          phase: "run",
          eventName: "workflow_dispatch",
          ok: false,
          promotionStatus: "blocked",
        }),
      ],
      360,
      Date.parse("2026-03-26T17:05:00.000Z"),
    );

    expect(summary.consecutiveGreenCount).toBe(0);
    expect(summary.eventCounts).toEqual({ schedule: 4, workflow_dispatch: 1 });
    expect(summary.schedule.receiptCount).toBe(4);
    expect(summary.schedule.greenReceiptCount).toBe(2);
    expect(summary.schedule.blockedReceiptCount).toBe(0);
    expect(summary.schedule.consecutiveGreenCount).toBe(2);
    expect(summary.schedule.longestGreenStreak).toBe(2);
    expect(summary.schedule.latestGreenGeneratedAt).toBe("2026-03-25T21:05:00.000Z");
    expect(summary.schedule.latestGreenAgeHours).toBe(20);
    expect(summary.schedule.runwayStatus).toBe("warning");
    expect(summary.schedule.healthy).toBe(false);
    expect(summary.schedule.runwayWindowHours).toBe(12.08);
    expect(summary.runwayMaturityLabel).toBe("Emerging scheduled runway");
    expect(summary.runwayMaturityStatus).toBe("emerging_scheduled");
  });

  it("classifies a sustained scheduled history as a boring multi-day runway", () => {
    const makeReceipt = ({
      generatedAt,
      eventName,
    }: {
      generatedAt: string;
      eventName: string;
    }): ReturnType<typeof buildPersistedBenchmarkReceipt> => ({
      contractVersion: "openclaw.live-runtime-benchmark-receipt.v1",
      generatedAt,
      ok: true,
      phase: "run",
      packRef: "examples/voltaris-v2-pack",
      profile: "voltaris-proof",
      modelRef: "openai-codex/gpt-5.3-codex",
      repeatRuns: 3,
      repeatDelayMs: 30000,
      greenRunCount: 3,
      providerId: "openai-codex",
      readyProfileCount: 1,
      readyProfileIds: ["proof"],
      preflightStatus: "ready",
      proofStatus: "ready",
      promotionStatus: "green",
      assertionCount: 4,
      passedAssertionCount: 4,
      failedAssertionCount: 0,
      failedAssertions: [],
      failureReasons: [],
      latestRun: null,
      runs: [],
      workflow: {
        eventName,
        runId: generatedAt,
        runAttempt: "1",
        sha: "deadbeef",
      },
    });

    const summary = buildPersistedBenchmarkHistorySummary(
      [
        makeReceipt({ generatedAt: "2026-03-20T09:05:00.000Z", eventName: "schedule" }),
        makeReceipt({ generatedAt: "2026-03-20T21:05:00.000Z", eventName: "schedule" }),
        makeReceipt({ generatedAt: "2026-03-21T09:05:00.000Z", eventName: "schedule" }),
        makeReceipt({ generatedAt: "2026-03-21T21:05:00.000Z", eventName: "schedule" }),
        makeReceipt({ generatedAt: "2026-03-22T09:05:00.000Z", eventName: "schedule" }),
        makeReceipt({ generatedAt: "2026-03-22T21:05:00.000Z", eventName: "schedule" }),
        makeReceipt({ generatedAt: "2026-03-23T09:05:00.000Z", eventName: "schedule" }),
      ],
      540,
      Date.parse("2026-03-23T10:00:00.000Z"),
    );

    expect(summary.schedule.receiptCount).toBe(7);
    expect(summary.schedule.greenReceiptCount).toBe(7);
    expect(summary.schedule.consecutiveGreenCount).toBe(7);
    expect(summary.schedule.runwayWindowHours).toBe(72);
    expect(summary.runwayMaturityLabel).toBe("Boring multi-day runway");
    expect(summary.runwayMaturityStatus).toBe("boring_multi_day");
  });
});

describe("voltaris-v2-live-benchmark-gate CLI", () => {
  it("writes a passing preflight report when provider auth state is seeded from env", async () => {
    const reportDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-live-benchmark-gate-"));
    tempDirs.push(reportDir);

    const seededStore = makeStore({
      profiles: {
        proof: { type: "api_key", provider: "openai-codex", key: "sk-proof" },
      },
    });

    execFileSync(
      process.execPath,
      [
        "--import",
        "tsx",
        "scripts/cyborgclaw/voltaris-v2-live-benchmark-gate.ts",
        "--preflight-only",
        `--report-dir=${reportDir}`,
      ],
      {
        cwd: REPO_ROOT,
        env: {
          ...process.env,
          OPENCLAW_LIVE_BENCHMARK_ENABLED: "true",
          OPENCLAW_LIVE_BENCHMARK_MODEL: "openai-codex/gpt-5.3-codex",
          OPENCLAW_LIVE_BENCHMARK_AUTH_PROFILES_JSON: JSON.stringify(seededStore),
        },
        stdio: "pipe",
      },
    );

    const report = JSON.parse(
      await fs.readFile(path.join(reportDir, "gate-report.json"), "utf8"),
    ) as {
      ok: boolean;
      phase: string;
      readiness: {
        preflight: {
          status: string;
        };
        proof: {
          status: string;
        };
        promotion: {
          status: string;
        };
      };
      preflight: {
        readyProfileIds: string[];
      };
    };

    expect(report.ok).toBe(true);
    expect(report.phase).toBe("preflight");
    expect(report.readiness.preflight.status).toBe("ready");
    expect(report.readiness.proof.status).toBe("not_run");
    expect(report.readiness.promotion.status).toBe("not_run");
    expect(report.preflight.readyProfileIds).toEqual(["proof"]);
    expect(
      await fs.readFile(
        path.join(
          reportDir,
          "preflight",
          "auth-source-state",
          "agents",
          "main",
          "agent",
          "auth-profiles.json",
        ),
        "utf8",
      ),
    ).toContain('"proof"');
  });

  it("seeds an explicit auth source copy from local Codex CLI credentials", async () => {
    const reportDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-live-benchmark-gate-"));
    const sourceStateDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-live-benchmark-src-"));
    const codexHome = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-live-benchmark-codex-"));
    tempDirs.push(reportDir, sourceStateDir, codexHome);

    const authStorePath = path.join(
      sourceStateDir,
      "agents",
      "main",
      "agent",
      "auth-profiles.json",
    );
    await fs.mkdir(path.dirname(authStorePath), { recursive: true });
    await fs.writeFile(
      authStorePath,
      JSON.stringify({
        version: 1,
        profiles: {
          "openai-codex:default": {
            type: "oauth",
            provider: "openai-codex",
            access: "expired-access",
            refresh: "expired-refresh",
            expires: Date.now() - 60_000,
          },
        },
      }),
      "utf8",
    );

    await fs.writeFile(
      path.join(codexHome, "auth.json"),
      JSON.stringify({
        tokens: {
          access_token: "fresh-access",
          refresh_token: "fresh-refresh",
          account_id: "acct-live-proof",
        },
      }),
      "utf8",
    );

    execFileSync(
      process.execPath,
      [
        "--import",
        "tsx",
        "scripts/cyborgclaw/voltaris-v2-live-benchmark-gate.ts",
        "--preflight-only",
        `--report-dir=${reportDir}`,
        `--auth-source-state-dir=${sourceStateDir}`,
      ],
      {
        cwd: REPO_ROOT,
        env: {
          ...process.env,
          CODEX_HOME: codexHome,
          OPENCLAW_LIVE_BENCHMARK_ENABLED: "true",
          OPENCLAW_LIVE_BENCHMARK_MODEL: "openai-codex/gpt-5.3-codex",
        },
        stdio: "pipe",
      },
    );

    const seededAuthStorePath = path.join(
      reportDir,
      "preflight",
      "auth-source-state",
      "agents",
      "main",
      "agent",
      "auth-profiles.json",
    );
    const seededStore = JSON.parse(
      await fs.readFile(seededAuthStorePath, "utf8"),
    ) as AuthProfileStore;

    expect(seededStore.profiles["openai-codex:default"]).toMatchObject({
      provider: "openai-codex",
      access: "fresh-access",
      refresh: "fresh-refresh",
      accountId: "acct-live-proof",
    });
  });

  it("persists a compact receipt artifact for preflight runs", async () => {
    const reportDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-live-benchmark-gate-"));
    const persistDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-live-benchmark-persist-"));
    tempDirs.push(reportDir, persistDir);

    const seededStore = makeStore({
      profiles: {
        proof: { type: "api_key", provider: "openai-codex", key: "sk-proof" },
      },
    });

    execFileSync(
      process.execPath,
      [
        "--import",
        "tsx",
        "scripts/cyborgclaw/voltaris-v2-live-benchmark-gate.ts",
        "--preflight-only",
        `--report-dir=${reportDir}`,
        `--persist-dir=${persistDir}`,
      ],
      {
        cwd: REPO_ROOT,
        env: {
          ...process.env,
          OPENCLAW_LIVE_BENCHMARK_ENABLED: "true",
          OPENCLAW_LIVE_BENCHMARK_MODEL: "openai-codex/gpt-5.3-codex",
          OPENCLAW_LIVE_BENCHMARK_AUTH_PROFILES_JSON: JSON.stringify(seededStore),
        },
        stdio: "pipe",
      },
    );

    const latestReceipt = JSON.parse(
      await fs.readFile(path.join(persistDir, "latest-receipt.json"), "utf8"),
    ) as { phase: string; preflightStatus: string };
    const historyLines = (await fs.readFile(path.join(persistDir, "history.jsonl"), "utf8"))
      .trim()
      .split("\n");

    expect(latestReceipt.phase).toBe("preflight");
    expect(latestReceipt.preflightStatus).toBe("ready");
    expect(historyLines).toHaveLength(1);
    expect(
      await fs.stat(path.join(persistDir, "latest-green-receipt.json")).catch(() => null),
    ).toBeNull();
  });
});
