import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  resolveGenomeRepoRoot,
  resolveGenomeRepoRootFrom,
  resolveVoltarisV2GoldenPackPaths,
} from "./paths.js";

describe("CyborgClaw genome paths", () => {
  const repoRoot = path.resolve(process.cwd());

  it("finds the repo root from the source module location", () => {
    expect(resolveGenomeRepoRoot()).toBe(repoRoot);
  });

  it("finds the repo root from a dist-like starting directory", () => {
    expect(resolveGenomeRepoRootFrom(path.join(repoRoot, "dist"))).toBe(repoRoot);
  });

  it("resolves the Voltaris golden pack beneath the repo root", () => {
    const paths = resolveVoltarisV2GoldenPackPaths(repoRoot);
    expect(paths.packageManifestPath).toBe(
      path.join(repoRoot, "examples", "voltaris-v2-pack", "compiled", "package.manifest.json"),
    );
  });
});
