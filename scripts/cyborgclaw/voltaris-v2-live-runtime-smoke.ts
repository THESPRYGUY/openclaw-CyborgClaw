#!/usr/bin/env bun
import { execFile, spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { splitModelRef } from "../../src/agents/subagent-spawn.js";
import { loadConfig, resolveStateDir } from "../../src/config/config.js";
import { collectLiveAgentTranscriptProof } from "../../src/cyborgclaw/live-agent-proof.js";

const execFileAsync = promisify(execFile);
const REPO_ROOT = path.resolve(import.meta.dirname, "../..");
const DEFAULT_PACK_REF = "examples/voltaris-v2-pack";
const DEFAULT_PROFILE = "voltaris-proof";
const DEFAULT_PROBE_MESSAGE =
  "Reply in one line using this exact format: VOLTARIS-LIVE-OK | ProofToken=<token> | Name=<your name> | Role=<your role>";
const GATEWAY_UNTOUCHED_SURFACES = [
  "sessions",
  "routing",
  "channel state",
  "approvals",
  "control-plane truth",
] as const;

type JsonRecord = Record<string, unknown>;

type Args = {
  packRef: string;
  profile: string;
  keepState: boolean;
  json: boolean;
  message: string;
  authSourceStateDir?: string;
  model?: string;
  port?: number;
};

type CommandRun = {
  command: string;
  cwd: string;
  stdout: string;
  stderr: string;
};

const CORRELATION_TOKEN_PLACEHOLDERS = ["<token>", "{correlationToken}", "${token}"] as const;

function asStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function createCorrelationToken(): string {
  return `voltaris-proof-${randomBytes(8).toString("hex")}`;
}

function buildProbeMessage(baseMessage: string, correlationToken: string): string {
  const trimmed = baseMessage.trim();
  const normalizedBase = trimmed || DEFAULT_PROBE_MESSAGE;
  let substituted = normalizedBase;
  for (const placeholder of CORRELATION_TOKEN_PLACEHOLDERS) {
    substituted = substituted.replaceAll(placeholder, correlationToken);
  }
  if (substituted !== normalizedBase) {
    return substituted;
  }
  return [
    normalizedBase,
    "",
    `Correlation token: ${correlationToken}`,
    `Include the exact field ProofToken=${correlationToken} in your final reply.`,
  ].join("\n");
}

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

function parseNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`invalid numeric value for ${value}`);
  }
  return parsed;
}

function parseArgs(): Args {
  return {
    packRef: resolveArg("--pack") ?? DEFAULT_PACK_REF,
    profile: resolveArg("--profile") ?? DEFAULT_PROFILE,
    keepState: hasFlag("--keep-state"),
    json: hasFlag("--json"),
    message: resolveArg("--message") ?? DEFAULT_PROBE_MESSAGE,
    authSourceStateDir: resolveArg("--auth-source-state-dir"),
    model: resolveArg("--model"),
    port: parseNumber(resolveArg("--port")),
  };
}

function shellEscape(value: string): string {
  if (/^[A-Za-z0-9_./:-]+$/.test(value)) {
    return value;
  }
  return `'${value.replaceAll("'", `'"'"'`)}'`;
}

function commandString(env: NodeJS.ProcessEnv, args: string[]): string {
  const envBits = [
    `HOME=${shellEscape(env.HOME ?? "")}`,
    `OPENCLAW_HOME=${shellEscape(env.OPENCLAW_HOME ?? "")}`,
    `OPENCLAW_PROFILE=${shellEscape(env.OPENCLAW_PROFILE ?? "")}`,
    `OPENCLAW_STATE_DIR=${shellEscape(env.OPENCLAW_STATE_DIR ?? "")}`,
    `OPENCLAW_CONFIG_PATH=${shellEscape(env.OPENCLAW_CONFIG_PATH ?? "")}`,
    `OPENCLAW_RUNNER_LOG=${shellEscape(env.OPENCLAW_RUNNER_LOG ?? "0")}`,
  ];
  return `env ${envBits.join(" ")} pnpm --silent openclaw ${args.map(shellEscape).join(" ")}`;
}

async function findFreePort(): Promise<number> {
  return await new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("failed to allocate free port")));
        return;
      }
      const port = address.port;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
  });
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

async function copyFileIfPresent(sourcePath: string, targetPath: string): Promise<boolean> {
  if (!(await pathExists(sourcePath))) {
    return false;
  }
  await ensureDir(path.dirname(targetPath));
  await fs.copyFile(sourcePath, targetPath);
  return true;
}

async function collectSurfaceArtifacts(rootDir: string): Promise<string[]> {
  const results: string[] = [];
  async function walk(currentDir: string): Promise<void> {
    let entries: Awaited<ReturnType<typeof fs.readdir>>;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(rootDir, fullPath).replaceAll(path.sep, "/");
      if (/(^|\/)(sessions|routing|approvals?|channel(?:s|-state)?)(\/|$)/.test(relativePath)) {
        results.push(relativePath);
      }
      if (entry.isDirectory()) {
        await walk(fullPath);
      }
    }
  }
  await walk(rootDir);
  return results.toSorted();
}

async function runJsonCommand(
  env: NodeJS.ProcessEnv,
  args: string[],
  runs: CommandRun[],
): Promise<JsonRecord> {
  const command = commandString(env, args);
  const result = await execFileAsync("pnpm", ["--silent", "openclaw", ...args], {
    cwd: REPO_ROOT,
    env,
    maxBuffer: 20 * 1024 * 1024,
  });
  runs.push({
    command,
    cwd: REPO_ROOT,
    stdout: result.stdout,
    stderr: result.stderr,
  });
  const trimmed = result.stdout.trim();
  const objectStart = Math.max(trimmed.lastIndexOf("\n{"), trimmed.indexOf("{"));
  if (objectStart < 0) {
    throw new Error(`command did not emit JSON output:\n${trimmed}`);
  }
  const jsonText = trimmed.slice(
    objectStart === trimmed.indexOf("{") ? objectStart : objectStart + 1,
  );
  return JSON.parse(jsonText) as JsonRecord;
}

async function runTextCommand(
  env: NodeJS.ProcessEnv,
  args: string[],
  runs: CommandRun[],
): Promise<void> {
  const command = commandString(env, args);
  const result = await execFileAsync("pnpm", ["--silent", "openclaw", ...args], {
    cwd: REPO_ROOT,
    env,
    maxBuffer: 20 * 1024 * 1024,
  });
  runs.push({
    command,
    cwd: REPO_ROOT,
    stdout: result.stdout,
    stderr: result.stderr,
  });
}

async function waitForGatewayReady(
  child: ReturnType<typeof spawn>,
  startupLog: string[],
  startupError: string[],
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      reject(new Error(`gateway did not become ready in time\n${startupLog.join("")}`));
    }, 45_000);

    const handleChunk = (buffer: Buffer | string, target: string[]) => {
      const text = buffer.toString();
      target.push(text);
      if (!settled && text.includes("[gateway] listening on")) {
        settled = true;
        clearTimeout(timer);
        resolve();
      }
    };

    child.stdout?.on("data", (chunk) => {
      handleChunk(chunk, startupLog);
    });
    child.stderr?.on("data", (chunk) => {
      handleChunk(chunk, startupError);
    });
    child.once("exit", (code, signal) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      reject(
        new Error(
          `gateway exited before ready (code=${String(code)} signal=${String(signal)})\n${startupLog.join("")}${startupError.join("")}`,
        ),
      );
    });
  });
}

async function stopGateway(child: ReturnType<typeof spawn>): Promise<void> {
  if (child.killed || child.exitCode !== null) {
    return;
  }
  const killGatewayGroup = (signal: NodeJS.Signals) => {
    if (typeof child.pid === "number" && child.pid > 0) {
      try {
        process.kill(-child.pid, signal);
        return;
      } catch {}
    }
    child.kill(signal);
  };

  killGatewayGroup("SIGINT");
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      if (child.exitCode === null) {
        killGatewayGroup("SIGKILL");
      }
      resolve();
    }, 5_000);
    child.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

async function main(): Promise<number> {
  const args = parseArgs();
  const proofRoot = await fs.mkdtemp(path.join(os.tmpdir(), "voltaris-v2-live-smoke."));
  const tmpHome = path.join(proofRoot, "home");
  const stateDir = path.join(tmpHome, `.openclaw-${args.profile}`);
  const configPath = path.join(stateDir, "openclaw.json");
  const reportPath = path.join(proofRoot, "voltaris-v2-live-smoke-report.json");
  const commandRuns: CommandRun[] = [];
  const gatewayStdout: string[] = [];
  const gatewayStderr: string[] = [];
  let gatewayProcess: ReturnType<typeof spawn> | null = null;
  let keepArtifacts = args.keepState;
  let port: number | undefined;
  let sourceStateDir: string | undefined;
  let copiedAuthProfiles = false;
  let correlationToken: string | null = null;
  let probeMessage: string | null = null;

  try {
    await ensureDir(tmpHome);
    await ensureDir(stateDir);

    sourceStateDir = args.authSourceStateDir
      ? path.resolve(args.authSourceStateDir)
      : resolveStateDir(process.env);
    const sourceAuthProfiles = path.join(
      sourceStateDir,
      "agents",
      "main",
      "agent",
      "auth-profiles.json",
    );
    copiedAuthProfiles = await copyFileIfPresent(
      sourceAuthProfiles,
      path.join(stateDir, "agents", "main", "agent", "auth-profiles.json"),
    );
    if (!copiedAuthProfiles) {
      throw new Error(
        `missing source auth profile store: ${sourceAuthProfiles}\nSet --auth-source-state-dir or seed agents/main/agent/auth-profiles.json before running the smoke.`,
      );
    }

    const sourceConfig = loadConfig();
    const primaryModel =
      args.model ?? sourceConfig.agents?.defaults?.model?.primary ?? "openai-codex/gpt-5.3-codex";
    const modelFallbacks: string[] = [];
    const requestedTarget = splitModelRef(primaryModel);
    port = args.port ?? (await findFreePort());

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      HOME: tmpHome,
      OPENCLAW_HOME: tmpHome,
      OPENCLAW_PROFILE: args.profile,
      OPENCLAW_STATE_DIR: stateDir,
      OPENCLAW_CONFIG_PATH: configPath,
      OPENCLAW_RUNNER_LOG: "0",
      OPENCLAW_SKIP_CHANNELS: "1",
      OPENCLAW_SKIP_GMAIL_WATCHER: "1",
      OPENCLAW_SKIP_CRON: "1",
      OPENCLAW_SKIP_BROWSER_CONTROL_SERVER: "1",
      OPENCLAW_SKIP_CANVAS_HOST: "1",
    };

    await runTextCommand(env, ["config", "set", "gateway.mode", "local"], commandRuns);
    await runTextCommand(env, ["config", "set", "gateway.auth.mode", "none"], commandRuns);
    await runTextCommand(
      env,
      ["config", "set", "gateway.port", JSON.stringify(port), "--strict-json"],
      commandRuns,
    );
    await runTextCommand(
      env,
      [
        "config",
        "set",
        "agents.defaults.model.primary",
        JSON.stringify(primaryModel),
        "--strict-json",
      ],
      commandRuns,
    );
    await runTextCommand(
      env,
      [
        "config",
        "set",
        "agents.defaults.model.fallbacks",
        JSON.stringify(modelFallbacks),
        "--strict-json",
      ],
      commandRuns,
    );

    const forbiddenBeforeDeploy = await collectSurfaceArtifacts(stateDir);
    const validateResult = await runJsonCommand(
      env,
      ["genome", "validate", args.packRef, "--json"],
      commandRuns,
    );
    const planResult = await runJsonCommand(
      env,
      ["genome", "plan-deploy", args.packRef, "--json"],
      commandRuns,
    );
    const applyResult = await runJsonCommand(
      env,
      ["genome", "apply-deploy", args.packRef, "--force", "--write-config", "--json"],
      commandRuns,
    );
    const forbiddenAfterDeploy = await collectSurfaceArtifacts(stateDir);
    const receiptRef =
      typeof applyResult.packageId === "string" && applyResult.packageId.trim()
        ? applyResult.packageId
        : "voltaris-v2.pack";
    const receiptResult = await runJsonCommand(
      env,
      ["genome", "show-receipt", receiptRef, "--json"],
      commandRuns,
    );

    if (forbiddenBeforeDeploy.length !== 0) {
      throw new Error(
        `expected isolated proof state to start without gateway-owned surfaces, found: ${forbiddenBeforeDeploy.join(", ")}`,
      );
    }
    if (forbiddenAfterDeploy.length !== 0) {
      throw new Error(
        `genome deployment wrote gateway-owned surfaces: ${forbiddenAfterDeploy.join(", ")}`,
      );
    }

    gatewayProcess = spawn(
      "pnpm",
      ["--silent", "openclaw", "gateway", "run", "--bind", "loopback", "--verbose"],
      {
        cwd: REPO_ROOT,
        detached: true,
        env,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    await waitForGatewayReady(gatewayProcess, gatewayStdout, gatewayStderr);

    correlationToken = createCorrelationToken();
    probeMessage = buildProbeMessage(args.message, correlationToken);
    const commandStartedAt = Date.now();
    const agentResult = await runJsonCommand(
      env,
      ["agent", "--agent", "voltaris-v2", "--message", probeMessage, "--json"],
      commandRuns,
    );
    const agentMeta = ((agentResult.meta as JsonRecord | undefined)?.agentMeta ??
      (agentResult.result as JsonRecord | undefined)?.meta?.agentMeta ??
      undefined) as
      | {
          sessionId?: string;
          provider?: string;
          model?: string;
        }
      | undefined;

    const sessionsDir = path.join(stateDir, "agents", "voltaris-v2", "sessions");
    const sessionsIndexPath = path.join(sessionsDir, "sessions.json");
    const sessionsIndex = JSON.parse(await fs.readFile(sessionsIndexPath, "utf8")) as Record<
      string,
      JsonRecord
    >;
    const sessionEntry = sessionsIndex["agent:voltaris-v2:main"] ?? {};
    const sessionId = asStringValue(sessionEntry.sessionId);
    if (!sessionId) {
      throw new Error("runtime smoke did not persist agent:voltaris-v2:main session state");
    }
    const sessionTranscriptPath = path.join(sessionsDir, `${sessionId}.jsonl`);
    const sessionTranscript = await fs.readFile(sessionTranscriptPath, "utf8");
    const transcriptProof = await collectLiveAgentTranscriptProof({
      sessionKey: "agent:voltaris-v2:main",
      expectedSessionId: sessionId,
      transcriptPath: sessionTranscriptPath,
      correlationToken,
      payloads:
        ((agentResult.result as JsonRecord | undefined)?.payloads as Array<{
          text?: string | null;
        }>) ?? [],
      agentMeta,
      expectedProvider: asStringValue(requestedTarget.provider),
      expectedModel: asStringValue(requestedTarget.model),
      commandStartedAt,
      sessionUpdatedAt:
        typeof sessionEntry.updatedAt === "number" && Number.isFinite(sessionEntry.updatedAt)
          ? sessionEntry.updatedAt
          : undefined,
    });
    if (!transcriptProof.ok) {
      throw new Error(`live transcript proof failed:\n- ${transcriptProof.failures.join("\n- ")}`);
    }
    const workspaceDir = asStringValue(
      (sessionEntry.systemPromptReport as JsonRecord | undefined)?.workspaceDir,
    );
    const identityPath = path.join(stateDir, "workspace-voltaris-v2", "IDENTITY.md");
    const identityText = await fs.readFile(identityPath, "utf8");
    const forbiddenAfterRuntime = await collectSurfaceArtifacts(stateDir);

    const proof = {
      ok: true,
      packRef: args.packRef,
      proofRoot,
      reportPath,
      tempRuntime: {
        profile: args.profile,
        home: tmpHome,
        stateDir,
        configPath,
        port,
        authSourceStateDir: sourceStateDir,
        copiedAuthProfiles,
      },
      commands: commandRuns.map((entry) => entry.command),
      validateResult,
      planResult,
      applyResult,
      receiptResult,
      runtimeSmoke: {
        agentCommand: commandRuns.at(-1)?.command ?? null,
        agentResult,
        requestedMessage: args.message,
        probeMessage,
        correlationToken,
        sessionKey: "agent:voltaris-v2:main",
        sessionId,
        evidenceSummary: {
          requestedProvider: asStringValue(requestedTarget.provider),
          requestedModel: asStringValue(requestedTarget.model),
          resolvedProvider: asStringValue(agentMeta?.provider),
          resolvedModel: asStringValue(agentMeta?.model),
          transcriptProvider: transcriptProof.transcript.latestAssistant.provider,
          transcriptModel: transcriptProof.transcript.latestAssistant.model,
          proofStatus: transcriptProof.ok ? "ready" : "blocked",
        },
        sessionTranscriptPath,
        sessionTranscriptPreview: sessionTranscript.trim().split("\n").slice(0, 6),
        transcriptProof,
        systemPromptReport: sessionEntry.systemPromptReport ?? null,
        identityText,
      },
      gatewayProof: {
        startupLog: gatewayStdout.join(""),
        startupError: gatewayStderr.join(""),
      },
      surfaceProof: {
        untouchedByGenomeWorkflow: GATEWAY_UNTOUCHED_SURFACES,
        beforeDeploy: forbiddenBeforeDeploy,
        afterDeployBeforeRuntime: forbiddenAfterDeploy,
        afterRuntime: forbiddenAfterRuntime,
      },
      assertions: {
        validateStatus: validateResult.status === "valid",
        planDryRun: planResult.dryRun === true,
        applyStatus: applyResult.status === "applied",
        showReceiptStatus: receiptResult.status === "ok",
        receiptResolvedInstalledPack:
          typeof receiptResult.buildReceiptPath === "string" &&
          receiptResult.buildReceiptPath.includes(
            "/agents/voltaris-v2/agent/cyborgclaw/genome/packs/voltaris-v2.pack/compiled/build.receipt.json",
          ),
        gatewayAgentRpcObserved: gatewayStdout.join("").includes("[ws] ⇄ res ✓ agent"),
        gatewaySessionLaneObserved: gatewayStdout
          .join("")
          .includes("lane=session:agent:voltaris-v2:main"),
        transcriptHeaderMatchedSessionId: transcriptProof.header.matchesExpectedSessionId,
        transcriptFreshAfterCommand:
          transcriptProof.correlation.assistantTimestampAfterCommand === true &&
          transcriptProof.correlation.sessionUpdatedAfterCommand === true,
        transcriptCorrelationTokenObservedInUser:
          transcriptProof.transcript.correlationToken.userObserved === true,
        transcriptCorrelationTokenObservedInAssistant:
          transcriptProof.transcript.correlationToken.latestAssistantObserved === true,
        transcriptCorrelationTokenObservedInPayload:
          transcriptProof.transcript.correlationToken.payloadObserved === true,
        transcriptReplyMatchedPayload: transcriptProof.transcript.payloadMatch.matched,
        transcriptRecordedPositiveUsage:
          transcriptProof.transcript.latestAssistant.usage !== null &&
          [
            transcriptProof.transcript.latestAssistant.usage.input,
            transcriptProof.transcript.latestAssistant.usage.output,
            transcriptProof.transcript.latestAssistant.usage.totalTokens,
          ].some((value) => typeof value === "number" && value > 0),
        requestedProviderMatchedResolved:
          transcriptProof.target.requestedProviderMatchedResolved === true,
        requestedModelMatchedResolved:
          transcriptProof.target.requestedModelMatchedResolved === true,
        transcriptMatchedRequestedProvider:
          transcriptProof.target.transcriptProviderMatchedRequested === true,
        transcriptMatchedRequestedModel:
          transcriptProof.target.transcriptModelMatchedRequested === true,
        benchmarkFallbacksDisabled: modelFallbacks.length === 0,
        identityMatches:
          identityText.includes("Name: Voltaris V2") &&
          identityText.includes("Role: Master Genome Executive"),
        workspaceBootstrapLoaded:
          workspaceDir.endsWith("/workspace-voltaris-v2") &&
          Array.isArray(
            (sessionEntry.systemPromptReport as JsonRecord | undefined)?.injectedWorkspaceFiles,
          ),
        genomeWorkflowDidNotWriteGatewaySurfaces: forbiddenAfterDeploy.length === 0,
        runtimeCreatedNormalSession:
          forbiddenAfterRuntime.some((entry) => entry.includes("/sessions/")) &&
          !forbiddenAfterRuntime.some((entry) => entry.includes("/routing/")) &&
          !forbiddenAfterRuntime.some((entry) => entry.includes("/approv")) &&
          !forbiddenAfterRuntime.some((entry) => entry.includes("/channel")),
      },
    };

    await fs.writeFile(reportPath, JSON.stringify(proof, null, 2));

    if (args.json) {
      console.log(JSON.stringify(proof, null, 2));
    } else {
      console.log("Voltaris V2 live smoke passed.");
      console.log(`Proof root: ${proofRoot}`);
      console.log(`Report: ${reportPath}`);
      console.log(
        `Agent reply: ${String((agentResult.result as JsonRecord | undefined)?.payloads ? JSON.stringify((agentResult.result as JsonRecord).payloads) : "")}`,
      );
    }
    return 0;
  } catch (error) {
    keepArtifacts = true;
    const failure = {
      ok: false,
      packRef: args.packRef,
      proofRoot,
      reportPath,
      tempRuntime: {
        profile: args.profile,
        home: tmpHome,
        stateDir,
        configPath,
        port: port ?? null,
        authSourceStateDir: sourceStateDir ?? null,
        copiedAuthProfiles,
      },
      runtimeSmoke: {
        requestedMessage: args.message,
        probeMessage,
        correlationToken,
      },
      commands: commandRuns.map((entry) => entry.command),
      gatewayProof: {
        startupLog: gatewayStdout.join(""),
        startupError: gatewayStderr.join(""),
      },
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    };
    await fs.writeFile(reportPath, JSON.stringify(failure, null, 2));
    if (args.json) {
      console.log(JSON.stringify(failure, null, 2));
    } else {
      console.error("Voltaris V2 live smoke failed.");
      console.error(`Proof root: ${proofRoot}`);
      console.error(`Report: ${reportPath}`);
      console.error(failure.error.message);
    }
    return 1;
  } finally {
    if (gatewayProcess) {
      await stopGateway(gatewayProcess);
    }
    if (!keepArtifacts) {
      await fs.rm(proofRoot, { recursive: true, force: true });
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const exitCode = await main();
  process.exit(exitCode);
}
