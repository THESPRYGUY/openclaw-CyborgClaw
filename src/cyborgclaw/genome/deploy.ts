import fs from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { parse as parseYaml } from "yaml";
import { resolveAgentConfig, resolveDefaultAgentId } from "../../agents/agent-scope.js";
import { resolveDefaultAgentWorkspaceDir } from "../../agents/workspace.js";
import { applyAgentConfig } from "../../commands/agents.config.js";
import type { OpenClawConfig } from "../../config/config.js";
import { writeConfigFile } from "../../config/config.js";
import { resolveConfigPath, resolveStateDir } from "../../config/paths.js";
import {
  SafeOpenError,
  readPathWithinRoot,
  writeFileFromPathWithinRoot,
} from "../../infra/fs-safe.js";
import { normalizeAgentId } from "../../routing/session-key.js";
import { resolveUserPath } from "../../utils.js";
import { readJson, readText } from "./io.js";
import { resolveVoltarisV2GoldenPackPaths } from "./paths.js";
import type {
  DeploymentBridgeApplyResult,
  DeploymentBridgeConflictMode,
  DeploymentBridgePlan,
  DeploymentBridgeWrite,
  GenomePackPaths,
} from "./types.js";

type DeploymentManifest = {
  agentId?: unknown;
  workspace?: {
    bootstrapFiles?: unknown;
  };
  ownership?: {
    compilerOwns?: unknown;
    runtimeOwns?: unknown;
    gatewayOwns?: unknown;
    governanceOwns?: unknown;
  };
};

type PackageManifest = {
  agentId?: unknown;
  packageId?: unknown;
  artifacts?: Array<Record<string, unknown>>;
};

type GenomeSource = {
  agentId?: unknown;
  identity?: {
    displayName?: unknown;
  };
};

type DeploymentPackMetadata = {
  agentId: string;
  packageId: string;
  displayName?: string;
  bootstrapFiles: string[];
  artifactRoles: Map<string, string>;
  compilerOwns: string[];
  runtimeOwns: string[];
  gatewayOwns: string[];
  governanceOwns: string[];
};

export class GenomeDeploymentConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GenomeDeploymentConflictError";
  }
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function readOptionalGenomeSource(genomePath: string): Promise<GenomeSource | null> {
  try {
    return parseYaml(await readText(genomePath)) as GenomeSource;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return null;
    }
    throw error;
  }
}

function resolveProfile(env: NodeJS.ProcessEnv = process.env): string {
  const profile = env.OPENCLAW_PROFILE?.trim();
  if (!profile || profile.toLowerCase() === "default") {
    return "default";
  }
  return profile;
}

function resolveImplicitWorkspaceDir(
  cfg: OpenClawConfig,
  agentId: string,
  env: NodeJS.ProcessEnv,
): string {
  const normalizedAgentId = normalizeAgentId(agentId);
  const defaultAgentId = resolveDefaultAgentId(cfg);
  if (normalizedAgentId === defaultAgentId) {
    const fallback = cfg.agents?.defaults?.workspace?.trim();
    if (fallback) {
      return resolveUserPath(fallback, env);
    }
    return resolveDefaultAgentWorkspaceDir(env);
  }
  return path.join(resolveStateDir(env), `workspace-${normalizedAgentId}`);
}

function resolveTargetWorkspaceDir(
  cfg: OpenClawConfig,
  agentId: string,
  env: NodeJS.ProcessEnv,
): string {
  const configured = resolveAgentConfig(cfg, agentId)?.workspace?.trim();
  if (configured) {
    return resolveUserPath(configured, env);
  }
  return resolveImplicitWorkspaceDir(cfg, agentId, env);
}

function resolveImplicitAgentDir(agentId: string, env: NodeJS.ProcessEnv): string {
  return path.join(resolveStateDir(env), "agents", normalizeAgentId(agentId), "agent");
}

function resolveTargetAgentDir(
  cfg: OpenClawConfig,
  agentId: string,
  env: NodeJS.ProcessEnv,
): string {
  const configured = resolveAgentConfig(cfg, agentId)?.agentDir?.trim();
  if (configured) {
    return resolveUserPath(configured, env);
  }
  return resolveImplicitAgentDir(agentId, env);
}

async function loadDeploymentPackMetadata(paths: GenomePackPaths): Promise<DeploymentPackMetadata> {
  const deploymentManifest = (await readJson(paths.deploymentManifestPath)) as DeploymentManifest;
  const packageManifest = (await readJson(paths.packageManifestPath)) as PackageManifest;
  const genome = await readOptionalGenomeSource(paths.genomePath);

  const agentId = normalizeAgentId(
    asTrimmedString(deploymentManifest.agentId) ||
      asTrimmedString(packageManifest.agentId) ||
      asTrimmedString(genome?.agentId),
  );
  if (!agentId) {
    throw new Error(`deployment bridge could not resolve agent id from ${paths.packRoot}`);
  }

  const packageId = asTrimmedString(packageManifest.packageId);
  if (!packageId) {
    throw new Error(
      `deployment bridge could not resolve package id from ${paths.packageManifestPath}`,
    );
  }

  const artifactRoles = new Map<string, string>();
  for (const artifact of packageManifest.artifacts ?? []) {
    const artifactPath = typeof artifact.path === "string" ? artifact.path : "";
    if (!artifactPath) {
      continue;
    }
    const role = typeof artifact.role === "string" ? artifact.role : artifactPath;
    artifactRoles.set(artifactPath, role);
  }

  return {
    agentId,
    packageId,
    displayName:
      typeof genome?.identity?.displayName === "string"
        ? genome.identity.displayName.trim() || undefined
        : undefined,
    bootstrapFiles: asStringArray(deploymentManifest.workspace?.bootstrapFiles),
    artifactRoles,
    compilerOwns: asStringArray(deploymentManifest.ownership?.compilerOwns),
    runtimeOwns: asStringArray(deploymentManifest.ownership?.runtimeOwns),
    gatewayOwns: asStringArray(deploymentManifest.ownership?.gatewayOwns),
    governanceOwns: asStringArray(deploymentManifest.ownership?.governanceOwns),
  };
}

function buildConfigBinding(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  agentId: string;
  displayName?: string;
  workspaceDir: string;
  agentDir: string;
}) {
  const existing = resolveAgentConfig(params.cfg, params.agentId);
  const explicitFields = {
    name: existing?.name?.trim() ? undefined : params.displayName,
    workspace:
      params.workspaceDir === resolveImplicitWorkspaceDir(params.cfg, params.agentId, params.env)
        ? undefined
        : params.workspaceDir,
    agentDir:
      params.agentDir === resolveImplicitAgentDir(params.agentId, params.env)
        ? undefined
        : params.agentDir,
  };

  const nextConfig = applyAgentConfig(params.cfg, {
    agentId: params.agentId,
    ...(explicitFields.name ? { name: explicitFields.name } : {}),
    ...(explicitFields.workspace ? { workspace: explicitFields.workspace } : {}),
    ...(explicitFields.agentDir ? { agentDir: explicitFields.agentDir } : {}),
  });

  return {
    configPath: resolveConfigPath(params.env),
    changed: !isDeepStrictEqual(params.cfg, nextConfig),
    nextConfig,
    explicitFields,
    note: "Config binding is limited to agent discovery. Gateway sessions, routing, approvals, and control-plane truth remain untouched.",
  };
}

function buildWorkspaceWrites(params: {
  paths: GenomePackPaths;
  metadata: DeploymentPackMetadata;
  workspaceDir: string;
}): DeploymentBridgeWrite[] {
  return params.metadata.bootstrapFiles.map((fileName) => {
    const sourceRelativePath = path.posix.join("workspace", fileName);
    return {
      rootDir: params.workspaceDir,
      sourcePath: path.join(params.paths.compiledRoot, sourceRelativePath),
      sourceRelativePath,
      targetPath: path.join(params.workspaceDir, fileName),
      targetRelativePath: fileName,
      surface: "workspace",
      role: params.metadata.artifactRoles.get(sourceRelativePath) ?? sourceRelativePath,
    };
  });
}

function buildAgentDirWrites(params: {
  paths: GenomePackPaths;
  metadata: DeploymentPackMetadata;
  managedPackRoot: string;
}): DeploymentBridgeWrite[] {
  const relativePaths = [
    "build.receipt.json",
    "package.manifest.json",
    ...Array.from(params.metadata.artifactRoles.keys()),
  ].filter((entry, index, array) => array.indexOf(entry) === index);

  return relativePaths.map((sourceRelativePath) => ({
    rootDir: params.managedPackRoot,
    sourcePath: path.join(params.paths.compiledRoot, sourceRelativePath),
    sourceRelativePath,
    targetPath: path.join(params.managedPackRoot, "compiled", sourceRelativePath),
    targetRelativePath: path.posix.join("compiled", sourceRelativePath),
    surface: "agent-dir",
    role:
      sourceRelativePath === "build.receipt.json"
        ? "build-receipt"
        : sourceRelativePath === "package.manifest.json"
          ? "package-manifest"
          : (params.metadata.artifactRoles.get(sourceRelativePath) ?? sourceRelativePath),
  }));
}

export async function planGenomePackDeployment(params: {
  paths: GenomePackPaths;
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
}): Promise<DeploymentBridgePlan> {
  const cfg = params.cfg ?? {};
  const env = params.env ?? process.env;
  const metadata = await loadDeploymentPackMetadata(params.paths);
  const stateDir = resolveStateDir(env);
  const workspaceDir = resolveTargetWorkspaceDir(cfg, metadata.agentId, env);
  const agentDir = resolveTargetAgentDir(cfg, metadata.agentId, env);
  const managedPackRoot = path.join(agentDir, "cyborgclaw", "genome", "packs", metadata.packageId);

  return {
    pack: {
      packRoot: params.paths.packRoot,
      compiledRoot: params.paths.compiledRoot,
      packageId: metadata.packageId,
      agentId: metadata.agentId,
    },
    target: {
      agentId: metadata.agentId,
      profile: resolveProfile(env),
      stateDir,
      workspaceDir,
      agentDir,
      managedPackRoot,
      managedPackCompiledRoot: path.join(managedPackRoot, "compiled"),
    },
    workspaceWrites: buildWorkspaceWrites({
      paths: params.paths,
      metadata,
      workspaceDir,
    }),
    agentDirWrites: buildAgentDirWrites({
      paths: params.paths,
      metadata,
      managedPackRoot,
    }),
    configBinding: buildConfigBinding({
      cfg,
      env,
      agentId: metadata.agentId,
      displayName: metadata.displayName,
      workspaceDir,
      agentDir,
    }),
    authorityBoundary: {
      compilerOwns: metadata.compilerOwns,
      runtimeOwns: metadata.runtimeOwns,
      gatewayOwns: metadata.gatewayOwns,
      governanceOwns: metadata.governanceOwns,
      touchesGatewaySessionState: false,
    },
  };
}

async function applyWrite(params: {
  write: DeploymentBridgeWrite;
  conflictMode: DeploymentBridgeConflictMode;
  writtenFiles: string[];
  skippedFiles: string[];
}) {
  const sourceBuffer = await fs.readFile(params.write.sourcePath);

  try {
    const existing = await readPathWithinRoot({
      rootDir: params.write.rootDir,
      filePath: params.write.targetPath,
      rejectHardlinks: true,
    });
    if (Buffer.compare(existing.buffer, sourceBuffer) === 0) {
      params.skippedFiles.push(params.write.targetPath);
      return;
    }
    if (params.conflictMode === "error") {
      throw new GenomeDeploymentConflictError(
        `deployment bridge refused to overwrite drifted ${params.write.surface} file ${params.write.targetPath}`,
      );
    }
  } catch (error) {
    if (!(error instanceof SafeOpenError) || error.code !== "not-found") {
      throw error;
    }
  }

  await writeFileFromPathWithinRoot({
    rootDir: params.write.rootDir,
    relativePath: params.write.targetRelativePath,
    sourcePath: params.write.sourcePath,
  });
  params.writtenFiles.push(params.write.targetPath);
}

export async function applyGenomePackDeployment(params: {
  plan?: DeploymentBridgePlan;
  paths?: GenomePackPaths;
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  conflictMode?: DeploymentBridgeConflictMode;
  writeConfig?: boolean;
}): Promise<DeploymentBridgeApplyResult> {
  const plan =
    params.plan ??
    (await planGenomePackDeployment({
      paths: params.paths ?? resolveVoltarisV2GoldenPackPaths(),
      cfg: params.cfg,
      env: params.env,
    }));

  await fs.mkdir(plan.target.workspaceDir, { recursive: true });
  await fs.mkdir(plan.target.managedPackRoot, { recursive: true });

  const writtenFiles: string[] = [];
  const skippedFiles: string[] = [];
  const conflictMode = params.conflictMode ?? "error";

  for (const write of [...plan.workspaceWrites, ...plan.agentDirWrites]) {
    await applyWrite({
      write,
      conflictMode,
      writtenFiles,
      skippedFiles,
    });
  }

  let configWritten = false;
  if (params.writeConfig && plan.configBinding.changed) {
    await writeConfigFile(plan.configBinding.nextConfig);
    configWritten = true;
  }

  return {
    plan,
    writtenFiles,
    skippedFiles,
    configWritten,
  };
}

export async function planVoltarisV2FixtureDeployment(params: {
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
}): Promise<DeploymentBridgePlan> {
  return await planGenomePackDeployment({
    paths: resolveVoltarisV2GoldenPackPaths(),
    cfg: params.cfg,
    env: params.env,
  });
}

export async function applyVoltarisV2FixtureDeployment(params: {
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  conflictMode?: DeploymentBridgeConflictMode;
  writeConfig?: boolean;
}): Promise<DeploymentBridgeApplyResult> {
  return await applyGenomePackDeployment({
    paths: resolveVoltarisV2GoldenPackPaths(),
    cfg: params.cfg,
    env: params.env,
    conflictMode: params.conflictMode,
    writeConfig: params.writeConfig,
  });
}
