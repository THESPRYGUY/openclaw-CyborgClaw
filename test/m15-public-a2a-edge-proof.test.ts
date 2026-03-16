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

describe("M15 public A2A edge proof", () => {
  it("validates minimal clean public-edge artifacts", () => {
    const cleanPairs = [
      [
        "schemas/public-agent-card.schema.json",
        "examples/public-a2a-edge-bundle/minimal-clean/agent-card.json",
      ],
      [
        "schemas/public-a2a-task.schema.json",
        "examples/public-a2a-edge-bundle/minimal-clean/task.json",
      ],
    ] as const;

    for (const [schemaPath, dataPath] of cleanPairs) {
      const result = validate(schemaPath, dataPath);
      expect(result.ok, `${dataPath} should validate against ${schemaPath}`).toBe(true);
      expect(result.errors).toEqual([]);
    }
  });

  it("rejects deterministic known-bad public-edge artifacts", () => {
    const knownBadCard = validate(
      "schemas/public-agent-card.schema.json",
      "examples/public-a2a-edge-bundle/known-bad/agent-card.json",
    );
    expect(knownBadCard.ok).toBe(false);
    expect(knownBadCard.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          instancePath: "/securitySchemes/messageSend",
          keyword: "const",
        }),
      ]),
    );

    const knownBadTask = validate(
      "schemas/public-a2a-task.schema.json",
      "examples/public-a2a-edge-bundle/known-bad/task.json",
    );
    expect(knownBadTask.ok).toBe(false);
    expect(knownBadTask.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keyword: expect.stringMatching(/pattern|enum/),
        }),
      ]),
    );
  });

  it("anchors the public-edge seam symbols", () => {
    const source = readText("src/gateway/public-a2a-edge-http.ts");
    const requiredSymbols = [
      "handlePublicA2AEdgeHttpRequest",
      "buildPublicAgentCard",
      "derivePublicTaskId",
      "derivePublicContextId",
      "projectPublicTask",
    ] as const;
    for (const symbol of requiredSymbols) {
      expect(
        source.includes(symbol),
        `${symbol} should exist in src/gateway/public-a2a-edge-http.ts`,
      ).toBe(true);
    }
  });

  it("anchors required M15 architecture docs", () => {
    const requiredDocs = [
      "docs/architecture/public-a2a-agent-card.md",
      "docs/architecture/a2a-edge-endpoints.md",
      "docs/architecture/public-task-projection.md",
      "docs/architecture/public-edge-sanitization.md",
    ] as const;

    for (const docPath of requiredDocs) {
      const absolutePath = path.join(repoRoot, docPath);
      expect(fs.existsSync(absolutePath), `${docPath} should exist`).toBe(true);
      const text = readText(docPath);
      expect(text.trim().length, `${docPath} should not be empty`).toBeGreaterThan(0);
    }
  });
});
