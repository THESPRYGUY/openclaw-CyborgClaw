import {
  emitOfficialM18RicherHelperBundleFromFixture,
  type EmitOfficialM18RicherHelperBundleResult,
} from "./official-richer-helper-harness.js";
import {
  normalizeOfficialM18RicherHelperHarnessInputs,
  type NormalizeOfficialM18RicherHelperHarnessInputsResult,
} from "./official-richer-helper-prep.js";

export type RunOfficialM18RicherHelperEntrypointParams = {
  sourceDir: string;
  preparedDir: string;
  bundleDir: string;
  lapId: string;
  lapNumber: number;
  approvalFileName: string;
  parentTranscriptFileName: string;
  childTranscriptFileName: string;
  lapClass?: string;
};

export type RunOfficialM18RicherHelperEntrypointResult = {
  normalized: NormalizeOfficialM18RicherHelperHarnessInputsResult;
  emitted: EmitOfficialM18RicherHelperBundleResult;
};

function sourcePath(sourceDir: string, fileName: string): string {
  return `${sourceDir}/${fileName}`;
}

export async function runOfficialM18RicherHelperEntrypoint(
  params: RunOfficialM18RicherHelperEntrypointParams,
): Promise<RunOfficialM18RicherHelperEntrypointResult> {
  const normalized = await normalizeOfficialM18RicherHelperHarnessInputs({
    outputDir: params.preparedDir,
    lapId: params.lapId,
    approvalCheckpointPath: sourcePath(params.sourceDir, params.approvalFileName),
    summaryPath: sourcePath(params.sourceDir, `${params.lapId}.summary`),
    auditPath: sourcePath(params.sourceDir, `${params.lapId}.audit.json`),
    parentTranscriptPath: sourcePath(params.sourceDir, params.parentTranscriptFileName),
    childTranscriptPath: sourcePath(params.sourceDir, params.childTranscriptFileName),
  });

  const emitted = await emitOfficialM18RicherHelperBundleFromFixture({
    fixtureDir: normalized.fixtureDir,
    outputDir: params.bundleDir,
    lapId: params.lapId,
    lapNumber: params.lapNumber,
    lapClass: params.lapClass,
  });

  return {
    normalized,
    emitted,
  };
}
