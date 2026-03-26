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
const DEFAULT_PERSIST_SUBDIR = "live-runtime-benchmark";
const DEFAULT_HISTORY_MAX_ENTRIES = 540;
const OPENAI_CODEX_DEFAULT_PROFILE_ID = "openai-codex:default";
const SCHEDULED_RUNWAY_CADENCE_HOURS = 12;
const SCHEDULED_RUNWAY_WARNING_AFTER_HOURS = 18;
const SCHEDULED_RUNWAY_STALE_AFTER_HOURS = 30;
const SHORT_RUNWAY_WINDOW_HOURS = 24;
const MULTI_DAY_RUNWAY_WINDOW_HOURS = 72;
const BORING_SCHEDULED_RUNWAY_WINDOW_HOURS = 72;
const BORING_SCHEDULED_GREEN_STREAK = 4;
const BORING_SCHEDULED_GREEN_RECEIPTS = 6;
const SMOKE_SCRIPT_PATH = path.join(
  REPO_ROOT,
  "scripts",
  "cyborgclaw",
  "voltaris-v2-live-runtime-smoke.ts",
);

type Args = {
  reportDir: string;
  persistDir: string;
  packRef: string;
  profile: string;
  model: string;
  enabled: boolean;
  preflightOnly: boolean;
  repeatRuns: number;
  repeatDelayMs: number;
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
  runtimeSmoke?: {
    evidenceSummary?: Record<string, unknown>;
  };
  assertions?: Record<string, unknown>;
  error?: {
    message?: string;
    stack?: string;
  };
};

export type BenchmarkSmokeReport = {
  runIndex: number;
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
  repeatRuns: number;
  repeatDelayMs: number;
  greenRunCount: number;
  preflight: BenchmarkPreflight;
  readiness: BenchmarkReadiness;
  smoke?: BenchmarkSmokeReport;
  smokeRuns?: BenchmarkSmokeReport[];
  verdict: BenchmarkVerdict;
};

type PersistedBenchmarkRunSummary = {
  runIndex: number;
  ok: boolean;
  requestedProvider: string | null;
  requestedModel: string | null;
  resolvedProvider: string | null;
  resolvedModel: string | null;
  transcriptProvider: string | null;
  transcriptModel: string | null;
  proofStatus: string | null;
};

type PersistedBenchmarkRunwayStatus = "healthy" | "warning" | "stale" | "missing";
type PersistedBenchmarkMaturityStatus =
  | "missing"
  | "ad_hoc_only"
  | "emerging_scheduled"
  | "multi_day_scheduled"
  | "boring_multi_day";
type PersistedBenchmarkScheduleBranchEligibilityState =
  | "eligible"
  | "blocked_non_default_branch"
  | "unknown";

export type PersistedBenchmarkReceipt = {
  contractVersion: "openclaw.live-runtime-benchmark-receipt.v1";
  generatedAt: string;
  ok: boolean;
  phase: "preflight" | "run";
  packRef: string;
  profile: string;
  modelRef: string;
  repeatRuns: number;
  repeatDelayMs: number;
  greenRunCount: number;
  providerId: string | null;
  readyProfileCount: number;
  readyProfileIds: string[];
  preflightStatus: BenchmarkReadiness["preflight"]["status"];
  proofStatus: BenchmarkReadiness["proof"]["status"];
  promotionStatus: BenchmarkReadiness["promotion"]["status"];
  assertionCount: number;
  passedAssertionCount: number;
  failedAssertionCount: number;
  failedAssertions: string[];
  failureReasons: string[];
  latestRun: PersistedBenchmarkRunSummary | null;
  runs: PersistedBenchmarkRunSummary[];
  workflow: {
    eventName: string | null;
    runId: string | null;
    runAttempt: string | null;
    sha: string | null;
    refName: string | null;
    defaultBranch: string | null;
  };
};

export type PersistedBenchmarkHistorySummary = {
  contractVersion: "openclaw.live-runtime-benchmark-history.v1";
  generatedAt: string;
  retainedHistoryCount: number;
  retainedHistoryMax: number;
  greenReceiptCount: number;
  blockedReceiptCount: number;
  preflightReceiptCount: number;
  latestGeneratedAt: string | null;
  oldestGeneratedAt: string | null;
  latestGreenGeneratedAt: string | null;
  latestGreenAgeHours: number | null;
  consecutiveGreenCount: number;
  longestGreenStreak: number;
  runwayWindowHours: number;
  runwayWindowDays: number;
  runwayWindowCategory: "unknown" | "single_receipt" | "short" | "multi_day" | "extended";
  runwayWindowLabel: string;
  runwayWindowSeverity: string;
  runwayWindowDetail: string;
  runwayCadenceHours: number | null;
  runwayCadenceLabel: string;
  runwayMaturityStatus: PersistedBenchmarkMaturityStatus;
  runwayMaturityLabel: string;
  runwayMaturitySeverity: string;
  runwayMaturityDetail: string;
  providerIds: string[];
  modelRefs: string[];
  eventCounts: Record<string, number>;
  schedule: {
    receiptCount: number;
    greenReceiptCount: number;
    blockedReceiptCount: number;
    receiptObservationState: "missing" | "observed";
    receiptObservationLabel: string;
    receiptObservationDetail: string;
    branchEligibilityState: PersistedBenchmarkScheduleBranchEligibilityState;
    branchEligibilityLabel: string;
    branchEligibilityDetail: string;
    branchName: string | null;
    defaultBranch: string | null;
    oldestGeneratedAt: string | null;
    oldestGreenGeneratedAt: string | null;
    latestGeneratedAt: string | null;
    latestGreenGeneratedAt: string | null;
    latestGreenAgeHours: number | null;
    consecutiveGreenCount: number;
    longestGreenStreak: number;
    runwayWindowHours: number;
    runwayWindowDays: number;
    cadenceHours: number;
    warningAfterHours: number;
    staleAfterHours: number;
    runwayStatus: PersistedBenchmarkRunwayStatus;
    healthy: boolean;
  };
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

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return fallback;
  }
  const parsed = Number.parseInt(normalized, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function resolveHistoryMaxEntries(): number {
  return parsePositiveInteger(
    resolveArg("--history-max") ?? process.env.OPENCLAW_LIVE_BENCHMARK_HISTORY_MAX,
    DEFAULT_HISTORY_MAX_ENTRIES,
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

function resolvePersistDir(): string {
  const explicit = resolveArg("--persist-dir");
  if (explicit) {
    return path.resolve(explicit);
  }
  const envValue = resolveNonEmptyEnv("OPENCLAW_LIVE_BENCHMARK_PERSIST_DIR");
  if (envValue) {
    return path.resolve(envValue);
  }
  return path.join(os.homedir(), ".openclaw", DEFAULT_PERSIST_SUBDIR);
}

function parseArgs(): Args {
  return {
    reportDir: resolveReportDir(),
    persistDir: resolvePersistDir(),
    packRef: resolveArg("--pack") ?? DEFAULT_PACK_REF,
    profile: resolveArg("--profile") ?? DEFAULT_PROFILE,
    model:
      resolveArg("--model") ?? resolveNonEmptyEnv("OPENCLAW_LIVE_BENCHMARK_MODEL") ?? DEFAULT_MODEL,
    enabled: normalizeBooleanEnv(process.env.OPENCLAW_LIVE_BENCHMARK_ENABLED),
    preflightOnly: hasFlag("--preflight-only"),
    repeatRuns: parsePositiveInteger(
      resolveArg("--repeat-runs") ?? resolveNonEmptyEnv("OPENCLAW_LIVE_BENCHMARK_REPEAT_RUNS"),
      1,
    ),
    repeatDelayMs: parsePositiveInteger(
      resolveArg("--repeat-delay-ms") ??
        resolveNonEmptyEnv("OPENCLAW_LIVE_BENCHMARK_REPEAT_DELAY_MS"),
      0,
    ),
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

function aggregateBenchmarkVerdicts(verdicts: BenchmarkVerdict[]): BenchmarkVerdict {
  if (verdicts.length === 0) {
    return {
      ok: false,
      failedAssertions: [],
      assertionCount: 0,
      passedAssertionCount: 0,
      failedAssertionCount: 0,
      smokeError: "No live smoke runs were executed.",
      status: "fail",
      failureReasons: ["No live smoke runs were executed."],
    };
  }
  if (verdicts.length === 1) {
    return verdicts[0];
  }

  const failureReasons: string[] = [];
  const failedAssertions: string[] = [];
  let assertionCount = 0;
  let passedAssertionCount = 0;
  let failedAssertionCount = 0;

  for (const [index, verdict] of verdicts.entries()) {
    assertionCount += verdict.assertionCount;
    passedAssertionCount += verdict.passedAssertionCount;
    failedAssertionCount += verdict.failedAssertionCount;
    failedAssertions.push(
      ...verdict.failedAssertions.map((assertion) => `run${index + 1}:${assertion}`),
    );
    if (!verdict.ok) {
      failureReasons.push(...verdict.failureReasons.map((reason) => `Run ${index + 1}: ${reason}`));
    }
  }

  return {
    ok: failureReasons.length === 0,
    failedAssertions,
    assertionCount,
    passedAssertionCount,
    failedAssertionCount,
    smokeError: failureReasons[0] ?? null,
    status: failureReasons.length === 0 ? "pass" : "fail",
    failureReasons,
  };
}

export function buildBenchmarkReadiness(params: {
  phase: "preflight" | "run";
  preflight: BenchmarkPreflight;
  verdict: BenchmarkVerdict;
  smoke?: BenchmarkSmokeReport;
  smokeRuns?: BenchmarkSmokeReport[];
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
  const smokeRunCount =
    Array.isArray(params.smokeRuns) && params.smokeRuns.length > 0
      ? params.smokeRuns.length
      : params.smoke
        ? 1
        : 0;
  const proofSummary = proofNotRun
    ? params.phase === "preflight"
      ? "Proof gate was not executed, so the lane is not promotable yet."
      : "Proof gate did not run because preflight readiness failed."
    : proofReady
      ? smokeRunCount > 1
        ? `${smokeRunCount}/${smokeRunCount} repeated proof runs passed with ${params.verdict.passedAssertionCount}/${params.verdict.assertionCount} assertions${smokeArtifactsCaptured ? "; proof artifacts captured." : "."}`
        : `${params.verdict.passedAssertionCount}/${params.verdict.assertionCount} proof assertions passed${smokeArtifactsCaptured ? "; proof artifacts captured." : "."}`
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
  await ensureDir(reportDir);

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
  persistDir: string,
): Promise<never> {
  await writeJsonFile(reportPath, report);
  try {
    await persistBenchmarkReceiptArtifacts(report, persistDir);
  } catch (error) {
    process.stderr.write(
      `Failed to persist benchmark receipt artifacts: ${String((error as Error).message || error)}\n`,
    );
  }
  if (exitCode === 0) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stderr.write(`${JSON.stringify(report, null, 2)}\n`);
  }
  process.exit(exitCode);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asStringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asTimestampMs(value: unknown): number | null {
  const normalized = asStringValue(value);
  if (!normalized) {
    return null;
  }
  const parsed = Date.parse(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function roundHours(deltaMs: number): number {
  return Math.round((deltaMs / (60 * 60 * 1000)) * 10) / 10;
}

function incrementCount(
  counts: Record<string, number>,
  key: string | null,
  fallback: string,
): void {
  const normalized = key ?? fallback;
  counts[normalized] = (counts[normalized] ?? 0) + 1;
}

function buildPersistedBenchmarkRunSummary(
  smokeRun: BenchmarkSmokeReport | undefined,
): PersistedBenchmarkRunSummary | null {
  if (!smokeRun) {
    return null;
  }
  const runtimeSmoke = asRecord(smokeRun.proof?.runtimeSmoke);
  const evidenceSummary = asRecord(runtimeSmoke?.evidenceSummary);
  return {
    runIndex: smokeRun.runIndex,
    ok: smokeRun.ok,
    requestedProvider: asStringValue(evidenceSummary?.requestedProvider),
    requestedModel: asStringValue(evidenceSummary?.requestedModel),
    resolvedProvider: asStringValue(evidenceSummary?.resolvedProvider),
    resolvedModel: asStringValue(evidenceSummary?.resolvedModel),
    transcriptProvider: asStringValue(evidenceSummary?.transcriptProvider),
    transcriptModel: asStringValue(evidenceSummary?.transcriptModel),
    proofStatus: asStringValue(evidenceSummary?.proofStatus),
  };
}

function resolveWorkflowEventName(): string {
  return asStringValue(process.env.GITHUB_EVENT_NAME) ?? "local_manual";
}

function resolveWorkflowRefName(): string | null {
  return (
    asStringValue(process.env.GITHUB_REF_NAME) ??
    asStringValue(process.env.OPENCLAW_LIVE_BENCHMARK_REF_NAME)
  );
}

function resolveWorkflowDefaultBranch(): string | null {
  return (
    asStringValue(process.env.GITHUB_DEFAULT_BRANCH) ??
    asStringValue(process.env.OPENCLAW_LIVE_BENCHMARK_DEFAULT_BRANCH)
  );
}

function resolveReceiptEventName(
  receipt: Pick<PersistedBenchmarkReceipt, "workflow"> | null | undefined,
): string {
  return asStringValue(receipt?.workflow?.eventName) ?? "local_manual";
}

export function buildPersistedBenchmarkReceipt(report: GateReport): PersistedBenchmarkReceipt {
  const runs = Array.isArray(report.smokeRuns)
    ? report.smokeRuns
        .map((run) => buildPersistedBenchmarkRunSummary(run))
        .filter((run): run is PersistedBenchmarkRunSummary => Boolean(run))
    : [];
  const latestRun = buildPersistedBenchmarkRunSummary(report.smoke) ?? runs.at(-1) ?? null;

  return {
    contractVersion: "openclaw.live-runtime-benchmark-receipt.v1",
    generatedAt: report.generatedAt,
    ok: report.ok,
    phase: report.phase,
    packRef: report.packRef,
    profile: report.profile,
    modelRef: report.modelRef,
    repeatRuns: report.repeatRuns,
    repeatDelayMs: report.repeatDelayMs,
    greenRunCount: report.greenRunCount,
    providerId: report.preflight.providerId,
    readyProfileCount: report.preflight.readyProfileCount,
    readyProfileIds: report.preflight.readyProfileIds,
    preflightStatus: report.readiness.preflight.status,
    proofStatus: report.readiness.proof.status,
    promotionStatus: report.readiness.promotion.status,
    assertionCount: report.verdict.assertionCount,
    passedAssertionCount: report.verdict.passedAssertionCount,
    failedAssertionCount: report.verdict.failedAssertionCount,
    failedAssertions: [...report.verdict.failedAssertions],
    failureReasons: [...report.verdict.failureReasons],
    latestRun,
    runs,
    workflow: {
      eventName: resolveWorkflowEventName(),
      runId: asStringValue(process.env.GITHUB_RUN_ID),
      runAttempt: asStringValue(process.env.GITHUB_RUN_ATTEMPT),
      sha: asStringValue(process.env.GITHUB_SHA),
      refName: resolveWorkflowRefName(),
      defaultBranch: resolveWorkflowDefaultBranch(),
    },
  };
}

function isGreenBenchmarkReceipt(receipt: PersistedBenchmarkReceipt | null | undefined): boolean {
  if (!receipt) {
    return false;
  }
  return receipt.phase === "run" && receipt.ok && receipt.promotionStatus === "green";
}

function selectLatestReceipt(
  receipts: PersistedBenchmarkReceipt[],
  predicate: (receipt: PersistedBenchmarkReceipt) => boolean = () => true,
): PersistedBenchmarkReceipt | null {
  let latest: PersistedBenchmarkReceipt | null = null;
  let latestMs = -1;
  for (const receipt of receipts) {
    if (!predicate(receipt)) {
      continue;
    }
    const generatedAtMs = asTimestampMs(receipt.generatedAt);
    if (generatedAtMs == null) {
      continue;
    }
    if (!latest || generatedAtMs > latestMs) {
      latest = receipt;
      latestMs = generatedAtMs;
    }
  }
  return latest;
}

function selectOldestReceipt(
  receipts: PersistedBenchmarkReceipt[],
  predicate: (receipt: PersistedBenchmarkReceipt) => boolean = () => true,
): PersistedBenchmarkReceipt | null {
  let oldest: PersistedBenchmarkReceipt | null = null;
  let oldestMs = Number.POSITIVE_INFINITY;
  for (const receipt of receipts) {
    if (!predicate(receipt)) {
      continue;
    }
    const generatedAtMs = asTimestampMs(receipt.generatedAt);
    if (generatedAtMs == null) {
      continue;
    }
    if (!oldest || generatedAtMs < oldestMs) {
      oldest = receipt;
      oldestMs = generatedAtMs;
    }
  }
  return oldest;
}

function computeGreenStreak(receipts: PersistedBenchmarkReceipt[]): {
  consecutiveGreenCount: number;
  longestGreenStreak: number;
} {
  let consecutiveGreenCount = 0;
  let longestGreenStreak = 0;
  let currentGreenStreak = 0;

  for (const receipt of receipts) {
    if (isGreenBenchmarkReceipt(receipt)) {
      currentGreenStreak += 1;
      longestGreenStreak = Math.max(longestGreenStreak, currentGreenStreak);
    } else if (receipt.phase === "run") {
      currentGreenStreak = 0;
    }
  }

  for (let index = receipts.length - 1; index >= 0; index -= 1) {
    const receipt = receipts[index];
    if (receipt.phase !== "run") {
      continue;
    }
    if (isGreenBenchmarkReceipt(receipt)) {
      consecutiveGreenCount += 1;
      continue;
    }
    break;
  }

  return {
    consecutiveGreenCount,
    longestGreenStreak,
  };
}

function classifyScheduledRunway(
  latestGreenAgeHours: number | null,
): PersistedBenchmarkRunwayStatus {
  if (latestGreenAgeHours == null) {
    return "missing";
  }
  if (latestGreenAgeHours > SCHEDULED_RUNWAY_STALE_AFTER_HOURS) {
    return "stale";
  }
  if (latestGreenAgeHours > SCHEDULED_RUNWAY_WARNING_AFTER_HOURS) {
    return "warning";
  }
  return "healthy";
}

function buildScheduledBranchEligibility(params: {
  branchName: string | null;
  defaultBranch: string | null;
}): {
  branchEligibilityState: PersistedBenchmarkScheduleBranchEligibilityState;
  branchEligibilityLabel: string;
  branchEligibilityDetail: string;
  branchName: string | null;
  defaultBranch: string | null;
} {
  const branchName = asStringValue(params.branchName);
  const defaultBranch = asStringValue(params.defaultBranch);

  if (!branchName || !defaultBranch) {
    return {
      branchEligibilityState: "unknown",
      branchEligibilityLabel: "Scheduled branch eligibility unknown",
      branchEligibilityDetail:
        "The retained runway does not include enough branch metadata to determine whether scheduled receipts should be expected here.",
      branchName: branchName ?? null,
      defaultBranch: defaultBranch ?? null,
    };
  }

  if (branchName !== defaultBranch) {
    return {
      branchEligibilityState: "blocked_non_default_branch",
      branchEligibilityLabel: "Scheduled runway requires default branch",
      branchEligibilityDetail: `GitHub scheduled workflows only run from the default branch (${defaultBranch}), but this retained runway belongs to ${branchName}.`,
      branchName,
      defaultBranch,
    };
  }

  return {
    branchEligibilityState: "eligible",
    branchEligibilityLabel: "Scheduled runway eligible on this branch",
    branchEligibilityDetail: `This retained runway belongs to the default branch (${defaultBranch}), so scheduled receipts can accumulate here once the workflow is active.`,
    branchName,
    defaultBranch,
  };
}

function buildScheduledReceiptObservation(params: {
  receiptCount: number;
  greenReceiptCount: number;
  branchEligibility: ReturnType<typeof buildScheduledBranchEligibility>;
}): {
  receiptObservationState: "missing" | "observed";
  receiptObservationLabel: string;
  receiptObservationDetail: string;
} {
  const receiptCount = Number(params.receiptCount || 0) || 0;
  const greenReceiptCount = Number(params.greenReceiptCount || 0) || 0;
  const branchEligibility = params.branchEligibility;

  if (receiptCount <= 0) {
    if (branchEligibility.branchEligibilityState === "blocked_non_default_branch") {
      return {
        receiptObservationState: "missing",
        receiptObservationLabel: "Scheduled runway requires default branch",
        receiptObservationDetail: branchEligibility.branchEligibilityDetail,
      };
    }
    return {
      receiptObservationState: "missing",
      receiptObservationLabel: "No scheduled receipts observed",
      receiptObservationDetail:
        "The retained runway is still backed only by ad hoc receipts, so scheduled runway truth has not been observed yet.",
    };
  }

  if (greenReceiptCount <= 0) {
    return {
      receiptObservationState: "observed",
      receiptObservationLabel: "Scheduled receipts observed without green runs",
      receiptObservationDetail:
        "Scheduled receipts are present in history, but none of the scheduled runs have turned green yet.",
    };
  }

  return {
    receiptObservationState: "observed",
    receiptObservationLabel: "Scheduled receipts observed",
    receiptObservationDetail:
      "Scheduled receipts are present in history and include at least one green run.",
  };
}

function buildRetainedRunwayProjection(params: {
  runwayWindowHours: number;
  retainedHistoryCount: number;
}): {
  runwayWindowDays: number;
  runwayWindowCategory: "unknown" | "single_receipt" | "short" | "multi_day" | "extended";
  runwayWindowLabel: string;
  runwayWindowSeverity: string;
  runwayWindowDetail: string;
  runwayCadenceHours: number | null;
  runwayCadenceLabel: string;
} {
  const runwayWindowHours = Number.isFinite(params.runwayWindowHours)
    ? params.runwayWindowHours
    : 0;
  const retainedHistoryCount = Number.isFinite(params.retainedHistoryCount)
    ? params.retainedHistoryCount
    : 0;
  const runwayCadenceHours =
    retainedHistoryCount > 1
      ? Number((runwayWindowHours / Math.max(1, retainedHistoryCount - 1)).toFixed(2))
      : null;

  let runwayWindowCategory: "unknown" | "single_receipt" | "short" | "multi_day" | "extended" =
    "unknown";
  let runwayWindowLabel = "Unknown runway";
  let runwayWindowSeverity = "unknown";
  let runwayWindowDetail = "No benchmark runway history is available yet.";

  if (retainedHistoryCount === 1) {
    runwayWindowCategory = "single_receipt";
    runwayWindowLabel = "Single receipt";
    runwayWindowSeverity = "unknown";
    runwayWindowDetail =
      "Only one persisted benchmark receipt is available, so runway span is still undefined.";
  } else if (retainedHistoryCount > 1) {
    if (runwayWindowHours < SHORT_RUNWAY_WINDOW_HOURS) {
      runwayWindowCategory = "short";
      runwayWindowLabel = "Short runway";
      runwayWindowSeverity = "urgent";
      runwayWindowDetail = "Receipts are clustered inside a single workday.";
    } else if (runwayWindowHours < MULTI_DAY_RUNWAY_WINDOW_HOURS) {
      runwayWindowCategory = "multi_day";
      runwayWindowLabel = "Multi-day runway";
      runwayWindowSeverity = "steady";
      runwayWindowDetail = "Receipts span multiple days and are no longer time-critical.";
    } else {
      runwayWindowCategory = "extended";
      runwayWindowLabel = "Extended runway";
      runwayWindowSeverity = "relaxed";
      runwayWindowDetail = "Receipts span several days and the runway is comfortably wide.";
    }
  }

  let runwayCadenceLabel = "unknown";
  if (Number.isFinite(runwayCadenceHours ?? Number.NaN)) {
    if ((runwayCadenceHours ?? 0) < SHORT_RUNWAY_WINDOW_HOURS) {
      runwayCadenceLabel = "same-day cadence";
    } else if ((runwayCadenceHours ?? 0) < MULTI_DAY_RUNWAY_WINDOW_HOURS) {
      runwayCadenceLabel = "multi-day cadence";
    } else {
      runwayCadenceLabel = "extended cadence";
    }
  }

  return {
    runwayWindowDays: Number((runwayWindowHours / 24).toFixed(2)),
    runwayWindowCategory,
    runwayWindowLabel,
    runwayWindowSeverity,
    runwayWindowDetail,
    runwayCadenceHours,
    runwayCadenceLabel,
  };
}

function classifyRunwayMaturity(params: {
  retainedHistoryCount: number;
  eventCounts: Record<string, number>;
  scheduledReceiptCount: number;
  scheduledGreenReceiptCount: number;
  scheduledConsecutiveGreenCount: number;
  scheduledWindowHours: number;
}): {
  runwayMaturityStatus: PersistedBenchmarkMaturityStatus;
  runwayMaturityLabel: string;
  runwayMaturitySeverity: string;
  runwayMaturityDetail: string;
} {
  const retainedHistoryCount = Number(params.retainedHistoryCount || 0) || 0;
  const scheduledReceiptCount = Number(params.scheduledReceiptCount || 0) || 0;
  const scheduledGreenReceiptCount = Number(params.scheduledGreenReceiptCount || 0) || 0;
  const scheduledConsecutiveGreenCount = Number(params.scheduledConsecutiveGreenCount || 0) || 0;
  const scheduledWindowHours = Number(params.scheduledWindowHours || 0) || 0;
  const eventCounts = params.eventCounts || {};
  const adHocReceiptCount =
    Number(eventCounts.local_manual || 0) +
    Number(eventCounts.push || 0) +
    Number(eventCounts.workflow_dispatch || 0) +
    Number(eventCounts.unknown || 0);

  if (scheduledReceiptCount <= 0) {
    if (retainedHistoryCount <= 0) {
      return {
        runwayMaturityStatus: "missing",
        runwayMaturityLabel: "No retained runway",
        runwayMaturitySeverity: "danger",
        runwayMaturityDetail: "No persisted benchmark history is available yet.",
      };
    }
    return {
      runwayMaturityStatus: "ad_hoc_only",
      runwayMaturityLabel: "Ad hoc runway only",
      runwayMaturitySeverity: "warning",
      runwayMaturityDetail:
        adHocReceiptCount > 0
          ? "The retained runway is backed by local, push, or manual dispatch proofs, but no scheduled benchmark receipts have accumulated yet."
          : "The retained runway exists, but it is not yet backed by scheduled benchmark receipts.",
    };
  }

  if (
    scheduledWindowHours >= BORING_SCHEDULED_RUNWAY_WINDOW_HOURS &&
    scheduledConsecutiveGreenCount >= BORING_SCHEDULED_GREEN_STREAK &&
    scheduledGreenReceiptCount >= BORING_SCHEDULED_GREEN_RECEIPTS
  ) {
    return {
      runwayMaturityStatus: "boring_multi_day",
      runwayMaturityLabel: "Boring multi-day runway",
      runwayMaturitySeverity: "success",
      runwayMaturityDetail:
        "Scheduled benchmark receipts now span several days with a sustained green streak, so the runway is operationally boring.",
    };
  }

  if (scheduledWindowHours >= SHORT_RUNWAY_WINDOW_HOURS && scheduledGreenReceiptCount >= 2) {
    return {
      runwayMaturityStatus: "multi_day_scheduled",
      runwayMaturityLabel: "Multi-day scheduled runway",
      runwayMaturitySeverity: "info",
      runwayMaturityDetail:
        "Scheduled benchmark receipts now span multiple days, but the runway is still accumulating before it can be called boring.",
    };
  }

  return {
    runwayMaturityStatus: "emerging_scheduled",
    runwayMaturityLabel: "Emerging scheduled runway",
    runwayMaturitySeverity: "warning",
    runwayMaturityDetail:
      "Scheduled benchmark receipts exist, but the runway is still young and has not yet matured into a multi-day boring history.",
  };
}

async function readPersistedBenchmarkHistory(
  persistDir: string,
): Promise<PersistedBenchmarkReceipt[]> {
  const historyPath = path.join(path.resolve(persistDir), "history.jsonl");
  try {
    const raw = await fs.readFile(historyPath, "utf8");
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as PersistedBenchmarkReceipt;
        } catch {
          return null;
        }
      })
      .filter((entry): entry is PersistedBenchmarkReceipt => Boolean(entry));
  } catch {
    return [];
  }
}

export function buildPersistedBenchmarkHistorySummary(
  history: PersistedBenchmarkReceipt[],
  retainedHistoryMax: number,
  nowMs = Date.now(),
): PersistedBenchmarkHistorySummary {
  const receipts = Array.isArray(history) ? history : [];
  const runReceipts = receipts.filter((receipt) => receipt.phase === "run");
  const scheduledReceipts = receipts.filter(
    (receipt) => resolveReceiptEventName(receipt) === "schedule",
  );
  const scheduledRunReceipts = scheduledReceipts.filter((receipt) => receipt.phase === "run");
  const { consecutiveGreenCount, longestGreenStreak } = computeGreenStreak(runReceipts);
  const {
    consecutiveGreenCount: scheduledConsecutiveGreenCount,
    longestGreenStreak: scheduledLongestGreenStreak,
  } = computeGreenStreak(scheduledRunReceipts);
  const latestReceipt = selectLatestReceipt(receipts);
  const oldestReceipt = selectOldestReceipt(receipts);
  const latestGreenReceipt = selectLatestReceipt(receipts, (receipt) =>
    isGreenBenchmarkReceipt(receipt),
  );
  const latestScheduledReceipt = selectLatestReceipt(scheduledReceipts);
  const oldestScheduledReceipt = selectOldestReceipt(scheduledReceipts);
  const latestScheduledGreenReceipt = selectLatestReceipt(scheduledReceipts, (receipt) =>
    isGreenBenchmarkReceipt(receipt),
  );
  const oldestScheduledGreenReceipt = selectOldestReceipt(scheduledReceipts, (receipt) =>
    isGreenBenchmarkReceipt(receipt),
  );
  const latestTimestamp = asTimestampMs(latestReceipt?.generatedAt);
  const oldestTimestamp = asTimestampMs(oldestReceipt?.generatedAt);
  const runwayWindowHours =
    latestTimestamp != null && oldestTimestamp != null
      ? Math.max(0, (latestTimestamp - oldestTimestamp) / (60 * 60 * 1000))
      : 0;
  const latestGreenTimestamp = asTimestampMs(latestGreenReceipt?.generatedAt);
  const latestScheduledTimestamp = asTimestampMs(latestScheduledReceipt?.generatedAt);
  const oldestScheduledTimestamp = asTimestampMs(oldestScheduledReceipt?.generatedAt);
  const latestScheduledGreenTimestamp = asTimestampMs(latestScheduledGreenReceipt?.generatedAt);
  const latestGreenAgeHours =
    latestGreenTimestamp == null ? null : roundHours(Math.max(0, nowMs - latestGreenTimestamp));
  const latestScheduledGreenAgeHours =
    latestScheduledGreenTimestamp == null
      ? null
      : roundHours(Math.max(0, nowMs - latestScheduledGreenTimestamp));
  const eventCounts: Record<string, number> = {};
  const scheduledBranchEligibility = buildScheduledBranchEligibility({
    branchName: asStringValue(latestReceipt?.workflow?.refName),
    defaultBranch: asStringValue(latestReceipt?.workflow?.defaultBranch),
  });
  const scheduledReceiptObservation = buildScheduledReceiptObservation({
    receiptCount: scheduledReceipts.length,
    greenReceiptCount: scheduledRunReceipts.filter((receipt) => isGreenBenchmarkReceipt(receipt))
      .length,
    branchEligibility: scheduledBranchEligibility,
  });

  for (const receipt of receipts) {
    incrementCount(eventCounts, resolveReceiptEventName(receipt), "local_manual");
  }

  const scheduledRunwayStatus = classifyScheduledRunway(latestScheduledGreenAgeHours);
  const scheduledRunwayWindowHours =
    latestScheduledTimestamp != null && oldestScheduledTimestamp != null
      ? Math.max(0, (latestScheduledTimestamp - oldestScheduledTimestamp) / (60 * 60 * 1000))
      : 0;
  const retainedRunwayProjection = buildRetainedRunwayProjection({
    runwayWindowHours: Number(runwayWindowHours.toFixed(2)),
    retainedHistoryCount: receipts.length,
  });
  const runwayMaturity = classifyRunwayMaturity({
    retainedHistoryCount: receipts.length,
    eventCounts,
    scheduledReceiptCount: scheduledReceipts.length,
    scheduledGreenReceiptCount: scheduledRunReceipts.filter((receipt) =>
      isGreenBenchmarkReceipt(receipt),
    ).length,
    scheduledConsecutiveGreenCount,
    scheduledWindowHours: Number(scheduledRunwayWindowHours.toFixed(2)),
  });

  return {
    contractVersion: "openclaw.live-runtime-benchmark-history.v1",
    generatedAt: new Date(nowMs).toISOString(),
    retainedHistoryCount: receipts.length,
    retainedHistoryMax,
    greenReceiptCount: runReceipts.filter((receipt) => isGreenBenchmarkReceipt(receipt)).length,
    blockedReceiptCount: runReceipts.filter((receipt) => !isGreenBenchmarkReceipt(receipt)).length,
    preflightReceiptCount: receipts.filter((receipt) => receipt.phase === "preflight").length,
    latestGeneratedAt: latestReceipt?.generatedAt || null,
    oldestGeneratedAt: oldestReceipt?.generatedAt || null,
    latestGreenGeneratedAt: latestGreenReceipt?.generatedAt || null,
    latestGreenAgeHours,
    consecutiveGreenCount,
    longestGreenStreak,
    runwayWindowHours: Number(runwayWindowHours.toFixed(2)),
    ...retainedRunwayProjection,
    ...runwayMaturity,
    providerIds: [
      ...new Set(receipts.map((receipt) => asStringValue(receipt.providerId)).filter(Boolean)),
    ],
    modelRefs: [
      ...new Set(receipts.map((receipt) => asStringValue(receipt.modelRef)).filter(Boolean)),
    ],
    eventCounts,
    schedule: {
      receiptCount: scheduledReceipts.length,
      greenReceiptCount: scheduledRunReceipts.filter((receipt) => isGreenBenchmarkReceipt(receipt))
        .length,
      blockedReceiptCount: scheduledRunReceipts.filter(
        (receipt) => !isGreenBenchmarkReceipt(receipt),
      ).length,
      ...scheduledReceiptObservation,
      ...scheduledBranchEligibility,
      oldestGeneratedAt: oldestScheduledReceipt?.generatedAt || null,
      oldestGreenGeneratedAt: oldestScheduledGreenReceipt?.generatedAt || null,
      latestGeneratedAt: latestScheduledReceipt?.generatedAt || null,
      latestGreenGeneratedAt: latestScheduledGreenReceipt?.generatedAt || null,
      latestGreenAgeHours: latestScheduledGreenAgeHours,
      consecutiveGreenCount: scheduledConsecutiveGreenCount,
      longestGreenStreak: scheduledLongestGreenStreak,
      runwayWindowHours: Number(scheduledRunwayWindowHours.toFixed(2)),
      runwayWindowDays: Number((scheduledRunwayWindowHours / 24).toFixed(2)),
      cadenceHours: SCHEDULED_RUNWAY_CADENCE_HOURS,
      warningAfterHours: SCHEDULED_RUNWAY_WARNING_AFTER_HOURS,
      staleAfterHours: SCHEDULED_RUNWAY_STALE_AFTER_HOURS,
      runwayStatus: scheduledRunwayStatus,
      healthy: scheduledRunwayStatus === "healthy",
    },
  };
}

export async function persistBenchmarkReceiptArtifacts(
  report: GateReport,
  persistDir: string,
  historyMaxEntries = resolveHistoryMaxEntries(),
): Promise<PersistedBenchmarkReceipt> {
  const receipt = buildPersistedBenchmarkReceipt(report);
  const resolvedPersistDir = path.resolve(persistDir);
  await ensureDir(resolvedPersistDir);
  const retainedHistoryMax = Math.max(1, historyMaxEntries);
  const existingHistory = await readPersistedBenchmarkHistory(resolvedPersistDir);
  const nextHistory = [...existingHistory, receipt].slice(-retainedHistoryMax);
  const historySummary = buildPersistedBenchmarkHistorySummary(nextHistory, retainedHistoryMax);
  await writeJsonFile(path.join(resolvedPersistDir, "latest-receipt.json"), receipt);
  await fs.writeFile(
    path.join(resolvedPersistDir, "history.jsonl"),
    `${nextHistory.map((entry) => JSON.stringify(entry)).join("\n")}\n`,
    "utf8",
  );
  await writeJsonFile(path.join(resolvedPersistDir, "history-summary.json"), historySummary);
  if (receipt.phase === "run" && receipt.promotionStatus === "green" && receipt.ok) {
    await fs.appendFile(
      path.join(resolvedPersistDir, "green-history.jsonl"),
      `${JSON.stringify(receipt)}\n`,
      "utf8",
    );
    await writeJsonFile(path.join(resolvedPersistDir, "latest-green-receipt.json"), receipt);
  }
  return receipt;
}

function buildGateReport(params: {
  ok: boolean;
  phase: "preflight" | "run";
  packRef: string;
  profile: string;
  modelRef: string;
  repeatRuns: number;
  repeatDelayMs: number;
  preflight: BenchmarkPreflight;
  verdict: BenchmarkVerdict;
  smoke?: BenchmarkSmokeReport;
  smokeRuns?: BenchmarkSmokeReport[];
}): GateReport {
  return {
    ok: params.ok,
    phase: params.phase,
    generatedAt: new Date().toISOString(),
    packRef: params.packRef,
    profile: params.profile,
    modelRef: params.modelRef,
    repeatRuns: params.repeatRuns,
    repeatDelayMs: params.repeatDelayMs,
    greenRunCount: Array.isArray(params.smokeRuns)
      ? params.smokeRuns.filter((run) => run.ok).length
      : params.smoke?.ok
        ? 1
        : 0,
    preflight: params.preflight,
    readiness: buildBenchmarkReadiness({
      phase: params.phase,
      preflight: params.preflight,
      verdict: params.verdict,
      smoke: params.smoke,
      smokeRuns: params.smokeRuns,
    }),
    smoke: params.smoke,
    smokeRuns: params.smokeRuns,
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
      repeatRuns: args.repeatRuns,
      repeatDelayMs: args.repeatDelayMs,
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
    await summarizeAndExit(reportPath, report, preflight.ok ? 0 : 1, args.persistDir);
  }

  if (!preflight.ok || !authSource.stateDir) {
    const report = buildGateReport({
      ok: false,
      phase: "run",
      packRef: args.packRef,
      profile: args.profile,
      modelRef: args.model,
      repeatRuns: args.repeatRuns,
      repeatDelayMs: args.repeatDelayMs,
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
    await summarizeAndExit(reportPath, report, 1, args.persistDir);
  }

  try {
    const smokeRuns: BenchmarkSmokeReport[] = [];
    const runVerdicts: BenchmarkVerdict[] = [];
    for (let runIndex = 0; runIndex < Math.max(1, args.repeatRuns); runIndex += 1) {
      const runReportDir =
        args.repeatRuns > 1
          ? path.join(reportDir, `run-${String(runIndex + 1).padStart(2, "0")}`)
          : reportDir;
      try {
        const smoke = await runSmoke(args, authSource.stateDir, runReportDir);
        const verdict = evaluateLiveBenchmarkProof(smoke.proof);
        smokeRuns.push({
          runIndex: runIndex + 1,
          ok: smoke.proof?.ok === true && verdict.ok,
          command: ["node", ...smoke.command],
          stdoutPath: smoke.stdoutPath,
          stderrPath: smoke.stderrPath,
          reportCopyPath: smoke.reportCopyPath,
          proofRootCopyPath: smoke.proofRootCopyPath,
          proof: smoke.proof,
        });
        runVerdicts.push(verdict);
        if (!verdict.ok) {
          break;
        }
      } catch (error) {
        const stdoutPath = path.join(runReportDir, "smoke.stdout.log");
        const stderrPath = path.join(runReportDir, "smoke.stderr.log");
        smokeRuns.push({
          runIndex: runIndex + 1,
          ok: false,
          command: ["node", ...buildSmokeCommand(args, authSource.stateDir)],
          stdoutPath: (await pathExists(stdoutPath)) ? stdoutPath : null,
          stderrPath: (await pathExists(stderrPath)) ? stderrPath : null,
          reportCopyPath: null,
          proofRootCopyPath: null,
          proof: null,
        });
        runVerdicts.push({
          ok: false,
          failedAssertions: [],
          assertionCount: 0,
          passedAssertionCount: 0,
          failedAssertionCount: 0,
          smokeError: String((error as Error).message || error),
          status: "fail",
          failureReasons: [String((error as Error).message || error)],
        });
        break;
      }
      if (args.repeatDelayMs > 0 && runIndex + 1 < args.repeatRuns) {
        await new Promise((resolve) => setTimeout(resolve, args.repeatDelayMs));
      }
    }

    const verdict = aggregateBenchmarkVerdicts(runVerdicts);
    const latestSmoke = smokeRuns.at(-1);
    const report = buildGateReport({
      ok: verdict.ok,
      phase: "run",
      packRef: args.packRef,
      profile: args.profile,
      modelRef: args.model,
      repeatRuns: args.repeatRuns,
      repeatDelayMs: args.repeatDelayMs,
      preflight,
      smoke: latestSmoke,
      smokeRuns,
      verdict,
    });
    await summarizeAndExit(reportPath, report, verdict.ok ? 0 : 1, args.persistDir);
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
      repeatRuns: args.repeatRuns,
      repeatDelayMs: args.repeatDelayMs,
      preflight,
      smoke: {
        runIndex: 1,
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
    await summarizeAndExit(reportPath, report, 1, args.persistDir);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
