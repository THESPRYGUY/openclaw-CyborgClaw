import type { OpenClawConfig } from "../../config/config.js";

export type JsonRecord = Record<string, unknown>;

export type GenomePackPaths = {
  repoRoot: string;
  packRoot: string;
  genomePath: string;
  readmePath: string;
  compiledRoot: string;
  workspaceRoot: string;
  manifestsRoot: string;
  packageManifestPath: string;
  buildReceiptPath: string;
  lineageManifestPath: string;
  runtimeManifestPath: string;
  policyManifestPath: string;
  deploymentManifestPath: string;
};

export type GenomePackDigests = {
  admissionContractDigest: string;
  genomeDigest: string;
  packReadmeDigest: string;
  packageManifestDigest: string;
  instructionsDigest: string;
  toolCatalogDigest: string;
  inputs: Record<string, string>;
  artifacts: Record<string, { fileDigest: string; canonicalDigest?: string }>;
  manifests: {
    lineageCanonicalDigest: string;
    runtimeCanonicalDigest: string;
    policyCanonicalDigest: string;
  };
};

export type GenomePackValidationResult = {
  ok: boolean;
  errors: string[];
  digests: GenomePackDigests;
};

export type DeploymentBridgeConflictMode = "error" | "overwrite";

export type DeploymentBridgeWrite = {
  rootDir: string;
  sourcePath: string;
  sourceRelativePath: string;
  targetPath: string;
  targetRelativePath: string;
  surface: "workspace" | "agent-dir";
  role: string;
};

export type DeploymentBridgeConfigBinding = {
  configPath: string;
  changed: boolean;
  nextConfig: OpenClawConfig;
  explicitFields: {
    name?: string;
    workspace?: string;
    agentDir?: string;
  };
  note: string;
};

export type DeploymentBridgePlan = {
  pack: {
    packRoot: string;
    compiledRoot: string;
    packageId: string;
    agentId: string;
  };
  target: {
    agentId: string;
    profile: string;
    stateDir: string;
    workspaceDir: string;
    agentDir: string;
    managedPackRoot: string;
    managedPackCompiledRoot: string;
  };
  workspaceWrites: DeploymentBridgeWrite[];
  agentDirWrites: DeploymentBridgeWrite[];
  configBinding: DeploymentBridgeConfigBinding;
  authorityBoundary: {
    compilerOwns: string[];
    runtimeOwns: string[];
    gatewayOwns: string[];
    governanceOwns: string[];
    touchesGatewaySessionState: false;
  };
};

export type DeploymentBridgeApplyResult = {
  plan: DeploymentBridgePlan;
  writtenFiles: string[];
  skippedFiles: string[];
  configWritten: boolean;
};

export type GenomePackReferenceSourceKind =
  | "fixture-default"
  | "package-id"
  | "path"
  | "receipt-path";

export type GenomePackReferenceResolution = {
  reference: string | null;
  sourceKind: GenomePackReferenceSourceKind;
  paths: GenomePackPaths;
  warnings: string[];
};
