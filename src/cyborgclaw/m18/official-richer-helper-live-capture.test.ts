import path from "node:path";
import { describe, expect, it } from "vitest";

import { planOfficialM18RicherHelperLiveCapture } from "./official-richer-helper-live-capture.js";

function createParams() {
  return {
    lapId: "RH-LIVE-01",
    lapNumber: 1,
    outputDir: "/tmp/m18-live",
    laneTarget: "agent:main",
    taskPrompt: "Spawn one richer helper and wait for its completion receipt.",
    approvalContext: {
      policy: "strict",
      namespace: "approval:m18:official-richer-helper",
    },
    comparabilityPins: {
      branch: "cyborg/v2026.2.26-pr",
      sha: "c1bfd3bf9d8fa38cda2523059c62cb5f9a436d8b",
      host: "voltaris",
      provider: "openai-codex",
      model: "gpt-5.3-codex",
    },
    runtime: {
      profile: "m18-live-proof",
      authSourceStateDir: "/tmp/openclaw-auth-source",
      port: 18789,
      model: "openai-codex/gpt-5.3-codex",
    },
  };
}

describe("M18 official richer-helper live capture wrapper", () => {
  it("prepares the exact runner ref set for one live lap", () => {
    const plan = planOfficialM18RicherHelperLiveCapture(createParams());

    expect(plan.runnerParams.receiptRefs).toEqual({
      approvalEvidencePath: "/tmp/m18-live/RH-LIVE-01-capture/approval-evidence.json",
      summaryPath: "/tmp/m18-live/RH-LIVE-01-capture/RH-LIVE-01.summary",
      auditPath: "/tmp/m18-live/RH-LIVE-01-capture/RH-LIVE-01.audit.json",
      parentDeltaPath: "/tmp/m18-live/RH-LIVE-01-capture/RH-LIVE-01.parent.delta.jsonl",
      childTranscriptPath: "/tmp/m18-live/RH-LIVE-01-capture/RH-LIVE-01.child.transcript.jsonl",
      stdoutPath: "/tmp/m18-live/RH-LIVE-01-capture/RH-LIVE-01.stdout.log",
      stderrPath: "/tmp/m18-live/RH-LIVE-01-capture/RH-LIVE-01.stderr.log",
      parentTranscriptRef: "/tmp/m18-live/RH-LIVE-01-capture/RH-LIVE-01.parent.transcript.jsonl",
      childTranscriptRef: "/tmp/m18-live/RH-LIVE-01-capture/RH-LIVE-01.child.transcript.ref.jsonl",
    });
    expect(plan.launch.gatewayCommand).toEqual([
      "pnpm",
      "--silent",
      "openclaw",
      "gateway",
      "run",
      "--bind",
      "loopback",
      "--verbose",
    ]);
  });

  it("fails clearly when required capture planning inputs are missing", () => {
    const params = createParams();
    expect(() =>
      planOfficialM18RicherHelperLiveCapture({
        ...params,
        approvalContext: { ...params.approvalContext, namespace: "" },
      }),
    ).toThrow("missing approval namespace");
  });

  it("preserves lap, lane, and runner identity in the planned contract", () => {
    const plan = planOfficialM18RicherHelperLiveCapture(createParams());

    expect(plan.proofRoot).toBe(path.join("/tmp/m18-live", "RH-LIVE-01-capture"));
    expect(plan.tempRuntime.stateDir).toBe(
      path.join("/tmp/m18-live", "RH-LIVE-01-capture", "home", ".openclaw-m18-live-proof"),
    );
    expect(plan.runnerParams.lapId).toBe("RH-LIVE-01");
    expect(plan.runnerParams.laneTarget).toBe("agent:main");
    expect(plan.metadata.comparabilityPins.sha).toBe("c1bfd3bf9d8fa38cda2523059c62cb5f9a436d8b");
    expect(plan.launch.agentCommand).toEqual([
      "pnpm",
      "--silent",
      "openclaw",
      "agent",
      "--agent",
      "main",
      "--message",
      "Spawn one richer helper and wait for its completion receipt.",
      "--json",
    ]);
  });

  it("normalizes repo-relative proof paths to absolute runtime env paths", () => {
    const plan = planOfficialM18RicherHelperLiveCapture({
      ...createParams(),
      outputDir: "tmp/mission-018-live-lap-retry-03",
    });

    expect(path.isAbsolute(plan.proofRoot)).toBe(true);
    expect(path.isAbsolute(plan.tempRuntime.homeDir)).toBe(true);
    expect(path.isAbsolute(plan.tempRuntime.stateDir)).toBe(true);
    expect(path.isAbsolute(plan.tempRuntime.configPath)).toBe(true);
    expect(path.isAbsolute(plan.runnerParams.outputDir)).toBe(true);
    expect(path.isAbsolute(plan.runnerParams.receiptRefs.childTranscriptPath)).toBe(true);
  });
});
