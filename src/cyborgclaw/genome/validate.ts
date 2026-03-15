import path from "node:path";
import AjvPkg from "ajv";
import { parse as parseYaml } from "yaml";
import {
  fileDigest,
  getPathValue,
  readJson,
  readText,
  sha256,
  stableJson,
  toPosixPath,
  zeroDigestFields,
} from "./io.js";
import { resolveVoltarisV2GoldenPackPaths } from "./paths.js";
import type { GenomePackDigests, GenomePackPaths, GenomePackValidationResult } from "./types.js";

const Ajv = AjvPkg as unknown as new (opts?: object) => import("ajv").default;

type PackageManifestEntry = {
  path: string;
  kind?: string;
  role?: string;
};

function expectEqual(errors: string[], label: string, actual: unknown, expected: unknown) {
  if (actual !== expected) {
    errors.push(`${label}: expected ${String(expected)} but found ${String(actual)}`);
  }
}

async function canonicalManifestDigest(filePath: string): Promise<string> {
  const value = await readJson(filePath);
  return sha256(stableJson(zeroDigestFields(value)));
}

function schemaPath(paths: GenomePackPaths, fileName: string): string {
  return path.join(paths.repoRoot, "schemas", fileName);
}

function relativeToCompiled(paths: GenomePackPaths, targetPath: string): string {
  return toPosixPath(path.relative(paths.compiledRoot, targetPath));
}

async function loadPackageManifestEntries(paths: GenomePackPaths): Promise<PackageManifestEntry[]> {
  const manifest = await readJson(paths.packageManifestPath);
  const artifacts = Array.isArray(manifest.artifacts) ? manifest.artifacts : [];
  return artifacts
    .filter(
      (entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object",
    )
    .map((entry) => ({
      path: typeof entry.path === "string" ? entry.path : "",
      kind: typeof entry.kind === "string" ? entry.kind : undefined,
      role: typeof entry.role === "string" ? entry.role : undefined,
    }))
    .filter((entry) => entry.path.length > 0);
}

async function loadBootstrapFiles(paths: GenomePackPaths): Promise<string[]> {
  const deploymentManifest = await readJson(paths.deploymentManifestPath);
  const bootstrapFiles = (deploymentManifest.workspace as { bootstrapFiles?: unknown })
    ?.bootstrapFiles;
  if (!Array.isArray(bootstrapFiles)) {
    return [];
  }
  return bootstrapFiles.filter(
    (entry): entry is string => typeof entry === "string" && entry.length > 0,
  );
}

async function computeAdmissionContractDigest(
  schemaDigests: Record<string, string>,
): Promise<string> {
  const descriptor = {
    kind: "m11-admission-contract",
    schemas: Object.entries(schemaDigests)
      .toSorted(([left], [right]) => left.localeCompare(right))
      .map(([schemaPathValue, digest]) => ({ schemaPath: schemaPathValue, digest })),
  };
  return sha256(stableJson(descriptor));
}

async function computeInstructionsDigest(paths: GenomePackPaths): Promise<string> {
  const files = await loadBootstrapFiles(paths);
  const entries = await Promise.all(
    files.map(async (fileName) => ({
      fileName,
      fileDigest: await fileDigest(path.join(paths.workspaceRoot, fileName)),
    })),
  );
  return sha256(stableJson({ kind: "instructions-catalog", entries }));
}

async function computeToolCatalogDigest(paths: GenomePackPaths): Promise<string> {
  const genome = parseYaml(await readText(paths.genomePath)) as {
    tools?: {
      profile?: string;
      readOnly?: string[];
      analysis?: string[];
      execution?: string[];
      explicitDenials?: string[];
    };
  };
  const tools = genome.tools ?? {};
  const descriptor = {
    kind: "tool-catalog",
    profile: tools.profile ?? "",
    readOnly: [...(tools.readOnly ?? [])].toSorted(),
    analysis: [...(tools.analysis ?? [])].toSorted(),
    execution: [...(tools.execution ?? [])].toSorted(),
    explicitDenials: [...(tools.explicitDenials ?? [])].toSorted(),
  };
  return sha256(stableJson(descriptor));
}

export async function computeGenomePackDigests(paths: GenomePackPaths): Promise<GenomePackDigests> {
  const inputPaths = [
    paths.genomePath,
    schemaPath(paths, "agent.genome.v1.schema.json"),
    schemaPath(paths, "agent.lineage.schema.json"),
    schemaPath(paths, "agent.runtime.schema.json"),
    schemaPath(paths, "agent.policy.schema.json"),
    paths.packageManifestPath,
  ];

  const inputs: Record<string, string> = {};
  for (const inputPath of inputPaths) {
    inputs[relativeToCompiled(paths, inputPath)] = await fileDigest(inputPath);
  }

  const schemaDigests = {
    "schemas/agent.lineage.schema.json":
      inputs[relativeToCompiled(paths, schemaPath(paths, "agent.lineage.schema.json"))],
    "schemas/agent.runtime.schema.json":
      inputs[relativeToCompiled(paths, schemaPath(paths, "agent.runtime.schema.json"))],
    "schemas/agent.policy.schema.json":
      inputs[relativeToCompiled(paths, schemaPath(paths, "agent.policy.schema.json"))],
  };

  const lineageCanonicalDigest = await canonicalManifestDigest(paths.lineageManifestPath);
  const runtimeCanonicalDigest = await canonicalManifestDigest(paths.runtimeManifestPath);
  const policyCanonicalDigest = await canonicalManifestDigest(paths.policyManifestPath);

  const artifactDigests: GenomePackDigests["artifacts"] = {};
  for (const artifact of await loadPackageManifestEntries(paths)) {
    const absolutePath = path.join(paths.compiledRoot, artifact.path);
    artifactDigests[artifact.path] = {
      fileDigest: await fileDigest(absolutePath),
      ...(artifact.path === "manifests/agent.lineage.json"
        ? { canonicalDigest: lineageCanonicalDigest }
        : artifact.path === "manifests/agent.runtime.json"
          ? { canonicalDigest: runtimeCanonicalDigest }
          : artifact.path === "manifests/agent.policy.json"
            ? { canonicalDigest: policyCanonicalDigest }
            : {}),
    };
  }

  return {
    admissionContractDigest: await computeAdmissionContractDigest(schemaDigests),
    genomeDigest: await fileDigest(paths.genomePath),
    packReadmeDigest: await fileDigest(paths.readmePath),
    packageManifestDigest: await fileDigest(paths.packageManifestPath),
    instructionsDigest: await computeInstructionsDigest(paths),
    toolCatalogDigest: await computeToolCatalogDigest(paths),
    inputs,
    artifacts: artifactDigests,
    manifests: {
      lineageCanonicalDigest,
      runtimeCanonicalDigest,
      policyCanonicalDigest,
    },
  };
}

async function validateJsonSchema(params: {
  repoRoot: string;
  schemaPath: string;
  dataPath: string;
}): Promise<string[]> {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const schema = JSON.parse(await readText(params.schemaPath));
  const data = JSON.parse(await readText(params.dataPath));
  const compiled = ajv.compile(schema);
  const ok = compiled(data);
  if (ok) {
    return [];
  }
  return (compiled.errors ?? []).map(
    (error) =>
      `${path.relative(params.repoRoot, params.dataPath)} ${error.instancePath || "/"} ${error.keyword} ${JSON.stringify(error.params)}`,
  );
}

async function validateGenomeSchema(paths: GenomePackPaths, errors: string[]) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const schema = JSON.parse(await readText(schemaPath(paths, "agent.genome.v1.schema.json")));
  const genome = parseYaml(await readText(paths.genomePath));
  const compiled = ajv.compile(schema);
  const ok = compiled(genome);
  if (ok) {
    return;
  }
  for (const error of compiled.errors ?? []) {
    errors.push(
      `${path.relative(paths.repoRoot, paths.genomePath)} ${error.instancePath || "/"} ${error.keyword} ${JSON.stringify(error.params)}`,
    );
  }
}

async function validateBuildReceipt(
  paths: GenomePackPaths,
  errors: string[],
  digests: GenomePackDigests,
) {
  const receipt = await readJson(paths.buildReceiptPath);
  const inputs = (receipt.inputs as Array<{ path?: string; fileDigest?: string }>) ?? [];
  const artifacts =
    (receipt.artifacts as Array<{
      path?: string;
      fileDigest?: string;
      canonicalDigest?: string;
    }>) ?? [];

  const actualInputPaths = inputs.map((entry) => String(entry.path ?? ""));
  const expectedInputPaths = Object.keys(digests.inputs);
  if (JSON.stringify(actualInputPaths) !== JSON.stringify(expectedInputPaths)) {
    errors.push(
      `build receipt input coverage mismatch: expected ${JSON.stringify(expectedInputPaths)} but found ${JSON.stringify(actualInputPaths)}`,
    );
  }
  for (const entry of inputs) {
    const relativePath = String(entry.path ?? "");
    expectEqual(
      errors,
      `build receipt input ${relativePath}`,
      entry.fileDigest,
      digests.inputs[relativePath],
    );
  }

  const actualArtifactPaths = artifacts.map((entry) => String(entry.path ?? ""));
  const expectedArtifactPaths = Object.keys(digests.artifacts);
  if (JSON.stringify(actualArtifactPaths) !== JSON.stringify(expectedArtifactPaths)) {
    errors.push(
      `build receipt artifact coverage mismatch: expected ${JSON.stringify(expectedArtifactPaths)} but found ${JSON.stringify(actualArtifactPaths)}`,
    );
  }
  for (const entry of artifacts) {
    const relativePath = String(entry.path ?? "");
    const expected = digests.artifacts[relativePath];
    if (!expected) {
      errors.push(`build receipt artifact ${relativePath}: unexpected artifact`);
      continue;
    }
    expectEqual(
      errors,
      `build receipt artifact ${relativePath}`,
      entry.fileDigest,
      expected.fileDigest,
    );
    if (expected.canonicalDigest) {
      expectEqual(
        errors,
        `build receipt artifact ${relativePath} canonical`,
        entry.canonicalDigest,
        expected.canonicalDigest,
      );
    }
  }
}

async function validatePackageManifest(paths: GenomePackPaths, errors: string[]) {
  const artifacts = await loadPackageManifestEntries(paths);
  const actual = artifacts.map((entry) => entry.path);
  const expected = [
    ...(await loadBootstrapFiles(paths)).map((fileName) => `workspace/${fileName}`),
    "manifests/agent.lineage.json",
    "manifests/agent.runtime.json",
    "manifests/agent.policy.json",
    "manifests/deployment.manifest.json",
  ];
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    errors.push(
      `package manifest artifact coverage mismatch: expected ${JSON.stringify(expected)} but found ${JSON.stringify(actual)}`,
    );
  }
}

async function validateManifestBindings(
  paths: GenomePackPaths,
  errors: string[],
  digests: GenomePackDigests,
) {
  const lineage = await readJson(paths.lineageManifestPath);
  const runtime = await readJson(paths.runtimeManifestPath);
  const policy = await readJson(paths.policyManifestPath);

  expectEqual(
    errors,
    "lineage designStudio.outputDigest",
    getPathValue(lineage, "designStudio.outputDigest"),
    digests.packageManifestDigest,
  );
  expectEqual(
    errors,
    "lineage provenance.inputs[bundle]",
    (lineage.provenance as { inputs?: Array<{ kind?: string; digest?: string }> }).inputs?.find(
      (entry) => entry.kind === "bundle",
    )?.digest,
    digests.genomeDigest,
  );
  expectEqual(
    errors,
    "lineage provenance.inputs[prompt]",
    (lineage.provenance as { inputs?: Array<{ kind?: string; digest?: string }> }).inputs?.find(
      (entry) => entry.kind === "prompt",
    )?.digest,
    digests.packReadmeDigest,
  );
  expectEqual(
    errors,
    "lineage receipts.lineageDigest",
    getPathValue(lineage, "receipts.lineageDigest"),
    digests.manifests.lineageCanonicalDigest,
  );
  expectEqual(
    errors,
    "lineage receipts.admissionContractDigest",
    getPathValue(lineage, "receipts.admissionContractDigest"),
    digests.admissionContractDigest,
  );

  expectEqual(
    errors,
    "runtime lineage digest",
    getPathValue(runtime, "lineage.lineageDigest"),
    digests.manifests.lineageCanonicalDigest,
  );
  expectEqual(
    errors,
    "runtime instructions digest",
    getPathValue(runtime, "runtime.instructionsDigest"),
    digests.instructionsDigest,
  );
  expectEqual(
    errors,
    "runtime tool catalog digest",
    getPathValue(runtime, "runtime.toolCatalogDigest"),
    digests.toolCatalogDigest,
  );
  expectEqual(
    errors,
    "runtime provenance designStudioOutputDigest",
    getPathValue(runtime, "provenance.designStudioOutputDigest"),
    digests.packageManifestDigest,
  );
  expectEqual(
    errors,
    "runtime provenance lineageDigest",
    getPathValue(runtime, "provenance.lineageDigest"),
    digests.manifests.lineageCanonicalDigest,
  );
  expectEqual(
    errors,
    "runtime receipts.runtimeDigest",
    getPathValue(runtime, "receipts.runtimeDigest"),
    digests.manifests.runtimeCanonicalDigest,
  );
  expectEqual(
    errors,
    "runtime receipts.lineageDigest",
    getPathValue(runtime, "receipts.lineageDigest"),
    digests.manifests.lineageCanonicalDigest,
  );
  expectEqual(
    errors,
    "runtime receipts.policyDigest",
    getPathValue(runtime, "receipts.policyDigest"),
    digests.manifests.policyCanonicalDigest,
  );

  expectEqual(
    errors,
    "policy lineage digest",
    getPathValue(policy, "lineage.lineageDigest"),
    digests.manifests.lineageCanonicalDigest,
  );
  expectEqual(
    errors,
    "policy provenance designStudioOutputDigest",
    getPathValue(policy, "provenance.designStudioOutputDigest"),
    digests.packageManifestDigest,
  );
  expectEqual(
    errors,
    "policy provenance lineageDigest",
    getPathValue(policy, "provenance.lineageDigest"),
    digests.manifests.lineageCanonicalDigest,
  );
  expectEqual(
    errors,
    "policy receipts.policyDigest",
    getPathValue(policy, "receipts.policyDigest"),
    digests.manifests.policyCanonicalDigest,
  );
  expectEqual(
    errors,
    "policy receipts.lineageDigest",
    getPathValue(policy, "receipts.lineageDigest"),
    digests.manifests.lineageCanonicalDigest,
  );
  expectEqual(
    errors,
    "policy receipts.runtimeDigest",
    getPathValue(policy, "receipts.runtimeDigest"),
    digests.manifests.runtimeCanonicalDigest,
  );
}

export async function validateGenomePack(
  paths: GenomePackPaths,
): Promise<GenomePackValidationResult> {
  const errors: string[] = [];
  await validateGenomeSchema(paths, errors);

  const manifestPairs = [
    [schemaPath(paths, "agent.lineage.schema.json"), paths.lineageManifestPath],
    [schemaPath(paths, "agent.runtime.schema.json"), paths.runtimeManifestPath],
    [schemaPath(paths, "agent.policy.schema.json"), paths.policyManifestPath],
  ] as const;

  for (const [schemaPathValue, dataPathValue] of manifestPairs) {
    errors.push(
      ...(await validateJsonSchema({
        repoRoot: paths.repoRoot,
        schemaPath: schemaPathValue,
        dataPath: dataPathValue,
      })),
    );
  }

  const digests = await computeGenomePackDigests(paths);
  await validatePackageManifest(paths, errors);
  await validateBuildReceipt(paths, errors, digests);
  await validateManifestBindings(paths, errors, digests);

  return {
    ok: errors.length === 0,
    errors,
    digests,
  };
}

export async function computeVoltarisV2Digests(): Promise<GenomePackDigests> {
  return await computeGenomePackDigests(resolveVoltarisV2GoldenPackPaths());
}

export async function validateVoltarisV2Pack(): Promise<GenomePackValidationResult> {
  return await validateGenomePack(resolveVoltarisV2GoldenPackPaths());
}
