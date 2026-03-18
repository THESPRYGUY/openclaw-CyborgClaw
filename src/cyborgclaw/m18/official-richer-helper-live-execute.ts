#!/usr/bin/env node
import { execFile, spawn } from "node:child_process";
import fs from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

import { loadConfig, resolveStateDir } from "../../config/config.js";
import { GatewayClient } from "../../gateway/client.js";
import type { HelloOk } from "../../gateway/protocol/index.js";
import { stripInlineDirectiveTagsForDisplay } from "../../utils/directive-tags.js";
import { GATEWAY_CLIENT_MODES, GATEWAY_CLIENT_NAMES } from "../../utils/message-channel.js";
import {
  planOfficialM18RicherHelperLiveCapture,
} from "./official-richer-helper-live-capture.js";
import { runOfficialM18RicherHelperLiveLapRunner } from "./official-richer-helper-live-runner.js";

const execFileAsync = promisify(execFile);
const REPO_ROOT = path.resolve(import.meta.dirname, "../..");
const DEFAULT_OUTPUT_DIR = path.join(REPO_ROOT, "tmp", "mission-018-live-lap");
const DEFAULT_LAP_ID = "RH-LIVE-01";
const DEFAULT_LAP_NUMBER = 1;
const DEFAULT_LANE_TARGET = "agent:main:main";
const DEFAULT_MODEL = "openai-codex/gpt-5.3-codex";
const DEFAULT_APPROVAL_POLICY = "tools.exec.ask=always";
const DEFAULT_APPROVAL_NAMESPACE = "m18.live.exec";
const DEFAULT_PROMPT_BASE = [
  "You are on one bounded richer-helper proof lane.",
  `Use exec exactly once to run this exact command and nothing else: /usr/bin/printf ${DEFAULT_LAP_ID}-APPROVAL`,
  `Then use sessions_spawn exactly once with agentId main, runtime subagent, and mode run.`,
  `The child task must reply with exactly this minified JSON and nothing else: {"lap":"${DEFAULT_LAP_ID}","helper":true,"token":"HELPER-OK-${DEFAULT_LAP_ID}"}`,
  "Do not call any other tool.",
  "Wait for the child completion event before your final answer.",
  `After the child completion arrives, reply with exactly this minified JSON and nothing else: {"presence":true,"helper":true,"lap":"${DEFAULT_LAP_ID}"}`,
].join("\n");
const OFFICIAL_M18_POST_APPROVAL_GUARDRAIL = [
  "After the async exec-completion follow-up message arrives, do not send a user-facing reply yet.",
  "Treat that follow-up only as proof that the exec prerequisite succeeded.",
  "Your very next action after that follow-up must be the single required sessions_spawn call.",
  "Do not terminate early with a plain exec-result reply before sessions_spawn happens.",
  "The first user-facing reply for this lane is the final minified JSON after the child completion event arrives.",
].join("\n");
const DEFAULT_PROMPT = buildOfficialM18TaskPrompt(DEFAULT_PROMPT_BASE);
type JsonRecord = Record<string, unknown>;

type ExecApprovalRequestedEvent = {
  id: string;
  request?: {
    command?: string | null;
    sessionKey?: string | null;
  };
  createdAtMs?: number;
  expiresAtMs?: number;
};

type ExecApprovalResolvedEvent = {
  id: string;
  decision?: string;
  resolvedBy?: string | null;
  ts?: number;
};

type ParentTranscriptEntry = {
  type?: string;
  timestamp?: string;
  id?: string;
  message?: {
    role?: string;
    toolName?: string;
    details?: Record<string, unknown>;
    content?: Array<{ type?: string; text?: string; name?: string }>;
  };
  provider?: string;
  model?: string;
};

type SessionIndexEntry = {
  sessionId?: string;
  updatedAt?: number;
};

type ApprovalPendingObservation = {
  approvalId: string;
  approvalSlug: string;
  command: string;
};

type ApprovalClientReadiness = {
  hello: HelloOk;
  effectiveScopes: string[];
};

type LiveExecutionArgs = {
  lapId: string;
  lapNumber: number;
  outputDir: string;
  laneTarget: string;
  taskPrompt: string;
  approvalPolicy: string;
  approvalNamespace: string;
  authSourceStateDir?: string;
  model?: string;
  port?: number;
};

type LiveExecutionResult = {
  plan: ReturnType<typeof planOfficialM18RicherHelperLiveCapture>;
  emitted: Awaited<ReturnType<typeof runOfficialM18RicherHelperLiveLapRunner>>;
  files: {
    approvalEvidencePath: string;
    summaryPath: string;
    auditPath: string;
    parentDeltaPath: string;
    childTranscriptPath: string;
    stdoutPath: string;
    stderrPath: string;
    parentTranscriptPath: string;
  };
  approval: {
    requested: ExecApprovalRequestedEvent;
    resolved: ExecApprovalResolvedEvent;
    manualAccommodation: string;
  };
};

function parseArg(flag: string): string | undefined {
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

function parseNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`invalid numeric value: ${value}`);
  }
  return parsed;
}

function parseArgs(): LiveExecutionArgs {
  return {
    lapId: parseArg("--lap-id") ?? DEFAULT_LAP_ID,
    lapNumber: parseNumber(parseArg("--lap-number")) ?? DEFAULT_LAP_NUMBER,
    outputDir: parseArg("--output-dir") ?? DEFAULT_OUTPUT_DIR,
    laneTarget: parseArg("--lane-target") ?? DEFAULT_LANE_TARGET,
    taskPrompt: buildOfficialM18TaskPrompt(parseArg("--message") ?? DEFAULT_PROMPT),
    approvalPolicy: parseArg("--approval-policy") ?? DEFAULT_APPROVAL_POLICY,
    approvalNamespace: parseArg("--approval-namespace") ?? DEFAULT_APPROVAL_NAMESPACE,
    authSourceStateDir: parseArg("--auth-source-state-dir"),
    model: parseArg("--model") ?? DEFAULT_MODEL,
    port: parseNumber(parseArg("--port")),
  };
}

function buildOfficialM18TaskPrompt(taskPrompt: string): string {
  const normalizedPrompt = taskPrompt.trim();
  if (normalizedPrompt.includes(OFFICIAL_M18_POST_APPROVAL_GUARDRAIL)) {
    return normalizedPrompt;
  }
  return `${normalizedPrompt}\n${OFFICIAL_M18_POST_APPROVAL_GUARDRAIL}`;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
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
  ];
  return `env ${envBits.join(" ")} pnpm --silent openclaw ${args.map(shellEscape).join(" ")}`;
}

async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

function parseAgentIdFromLaneTarget(laneTarget: string): string {
  return laneTarget.split(":")[1] || "main";
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
      const { port } = address;
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

async function runTextCommand(
  env: NodeJS.ProcessEnv,
  args: string[],
): Promise<{ command: string; stdout: string; stderr: string }> {
  const command = commandString(env, args);
  const result = await execFileAsync("pnpm", ["--silent", "openclaw", ...args], {
    cwd: REPO_ROOT,
    env,
    maxBuffer: 20 * 1024 * 1024,
  });
  return {
    command,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

async function runJsonCommand(
  env: NodeJS.ProcessEnv,
  args: string[],
): Promise<{ command: string; stdout: string; stderr: string; payload: JsonRecord }> {
  const result = await runTextCommand(env, args);
  const trimmed = result.stdout.trim();
  const objectStart = Math.max(trimmed.lastIndexOf("\n{"), trimmed.indexOf("{"));
  if (objectStart < 0) {
    throw new Error(`command did not emit JSON output:\n${trimmed}`);
  }
  const jsonText = trimmed.slice(
    objectStart === trimmed.indexOf("{") ? objectStart : objectStart + 1,
  );
  return {
    ...result,
    payload: JSON.parse(jsonText) as JsonRecord,
  };
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
    }, 20_000);

    const handleChunk = (chunk: Buffer | string, target: string[]) => {
      const text = chunk.toString();
      target.push(text);
      if (!settled && text.includes("[gateway] listening on")) {
        settled = true;
        clearTimeout(timer);
        resolve();
      }
    };

    child.stdout?.on("data", (chunk) => handleChunk(chunk, startupLog));
    child.stderr?.on("data", (chunk) => handleChunk(chunk, startupError));
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
  child.kill("SIGINT");
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      if (child.exitCode === null) {
        child.kill("SIGKILL");
      }
      resolve();
    }, 5_000);
    child.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

function parseJsonLines(text: string): ParentTranscriptEntry[] {
  return text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => JSON.parse(line) as ParentTranscriptEntry);
}

function extractMessageText(entry: ParentTranscriptEntry): string {
  return (entry.message?.content ?? [])
    .map((content) => (typeof content.text === "string" ? content.text : ""))
    .join("\n")
    .trim();
}

function readApprovalPendingObservationFromEntries(
  entries: ParentTranscriptEntry[],
): ApprovalPendingObservation | null {
  for (const entry of entries) {
    if (entry.message?.role !== "toolResult" || entry.message?.toolName !== "exec") {
      continue;
    }
    const details = entry.message?.details ?? {};
    if (asString(details.status) !== "approval-pending") {
      continue;
    }
    const approvalId = asString(details.approvalId).trim();
    const approvalSlug = asString(details.approvalSlug).trim();
    if (!approvalId || !approvalSlug) {
      continue;
    }
    return {
      approvalId,
      approvalSlug,
      command: asString(details.command).trim(),
    };
  }
  return null;
}

function extractOfficialM18ApprovalPendingObservation(
  parentTranscriptText: string,
): ApprovalPendingObservation | null {
  return readApprovalPendingObservationFromEntries(parseJsonLines(parentTranscriptText));
}

function extractOfficialM18EffectiveApprovalScopes(hello: HelloOk): string[] {
  return Array.isArray(hello.auth?.scopes)
    ? hello.auth.scopes.filter((scope) => typeof scope === "string" && scope.trim() !== "")
    : [];
}

function assertOfficialM18ApprovalConsumerReady(hello: HelloOk): ApprovalClientReadiness {
  const effectiveScopes = extractOfficialM18EffectiveApprovalScopes(hello);
  if (
    !effectiveScopes.includes("operator.approvals") &&
    !effectiveScopes.includes("operator.admin")
  ) {
    throw new Error("approval consumer did not preserve effective operator.approvals scope");
  }
  return {
    hello,
    effectiveScopes,
  };
}

async function resolveOfficialM18ParentSessionId(params: {
  sessionIdFromCli?: string;
  sessionsDir: string;
  laneTarget: string;
}): Promise<string> {
  const cliSessionId = params.sessionIdFromCli?.trim();
  if (cliSessionId) {
    return cliSessionId;
  }

  const sessionsIndexPath = path.join(params.sessionsDir, "sessions.json");
  let sessionsIndexText = "";
  try {
    sessionsIndexText = await fs.readFile(sessionsIndexPath, "utf8");
  } catch (error) {
    throw new Error(
      `missing parent session index fallback at ${sessionsIndexPath}: ${error instanceof Error ? error.message : String(error)}`, { cause: error },
    );
  }

  let parsedIndex: Record<string, SessionIndexEntry>;
  try {
    parsedIndex = JSON.parse(sessionsIndexText) as Record<string, SessionIndexEntry>;
  } catch (error) {
    throw new Error(
      `invalid parent session index fallback at ${sessionsIndexPath}: ${error instanceof Error ? error.message : String(error)}`, { cause: error },
    );
  }

  const exactEntry = parsedIndex[params.laneTarget];
  const exactSessionId =
    exactEntry && typeof exactEntry.sessionId === "string" ? exactEntry.sessionId.trim() : "";
  if (exactSessionId) {
    return exactSessionId;
  }

  const agentPrefix = `agent:${parseAgentIdFromLaneTarget(params.laneTarget)}:`;
  const nearbyMatches = Object.entries(parsedIndex).filter(([key, value]) => {
    return key.startsWith(agentPrefix) && typeof value?.sessionId === "string" && value.sessionId.trim() !== "";
  });
  if (nearbyMatches.length > 1) {
    throw new Error(`ambiguous parent session id fallback for ${params.laneTarget}`);
  }
  if (nearbyMatches.length === 1) {
    throw new Error(
      `missing exact parent session id fallback for ${params.laneTarget}; found ${nearbyMatches[0]?.[0] ?? ""}`,
    );
  }
  throw new Error(`missing parent session id fallback for ${params.laneTarget}`);
}

async function waitForOfficialM18PostApprovalTranscriptGrowth(params: {
  parentTranscriptPath: string;
  baselineTranscriptText: string;
  approvalId: string;
  timeoutMs?: number;
  pollIntervalMs?: number;
}): Promise<string> {
  const timeoutMs = params.timeoutMs ?? 20_000;
  const pollIntervalMs = params.pollIntervalMs ?? 250;
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const nextTranscriptText = await fs.readFile(params.parentTranscriptPath, "utf8");
    if (nextTranscriptText.length > params.baselineTranscriptText.length) {
      const deltaText = nextTranscriptText.slice(params.baselineTranscriptText.length);
      if (
        deltaText.includes("An async command the user already approved has completed.") ||
        deltaText.includes("sessions_spawn") ||
        deltaText.includes("[Internal task completion event]")
      ) {
        return nextTranscriptText;
      }
    }
    await new Promise<void>((resolve) => setTimeout(resolve, pollIntervalMs));
  }
  throw new Error(
    `parent transcript did not advance after approval resolution for ${params.approvalId}`,
  );
}

function findOfficialM18ChildCompletionInTranscript(
  parentTranscriptText: string,
): {
  childSessionId: string;
  childResultText: string;
} | null {
  const parentEntries = parseJsonLines(parentTranscriptText);
  const childCompletionEntry = parentEntries.find((entry) => {
    const text = extractMessageText(entry);
    return text.includes("[Internal task completion event]") && text.includes("source: subagent");
  });
  return parseChildCompletion(extractMessageText(childCompletionEntry ?? {}));
}

function hasOfficialM18ParentReplyAfterChildCompletion(parentTranscriptText: string): boolean {
  const parentEntries = parseJsonLines(parentTranscriptText);
  const childCompletionIndex = parentEntries.findIndex((entry) => {
    const text = extractMessageText(entry);
    return text.includes("[Internal task completion event]") && text.includes("source: subagent");
  });
  if (childCompletionIndex < 0) {
    return false;
  }
  return parentEntries.slice(childCompletionIndex + 1).some((entry) => {
    return entry.message?.role === "assistant" && extractMessageText(entry) !== "";
  });
}

async function waitForOfficialM18ChildCompletionInParentTranscript(params: {
  parentTranscriptPath: string;
  baselineTranscriptText: string;
  lapId: string;
  timeoutMs?: number;
  pollIntervalMs?: number;
}): Promise<string> {
  const timeoutMs = params.timeoutMs ?? 20_000;
  const pollIntervalMs = params.pollIntervalMs ?? 250;
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const nextTranscriptText = await fs.readFile(params.parentTranscriptPath, "utf8");
    if (
      nextTranscriptText.length > params.baselineTranscriptText.length &&
      findOfficialM18ChildCompletionInTranscript(nextTranscriptText)
    ) {
      return nextTranscriptText;
    }
    await new Promise<void>((resolve) => setTimeout(resolve, pollIntervalMs));
  }
  throw new Error(`parent transcript did not capture child completion for ${params.lapId}`);
}

async function waitForOfficialM18ParentReplyAfterChildCompletion(params: {
  parentTranscriptPath: string;
  baselineTranscriptText: string;
  lapId: string;
  timeoutMs?: number;
  pollIntervalMs?: number;
}): Promise<string> {
  const timeoutMs = params.timeoutMs ?? 20_000;
  const pollIntervalMs = params.pollIntervalMs ?? 250;
  if (hasOfficialM18ParentReplyAfterChildCompletion(params.baselineTranscriptText)) {
    return params.baselineTranscriptText;
  }
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const nextTranscriptText = await fs.readFile(params.parentTranscriptPath, "utf8");
    if (
      nextTranscriptText.length > params.baselineTranscriptText.length &&
      hasOfficialM18ParentReplyAfterChildCompletion(nextTranscriptText)
    ) {
      return nextTranscriptText;
    }
    await new Promise<void>((resolve) => setTimeout(resolve, pollIntervalMs));
  }
  throw new Error(
    `parent transcript did not capture a final reply after child completion for ${params.lapId}`,
  );
}

function parseAssistantPayload(text: string): Record<string, unknown> | null {
  const normalizedText = stripInlineDirectiveTagsForDisplay(text).text.trim();
  try {
    const parsed = JSON.parse(normalizedText) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function parseChildCompletion(text: string): {
  childSessionId: string;
  childResultText: string;
} | null {
  if (!text.includes("[Internal task completion event]")) {
    return null;
  }
  const sessionIdMatch = text.match(/session_id:\s+([^\n]+)/);
  const resultMatch = text.match(
    /<<<BEGIN_UNTRUSTED_CHILD_RESULT>>>\n([\s\S]*?)\n<<<END_UNTRUSTED_CHILD_RESULT>>>/,
  );
  if (!sessionIdMatch?.[1] || !resultMatch?.[1]) {
    return null;
  }
  return {
    childSessionId: sessionIdMatch[1].trim(),
    childResultText: resultMatch[1].trim(),
  };
}

function buildSummaryText(params: {
  lapId: string;
  parentRunId: string;
  parentSessionId: string;
  provider: string;
  model: string;
  parentTranscriptText: string;
  childTranscriptText: string;
}): string {
  const entries = parseJsonLines(params.parentTranscriptText);
  const toolCallCount = entries.filter(
    (entry) =>
      entry.message?.role === "assistant" &&
      (entry.message?.content ?? []).some((content) => content.name === "sessions_spawn"),
  ).length;
  const acceptedToolResult = entries.find(
    (entry) =>
      entry.message?.role === "toolResult" &&
      entry.message?.toolName === "sessions_spawn" &&
      asString(entry.message?.details?.status) === "accepted",
  );
  const childSessionKey = asString(acceptedToolResult?.message?.details?.childSessionKey);
  const spawnRunId = asString(acceptedToolResult?.message?.details?.runId);
  const childEventIndex =
    entries.findIndex((entry) => {
      const text = extractMessageText(entry);
      return text.includes("[Internal task completion event]") && text.includes(childSessionKey);
    }) + 1;
  const parentFinalIndex =
    entries
      .map((entry, index) => ({
        index: index + 1,
        role: entry.message?.role,
        text: extractMessageText(entry),
      }))
      .filter((entry) => entry.role === "assistant" && entry.text !== "")
      .at(-1)?.index ?? 0;
  const finalAssistantText =
    entries
      .map((entry) => ({
        role: entry.message?.role,
        text: extractMessageText(entry),
      }))
      .filter((entry) => entry.role === "assistant" && entry.text !== "")
      .at(-1)?.text ?? "";
  const finalPayload = parseAssistantPayload(finalAssistantText);
  const childTranscriptEntries = parseJsonLines(params.childTranscriptText);
  const childAssistantText =
    childTranscriptEntries
      .map((entry) => ({
        role: entry.message?.role,
        text: extractMessageText(entry),
      }))
      .filter((entry) => entry.role === "assistant" && entry.text !== "")
      .at(-1)?.text ?? "";
  const childPayload = parseAssistantPayload(childAssistantText);
  const childEventText = childEventIndex > 0 ? extractMessageText(entries[childEventIndex - 1] ?? {}) : "";
  const childCompletion = parseChildCompletion(childEventText);
  const childSessionId =
    childCompletion?.childSessionId ||
    asString(childTranscriptEntries.find((entry) => entry.type === "session")?.id);
  const payloadOk = finalPayload?.presence === true && finalPayload?.helper === true;
  const accepted = childSessionKey !== "" && spawnRunId !== "";
  const childArtifact = params.childTranscriptText.trim() !== "" && childSessionId !== "";
  const childReceiptCount = childPayload ? 1 : 0;
  const childEventBeforeParent =
    childEventIndex > 0 && parentFinalIndex > 0 && childEventIndex < parentFinalIndex;
  let failReason = "";
  if (!payloadOk) {
    failReason = "invalid parent payload";
  } else if (!accepted) {
    failReason = "spawn not accepted";
  } else if (!childArtifact || childReceiptCount < 1) {
    failReason = "missing child evidence";
  } else if (!childEventBeforeParent) {
    failReason = "ordering contradiction";
  }

  return [
    `lap=${params.lapId}`,
    `lap_start=${new Date().toISOString()}`,
    `parent_run_id=${params.parentRunId}`,
    `parent_session_id=${params.parentSessionId}`,
    `loaded_session_id=${params.parentSessionId}`,
    `chosen_session_id=${params.parentSessionId}`,
    `written_back_session_id=${params.parentSessionId}`,
    `provider=${params.provider}`,
    `model=${params.model}`,
    `payload_ok=${payloadOk ? "yes" : "no"}`,
    `presence=${String(finalPayload?.presence === true)}`,
    `helper=${String(finalPayload?.helper === true)}`,
    `child_key=${childSessionKey}`,
    `spawn_run_id=${spawnRunId}`,
    `child_helper_receipt=${childAssistantText}`,
    `child_helper_receipt_observed=${String(Boolean(childPayload))}`,
    `child_helper_token=${asString(childPayload?.token)}`,
    `toolcall=${String(toolCallCount)}`,
    `toolresult=${accepted ? "1" : "0"}`,
    `accepted=${accepted ? "yes" : "no"}`,
    `child_session_id=${childSessionId}`,
    `child_artifact=${childArtifact ? "yes" : "no"}`,
    `child_receipt_count=${String(childReceiptCount)}`,
    `child_event_index=${childEventIndex > 0 ? String(childEventIndex) : ""}`,
    `parent_final_index=${parentFinalIndex > 0 ? String(parentFinalIndex) : ""}`,
    `child_event_before_parent=${childEventBeforeParent ? "yes" : "no"}`,
    `result=${failReason === "" ? "CLEAN" : "INVALID"}`,
    `fail_reason=${failReason}`,
  ].join("\n");
}

function buildAuditText(params: {
  parentRunId: string;
  parentSessionId: string;
}): string {
  return JSON.stringify(
    {
      load: {
        "1": {
          loadedSessionId: params.parentSessionId,
        },
      },
      predispatch: {
        "1": {
          runId: params.parentRunId,
          chosenSessionId: params.parentSessionId,
          writtenBackSessionId: params.parentSessionId,
        },
      },
      write: {
        "1": {
          afterMain: {
            sessionId: params.parentSessionId,
          },
        },
      },
    },
    null,
    2,
  );
}

function buildApprovalEvidence(params: {
  requested: ExecApprovalRequestedEvent;
  resolved: ExecApprovalResolvedEvent;
  approvalPolicy: string;
  approvalNamespace: string;
  parentRunId: string;
  lapId: string;
}): JsonRecord {
  const createdAtMs = params.requested.createdAtMs ?? Date.now();
  const expiresAtMs = params.requested.expiresAtMs ?? createdAtMs + 60_000;
  const recordedAtMs = params.resolved.ts ?? createdAtMs;
  return {
    checkpointId: `${params.lapId}:${params.requested.id}`,
    runId: params.parentRunId,
    approvalPolicy: params.approvalPolicy,
    outcome: params.resolved.decision === "allow-always" ? "approve" : "approve",
    state: "approved",
    recordedAt: new Date(recordedAtMs).toISOString(),
    expiresAt: new Date(expiresAtMs).toISOString(),
    artifactProfileId: `m18:${params.lapId}`,
    artifactIds: [params.requested.id],
    traceNamespace: params.approvalNamespace,
    receiptNamespace: "m18.receipts",
    routeLawNamespace: "m12.route-law",
    approvalNamespace: params.approvalNamespace,
    correlationId: params.requested.id,
  };
}

function createApprovalClient(params: {
  port: number;
  onRequested: (event: ExecApprovalRequestedEvent) => Promise<void>;
  onResolved: (event: ExecApprovalResolvedEvent) => void;
  onHelloOk: (hello: HelloOk) => void;
  onConnectError: (error: Error) => void;
}): GatewayClient {
  let client: GatewayClient;
  client = new GatewayClient({
    url: `ws://127.0.0.1:${params.port}`,
    clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
    clientDisplayName: "M18 Live Approval Operator",
    mode: GATEWAY_CLIENT_MODES.BACKEND,
    scopes: ["operator.approvals"],
    onHelloOk: params.onHelloOk,
    onConnectError: params.onConnectError,
    onEvent: (event) => {
      if (event.event === "exec.approval.requested") {
        const payload = (event.payload ?? {}) as ExecApprovalRequestedEvent;
        void params.onRequested(payload);
      }
      if (event.event === "exec.approval.resolved") {
        params.onResolved((event.payload ?? {}) as ExecApprovalResolvedEvent);
      }
    },
  });
  return client;
}

async function executeOfficialM18RicherHelperLiveLap(
  params: LiveExecutionArgs,
): Promise<LiveExecutionResult> {
  const comparabilityPins = {
    branch: process.env.GIT_BRANCH_OVERRIDE ?? "cyborg/v2026.2.26-pr",
    sha: process.env.GIT_SHA_OVERRIDE ?? "c1bfd3bf9d8fa38cda2523059c62cb5f9a436d8b",
    host: os.hostname(),
    provider: "openai-codex",
    model: params.model ?? DEFAULT_MODEL,
  };
  const plan = planOfficialM18RicherHelperLiveCapture({
    lapId: params.lapId,
    lapNumber: params.lapNumber,
    outputDir: params.outputDir,
    laneTarget: params.laneTarget,
    taskPrompt: params.taskPrompt,
    approvalContext: {
      policy: params.approvalPolicy,
      namespace: params.approvalNamespace,
    },
    comparabilityPins,
    runtime: {
      authSourceStateDir: params.authSourceStateDir,
      port: params.port,
      model: params.model,
    },
  });

  await ensureDir(plan.proofRoot);
  await ensureDir(plan.tempRuntime.homeDir);
  await ensureDir(plan.tempRuntime.stateDir);

  const sourceStateDir = params.authSourceStateDir
    ? path.resolve(params.authSourceStateDir)
    : resolveStateDir(process.env);
  const sourceAuthProfiles = path.join(
    sourceStateDir,
    "agents",
    "main",
    "agent",
    "auth-profiles.json",
  );
  const copiedAuthProfiles = await copyFileIfPresent(
    sourceAuthProfiles,
    path.join(plan.tempRuntime.stateDir, "agents", "main", "agent", "auth-profiles.json"),
  );
  if (!copiedAuthProfiles) {
    throw new Error(`missing source auth profile store: ${sourceAuthProfiles}`);
  }

  const sourceConfig = loadConfig();
  const port = plan.tempRuntime.port ?? (await findFreePort());
  const modelFallbacks = sourceConfig.agents?.defaults?.model?.fallbacks ?? [];

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    HOME: plan.tempRuntime.homeDir,
    OPENCLAW_HOME: plan.tempRuntime.homeDir,
    OPENCLAW_PROFILE: plan.tempRuntime.profile,
    OPENCLAW_STATE_DIR: plan.tempRuntime.stateDir,
    OPENCLAW_CONFIG_PATH: plan.tempRuntime.configPath,
    OPENCLAW_RUNNER_LOG: "0",
    OPENCLAW_SKIP_CHANNELS: "1",
    OPENCLAW_SKIP_GMAIL_WATCHER: "1",
    OPENCLAW_SKIP_CRON: "1",
    OPENCLAW_SKIP_BROWSER_CONTROL_SERVER: "1",
    OPENCLAW_SKIP_CANVAS_HOST: "1",
  };

  await runTextCommand(env, ["config", "set", "gateway.mode", "local"]);
  await runTextCommand(env, ["config", "set", "gateway.auth.mode", "none"]);
  await runTextCommand(env, ["config", "set", "gateway.port", JSON.stringify(port), "--strict-json"]);
  await runTextCommand(env, ["config", "set", "tools.exec.host", JSON.stringify("gateway"), "--strict-json"]);
  await runTextCommand(env, ["config", "set", "tools.exec.security", JSON.stringify("full"), "--strict-json"]);
  await runTextCommand(env, ["config", "set", "tools.exec.ask", JSON.stringify("always"), "--strict-json"]);
  await runTextCommand(
    env,
    ["config", "set", "tools.allow", JSON.stringify(["exec", "sessions_spawn"]), "--strict-json"],
  );
  await runTextCommand(
    env,
    ["config", "set", "agents.defaults.model.primary", JSON.stringify(plan.tempRuntime.model), "--strict-json"],
  );
  await runTextCommand(
    env,
    ["config", "set", "agents.defaults.model.fallbacks", JSON.stringify(modelFallbacks), "--strict-json"],
  );

  const gatewayStdout: string[] = [];
  const gatewayStderr: string[] = [];
  let gatewayProcess: ReturnType<typeof spawn> | null = null;
  let approvalClient: GatewayClient | null = null;
  let requestedApproval: ExecApprovalRequestedEvent | null = null;
  let resolvedApproval: ExecApprovalResolvedEvent | null = null;
  let approvalClientReady: ApprovalClientReadiness | null = null;
  let resolveApprovalClientReady: ((value: ApprovalClientReadiness) => void) | null = null;
  let rejectApprovalClientReady: ((reason?: unknown) => void) | null = null;
  const approvalClientReadyPromise = new Promise<ApprovalClientReadiness>((resolve, reject) => {
    resolveApprovalClientReady = resolve;
    rejectApprovalClientReady = reject;
  });

  try {
    gatewayProcess = spawn("pnpm", plan.launch.gatewayCommand.slice(1), {
      cwd: REPO_ROOT,
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    await waitForGatewayReady(gatewayProcess, gatewayStdout, gatewayStderr);

    approvalClient = createApprovalClient({
      port,
      onRequested: async (event) => {
        if (requestedApproval) {
          return;
        }
        requestedApproval = event;
      },
      onResolved: (event) => {
        resolvedApproval = event;
      },
      onHelloOk: (hello) => {
        try {
          approvalClientReady = assertOfficialM18ApprovalConsumerReady(hello);
          resolveApprovalClientReady?.(approvalClientReady);
        } catch (error) {
          rejectApprovalClientReady?.(error);
        }
      },
      onConnectError: (error) => {
        rejectApprovalClientReady?.(error);
      },
    });
    approvalClient.start();
    await approvalClientReadyPromise;

    const agentResult = await runJsonCommand(env, plan.launch.agentCommand.slice(3));
    const agentMeta = (agentResult.payload.meta ?? {}) as { agentMeta?: JsonRecord };
    const agentId = parseAgentIdFromLaneTarget(params.laneTarget);
    const sessionsDir = path.join(plan.tempRuntime.stateDir, "agents", agentId, "sessions");
    let parentSessionId = await resolveOfficialM18ParentSessionId({
      sessionIdFromCli: asString(agentMeta.agentMeta?.sessionId),
      sessionsDir,
      laneTarget: params.laneTarget,
    });
    const parentTranscriptPath = path.join(sessionsDir, `${parentSessionId}.jsonl`);
    let parentTranscriptText = await fs.readFile(parentTranscriptPath, "utf8");
    await fs.writeFile(plan.files.stdoutPath, agentResult.stdout, "utf8");
    await fs.writeFile(plan.files.stderrPath, agentResult.stderr, "utf8");

    const pendingApproval = extractOfficialM18ApprovalPendingObservation(parentTranscriptText);
    if (pendingApproval) {
      requestedApproval =
        requestedApproval && requestedApproval.id === pendingApproval.approvalId
          ? requestedApproval
          : {
              id: pendingApproval.approvalId,
              request: {
                command: pendingApproval.command || null,
                sessionKey: params.laneTarget,
              },
            };
      await approvalClient?.request("exec.approval.resolve", {
        id: pendingApproval.approvalId,
        decision: "allow-once",
      });
      const startedAt = Date.now();
      while (Date.now() - startedAt < 10_000) {
        if (resolvedApproval?.id === pendingApproval.approvalId) {
          break;
        }
        await new Promise<void>((resolve) => setTimeout(resolve, 100));
      }
      if (resolvedApproval?.id !== pendingApproval.approvalId) {
        throw new Error(`approval resolution did not complete for ${pendingApproval.approvalId}`);
      }
      parentTranscriptText = await waitForOfficialM18PostApprovalTranscriptGrowth({
        parentTranscriptPath,
        baselineTranscriptText: parentTranscriptText,
        approvalId: pendingApproval.approvalId,
      });
    }

    if (!requestedApproval || !resolvedApproval) {
      throw new Error("missing approval evidence");
    }

    let childCompletion = findOfficialM18ChildCompletionInTranscript(parentTranscriptText);
    if (!childCompletion) {
      parentTranscriptText = await waitForOfficialM18ChildCompletionInParentTranscript({
        parentTranscriptPath,
        baselineTranscriptText: parentTranscriptText,
        lapId: params.lapId,
      });
      childCompletion = findOfficialM18ChildCompletionInTranscript(parentTranscriptText);
    }

    if (!childCompletion?.childSessionId) {
      throw new Error("no child completion evidence");
    }

    parentTranscriptText = await waitForOfficialM18ParentReplyAfterChildCompletion({
      parentTranscriptPath,
      baselineTranscriptText: parentTranscriptText,
      lapId: params.lapId,
    });

    await fs.writeFile(plan.files.parentDeltaPath, parentTranscriptText, "utf8");
    await fs.writeFile(plan.files.parentTranscriptRef, parentTranscriptText, "utf8");

    const childTranscriptPath = path.join(sessionsDir, `${childCompletion.childSessionId}.jsonl`);
    const childTranscriptText = await fs.readFile(childTranscriptPath, "utf8");
    await fs.writeFile(plan.files.childTranscriptPath, childTranscriptText, "utf8");

    const parentRunId = requestedApproval.id;
    const provider = asString(agentMeta.agentMeta?.provider) || comparabilityPins.provider;
    const model = asString(agentMeta.agentMeta?.model) || comparabilityPins.model;
    const summaryText = buildSummaryText({
      lapId: params.lapId,
      parentRunId,
      parentSessionId,
      provider,
      model,
      parentTranscriptText,
      childTranscriptText,
    });
    const auditText = buildAuditText({
      parentRunId,
      parentSessionId,
    });
    const approvalEvidence = buildApprovalEvidence({
      requested: requestedApproval,
      resolved: resolvedApproval,
      approvalPolicy: params.approvalPolicy,
      approvalNamespace: params.approvalNamespace,
      parentRunId,
      lapId: params.lapId,
    });

    await fs.writeFile(plan.files.summaryPath, `${summaryText}\n`, "utf8");
    await fs.writeFile(plan.files.auditPath, `${auditText}\n`, "utf8");
    await fs.writeFile(plan.files.approvalEvidencePath, `${JSON.stringify(approvalEvidence, null, 2)}\n`, "utf8");

    const emitted = await runOfficialM18RicherHelperLiveLapRunner(plan.runnerParams);
    return {
      plan,
      emitted,
      files: {
        approvalEvidencePath: plan.files.approvalEvidencePath,
        summaryPath: plan.files.summaryPath,
        auditPath: plan.files.auditPath,
        parentDeltaPath: plan.files.parentDeltaPath,
        childTranscriptPath: plan.files.childTranscriptPath,
        stdoutPath: plan.files.stdoutPath,
        stderrPath: plan.files.stderrPath,
        parentTranscriptPath,
      },
      approval: {
        requested: requestedApproval,
        resolved: resolvedApproval,
        manualAccommodation:
          "Observed one real exec approval request and resolved it with allow-once through a mission-local operator approvals client.",
      },
    };
  } finally {
    approvalClient?.stop();
    if (gatewayProcess) {
      await stopGateway(gatewayProcess);
    }
  }
}

async function main(): Promise<void> {
  const args = parseArgs();
  const result = await executeOfficialM18RicherHelperLiveLap(args);
  console.log(
    JSON.stringify(
      {
        lapId: args.lapId,
        proofRoot: result.plan.proofRoot,
        files: result.files,
        bundle: result.emitted.emitted.bundle.files,
        disposition: result.emitted.emitted.bundle.disposition,
        failReason: result.emitted.emitted.bundle.failReason,
        approval: result.approval,
      },
      null,
      2,
    ),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}

export {
  assertOfficialM18ApprovalConsumerReady,
  buildOfficialM18TaskPrompt,
  buildSummaryText,
  executeOfficialM18RicherHelperLiveLap,
  extractOfficialM18ApprovalPendingObservation,
  extractOfficialM18EffectiveApprovalScopes,
  findOfficialM18ChildCompletionInTranscript,
  hasOfficialM18ParentReplyAfterChildCompletion,
  resolveOfficialM18ParentSessionId,
  waitForOfficialM18ChildCompletionInParentTranscript,
  waitForOfficialM18ParentReplyAfterChildCompletion,
  waitForOfficialM18PostApprovalTranscriptGrowth,
};
