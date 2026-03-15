import { isDeepStrictEqual } from "node:util";
import { parse as parseYaml } from "yaml";
import { resolveAgentConfig } from "../agents/agent-scope.js";
import { applyAgentConfig } from "../commands/agents.config.js";
import { readBestEffortConfig } from "../config/config.js";
import { resolveConfigPath } from "../config/paths.js";
import {
  applyGenomePackDeployment,
  planGenomePackDeployment,
  readJson,
  readText,
  resolveGenomePackReference,
  validateGenomePack,
} from "../cyborgclaw/genome/index.js";
import type { RuntimeEnv } from "../runtime.js";
import { theme } from "../terminal/theme.js";
import { shortenHomePath } from "../utils.js";

type GenomeValidateCommandOpts = {
  ref?: string;
  json?: boolean;
};

type GenomePlanDeployCommandOpts = {
  ref?: string;
  profile?: string;
  json?: boolean;
  writeConfig?: boolean;
};

type GenomeApplyDeployCommandOpts = GenomePlanDeployCommandOpts & {
  force?: boolean;
  overwrite?: boolean;
};

type GenomeShowReceiptCommandOpts = {
  ref?: string;
  profile?: string;
  json?: boolean;
};

type GenomePackSummary = {
  packRoot: string;
  sourceKind: string;
  packageId: string;
  agentId: string;
  displayName: string | null;
  genomeId: string | null;
  lineageId: string | null;
  runtimeId: string | null;
  policyId: string | null;
  buildEpoch: string | null;
  buildReceiptPath: string;
  packageManifestPath: string;
  warnings: string[];
  unknowns: string[];
  buildReceipt: Record<string, unknown>;
};

const GATEWAY_UNTOUCHED_SURFACES = [
  "sessions",
  "routing",
  "channel state",
  "approvals",
  "control-plane truth",
] as const;

type GenomeSourceSummary = {
  genomeId?: unknown;
  agentId?: unknown;
  identity?: {
    displayName?: unknown;
  };
};

type RuntimeManifestSummary = {
  runtimeId?: unknown;
  agent?: {
    agentId?: unknown;
  };
};

type LineageManifestSummary = {
  lineageId?: unknown;
  agentId?: unknown;
};

type DeploymentManifestSummary = {
  genomeId?: unknown;
  agentId?: unknown;
  unknowns?: unknown;
};

function withProfileEnv(profile?: string): NodeJS.ProcessEnv {
  if (!profile?.trim()) {
    return process.env;
  }
  return {
    ...process.env,
    OPENCLAW_PROFILE: profile.trim(),
  };
}

async function readOptionalGenomeSource(genomePath: string): Promise<GenomeSourceSummary | null> {
  try {
    return (parseYaml(await readText(genomePath)) ?? {}) as GenomeSourceSummary;
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

async function inspectGenomePack(params: {
  ref?: string;
  profile?: string;
}): Promise<GenomePackSummary & Awaited<ReturnType<typeof resolveGenomePackReference>>> {
  const resolution = await resolveGenomePackReference({
    reference: params.ref,
    env: withProfileEnv(params.profile),
  });
  const genome = await readOptionalGenomeSource(resolution.paths.genomePath);
  const packageManifest = (await readJson(resolution.paths.packageManifestPath)) as {
    packageId?: unknown;
    agentId?: unknown;
  };
  const lineageManifest = (await readJson(
    resolution.paths.lineageManifestPath,
  )) as LineageManifestSummary;
  const runtimeManifest = (await readJson(
    resolution.paths.runtimeManifestPath,
  )) as RuntimeManifestSummary;
  const policyManifest = (await readJson(resolution.paths.policyManifestPath)) as {
    policyId?: unknown;
  };
  const deploymentManifest = (await readJson(
    resolution.paths.deploymentManifestPath,
  )) as DeploymentManifestSummary;
  const buildReceipt = (await readJson(resolution.paths.buildReceiptPath)) as {
    packageId?: unknown;
    buildEpoch?: unknown;
  };

  return {
    ...resolution,
    packRoot: resolution.paths.packRoot,
    packageId:
      (typeof packageManifest.packageId === "string" && packageManifest.packageId.trim()) ||
      (typeof buildReceipt.packageId === "string" && buildReceipt.packageId.trim()) ||
      "UNKNOWN",
    agentId:
      (typeof packageManifest.agentId === "string" && packageManifest.agentId.trim()) ||
      (typeof deploymentManifest.agentId === "string" && deploymentManifest.agentId.trim()) ||
      (typeof runtimeManifest.agent?.agentId === "string" &&
        runtimeManifest.agent.agentId.trim()) ||
      (typeof lineageManifest.agentId === "string" && lineageManifest.agentId.trim()) ||
      (typeof genome?.agentId === "string" && genome.agentId.trim()) ||
      "UNKNOWN",
    displayName:
      typeof genome?.identity?.displayName === "string" ? genome.identity.displayName.trim() : null,
    genomeId:
      typeof genome?.genomeId === "string"
        ? genome.genomeId
        : typeof deploymentManifest.genomeId === "string"
          ? deploymentManifest.genomeId
          : null,
    lineageId: typeof lineageManifest.lineageId === "string" ? lineageManifest.lineageId : null,
    runtimeId: typeof runtimeManifest.runtimeId === "string" ? runtimeManifest.runtimeId : null,
    policyId: typeof policyManifest.policyId === "string" ? policyManifest.policyId : null,
    buildEpoch: typeof buildReceipt.buildEpoch === "string" ? buildReceipt.buildEpoch : null,
    buildReceiptPath: resolution.paths.buildReceiptPath,
    packageManifestPath: resolution.paths.packageManifestPath,
    warnings: resolution.warnings,
    unknowns: Array.isArray(deploymentManifest.unknowns)
      ? deploymentManifest.unknowns.filter((entry): entry is string => typeof entry === "string")
      : [],
    buildReceipt,
  };
}

function formatMaybePath(value: string): string {
  return shortenHomePath(value);
}

function formatUnknownString(value: unknown): string {
  return typeof value === "string" && value.trim() ? value : "UNKNOWN";
}

function buildConfigBindingPreview(params: {
  cfg: Awaited<ReturnType<typeof readBestEffortConfig>>;
  env: NodeJS.ProcessEnv;
  agentId: string;
  displayName?: string | null;
  workspaceDir?: string | null;
  agentDir?: string | null;
}) {
  const current = resolveAgentConfig(params.cfg, params.agentId);
  const explicitFields = {
    name: current?.name?.trim() ? undefined : (params.displayName ?? undefined),
    workspace: params.workspaceDir ?? undefined,
    agentDir: params.agentDir ?? undefined,
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
    note: "Config binding is optional and limited to agent discovery. Gateway-owned session and routing state remain untouched.",
  };
}

async function buildDeploymentPlan(params: {
  ref?: string;
  profile?: string;
  writeConfig?: boolean;
}) {
  const env = withProfileEnv(params.profile);
  const pack = await inspectGenomePack({ ref: params.ref, profile: params.profile });
  const cfg = await readBestEffortConfig();
  const plan = await planGenomePackDeployment({
    paths: pack.paths,
    cfg,
    env,
  });

  const configBinding = buildConfigBindingPreview({
    cfg,
    env,
    agentId: pack.agentId,
    displayName: pack.displayName,
  });

  return {
    pack,
    plan: {
      ...plan,
      configBinding,
    },
    writeConfigRequested: Boolean(params.writeConfig),
  };
}

function runtimeLogJson(runtime: RuntimeEnv, payload: unknown) {
  runtime.log(JSON.stringify(payload, null, 2));
}

function renderWarnings(lines: string[], label: string, entries: string[]) {
  if (entries.length === 0) {
    return;
  }
  lines.push(theme.heading(label));
  for (const entry of entries) {
    lines.push(`  - ${entry}`);
  }
  lines.push("");
}

function renderTouchedVsUntouched(
  lines: string[],
  touched: string[],
  untouched: readonly string[],
) {
  lines.push(theme.heading("Touched surfaces"));
  for (const entry of touched) {
    lines.push(`  - ${entry}`);
  }
  lines.push("");
  lines.push(theme.heading("Untouched Gateway-owned surfaces"));
  for (const entry of untouched) {
    lines.push(`  - ${entry}`);
  }
}

export async function genomeValidateCommand(
  runtime: RuntimeEnv,
  opts: GenomeValidateCommandOpts,
): Promise<void> {
  const pack = await inspectGenomePack({ ref: opts.ref });
  const result = await validateGenomePack(pack.paths);

  const payload = {
    status: result.ok ? "valid" : "invalid",
    command: "validate",
    reference: pack.reference,
    sourceKind: pack.sourceKind,
    packRoot: pack.packRoot,
    packageId: pack.packageId,
    genomeId: pack.genomeId,
    agentId: pack.agentId,
    lineageId: pack.lineageId,
    buildReceiptPath: pack.buildReceiptPath,
    digestStatus: result.ok ? "ok" : "mismatch",
    digests: {
      packageManifestDigest: result.digests.packageManifestDigest,
      lineageCanonicalDigest: result.digests.manifests.lineageCanonicalDigest,
      runtimeCanonicalDigest: result.digests.manifests.runtimeCanonicalDigest,
      policyCanonicalDigest: result.digests.manifests.policyCanonicalDigest,
    },
    warnings: pack.warnings,
    unknowns: pack.unknowns,
    errors: result.errors,
  };

  if (opts.json) {
    runtimeLogJson(runtime, payload);
  } else {
    const lines = [
      theme.heading("Genome validation"),
      "",
      `  Package: ${pack.packageId}`,
      `  Genome: ${pack.genomeId ?? "UNKNOWN"}`,
      `  Agent: ${pack.agentId}`,
      `  Lineage: ${pack.lineageId ?? "UNKNOWN"}`,
      `  Pack root: ${formatMaybePath(pack.packRoot)}`,
      `  Status: ${result.ok ? theme.success("PASS") : theme.error("FAIL")}`,
      "",
      theme.heading("Digest checks"),
      `  Package manifest: ${result.digests.packageManifestDigest}`,
      `  Lineage: ${result.digests.manifests.lineageCanonicalDigest}`,
      `  Runtime: ${result.digests.manifests.runtimeCanonicalDigest}`,
      `  Policy: ${result.digests.manifests.policyCanonicalDigest}`,
      "",
    ];
    renderWarnings(lines, "Warnings", pack.warnings);
    renderWarnings(lines, "UNKNOWNs", pack.unknowns);
    if (result.errors.length > 0) {
      lines.push(theme.heading("Errors"));
      for (const error of result.errors) {
        lines.push(`  - ${error}`);
      }
      lines.push("");
    }
    lines.push(theme.muted("Validation is read-only. Gateway-owned state was not touched."));
    runtime.log(lines.join("\n").trimEnd());
  }

  if (!result.ok) {
    throw new Error(`Genome validation failed for ${pack.packageId}`);
  }
}

export async function genomePlanDeployCommand(
  runtime: RuntimeEnv,
  opts: GenomePlanDeployCommandOpts,
): Promise<void> {
  const { pack, plan, writeConfigRequested } = await buildDeploymentPlan(opts);
  const payload = {
    status: "planned",
    command: "plan-deploy",
    reference: pack.reference,
    sourceKind: pack.sourceKind,
    packRoot: pack.packRoot,
    packageId: pack.packageId,
    genomeId: pack.genomeId,
    agentId: pack.agentId,
    lineageId: pack.lineageId,
    dryRun: true,
    target: plan.target,
    wouldWrite: {
      workspace: plan.workspaceWrites.map((entry) => ({
        role: entry.role,
        targetPath: entry.targetPath,
      })),
      agentDir: plan.agentDirWrites.map((entry) => ({
        role: entry.role,
        targetPath: entry.targetPath,
      })),
      configBinding: {
        requested: writeConfigRequested,
        changed: plan.configBinding.changed,
        configPath: plan.configBinding.configPath,
        explicitFields: plan.configBinding.explicitFields,
      },
    },
    untouchedGatewaySurfaces: GATEWAY_UNTOUCHED_SURFACES,
    warnings: [
      ...pack.warnings,
      ...(opts.profile?.trim()
        ? [
            `Profile override applies at planning/deployment time and does not change Gateway authority.`,
          ]
        : []),
    ],
    unknowns: pack.unknowns,
  };

  if (opts.json) {
    runtimeLogJson(runtime, payload);
    return;
  }

  const lines = [
    theme.heading("Genome deployment plan"),
    "",
    `  Package: ${pack.packageId}`,
    `  Genome: ${pack.genomeId ?? "UNKNOWN"}`,
    `  Agent: ${pack.agentId}`,
    `  Profile: ${plan.target.profile}`,
    `  Workspace: ${formatMaybePath(plan.target.workspaceDir)}`,
    `  Agent dir: ${formatMaybePath(plan.target.agentDir)}`,
    `  Archive root: ${formatMaybePath(plan.target.managedPackRoot)}`,
    "",
    theme.heading("Would write workspace artifacts"),
  ];
  for (const entry of plan.workspaceWrites) {
    lines.push(`  - ${entry.role}: ${formatMaybePath(entry.targetPath)}`);
  }
  lines.push("");
  lines.push(theme.heading("Would write genome archive"));
  for (const entry of plan.agentDirWrites) {
    lines.push(`  - ${entry.role}: ${formatMaybePath(entry.targetPath)}`);
  }
  lines.push("");
  lines.push(theme.heading("Optional config binding"));
  lines.push(`  Requested: ${writeConfigRequested ? "yes" : "no"}`);
  lines.push(`  Would change config: ${plan.configBinding.changed ? "yes" : "no"}`);
  lines.push(`  Config path: ${formatMaybePath(plan.configBinding.configPath)}`);
  lines.push("");
  renderWarnings(lines, "Warnings", payload.warnings);
  renderWarnings(lines, "UNKNOWNs", pack.unknowns);
  renderTouchedVsUntouched(
    lines,
    ["workspace bootstrap artifacts", "genome pack archive", "optional agent config binding"],
    GATEWAY_UNTOUCHED_SURFACES,
  );
  lines.push("");
  lines.push(theme.muted("Dry run only. No files were written."));
  runtime.log(lines.join("\n").trimEnd());
}

export async function genomeApplyDeployCommand(
  runtime: RuntimeEnv,
  opts: GenomeApplyDeployCommandOpts,
): Promise<void> {
  if (!opts.force) {
    throw new Error("apply-deploy requires --force to perform writes.");
  }

  const { pack, plan, writeConfigRequested } = await buildDeploymentPlan(opts);
  const result = await applyGenomePackDeployment({
    plan,
    conflictMode: opts.overwrite ? "overwrite" : "error",
    writeConfig: writeConfigRequested,
  });

  const deployedReceiptPath = `${result.plan.target.managedPackCompiledRoot}/build.receipt.json`;
  const payload = {
    status: "applied",
    command: "apply-deploy",
    reference: pack.reference,
    sourceKind: pack.sourceKind,
    packageId: pack.packageId,
    genomeId: pack.genomeId,
    agentId: pack.agentId,
    lineageId: pack.lineageId,
    target: result.plan.target,
    writtenFiles: result.writtenFiles,
    skippedFiles: result.skippedFiles,
    configWritten: result.configWritten,
    buildReceipt: {
      sourcePath: pack.buildReceiptPath,
      deployedPath: deployedReceiptPath,
      buildEpoch: pack.buildEpoch,
    },
    untouchedGatewaySurfaces: GATEWAY_UNTOUCHED_SURFACES,
    warnings: pack.warnings,
    unknowns: pack.unknowns,
  };

  if (opts.json) {
    runtimeLogJson(runtime, payload);
    return;
  }

  const lines = [
    theme.heading("Genome deployment applied"),
    "",
    `  Package: ${pack.packageId}`,
    `  Genome: ${pack.genomeId ?? "UNKNOWN"}`,
    `  Agent: ${pack.agentId}`,
    `  Workspace: ${formatMaybePath(result.plan.target.workspaceDir)}`,
    `  Agent dir: ${formatMaybePath(result.plan.target.agentDir)}`,
    `  Archive root: ${formatMaybePath(result.plan.target.managedPackRoot)}`,
    "",
    theme.heading("Changed"),
    `  Written files: ${result.writtenFiles.length}`,
    `  Skipped unchanged files: ${result.skippedFiles.length}`,
    `  Config binding written: ${result.configWritten ? "yes" : "no"}`,
    "",
    theme.heading("Receipt locations"),
    `  Source receipt: ${formatMaybePath(pack.buildReceiptPath)}`,
    `  Deployed receipt: ${formatMaybePath(deployedReceiptPath)}`,
    "",
  ];
  renderWarnings(lines, "Warnings", pack.warnings);
  renderWarnings(lines, "UNKNOWNs", pack.unknowns);
  renderTouchedVsUntouched(
    lines,
    [
      "workspace bootstrap artifacts",
      "genome pack archive",
      ...(result.configWritten ? ["agent config binding"] : []),
    ],
    GATEWAY_UNTOUCHED_SURFACES,
  );
  lines.push("");
  lines.push(
    theme.muted(
      "Next step: restart or point the runtime at the deployed workspace only if your operator workflow requires it.",
    ),
  );
  runtime.log(lines.join("\n").trimEnd());
}

export async function genomeShowReceiptCommand(
  runtime: RuntimeEnv,
  opts: GenomeShowReceiptCommandOpts,
): Promise<void> {
  const env = withProfileEnv(opts.profile);
  const pack = await inspectGenomePack({ ref: opts.ref, profile: opts.profile });
  const cfg = await readBestEffortConfig();
  const plan = await planGenomePackDeployment({
    paths: pack.paths,
    cfg,
    env,
  });

  const payload = {
    status: "ok",
    command: "show-receipt",
    reference: pack.reference,
    sourceKind: pack.sourceKind,
    packageId: pack.packageId,
    genomeId: pack.genomeId,
    agentId: pack.agentId,
    lineageId: pack.lineageId,
    runtimeId: pack.runtimeId,
    policyId: pack.policyId,
    buildEpoch: pack.buildEpoch,
    compilerVersion: null,
    buildReceiptPath: pack.buildReceiptPath,
    packageManifestPath: pack.packageManifestPath,
    buildReceipt: pack.buildReceipt,
    resolvedCurrentTarget: {
      profile: plan.target.profile,
      workspaceDir: plan.target.workspaceDir,
      agentDir: plan.target.agentDir,
      managedPackRoot: plan.target.managedPackRoot,
    },
    warnings: pack.warnings,
    unknowns: pack.unknowns,
  };

  if (opts.json) {
    runtimeLogJson(runtime, payload);
    return;
  }

  const reproducibility =
    (pack.buildReceipt.reproducibility as Record<string, unknown> | undefined) ?? {};
  const lines = [
    theme.heading("Genome receipt"),
    "",
    `  Package: ${pack.packageId}`,
    `  Genome: ${pack.genomeId ?? "UNKNOWN"}`,
    `  Agent: ${pack.agentId}`,
    `  Lineage: ${pack.lineageId ?? "UNKNOWN"}`,
    `  Build epoch: ${pack.buildEpoch ?? "UNKNOWN"}`,
    `  Receipt: ${formatMaybePath(pack.buildReceiptPath)}`,
    "",
    theme.heading("Reproducibility"),
    `  Encoding: ${formatUnknownString(reproducibility.encoding)}`,
    `  Newline: ${formatUnknownString(reproducibility.newline)}`,
    `  JSON style: ${formatUnknownString(reproducibility.jsonStyle)}`,
    "",
    theme.heading("Current target resolution"),
    `  Profile: ${plan.target.profile}`,
    `  Workspace: ${formatMaybePath(plan.target.workspaceDir)}`,
    `  Agent dir: ${formatMaybePath(plan.target.agentDir)}`,
    `  Archive root: ${formatMaybePath(plan.target.managedPackRoot)}`,
    "",
  ];
  renderWarnings(lines, "Warnings", pack.warnings);
  renderWarnings(lines, "UNKNOWNs", pack.unknowns);
  lines.push(theme.muted("Receipt inspection is read-only. Gateway-owned state was not touched."));
  runtime.log(lines.join("\n").trimEnd());
}
