import fs from "node:fs/promises";
import path from "node:path";
import {
  emitOfficialM18RicherHelperBundle,
  type EmitOfficialM18RicherHelperBundleResult,
} from "./official-richer-helper-bundle.js";

const DEFAULT_LAP_CLASS = "official richer-helper single-child receipt lane";

export type M18LiveApprovalCheckpointInput = {
  checkpointId: string;
  runId: string;
  approvalPolicy: string;
  outcome: "approve" | "deny" | "expire";
  state: "approved" | "denied" | "expired";
  recordedAt: string;
  expiresAt: string;
  artifactProfileId: string;
  artifactIds: string[];
  traceNamespace: string;
  receiptNamespace: string;
  routeLawNamespace: string;
  approvalNamespace: string;
  correlationId: string;
};

export type M18LiveComparabilityPins = {
  branch: string;
  sha: string;
  host: string;
  provider: string;
  model: string;
};

export type EmitOfficialM18RicherHelperLiveLapParams = {
  lapId: string;
  lapNumber: number;
  outputDir: string;
  laneTarget: string;
  taskPrompt: string;
  approvalCheckpoint: M18LiveApprovalCheckpointInput;
  summaryText: string;
  auditText: string;
  parentDeltaText: string;
  childTranscriptText: string;
  rawStdoutText?: string;
  rawStderrText?: string;
  parentTranscriptRef?: string;
  childTranscriptRef?: string;
  lapClass?: string;
  comparabilityPins: M18LiveComparabilityPins;
};

export type EmitOfficialM18RicherHelperLiveLapResult = {
  bundle: EmitOfficialM18RicherHelperBundleResult;
  files: {
    stdoutPath: string;
    stderrPath: string;
    metadataPath: string;
  };
};

type SummaryFields = Record<string, string>;

function parseSummary(summaryText: string): SummaryFields {
  const fields: SummaryFields = {};
  for (const line of summaryText.trim().split("\n")) {
    const splitIndex = line.indexOf("=");
    if (splitIndex <= 0) {
      continue;
    }
    fields[line.slice(0, splitIndex)] = line.slice(splitIndex + 1);
  }
  return fields;
}

function stringifyJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function buildOfficialM18RicherHelperApprovalCheckpoint(
  input: M18LiveApprovalCheckpointInput,
): Record<string, unknown> {
  return {
    kind: "approval.checkpoint",
    schemaVersion: 1,
    checkpointId: input.checkpointId,
    runId: input.runId,
    approvalPolicy: input.approvalPolicy,
    outcome: input.outcome,
    state: input.state,
    recordedAt: input.recordedAt,
    expiresAt: input.expiresAt,
    artifactProfileId: input.artifactProfileId,
    artifactIds: input.artifactIds,
    trace: {
      traceNamespace: input.traceNamespace,
      receiptNamespace: input.receiptNamespace,
      routeLawNamespace: input.routeLawNamespace,
      approvalNamespace: input.approvalNamespace,
      correlationId: input.correlationId,
    },
  };
}

function validateLiveLapInputs(params: EmitOfficialM18RicherHelperLiveLapParams): void {
  const summary = parseSummary(params.summaryText);
  const parentRunId = summary.parent_run_id ?? "";
  if (!parentRunId) {
    throw new Error("missing parent_run_id in summary");
  }
  if (params.approvalCheckpoint.runId.trim() === "") {
    throw new Error("missing approval checkpoint runId");
  }
  if (params.approvalCheckpoint.runId !== parentRunId) {
    throw new Error("approval checkpoint runId does not match summary parent_run_id");
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

export async function emitOfficialM18RicherHelperLiveLap(
  params: EmitOfficialM18RicherHelperLiveLapParams,
): Promise<EmitOfficialM18RicherHelperLiveLapResult> {
  validateLiveLapInputs(params);
  await fs.mkdir(params.outputDir, { recursive: true });

  const bundle = await emitOfficialM18RicherHelperBundle({
    outputDir: params.outputDir,
    lapId: params.lapId,
    lapNumber: params.lapNumber,
    lapClass: params.lapClass ?? DEFAULT_LAP_CLASS,
    summaryText: params.summaryText,
    auditText: params.auditText,
    parentDeltaText: params.parentDeltaText,
    childTranscriptText: params.childTranscriptText,
    approvalCheckpoint: buildOfficialM18RicherHelperApprovalCheckpoint(params.approvalCheckpoint),
  });

  const stdoutPath = path.join(params.outputDir, `${params.lapId}.stdout.log`);
  const stderrPath = path.join(params.outputDir, `${params.lapId}.stderr.log`);
  const metadataPath = path.join(params.outputDir, `${params.lapId}.live-lap.json`);

  await fs.writeFile(stdoutPath, (params.rawStdoutText ?? "").trimEnd() + "\n", "utf8");
  await fs.writeFile(stderrPath, (params.rawStderrText ?? "").trimEnd() + "\n", "utf8");
  await fs.writeFile(
    metadataPath,
    stringifyJson({
      lapId: params.lapId,
      lapNumber: params.lapNumber,
      laneTarget: params.laneTarget,
      taskPrompt: params.taskPrompt,
      comparabilityPins: params.comparabilityPins,
      parentTranscriptRef: params.parentTranscriptRef ?? null,
      childTranscriptRef: params.childTranscriptRef ?? null,
      output: {
        approvalCheckpointPath: bundle.files.approvalCheckpointPath,
        summaryPath: bundle.files.summaryPath,
        auditPath: bundle.files.auditPath,
        parentDeltaPath: bundle.files.parentDeltaPath,
        childReceiptPath: bundle.files.childReceiptPath,
        comparabilityManifestPath: bundle.files.comparabilityManifestPath,
        stdoutPath,
        stderrPath,
      },
    }),
    "utf8",
  );

  return {
    bundle,
    files: {
      stdoutPath,
      stderrPath,
      metadataPath,
    },
  };
}
