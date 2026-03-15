import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GenomePackPaths } from "./types.js";

export const ZERO_DIGEST = `sha256:${"0".repeat(64)}`;
export const VOLTARIS_V2_GOLDEN_PACK_RELATIVE_ROOT = path.join("examples", "voltaris-v2-pack");

function listAncestorDirs(startDir: string): string[] {
  const dirs: string[] = [];
  let current = path.resolve(startDir);
  while (true) {
    dirs.push(current);
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return dirs;
}

function isGenomeRepoRoot(candidate: string): boolean {
  try {
    return (
      fs.existsSync(path.join(candidate, "package.json")) &&
      fs.existsSync(path.join(candidate, "schemas", "agent.genome.v1.schema.json"))
    );
  } catch {
    return false;
  }
}

export function resolveGenomeRepoRootFrom(startDir: string, cwd: string = process.cwd()): string {
  const seen = new Set<string>();
  const searchDirs = [...listAncestorDirs(startDir), ...listAncestorDirs(cwd)];
  for (const candidate of searchDirs) {
    if (seen.has(candidate)) {
      continue;
    }
    seen.add(candidate);
    if (isGenomeRepoRoot(candidate)) {
      return candidate;
    }
  }
  return path.resolve(startDir, "../../..");
}

export function resolveGenomeRepoRoot(): string {
  return resolveGenomeRepoRootFrom(path.dirname(fileURLToPath(import.meta.url)));
}

export function resolveGenomePackPaths(
  packRoot: string,
  repoRoot: string = resolveGenomeRepoRoot(),
): GenomePackPaths {
  const absolutePackRoot = path.isAbsolute(packRoot)
    ? path.resolve(packRoot)
    : path.resolve(repoRoot, packRoot);
  const compiledRoot = path.join(absolutePackRoot, "compiled");
  const manifestsRoot = path.join(compiledRoot, "manifests");

  return {
    repoRoot,
    packRoot: absolutePackRoot,
    genomePath: resolveGenomeSourcePath(absolutePackRoot),
    readmePath: path.join(absolutePackRoot, "README.md"),
    compiledRoot,
    workspaceRoot: path.join(compiledRoot, "workspace"),
    manifestsRoot,
    packageManifestPath: path.join(compiledRoot, "package.manifest.json"),
    buildReceiptPath: path.join(compiledRoot, "build.receipt.json"),
    lineageManifestPath: path.join(manifestsRoot, "agent.lineage.json"),
    runtimeManifestPath: path.join(manifestsRoot, "agent.runtime.json"),
    policyManifestPath: path.join(manifestsRoot, "agent.policy.json"),
    deploymentManifestPath: path.join(manifestsRoot, "deployment.manifest.json"),
  };
}

export function resolveVoltarisV2GoldenPackPaths(
  repoRoot: string = resolveGenomeRepoRoot(),
): GenomePackPaths {
  return resolveGenomePackPaths(VOLTARIS_V2_GOLDEN_PACK_RELATIVE_ROOT, repoRoot);
}

function resolveGenomeSourcePath(packRoot: string): string {
  const preferred = path.join(packRoot, "voltaris-v2.genome.yaml");
  try {
    const matches = fs
      .readdirSync(packRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".genome.yaml"))
      .map((entry) => entry.name)
      .toSorted();
    if (matches.length === 1) {
      return path.join(packRoot, matches[0]);
    }
    if (matches.includes(path.basename(preferred))) {
      return preferred;
    }
    if (matches.length > 0) {
      return path.join(packRoot, matches[0]);
    }
  } catch {
    // Keep the canonical Voltaris fallback when the pack root is not yet materialized.
  }
  return preferred;
}
