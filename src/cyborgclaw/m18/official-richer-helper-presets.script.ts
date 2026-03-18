#!/usr/bin/env -S node --import tsx

import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  runOfficialM18RicherHelperPreset,
  type OfficialM18RicherHelperPresetName,
} from "./official-richer-helper-presets.js";

type ScriptArgs = {
  preset: OfficialM18RicherHelperPresetName;
  sourceDir: string;
  preparedDir: string;
  bundleDir: string;
};

function isPresetName(value: string): value is OfficialM18RicherHelperPresetName {
  return value === "source-clean" || value === "source-known-bad";
}

function readFlagValue(argv: string[], flag: string): string {
  const index = argv.indexOf(flag);
  if (index < 0 || !argv[index + 1]) {
    throw new Error(`Missing required flag: ${flag}`);
  }
  return argv[index + 1];
}

export function parseOfficialM18RicherHelperPresetScriptArgs(argv: string[]): ScriptArgs {
  const presetValue = readFlagValue(argv, "--preset");
  if (!isPresetName(presetValue)) {
    throw new Error(`Unsupported preset: ${presetValue}`);
  }

  return {
    preset: presetValue,
    sourceDir: path.resolve(readFlagValue(argv, "--source-dir")),
    preparedDir: path.resolve(readFlagValue(argv, "--prepared-dir")),
    bundleDir: path.resolve(readFlagValue(argv, "--bundle-dir")),
  };
}

export async function runOfficialM18RicherHelperPresetScript(argv: string[]): Promise<void> {
  const args = parseOfficialM18RicherHelperPresetScriptArgs(argv);
  await runOfficialM18RicherHelperPreset({
    preset: args.preset,
    sourceDir: args.sourceDir,
    preparedDir: args.preparedDir,
    bundleDir: args.bundleDir,
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await runOfficialM18RicherHelperPresetScript(process.argv.slice(2));
}
