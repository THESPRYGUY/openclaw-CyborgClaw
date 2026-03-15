import fs from "node:fs/promises";
import path from "node:path";
import { resolveStateDir } from "../../config/paths.js";
import { resolveUserPath } from "../../utils.js";
import { readJson } from "./io.js";
import {
  resolveGenomePackPaths,
  resolveGenomeRepoRoot,
  resolveVoltarisV2GoldenPackPaths,
} from "./paths.js";
import type { GenomePackReferenceResolution } from "./types.js";

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function isPackRoot(packRoot: string): Promise<boolean> {
  return (
    (await pathExists(path.join(packRoot, "compiled", "package.manifest.json"))) &&
    (await pathExists(path.join(packRoot, "compiled", "build.receipt.json")))
  );
}

async function findPackRootFromPath(candidatePath: string): Promise<string | null> {
  let current = candidatePath;
  try {
    const stat = await fs.stat(candidatePath);
    current = stat.isDirectory() ? candidatePath : path.dirname(candidatePath);
  } catch {
    return null;
  }

  for (let depth = 0; depth < 6; depth += 1) {
    if (await isPackRoot(current)) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return null;
}

function looksLikePath(reference: string): boolean {
  return (
    path.isAbsolute(reference) ||
    reference.startsWith(".") ||
    reference.startsWith("~") ||
    reference.includes("/") ||
    reference.includes("\\") ||
    reference.endsWith(".json") ||
    reference.endsWith(".yaml") ||
    reference.endsWith(".yml") ||
    reference.endsWith(".md")
  );
}

async function resolveFixtureByPackageId(
  packageId: string,
  repoRoot: string,
): Promise<string | null> {
  const fixture = resolveVoltarisV2GoldenPackPaths(repoRoot);
  try {
    const manifest = await readJson(fixture.packageManifestPath);
    return manifest.packageId === packageId ? fixture.packRoot : null;
  } catch {
    return null;
  }
}

async function resolveInstalledPackByPackageId(
  packageId: string,
  env: NodeJS.ProcessEnv,
): Promise<string[]> {
  const agentsRoot = path.join(resolveStateDir(env), "agents");
  let entries: Awaited<ReturnType<typeof fs.readdir>>;
  try {
    entries = await fs.readdir(agentsRoot, { withFileTypes: true });
  } catch {
    return [];
  }

  const matches: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const candidate = path.join(
      agentsRoot,
      entry.name,
      "agent",
      "cyborgclaw",
      "genome",
      "packs",
      packageId,
    );
    if (await isPackRoot(candidate)) {
      matches.push(candidate);
    }
  }
  return matches.toSorted();
}

export async function resolveGenomePackReference(params: {
  reference?: string | null;
  env?: NodeJS.ProcessEnv;
  repoRoot?: string;
}): Promise<GenomePackReferenceResolution> {
  const env = params.env ?? process.env;
  const repoRoot = params.repoRoot ?? resolveGenomeRepoRoot();
  const trimmed = params.reference?.trim() || "";

  if (!trimmed) {
    return {
      reference: null,
      sourceKind: "fixture-default",
      paths: resolveVoltarisV2GoldenPackPaths(repoRoot),
      warnings: ["No pack reference supplied; defaulted to the Voltaris V2 golden fixture."],
    };
  }

  if (looksLikePath(trimmed)) {
    const resolvedPath = resolveUserPath(trimmed, env);
    const packRoot = await findPackRootFromPath(resolvedPath);
    if (!packRoot) {
      throw new Error(`No genome pack found at ${trimmed}`);
    }
    return {
      reference: trimmed,
      sourceKind: path.basename(resolvedPath) === "build.receipt.json" ? "receipt-path" : "path",
      paths: resolveGenomePackPaths(packRoot, repoRoot),
      warnings: [],
    };
  }

  const installedMatches = await resolveInstalledPackByPackageId(trimmed, env);
  if (installedMatches.length > 1) {
    throw new Error(
      `Package id ${trimmed} resolved to multiple installed genome packs: ${installedMatches.join(", ")}`,
    );
  }
  if (installedMatches.length === 1) {
    return {
      reference: trimmed,
      sourceKind: "package-id",
      paths: resolveGenomePackPaths(installedMatches[0], repoRoot),
      warnings: [],
    };
  }

  const fixtureMatch = await resolveFixtureByPackageId(trimmed, repoRoot);
  if (fixtureMatch) {
    return {
      reference: trimmed,
      sourceKind: "package-id",
      paths: resolveGenomePackPaths(fixtureMatch, repoRoot),
      warnings: [
        "Package id resolved to the repo fixture because no installed genome pack matched.",
      ],
    };
  }

  throw new Error(`Unknown genome pack reference: ${trimmed}`);
}
