import fs from "node:fs/promises";
import path from "node:path";

export type NormalizeOfficialM18RicherHelperHarnessInputsParams = {
  outputDir: string;
  lapId: string;
  approvalCheckpointPath: string;
  summaryPath: string;
  auditPath: string;
  parentTranscriptPath: string;
  childTranscriptPath: string;
};

export type NormalizeOfficialM18RicherHelperHarnessInputsResult = {
  fixtureDir: string;
  files: {
    approvalCheckpointPath: string;
    summaryPath: string;
    auditPath: string;
    parentDeltaPath: string;
    childTranscriptPath: string;
  };
};

async function copyTextFile(fromPath: string, toPath: string): Promise<void> {
  const content = await fs.readFile(fromPath, "utf8");
  await fs.writeFile(toPath, content, "utf8");
}

async function copyJsonFile(fromPath: string, toPath: string): Promise<void> {
  const content = JSON.parse(await fs.readFile(fromPath, "utf8")) as unknown;
  await fs.writeFile(toPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

export async function normalizeOfficialM18RicherHelperHarnessInputs(
  params: NormalizeOfficialM18RicherHelperHarnessInputsParams,
): Promise<NormalizeOfficialM18RicherHelperHarnessInputsResult> {
  await fs.mkdir(params.outputDir, { recursive: true });

  const approvalCheckpointPath = path.join(params.outputDir, "approval-checkpoint.json");
  const summaryPath = path.join(params.outputDir, `${params.lapId}.summary`);
  const auditPath = path.join(params.outputDir, `${params.lapId}.audit.json`);
  const parentDeltaPath = path.join(params.outputDir, `${params.lapId}.parent.delta.jsonl`);
  const childTranscriptPath = path.join(params.outputDir, `${params.lapId}.child.transcript.jsonl`);

  await Promise.all([
    copyJsonFile(params.approvalCheckpointPath, approvalCheckpointPath),
    copyTextFile(params.summaryPath, summaryPath),
    copyTextFile(params.auditPath, auditPath),
    copyTextFile(params.parentTranscriptPath, parentDeltaPath),
    copyTextFile(params.childTranscriptPath, childTranscriptPath),
  ]);

  return {
    fixtureDir: params.outputDir,
    files: {
      approvalCheckpointPath,
      summaryPath,
      auditPath,
      parentDeltaPath,
      childTranscriptPath,
    },
  };
}
