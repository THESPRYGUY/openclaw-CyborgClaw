import {
  runOfficialM18RicherHelperEntrypoint,
  type RunOfficialM18RicherHelperEntrypointResult,
} from "./official-richer-helper-entrypoint.js";

export type OfficialM18RicherHelperPresetName = "source-clean" | "source-known-bad";

export type RunOfficialM18RicherHelperPresetParams = {
  preset: OfficialM18RicherHelperPresetName;
  sourceDir: string;
  preparedDir: string;
  bundleDir: string;
};

type PresetConfig = {
  lapId: string;
  lapNumber: number;
  approvalFileName: string;
  parentTranscriptFileName: string;
  childTranscriptFileName: string;
};

const PRESET_CONFIGS: Record<OfficialM18RicherHelperPresetName, PresetConfig> = {
  "source-clean": {
    lapId: "PK-L01",
    lapNumber: 1,
    approvalFileName: "approval-source.json",
    parentTranscriptFileName:
      "747ce949-f54d-4058-be66-cb63866bd312.jsonl.reset.2026-03-17T16-53-32.513Z",
    childTranscriptFileName:
      "0fda66f8-ed45-4755-ba51-24a92bc1785e.jsonl.deleted.2026-03-17T17-46-52.119Z",
  },
  "source-known-bad": {
    lapId: "PK-L03",
    lapNumber: 3,
    approvalFileName: "approval-source.json",
    parentTranscriptFileName:
      "747ce949-f54d-4058-be66-cb63866bd312.jsonl.reset.2026-03-17T16-46-18.698Z",
    childTranscriptFileName:
      "e83c40cf-4f61-4eaa-8a68-c6465fab85df.jsonl.deleted.2026-03-17T17-46-52.119Z",
  },
};

export function getOfficialM18RicherHelperPresetConfig(
  preset: OfficialM18RicherHelperPresetName,
): PresetConfig {
  return PRESET_CONFIGS[preset];
}

export async function runOfficialM18RicherHelperPreset(
  params: RunOfficialM18RicherHelperPresetParams,
): Promise<RunOfficialM18RicherHelperEntrypointResult> {
  const presetConfig = getOfficialM18RicherHelperPresetConfig(params.preset);
  return await runOfficialM18RicherHelperEntrypoint({
    sourceDir: params.sourceDir,
    preparedDir: params.preparedDir,
    bundleDir: params.bundleDir,
    lapId: presetConfig.lapId,
    lapNumber: presetConfig.lapNumber,
    approvalFileName: presetConfig.approvalFileName,
    parentTranscriptFileName: presetConfig.parentTranscriptFileName,
    childTranscriptFileName: presetConfig.childTranscriptFileName,
  });
}
