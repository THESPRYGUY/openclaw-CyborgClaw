#!/usr/bin/env node
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { listProfilesForProvider } from "../../src/agents/auth-profiles/profiles.js";
import type {
  AuthProfileCredential,
  AuthProfileStore,
} from "../../src/agents/auth-profiles/types.js";
import { readCodexCliCredentialsCached } from "../../src/agents/cli-credentials.js";
import { splitModelRef } from "../../src/agents/subagent-spawn.js";

const execFileAsync = promisify(execFile);
const REPO_ROOT = path.resolve(import.meta.dirname, "../..");
const DEFAULT_PACK_REF = "examples/voltaris-v2-pack";
const DEFAULT_PROFILE = "voltaris-proof";
const DEFAULT_MODEL = "openai-codex/gpt-5.3-codex";
const DEFAULT_REPORT_SUBDIR = "live-runtime-benchmark";
const OPENAI_CODEX_DEFAULT_PROFILE_ID = "openai-codex:default";
const SMOKE_SCRIPT_PATH = path.join(
  REPO_ROOT,
  "scripts",
  "cyborgclaw",
  "voltaris-v2-live-runtime-smoke.ts",
);

type Args = {
  reportDir: string;
  packRef: string;
  profile: string;
  model: string;
  enabled: boolean;
  preflightOnly: boolean;
  authSourceStateDir?: string;
  authProfilesJsonPath?: string;
  authProfilesJsonInline?: string;
};

export type BenchmarkPreflight = {
  ok: boolean;
  modelRef: string;
  providerId: string | null;
  enabled: boolean;
  authSourceStateDir: string | null;
  authStorePath: string | null;
  authStorePresent: boolean;
  authProfileCount: number;
  readyProfileCount: number;
  readyProfileIds: string[];
  failureReasons: string[];
};

export type BenchmarkVerdict = {
  ok: boolean;
  failedAssertions: string[];
  assertionCount: number;
  passedAssertionCount: number;
  failedAssertionCount: number;
  smokeError: string | null;
  status: "pass" | "fail";
  failureReasons: string[];
};

type SmokeProof = {
  ok?: boolean;
  proofRoot?: string;
  reportPath?: string;
  assertions?: Record<string, unknown>;
  error?: {
    message?: string;
    stack?: string;
  };
};

export type BenchmarkSmokeReport = {
  ok: boolean;
  command: string[];
  stdoutPath: string | null;
  stderrPath: string | null;
  reportCopyPath: string | null;
  proofRootCopyPath: string | null;
  proof?: SmokeProof | null;
};

export type BenchmarkReadiness = {
  preflight: {
    ok: boolean;
    status: "ready" | "blocked";
    summary: string;
    providerId: string | null;
    readyProfileCount: number;
    readyProfileIds: string[];
    failureReasons: string[];
  };
  proof: {
    ok: boolean;
    status: "ready" | "blocked" | "not_run";
    summary: string;
    assertionCount: number;
    passedAssertionCount: number;
    failedAssertionCount: number;
    failedAssertions: string[];
    smokeError: string | null;
    failureReasons: string[];
  };
  promotion: {
    ok: boolean;
    status: "green" | "blocked" | "not_run";
    summary: string;
    failureReasons: string[];
  };
};

type GateReport = {
  ok: boolean;
  phase: "preflight" | "run";
  generatedAt: string;
  packRef: string;
  profile: string;
  modelRef: string;
  preflight: BenchmarkPreflight;
  readiness: BenchmarkReadiness;
  smoke?: BenchmarkSmokeReport;
  verdict: BenchmarkVerdict;
};

function resolveArg(flag: string): string | undefined {
  const argv = process.argv.slice(2);
  const eq = argv.find((entry) => entry.startsWith(`${flag}=`));
  if (eq) {
    return eq.slice(flag.length + 1);
  }
  const index = argv.indexOf(flag);
  if (index >= 0 && index + 1 < argv.length) {
    return argv[index + 1];
  }
  return undefined;
}

function hasFlag(flag: string): boolean {
  return process.argv.slice(2).includes(flag);
}

function normalizeBooleanEnv(value: string | undefined): boolean {
  return (
    String(value || "")
      .trim()
      .toLowerCase() === "true"
  );
}

function resolveNonEmptyEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function resolveReportDir(): string {
  const explicit = resolveArg("--report-dir");
  if (explicit) {
    return path.resolve(explicit);
  }
  return path.join(os.tmpdir(), DEFAULT_REPORT_SUBDIR);
}

function parseArgs(): Args {
  return {
    reportDir: resolveReportDir(),
    packRef: resolveArg("--pack") ?? DEFAULT_PACK_REF,
    profile: resolveArg("--profile") ?? DEFAULT_PROFILE,
    model:
      resolveArg("--model") ?? resolveNonEmptyEnv("OPENCLAW_LIVE_BENCHMARK_MODEL") ?? DEFAULT_MODEL,
    enabled: normalizeBooleanEnv(process.env.OPENCLAW_LIVE_BENCHMARK_ENABLED),
    preflightOnly: hasFlag("--preflight-only"),
    authSourceStateDir: resolveArg("--auth-source-state-dir"),
    authProfilesJsonPath: resolveArg("--auth-profiles-json-path"),
    authProfilesJsonInline:
      resolveArg("--auth-profiles-json") ?? process.env.OPENCLAW_LIVE_BENCHMARK_AUTH_PROFILES_JSON,
  };
}

async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function cloneAuthProfileStore(store: AuthProfileStore): AuthProfileStore {
  return structuredClone(store);
}

function extractJsonObject(raw: string): Record<string, unknown> {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("command did not emit JSON output");
  }
  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {}
  const objectStart = Math.max(trimmed.lastIndexOf("\n{"), trimmed.indexOf("{"));
  if (objectStart < 0) {
    throw new Error(`command did not emit JSON output:\n${trimmed}`);
  }
  const jsonText = trimmed.slice(
    objectStart === trimmed.indexOf("{") ? objectStart : objectStart + 1,
  );
  return JSON.parse(jsonText) as Record<string, unknown>;
}

async function resolveAuthSourceStateDir(args: Args): Promise<{
  stateDir: string | null;
  authStorePath: string | null;
  authStorePresent: boolean;
  store: AuthProfileStore | null;
  error: string | null;
}> {
  const benchmarkProviderId = splitModelRef(args.model).provider?.trim() || null;
  const explicitStateDir = args.authSourceStateDir ? path.resolve(args.authSourceStateDir) : null;
  if (explicitStateDir) {
    const sourceAuthStorePath = path.join(
      explicitStateDir,
      "agents",
      "main",
      "agent",
      "auth-profiles.json",
    );
    const authStorePresent = await pathExists(sourceAuthStorePath);
    const store = authStorePresent
      ? await readJsonFile<AuthProfileStore>(sourceAuthStorePath)
      : null;
    if (!authStorePresent || !store) {
      return {
        stateDir: explicitStateDir,
        authStorePath: sourceAuthStorePath,
        authStorePresent,
        store,
        error: null,
      };
    }
    const seededStore = cloneAuthProfileStore(store);
    if (benchmarkProviderId === "openai-codex") {
      seedBenchmarkOpenaiCodexProfile(seededStore);
    }
    const seeded = await writeSeededAuthStore(args, seededStore);
    return {
      stateDir: seeded.stateDir,
      authStorePath: seeded.authStorePath,
      authStorePresent: true,
      store: seededStore,
      error: null,
    };
  }

  let rawStore: string | null = null;
  if (args.authProfilesJsonPath) {
    try {
      rawStore = await fs.readFile(path.resolve(args.authProfilesJsonPath), "utf8");
    } catch (error) {
      return {
        stateDir: null,
        authStorePath: path.resolve(args.authProfilesJsonPath),
        authStorePresent: false,
        store: null,
        error: `Unable to read auth profile store from "${path.resolve(args.authProfilesJsonPath)}": ${String((error as Error).message || error)}`,
      };
    }
  } else if (args.authProfilesJsonInline) {
    rawStore = args.authProfilesJsonInline;
  }

  if (!rawStore) {
    return {
      stateDir: null,
      authStorePath: null,
      authStorePresent: false,
      store: null,
      error: null,
    };
  }

  const seeded = await writeSeededAuthStore(args, rawStore);
  return {
    stateDir: seeded.stateDir,
    authStorePath: seeded.authStorePath,
    authStorePresent: true,
    store: await readJsonFile<AuthProfileStore>(seeded.authStorePath),
    error: null,
  };
}

function resolveProfileExpiry(credential: AuthProfileCredential | undefined): number | null {
  if (!credential) {
    return null;
  }
  if (credential.type !== "oauth" && credential.type !== "token") {
    return null;
  }
  return typeof credential.expires === "number" && Number.isFinite(credential.expires)
    ? credential.expires
    : null;
}

function isProfileReady(store: AuthProfileStore, profileId: string, now: number): boolean {
  const credential = store.profiles[profileId];
  if (!credential) {
    return false;
  }
  const disabledUntil = Number(store.usageStats?.[profileId]?.disabledUntil || 0);
  if (Number.isFinite(disabledUntil) && disabledUntil > now) {
    return false;
  }
  const expires = resolveProfileExpiry(credential);
  if (expires != null && expires <= now) {
    return false;
  }
  return true;
}

function listReadyProfileIds(store: AuthProfileStore, providerId: string): string[] {
  const now = Date.now();
  return listProfilesForProvider(store, providerId).filter((profileId) =>
    isProfileReady(store, profileId, now),
  );
}

function resolveOpenaiCodexSeedProfileId(store: AuthProfileStore, accountId?: string): string {
  const providerProfileIds = listProfilesForProvider(store, "openai-codex");
  if (providerProfileIds.includes(OPENAI_CODEX_DEFAULT_PROFILE_ID)) {
    return OPENAI_CODEX_DEFAULT_PROFILE_ID;
  }
  if (accountId) {
    const matchingProfileId = providerProfileIds.find((profileId) => {
      const credential = store.profiles[profileId];
      return credential?.type === "oauth" && credential.accountId === accountId;
    });
    if (matchingProfileId) {
      return matchingProfileId;
    }
  }
  if (providerProfileIds.length === 1) {
    return providerProfileIds[0];
  }
  return OPENAI_CODEX_DEFAULT_PROFILE_ID;
}

function seedBenchmarkOpenaiCodexProfile(store: AuthProfileStore): boolean {
  const credential = readCodexCliCredentialsCached({ ttlMs: 60_000 });
  if (!credential) {
    return false;
  }
  const profileId = resolveOpenaiCodexSeedProfileId(store, credential.accountId);
  const existing = store.profiles[profileId];
  const existingExpiry = resolveProfileExpiry(existing);
  const shouldReplace =
    !existing ||
    existing.provider !== "openai-codex" ||
    existing.type !== "oauth" ||
    existingExpiry == null ||
    existingExpiry <= Date.now() ||
    credential.expires > existingExpiry ||
    (credential.accountId != null && existing.accountId !== credential.accountId);
  if (!shouldReplace) {
    return false;
  }
  store.profiles[profileId] = {
    ...(existing?.type === "oauth" && existing.email ? { email: existing.email } : {}),
    ...(existing?.type === "oauth" && existing.clientId ? { clientId: existing.clientId } : {}),
    type: "oauth",
    provider: "openai-codex",
    access: credential.access,
    refresh: credential.refresh,
    expires: credential.expires,
    ...(credential.accountId ? { accountId: credential.accountId } : {}),
  };
  return true;
}

async function writeSeededAuthStore(
  args: Args,
  storeOrRawJson: AuthProfileStore | string,
): Promise<{ stateDir: string; authStorePath: string }> {
  const seededStateDir = path.join(args.reportDir, "preflight", "auth-source-state");
  const authStorePath = path.join(seededStateDir, "agents", "main", "agent", "auth-profiles.json");
  await ensureDir(path.dirname(authStorePath));
  await fs.writeFile(
    authStorePath,
    typeof storeOrRawJson === "string"
      ? storeOrRawJson
      : `${JSON.stringify(storeOrRawJson, null, 2)}\n`,
    "utf8",
  );
  return {
    stateDir: seededStateDir,
    authStorePath,
  };
}

export function buildLiveBenchmarkPreflight(params: {
  enabled: boolean;
  modelRef: string;
  authSourceStateDir: string | null;
  authStorePath: string | null;
  authStorePresent: boolean;
  authStore: AuthProfileStore | null;
  authSourceError?: string | null;
}): BenchmarkPreflight {
  const failureReasons: string[] = [];
  const modelRef = String(params.modelRef || "").trim();
  const { provider } = splitModelRef(modelRef);
  const providerId = provider?.trim() || null;
  const authStore = params.authStore;
  const authProfileCount =
    authStore && authStore.profiles && typeof authStore.profiles === "object"
      ? Object.keys(authStore.profiles).length
      : 0;
  const readyProfileIds = authStore && providerId ? listReadyProfileIds(authStore, providerId) : [];

  if (!params.enabled) {
    failureReasons.push(
      "OPENCLAW_LIVE_BENCHMARK_ENABLED must be set to true before the live benchmark may run.",
    );
  }
  if (params.authSourceError) {
    failureReasons.push(params.authSourceError);
  }
  if (!modelRef) {
    failureReasons.push("A non-empty live benchmark model ref is required.");
  }
  if (!providerId) {
    failureReasons.push(`Unable to resolve a provider id from model ref "${modelRef}".`);
  }
  if (!params.authSourceStateDir) {
    failureReasons.push(
      "No auth source state dir was provided or seeded. Supply --auth-source-state-dir or OPENCLAW_LIVE_BENCHMARK_AUTH_PROFILES_JSON.",
    );
  }
  if (!params.authStorePath) {
    failureReasons.push("No auth-profiles store path could be resolved for the benchmark run.");
  }
  if (params.authStorePath && !params.authStorePresent) {
    failureReasons.push(`Auth profile store is missing at "${params.authStorePath}".`);
  }
  if (params.authStorePresent && !authStore) {
    failureReasons.push(
      `Auth profile store at "${params.authStorePath}" could not be loaded as valid JSON.`,
    );
  }
  if (authStore && authProfileCount === 0) {
    failureReasons.push("Auth profile store is present but contains no profiles.");
  }
  if (authStore && providerId && readyProfileIds.length === 0) {
    failureReasons.push(
      `No ready auth profiles were found for provider "${providerId}" in the auth store.`,
    );
  }

  return {
    ok: failureReasons.length === 0,
    modelRef,
    providerId,
    enabled: params.enabled,
    authSourceStateDir: params.authSourceStateDir,
    authStorePath: params.authStorePath,
    authStorePresent: params.authStorePresent,
    authProfileCount,
    readyProfileCount: readyProfileIds.length,
    readyProfileIds,
    failureReasons,
  };
}

export function evaluateLiveBenchmarkProof(proof: SmokeProof | null): BenchmarkVerdict {
  const failureReasons: string[] = [];
  const failedAssertions: string[] = [];
  const smokeError =
    proof?.error && typeof proof.error.message === "string" && proof.error.message.trim()
      ? proof.error.message.trim()
      : null;

  if (!proof || proof.ok !== true) {
    failureReasons.push(
      smokeError
        ? `The live smoke executor failed: ${smokeError}`
        : "The live smoke executor did not report ok=true.",
    );
  }

  const assertions =
    proof && proof.assertions && typeof proof.assertions === "object" ? proof.assertions : {};
  const assertionCount = Object.keys(assertions).length;
  if (assertionCount === 0) {
    failureReasons.push("The live smoke executor did not report any proof assertions.");
  }
  for (const [key, value] of Object.entries(assertions)) {
    if (value !== true) {
      failedAssertions.push(key);
    }
  }
  const failedAssertionCount = failedAssertions.length;
  const passedAssertionCount = Math.max(0, assertionCount - failedAssertionCount);

  if (failedAssertions.length > 0) {
    failureReasons.push(`Failed smoke assertions: ${failedAssertions.join(", ")}`);
  }

  return {
    ok: failureReasons.length === 0,
    failedAssertions,
    assertionCount,
    passedAssertionCount,
    failedAssertionCount,
    smokeError,
    status: failureReasons.length === 0 ? "pass" : "fail",
    failureReasons,
  };
}

export function buildBenchmarkReadiness(params: {
  phase: "preflight" | "run";
  preflight: BenchmarkPreflight;
  verdict: BenchmarkVerdict;
  smoke?: BenchmarkSmokeReport;
}): BenchmarkReadiness {
  const preflightReady = params.preflight.ok;
  const preflightFailureReasons = [...params.preflight.failureReasons];
  const preflightSummary = preflightReady
    ? `Provider "${params.preflight.providerId ?? "unknown"}" has ${params.preflight.readyProfileCount} ready auth profile(s).`
    : (preflightFailureReasons[0] ?? "Preflight readiness is blocked.");

  const proofNotRun =
    params.phase === "preflight" ||
    (params.phase === "run" && !params.preflight.ok && !params.smoke);
  const proofReady = !proofNotRun && params.verdict.ok;
  const proofFailureReasons = [...params.verdict.failureReasons];
  const smokeArtifactsCaptured = Boolean(
    params.smoke?.reportCopyPath || params.smoke?.proofRootCopyPath,
  );
  const proofSummary = proofNotRun
    ? params.phase === "preflight"
      ? "Proof gate was not executed, so the lane is not promotable yet."
      : "Proof gate did not run because preflight readiness failed."
    : proofReady
      ? `${params.verdict.passedAssertionCount}/${params.verdict.assertionCount} proof assertions passed${smokeArtifactsCaptured ? "; proof artifacts captured." : "."}`
      : params.verdict.failedAssertionCount > 0
        ? `${params.verdict.failedAssertionCount}/${params.verdict.assertionCount} proof assertions failed.`
        : (proofFailureReasons[0] ?? "Proof readiness is blocked.");

  let promotionStatus: BenchmarkReadiness["promotion"]["status"];
  let promotionSummary: string;
  const promotionFailureReasons: string[] = [];
  if (params.phase === "preflight") {
    promotionStatus = "not_run";
    promotionSummary = "Preflight-only mode cannot promote the live benchmark lane to green.";
  } else if (!preflightReady) {
    promotionStatus = "blocked";
    promotionSummary = "Promotion is blocked by preflight readiness.";
    promotionFailureReasons.push(...preflightFailureReasons);
  } else if (!proofReady) {
    promotionStatus = "blocked";
    promotionSummary = "Promotion is blocked by proof readiness.";
    promotionFailureReasons.push(...proofFailureReasons);
  } else {
    promotionStatus = "green";
    promotionSummary = "Auth/provider readiness and proof readiness both passed.";
  }

  return {
    preflight: {
      ok: preflightReady,
      status: preflightReady ? "ready" : "blocked",
      summary: preflightSummary,
      providerId: params.preflight.providerId,
      readyProfileCount: params.preflight.readyProfileCount,
      readyProfileIds: params.preflight.readyProfileIds,
      failureReasons: preflightFailureReasons,
    },
    proof: {
      ok: proofReady,
      status: proofNotRun ? "not_run" : proofReady ? "ready" : "blocked",
      summary: proofSummary,
      assertionCount: params.verdict.assertionCount,
      passedAssertionCount: params.verdict.passedAssertionCount,
      failedAssertionCount: params.verdict.failedAssertionCount,
      failedAssertions: params.verdict.failedAssertions,
      smokeError: params.verdict.smokeError,
      failureReasons: proofFailureReasons,
    },
    promotion: {
      ok: promotionStatus === "green",
      status: promotionStatus,
      summary: promotionSummary,
      failureReasons: promotionFailureReasons,
    },
  };
}

async function copyIfPresent(
  sourcePath: string | undefined,
  targetPath: string,
): Promise<string | null> {
  if (!sourcePath) {
    return null;
  }
  const resolved = path.resolve(sourcePath);
  if (!(await pathExists(resolved))) {
    return null;
  }
  await ensureDir(path.dirname(targetPath));
  await fs.cp(resolved, targetPath, { recursive: true });
  return targetPath;
}

function buildSmokeCommand(args: Args, authSourceStateDir: string): string[] {
  return [
    "--import",
    "tsx",
    SMOKE_SCRIPT_PATH,
    `--pack=${args.packRef}`,
    `--profile=${args.profile}`,
    `--auth-source-state-dir=${authSourceStateDir}`,
    `--model=${args.model}`,
    "--json",
    "--keep-state",
  ];
}

async function runSmoke(
  args: Args,
  authSourceStateDir: string,
  reportDir: string,
): Promise<{
  proof: SmokeProof | null;
  command: string[];
  stdoutPath: string;
  stderrPath: string;
  reportCopyPath: string | null;
  proofRootCopyPath: string | null;
}> {
  const stdoutPath = path.join(reportDir, "smoke.stdout.log");
  const stderrPath = path.join(reportDir, "smoke.stderr.log");
  const command = buildSmokeCommand(args, authSourceStateDir);

  let stdout = "";
  let stderr = "";
  try {
    const result = await execFileAsync("node", command, {
      cwd: REPO_ROOT,
      env: process.env,
      maxBuffer: 20 * 1024 * 1024,
    });
    stdout = result.stdout;
    stderr = result.stderr;
  } catch (error) {
    stdout = String((error as { stdout?: string }).stdout || "");
    stderr = String(
      (error as { stderr?: string; message?: string }).stderr || (error as Error).message || "",
    );
    await fs.writeFile(stdoutPath, stdout, "utf8");
    await fs.writeFile(stderrPath, stderr, "utf8");
    throw new Error(`Live smoke command failed.\n${stderr || stdout}`, { cause: error });
  }

  await fs.writeFile(stdoutPath, stdout, "utf8");
  await fs.writeFile(stderrPath, stderr, "utf8");
  const proof = extractJsonObject(stdout) as SmokeProof;
  const reportCopyPath = await copyIfPresent(
    typeof proof.reportPath === "string" ? proof.reportPath : undefined,
    path.join(reportDir, "smoke-report.json"),
  );
  const proofRootCopyPath = await copyIfPresent(
    typeof proof.proofRoot === "string" ? proof.proofRoot : undefined,
    path.join(reportDir, "smoke-proof"),
  );

  return {
    proof,
    command,
    stdoutPath,
    stderrPath,
    reportCopyPath,
    proofRootCopyPath,
  };
}

async function summarizeAndExit(
  reportPath: string,
  report: GateReport,
  exitCode: number,
): Promise<never> {
  await writeJsonFile(reportPath, report);
  if (exitCode === 0) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stderr.write(`${JSON.stringify(report, null, 2)}\n`);
  }
  process.exit(exitCode);
}

function buildGateReport(params: {
  ok: boolean;
  phase: "preflight" | "run";
  packRef: string;
  profile: string;
  modelRef: string;
  preflight: BenchmarkPreflight;
  verdict: BenchmarkVerdict;
  smoke?: BenchmarkSmokeReport;
}): GateReport {
  return {
    ok: params.ok,
    phase: params.phase,
    generatedAt: new Date().toISOString(),
    packRef: params.packRef,
    profile: params.profile,
    modelRef: params.modelRef,
    preflight: params.preflight,
    readiness: buildBenchmarkReadiness({
      phase: params.phase,
      preflight: params.preflight,
      verdict: params.verdict,
      smoke: params.smoke,
    }),
    smoke: params.smoke,
    verdict: params.verdict,
  };
}

async function main(): Promise<void> {
  const args = parseArgs();
  const reportDir = path.resolve(args.reportDir);
  await ensureDir(reportDir);
  const reportPath = path.join(reportDir, "gate-report.json");

  const authSource = await resolveAuthSourceStateDir(args);
  const preflight = buildLiveBenchmarkPreflight({
    enabled: args.enabled,
    modelRef: args.model,
    authSourceStateDir: authSource.stateDir,
    authStorePath: authSource.authStorePath,
    authStorePresent: authSource.authStorePresent,
    authStore: authSource.store,
    authSourceError: authSource.error,
  });

  if (args.preflightOnly) {
    const report = buildGateReport({
      ok: preflight.ok,
      phase: "preflight",
      packRef: args.packRef,
      profile: args.profile,
      modelRef: args.model,
      preflight,
      verdict: {
        ok: preflight.ok,
        failedAssertions: [],
        assertionCount: 0,
        passedAssertionCount: 0,
        failedAssertionCount: 0,
        smokeError: null,
        status: preflight.ok ? "pass" : "fail",
        failureReasons: preflight.failureReasons,
      },
    });
    await summarizeAndExit(reportPath, report, preflight.ok ? 0 : 1);
  }

  if (!preflight.ok || !authSource.stateDir) {
    const report = buildGateReport({
      ok: false,
      phase: "run",
      packRef: args.packRef,
      profile: args.profile,
      modelRef: args.model,
      preflight,
      verdict: {
        ok: false,
        failedAssertions: [],
        assertionCount: 0,
        passedAssertionCount: 0,
        failedAssertionCount: 0,
        smokeError: null,
        status: "fail",
        failureReasons: preflight.failureReasons,
      },
    });
    await summarizeAndExit(reportPath, report, 1);
  }

  try {
    const smoke = await runSmoke(args, authSource.stateDir, reportDir);
    const verdict = evaluateLiveBenchmarkProof(smoke.proof);
    const report = buildGateReport({
      ok: verdict.ok,
      phase: "run",
      packRef: args.packRef,
      profile: args.profile,
      modelRef: args.model,
      preflight,
      smoke: {
        ok: smoke.proof?.ok === true,
        command: ["node", ...smoke.command],
        stdoutPath: smoke.stdoutPath,
        stderrPath: smoke.stderrPath,
        reportCopyPath: smoke.reportCopyPath,
        proofRootCopyPath: smoke.proofRootCopyPath,
        proof: smoke.proof,
      },
      verdict,
    });
    await summarizeAndExit(reportPath, report, verdict.ok ? 0 : 1);
  } catch (error) {
    const smokeCommand = authSource.stateDir
      ? ["node", ...buildSmokeCommand(args, authSource.stateDir)]
      : ["node", "--import", "tsx", SMOKE_SCRIPT_PATH];
    const stdoutPath = path.join(reportDir, "smoke.stdout.log");
    const stderrPath = path.join(reportDir, "smoke.stderr.log");
    const report = buildGateReport({
      ok: false,
      phase: "run",
      packRef: args.packRef,
      profile: args.profile,
      modelRef: args.model,
      preflight,
      smoke: {
        ok: false,
        command: smokeCommand,
        stdoutPath: (await pathExists(stdoutPath)) ? stdoutPath : null,
        stderrPath: (await pathExists(stderrPath)) ? stderrPath : null,
        reportCopyPath: null,
        proofRootCopyPath: null,
        proof: null,
      },
      verdict: {
        ok: false,
        failedAssertions: [],
        assertionCount: 0,
        passedAssertionCount: 0,
        failedAssertionCount: 0,
        smokeError: String((error as Error).message || error),
        status: "fail",
        failureReasons: [String((error as Error).message || error)],
      },
    });
    await summarizeAndExit(reportPath, report, 1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
