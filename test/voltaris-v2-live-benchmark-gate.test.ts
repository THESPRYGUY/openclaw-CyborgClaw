import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildLiveBenchmarkPreflight,
  evaluateLiveBenchmarkProof,
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
    expect(result.failureReasons).toContain("The live smoke executor did not report ok=true.");
    expect(result.failureReasons).toContain(
      "Failed smoke assertions: runtimeCreatedNormalSession, workspaceBootstrapLoaded",
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
      status: "pass",
      failureReasons: [],
    });
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
      preflight: {
        readyProfileIds: string[];
      };
    };

    expect(report.ok).toBe(true);
    expect(report.phase).toBe("preflight");
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
});
