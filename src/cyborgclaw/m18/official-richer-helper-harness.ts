import fs from "node:fs/promises";
import path from "node:path";
import {
  type EmitOfficialM18RicherHelperBundleResult,
  emitOfficialM18RicherHelperBundle,
} from "./official-richer-helper-bundle.js";

export type EmitOfficialM18RicherHelperBundleFromFixtureParams = {
  fixtureDir: string;
  outputDir: string;
  lapId: string;
  lapNumber: number;
  lapClass?: string;
};

export type M18OfficialRicherHelperFixtureInputs = {
  approvalCheckpoint: Record<string, unknown>;
  summaryText: string;
  auditText: string;
  parentDeltaText: string;
  childTranscriptText: string;
};

const DEFAULT_LAP_CLASS = "official richer-helper single-child receipt lane";

function fixtureFilePath(fixtureDir: string, fileName: string): string {
  return path.join(fixtureDir, fileName);
}

async function readRequiredTextFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf8");
}

async function readRequiredJsonFile(filePath: string): Promise<Record<string, unknown>> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as Record<string, unknown>;
}

export async function loadOfficialM18RicherHelperFixtureInputs(params: {
  fixtureDir: string;
  lapId: string;
}): Promise<M18OfficialRicherHelperFixtureInputs> {
  const approvalCheckpointPath = fixtureFilePath(params.fixtureDir, "approval-checkpoint.json");
  const summaryPath = fixtureFilePath(params.fixtureDir, `${params.lapId}.summary`);
  const auditPath = fixtureFilePath(params.fixtureDir, `${params.lapId}.audit.json`);
  const parentDeltaPath = fixtureFilePath(params.fixtureDir, `${params.lapId}.parent.delta.jsonl`);
  const childTranscriptPath = fixtureFilePath(
    params.fixtureDir,
    `${params.lapId}.child.transcript.jsonl`,
  );

  const [approvalCheckpoint, summaryText, auditText, parentDeltaText, childTranscriptText] =
    await Promise.all([
      readRequiredJsonFile(approvalCheckpointPath),
      readRequiredTextFile(summaryPath),
      readRequiredTextFile(auditPath),
      readRequiredTextFile(parentDeltaPath),
      readRequiredTextFile(childTranscriptPath),
    ]);

  return {
    approvalCheckpoint,
    summaryText,
    auditText,
    parentDeltaText,
    childTranscriptText,
  };
}

export async function emitOfficialM18RicherHelperBundleFromFixture(
  params: EmitOfficialM18RicherHelperBundleFromFixtureParams,
): Promise<EmitOfficialM18RicherHelperBundleResult> {
  const inputs = await loadOfficialM18RicherHelperFixtureInputs({
    fixtureDir: params.fixtureDir,
    lapId: params.lapId,
  });

  return await emitOfficialM18RicherHelperBundle({
    outputDir: params.outputDir,
    lapId: params.lapId,
    lapNumber: params.lapNumber,
    lapClass: params.lapClass ?? DEFAULT_LAP_CLASS,
    summaryText: inputs.summaryText,
    auditText: inputs.auditText,
    parentDeltaText: inputs.parentDeltaText,
    childTranscriptText: inputs.childTranscriptText,
    approvalCheckpoint: inputs.approvalCheckpoint,
  });
}
