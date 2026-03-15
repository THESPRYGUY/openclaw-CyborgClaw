import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCliRuntimeCapture } from "../cli/test-runtime-capture.js";

const resolveGenomePackReference = vi.fn();
const validateGenomePack = vi.fn();
const readJson = vi.fn();
const readText = vi.fn();

vi.mock("../cyborgclaw/genome/index.js", () => ({
  resolveGenomePackReference,
  validateGenomePack,
  readJson,
  readText,
  planGenomePackDeployment: vi.fn(),
  applyGenomePackDeployment: vi.fn(),
}));

const { runtimeLogs, defaultRuntime, resetRuntimeCapture } = createCliRuntimeCapture();

const { genomeValidateCommand } = await import("./genome.command.js");

describe("genome.command uses canonical boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRuntimeCapture();
    resolveGenomePackReference.mockResolvedValue({
      reference: "examples/voltaris-v2-pack",
      sourceKind: "path",
      warnings: [],
      paths: {
        packRoot: "/repo/examples/voltaris-v2-pack",
        genomePath: "/repo/examples/voltaris-v2-pack/voltaris-v2.genome.yaml",
        readmePath: "/repo/examples/voltaris-v2-pack/README.md",
        compiledRoot: "/repo/examples/voltaris-v2-pack/compiled",
        workspaceRoot: "/repo/examples/voltaris-v2-pack/compiled/workspace",
        manifestsRoot: "/repo/examples/voltaris-v2-pack/compiled/manifests",
        packageManifestPath: "/repo/examples/voltaris-v2-pack/compiled/package.manifest.json",
        buildReceiptPath: "/repo/examples/voltaris-v2-pack/compiled/build.receipt.json",
        lineageManifestPath:
          "/repo/examples/voltaris-v2-pack/compiled/manifests/agent.lineage.json",
        runtimeManifestPath:
          "/repo/examples/voltaris-v2-pack/compiled/manifests/agent.runtime.json",
        policyManifestPath: "/repo/examples/voltaris-v2-pack/compiled/manifests/agent.policy.json",
        deploymentManifestPath:
          "/repo/examples/voltaris-v2-pack/compiled/manifests/deployment.manifest.json",
        repoRoot: "/repo",
      },
    });
    validateGenomePack.mockResolvedValue({
      ok: true,
      errors: [],
      digests: {
        packageManifestDigest: "sha256:pkg",
        manifests: {
          lineageCanonicalDigest: "sha256:lineage",
          runtimeCanonicalDigest: "sha256:runtime",
          policyCanonicalDigest: "sha256:policy",
        },
      },
    });
    readText.mockResolvedValue("genomeId: cyborgclaw/voltaris-v2/master\nagentId: voltaris-v2\n");
    readJson.mockImplementation(async (filePath: string) => {
      if (filePath.endsWith("package.manifest.json")) {
        return { packageId: "voltaris-v2.pack", agentId: "voltaris-v2" };
      }
      if (filePath.endsWith("agent.lineage.json")) {
        return { lineageId: "lineage.cyborgclaw.voltaris-v2.master" };
      }
      if (filePath.endsWith("agent.runtime.json")) {
        return { runtimeId: "runtime.cyborgclaw.voltaris-v2.reference" };
      }
      if (filePath.endsWith("agent.policy.json")) {
        return { policyId: "policy.cyborgclaw.voltaris-v2.reference" };
      }
      if (filePath.endsWith("deployment.manifest.json")) {
        return { unknowns: [] };
      }
      if (filePath.endsWith("build.receipt.json")) {
        return {
          kind: "agent.build-receipt",
          packageId: "voltaris-v2.pack",
          buildEpoch: "2026-03-15T00:00:00Z",
        };
      }
      return {};
    });
  });

  it("calls the canonical pack resolver and validator", async () => {
    await expect(
      genomeValidateCommand(defaultRuntime, {
        ref: "examples/voltaris-v2-pack",
        json: true,
      }),
    ).resolves.toBeUndefined();

    expect(resolveGenomePackReference).toHaveBeenCalledWith({
      reference: "examples/voltaris-v2-pack",
      env: process.env,
    });
    expect(validateGenomePack).toHaveBeenCalledWith(
      expect.objectContaining({
        packRoot: "/repo/examples/voltaris-v2-pack",
      }),
    );
    expect(runtimeLogs[0]).toContain('"command": "validate"');
  });
});
