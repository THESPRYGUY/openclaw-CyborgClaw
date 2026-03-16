import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AjvPkg from "ajv";
import { describe, expect, it } from "vitest";

const Ajv = AjvPkg as unknown as new (opts?: object) => import("ajv").default;
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

type ValidationResult = {
  ok: boolean;
  errors: Array<{
    instancePath?: string;
    keyword?: string;
    params?: Record<string, unknown>;
  }>;
};

function readJson(relativePath: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function validate(schemaPath: string, dataPath: string): ValidationResult {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const schema = readJson(schemaPath);
  const data = readJson(dataPath);
  const compiled = ajv.compile(schema);
  const ok = compiled(data);
  return {
    ok,
    errors: (compiled.errors ?? []).map((error) => ({
      instancePath: error.instancePath,
      keyword: error.keyword,
      params: error.params as Record<string, unknown>,
    })),
  };
}

describe("M14 approval boundary proof", () => {
  it("validates minimal clean boundary artifacts", () => {
    const cleanPairs = [
      [
        "schemas/artifact-profile.schema.json",
        "examples/approval-boundary-bundle/minimal-clean/artifact-profile.json",
      ],
      [
        "schemas/approval-checkpoint.schema.json",
        "examples/approval-boundary-bundle/minimal-clean/approval-checkpoint.json",
      ],
    ] as const;

    for (const [schemaPath, dataPath] of cleanPairs) {
      const result = validate(schemaPath, dataPath);
      expect(result.ok, `${dataPath} should validate against ${schemaPath}`).toBe(true);
      expect(result.errors).toEqual([]);
    }
  });

  it("rejects deterministic known-bad boundary artifacts", () => {
    const knownBadProfile = validate(
      "schemas/artifact-profile.schema.json",
      "examples/approval-boundary-bundle/known-bad/artifact-profile.json",
    );
    expect(knownBadProfile.ok).toBe(false);
    expect(knownBadProfile.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keyword: expect.stringMatching(/const|required|additionalProperties/),
        }),
      ]),
    );

    const knownBadCheckpoint = validate(
      "schemas/approval-checkpoint.schema.json",
      "examples/approval-boundary-bundle/known-bad/approval-checkpoint.json",
    );
    expect(knownBadCheckpoint.ok).toBe(false);
    expect(knownBadCheckpoint.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ keyword: expect.stringMatching(/enum|const|required|minItems/) }),
      ]),
    );
  });

  it("anchors package truth to shipped M14 seam symbols and SHAs", () => {
    const profile = readJson(
      "examples/approval-boundary-bundle/minimal-clean/artifact-profile.json",
    ) as {
      publishedShas: string[];
    };

    expect(profile.publishedShas).toEqual([
      "033cbf6865713216eef187c3bde9ff590c25fe04",
      "3e7573eb01bfab8f250e7d17ca381970fbfba1e5",
      "ed092c30950761565089d0005d921391a78b200c",
      "315286045f85d305e39cb5ef01ea070120f7a2c0",
    ]);

    const symbolAnchors = [
      ["src/acp/translator.ts", "assertSupportedSessionSetup"],
      ["src/acp/control-plane/runtime-options.ts", "ACP_APPROVAL_POLICY_CONFIG_KEY"],
      ["src/acp/translator.ts", "findPendingBySessionKey"],
      ["src/acp/control-plane/manager.core.ts", "preserveRouteLawEnvelope"],
    ] as const;

    for (const [filePath, symbol] of symbolAnchors) {
      const source = readText(filePath);
      expect(source.includes(symbol), `${symbol} should exist in ${filePath}`).toBe(true);
    }

    const requiredDocs = [
      "docs/architecture/artifact-contract.md",
      "docs/architecture/approval-await-gateway.md",
      "docs/architecture/mcp-tool-boundary.md",
      "docs/architecture/approval-trace-model.md",
    ] as const;

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(repoRoot, docPath)), `${docPath} should exist`).toBe(true);
    }
  });
});
