#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const assetsDir = path.join(repoRoot, "dist", "control-ui", "assets");

const FORBIDDEN_SOURCE_PATTERNS = [
  {
    label: "jiti runtime",
    pattern: /(?:^|\/)node_modules\/jiti\/dist\/jiti\.cjs$/,
  },
  {
    label: "plugin loader",
    pattern: /(?:^|\/)src\/plugins\/loader\.ts$/,
  },
  {
    label: "plugin bundled-dir",
    pattern: /(?:^|\/)src\/plugins\/bundled-dir\.ts$/,
  },
  {
    label: "hook bundled-dir",
    pattern: /(?:^|\/)src\/hooks\/bundled-dir\.ts$/,
  },
  {
    label: "channel registry loader",
    pattern: /(?:^|\/)src\/channels\/plugins\/registry-loader\.ts$/,
  },
  {
    label: "agent skills bundled-dir",
    pattern: /(?:^|\/)src\/agents\/skills\/bundled-dir\.ts$/,
  },
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readMapSources(mapPath) {
  const raw = fs.readFileSync(mapPath, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.sources)
    ? parsed.sources.filter((source) => typeof source === "string")
    : [];
}

if (!fs.existsSync(assetsDir)) {
  fail(`Control UI bundle audit failed: assets directory missing at ${assetsDir}`);
}

const mapFiles = fs
  .readdirSync(assetsDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".js.map"))
  .map((entry) => path.join(assetsDir, entry.name))
  .toSorted();

if (mapFiles.length === 0) {
  fail(`Control UI bundle audit failed: no JS source maps found in ${assetsDir}`);
}

const offenders = [];
for (const mapPath of mapFiles) {
  for (const source of readMapSources(mapPath)) {
    for (const rule of FORBIDDEN_SOURCE_PATTERNS) {
      if (!rule.pattern.test(source)) {
        continue;
      }
      offenders.push({
        map: path.relative(repoRoot, mapPath),
        source,
        label: rule.label,
      });
    }
  }
}

if (offenders.length > 0) {
  const lines = [
    "Control UI bundle audit failed: server-only modules leaked into the browser bundle.",
    ...offenders.map((offender) => `- ${offender.label}: ${offender.source} (${offender.map})`),
  ];
  fail(lines.join("\n"));
}

console.log(`OK: Control UI bundle audit passed (${mapFiles.length} source map(s) checked).`);
