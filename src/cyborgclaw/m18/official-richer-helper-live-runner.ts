import fs from "node:fs/promises";

import {
  emitOfficialM18RicherHelperLiveLap,
  type EmitOfficialM18RicherHelperLiveLapResult,
  type M18LiveApprovalCheckpointInput,
  type M18LiveComparabilityPins,
} from "./official-richer-helper-live-lap.js";

export type OfficialM18RicherHelperLiveReceiptRefs = {
  approvalEvidencePath: string;
  summaryPath: string;
  auditPath: string;
  parentDeltaPath: string;
  childTranscriptPath: string;
  stdoutPath?: string;
  stderrPath?: string;
  parentTranscriptRef?: string;
  childTranscriptRef?: string;
};

export type RunOfficialM18RicherHelperLiveLapRunnerParams = {
  lapId: string;
  lapNumber: number;
  outputDir: string;
  laneTarget: string;
  taskPrompt: string;
  comparabilityPins: M18LiveComparabilityPins;
  receiptRefs: OfficialM18RicherHelperLiveReceiptRefs;
  lapClass?: string;
};

export type OfficialM18RicherHelperLiveLapRunnerInputs = {
  lapId: string;
  lapNumber: number;
  outputDir: string;
  laneTarget: string;
  taskPrompt: string;
  comparabilityPins: M18LiveComparabilityPins;
  lapClass?: string;
  approvalCheckpoint: M18LiveApprovalCheckpointInput;
  summaryText: string;
  auditText: string;
  parentDeltaText: string;
  childTranscriptText: string;
  rawStdoutText?: string;
  rawStderrText?: string;
  parentTranscriptRef?: string;
  childTranscriptRef?: string;
  approvalEvidenceRef: string;
};

export type RunOfficialM18RicherHelperLiveLapRunnerResult = {
  inputs: OfficialM18RicherHelperLiveLapRunnerInputs;
  emitted: EmitOfficialM18RicherHelperLiveLapResult;
};

async function readRequiredTextFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf8");
}

async function readOptionalTextFile(filePath?: string): Promise<string | undefined> {
  if (!filePath) {
    return undefined;
  }
  return await fs.readFile(filePath, "utf8");
}

async function readRequiredApprovalEvidence(
  filePath: string,
): Promise<M18LiveApprovalCheckpointInput> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as M18LiveApprovalCheckpointInput;
}

function validateRunnerParams(params: RunOfficialM18RicherHelperLiveLapRunnerParams): void {
  if (params.lapId.trim() === "") {
    throw new Error("missing lapId");
  }
  if (params.laneTarget.trim() === "") {
    throw new Error("missing laneTarget");
  }
  if (params.taskPrompt.trim() === "") {
    throw new Error("missing taskPrompt");
  }
  if (params.receiptRefs.approvalEvidencePath.trim() === "") {
    throw new Error("missing approvalEvidencePath");
  }
  if (params.receiptRefs.summaryPath.trim() === "") {
    throw new Error("missing summaryPath");
  }
  if (params.receiptRefs.auditPath.trim() === "") {
    throw new Error("missing auditPath");
  }
  if (params.receiptRefs.parentDeltaPath.trim() === "") {
    throw new Error("missing parentDeltaPath");
  }
  if (params.receiptRefs.childTranscriptPath.trim() === "") {
    throw new Error("missing childTranscriptPath");
  }
}

export async function loadOfficialM18RicherHelperLiveLapRunnerInputs(
  params: RunOfficialM18RicherHelperLiveLapRunnerParams,
): Promise<OfficialM18RicherHelperLiveLapRunnerInputs> {
  validateRunnerParams(params);

  const [
    approvalCheckpoint,
    summaryText,
    auditText,
    parentDeltaText,
    childTranscriptText,
    rawStdoutText,
    rawStderrText,
  ] = await Promise.all([
    readRequiredApprovalEvidence(params.receiptRefs.approvalEvidencePath),
    readRequiredTextFile(params.receiptRefs.summaryPath),
    readRequiredTextFile(params.receiptRefs.auditPath),
    readRequiredTextFile(params.receiptRefs.parentDeltaPath),
    readRequiredTextFile(params.receiptRefs.childTranscriptPath),
    readOptionalTextFile(params.receiptRefs.stdoutPath),
    readOptionalTextFile(params.receiptRefs.stderrPath),
  ]);

  return {
    lapId: params.lapId,
    lapNumber: params.lapNumber,
    outputDir: params.outputDir,
    laneTarget: params.laneTarget,
    taskPrompt: params.taskPrompt,
    comparabilityPins: params.comparabilityPins,
    lapClass: params.lapClass,
    approvalCheckpoint,
    summaryText,
    auditText,
    parentDeltaText,
    childTranscriptText,
    rawStdoutText,
    rawStderrText,
    parentTranscriptRef: params.receiptRefs.parentTranscriptRef,
    childTranscriptRef: params.receiptRefs.childTranscriptRef,
    approvalEvidenceRef: params.receiptRefs.approvalEvidencePath,
  };
}

export async function runOfficialM18RicherHelperLiveLapRunner(
  params: RunOfficialM18RicherHelperLiveLapRunnerParams,
): Promise<RunOfficialM18RicherHelperLiveLapRunnerResult> {
  const inputs = await loadOfficialM18RicherHelperLiveLapRunnerInputs(params);
  const emitted = await emitOfficialM18RicherHelperLiveLap({
    lapId: inputs.lapId,
    lapNumber: inputs.lapNumber,
    outputDir: inputs.outputDir,
    laneTarget: inputs.laneTarget,
    taskPrompt: inputs.taskPrompt,
    approvalCheckpoint: inputs.approvalCheckpoint,
    summaryText: inputs.summaryText,
    auditText: inputs.auditText,
    parentDeltaText: inputs.parentDeltaText,
    childTranscriptText: inputs.childTranscriptText,
    rawStdoutText: inputs.rawStdoutText,
    rawStderrText: inputs.rawStderrText,
    parentTranscriptRef: inputs.parentTranscriptRef,
    childTranscriptRef: inputs.childTranscriptRef,
    lapClass: inputs.lapClass,
    comparabilityPins: inputs.comparabilityPins,
  });

  return {
    inputs,
    emitted,
  };
}
