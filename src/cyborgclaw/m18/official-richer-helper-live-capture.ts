import path from "node:path";

import type { M18LiveComparabilityPins } from "./official-richer-helper-live-lap.js";
import type {
  OfficialM18RicherHelperLiveReceiptRefs,
  RunOfficialM18RicherHelperLiveLapRunnerParams,
} from "./official-richer-helper-live-runner.js";

const DEFAULT_PROFILE = "m18-richer-helper-live";
const DEFAULT_AGENT_ID = "main";
const DEFAULT_PRIMARY_MODEL = "openai-codex/gpt-5.3-codex";
const DEFAULT_LAP_CLASS = "official richer-helper single-child receipt lane";

export type PlanOfficialM18RicherHelperLiveCaptureParams = {
  lapId: string;
  lapNumber: number;
  outputDir: string;
  laneTarget: string;
  taskPrompt: string;
  approvalContext: {
    policy: string;
    namespace: string;
  };
  comparabilityPins: M18LiveComparabilityPins;
  runtime?: {
    profile?: string;
    authSourceStateDir?: string;
    port?: number;
    model?: string;
  };
  lapClass?: string;
};

export type OfficialM18RicherHelperLiveCapturePlan = {
  proofRoot: string;
  tempRuntime: {
    profile: string;
    homeDir: string;
    stateDir: string;
    configPath: string;
    authSourceStateDir?: string;
    port?: number;
    model: string;
  };
  launch: {
    gatewayCommand: string[];
    agentCommand: string[];
  };
  files: {
    approvalEvidencePath: string;
    summaryPath: string;
    auditPath: string;
    parentDeltaPath: string;
    childTranscriptPath: string;
    stdoutPath: string;
    stderrPath: string;
    parentTranscriptRef: string;
    childTranscriptRef: string;
  };
  runnerParams: RunOfficialM18RicherHelperLiveLapRunnerParams;
  metadata: {
    laneTarget: string;
    taskPrompt: string;
    approvalContext: {
      policy: string;
      namespace: string;
    };
    comparabilityPins: M18LiveComparabilityPins;
    lapClass: string;
  };
};

function sanitizePathPart(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, "-");
}

function validateCaptureParams(params: PlanOfficialM18RicherHelperLiveCaptureParams): void {
  if (params.lapId.trim() === "") {
    throw new Error("missing lapId");
  }
  if (params.lapNumber < 1) {
    throw new Error("invalid lapNumber");
  }
  if (params.outputDir.trim() === "") {
    throw new Error("missing outputDir");
  }
  if (params.laneTarget.trim() === "") {
    throw new Error("missing laneTarget");
  }
  if (params.taskPrompt.trim() === "") {
    throw new Error("missing taskPrompt");
  }
  if (params.approvalContext.policy.trim() === "") {
    throw new Error("missing approval policy");
  }
  if (params.approvalContext.namespace.trim() === "") {
    throw new Error("missing approval namespace");
  }
  if (
    params.comparabilityPins.branch.trim() === "" ||
    params.comparabilityPins.sha.trim() === "" ||
    params.comparabilityPins.host.trim() === "" ||
    params.comparabilityPins.provider.trim() === "" ||
    params.comparabilityPins.model.trim() === ""
  ) {
    throw new Error("missing comparability pin");
  }
}

function buildReceiptRefs(params: {
  outputDir: string;
  lapId: string;
}): OfficialM18RicherHelperLiveReceiptRefs {
  return {
    approvalEvidencePath: path.join(params.outputDir, "approval-evidence.json"),
    summaryPath: path.join(params.outputDir, `${params.lapId}.summary`),
    auditPath: path.join(params.outputDir, `${params.lapId}.audit.json`),
    parentDeltaPath: path.join(params.outputDir, `${params.lapId}.parent.delta.jsonl`),
    childTranscriptPath: path.join(params.outputDir, `${params.lapId}.child.transcript.jsonl`),
    stdoutPath: path.join(params.outputDir, `${params.lapId}.stdout.log`),
    stderrPath: path.join(params.outputDir, `${params.lapId}.stderr.log`),
    parentTranscriptRef: path.join(params.outputDir, `${params.lapId}.parent.transcript.jsonl`),
    childTranscriptRef: path.join(params.outputDir, `${params.lapId}.child.transcript.ref.jsonl`),
  };
}

export function planOfficialM18RicherHelperLiveCapture(
  params: PlanOfficialM18RicherHelperLiveCaptureParams,
): OfficialM18RicherHelperLiveCapturePlan {
  validateCaptureParams(params);

  // Live wrapper env exports these paths directly, so keep them absolute even
  // when callers pass a repo-relative output dir.
  const outputDir = path.resolve(params.outputDir);
  const lapSlug = sanitizePathPart(params.lapId);
  const proofRoot = path.join(outputDir, `${lapSlug}-capture`);
  const homeDir = path.join(proofRoot, "home");
  const profile = params.runtime?.profile?.trim() || DEFAULT_PROFILE;
  const stateDir = path.join(homeDir, `.openclaw-${profile}`);
  const configPath = path.join(stateDir, "openclaw.json");
  const model = params.runtime?.model?.trim() || DEFAULT_PRIMARY_MODEL;
  const files = buildReceiptRefs({ outputDir: proofRoot, lapId: params.lapId });
  const agentId = sanitizePathPart(params.laneTarget.split(":")[1] || DEFAULT_AGENT_ID);
  const runnerParams: RunOfficialM18RicherHelperLiveLapRunnerParams = {
    lapId: params.lapId,
    lapNumber: params.lapNumber,
    outputDir: proofRoot,
    laneTarget: params.laneTarget,
    taskPrompt: params.taskPrompt,
    comparabilityPins: params.comparabilityPins,
    receiptRefs: files,
    lapClass: params.lapClass ?? DEFAULT_LAP_CLASS,
  };

  return {
    proofRoot,
    tempRuntime: {
      profile,
      homeDir,
      stateDir,
      configPath,
      authSourceStateDir: params.runtime?.authSourceStateDir,
      port: params.runtime?.port,
      model,
    },
    launch: {
      gatewayCommand: ["pnpm", "--silent", "openclaw", "gateway", "run", "--bind", "loopback", "--verbose"],
      agentCommand: [
        "pnpm",
        "--silent",
        "openclaw",
        "agent",
        "--agent",
        agentId,
        "--message",
        params.taskPrompt,
        "--json",
      ],
    },
    files,
    runnerParams,
    metadata: {
      laneTarget: params.laneTarget,
      taskPrompt: params.taskPrompt,
      approvalContext: params.approvalContext,
      comparabilityPins: params.comparabilityPins,
      lapClass: params.lapClass ?? DEFAULT_LAP_CLASS,
    },
  };
}
