import fs from "node:fs/promises";
import path from "node:path";
import type { AgentMessage } from "@mariozechner/pi-agent-core";
import { writeFileWithinRoot } from "../infra/fs-safe.js";
import { redactSensitiveText } from "../logging/redact.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { extractSessionText } from "./session-files.js";

const log = createSubsystemLogger("memory/handoff-memory");
const HANDOFF_MEMORY_SCHEMA = "openclaw.handoff-memory.v1";
const HANDOFF_MEMORY_COMPARTMENT = "handoff_memory";
const DEFAULT_SCOPE = "agent-private";
const DEFAULT_TRUST_STATE = "observed-runtime";
const HANDOFF_FRESHNESS_SKEW_MS = 1_000;

type HandoffRunStatus = "ok" | "error" | "unknown";
type HandoffMemorySource = "agent_end" | "before_reset" | "session_end";

type HandoffSnapshotRecord = {
  schema: typeof HANDOFF_MEMORY_SCHEMA;
  compartment: typeof HANDOFF_MEMORY_COMPARTMENT;
  createdAt: string;
  agentId: string;
  sessionId?: string;
  sessionKey?: string;
  trigger?: string;
  source: HandoffMemorySource;
  runStatus: HandoffRunStatus;
  trustState: typeof DEFAULT_TRUST_STATE;
  scope: typeof DEFAULT_SCOPE;
  promotable: false;
  durationMs?: number;
  error?: string;
  messageCount: number;
  summary: string;
  sourceSnapshot?: string;
};

export type AgentEndHandoffMemoryParams = {
  workspaceDir: string;
  agentId: string;
  sessionId?: string;
  sessionKey?: string;
  sessionFile?: string;
  trigger?: string;
  messages: AgentMessage[];
  success: boolean;
  error?: string;
  durationMs?: number;
};

export type AgentEndHandoffMemoryWriteResult = {
  latestRelativePath: "memory/handoff-latest.md";
  snapshotRelativePath: string;
};

export type BeforeResetHandoffMemoryParams = {
  workspaceDir: string;
  agentId: string;
  sessionId?: string;
  sessionKey?: string;
  sessionFile?: string;
  action: "new" | "reset";
  messages: AgentMessage[];
  commandSource?: string;
};

export type BeforeResetHandoffMemoryWriteResult =
  | {
      status: "written";
      latestRelativePath: "memory/handoff-latest.md";
      snapshotRelativePath: string;
    }
  | {
      status: "skipped";
      reason: "fresh-agent-end-snapshot";
    };

export type SessionEndHandoffMemoryParams = {
  workspaceDir: string;
  agentId: string;
  sessionId?: string;
  sessionKey?: string;
  sessionFile?: string;
  transcriptMtimeMs?: number;
  messages: AgentMessage[];
};

export type SessionEndHandoffMemoryWriteResult =
  | {
      status: "written";
      latestRelativePath: "memory/handoff-latest.md";
      snapshotRelativePath: string;
    }
  | {
      status: "skipped";
      reason: "fresh-agent-end-or-before-reset-snapshot";
    };

function truncateExcerpt(value: string, max = 240): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max - 1).trimEnd()}...`;
}

function sanitizeMarkdownText(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const safe = redactSensitiveText(value);
  const truncated = truncateExcerpt(safe);
  return truncated || undefined;
}

function normalizeRelativeWorkspacePath(workspaceDir: string, targetPath: string): string | null {
  const relative = path.relative(workspaceDir, targetPath);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }
  return relative.split(path.sep).join(path.posix.sep);
}

function sanitizeSnapshotFileToken(value: string | undefined, fallback: string): string {
  const base = (value?.trim() || fallback).replace(/[^a-zA-Z0-9._-]+/g, "-");
  const compact = base.replace(/-+/g, "-").replace(/^-|-$/g, "");
  return compact || fallback;
}

function formatSnapshotStem(timestamp: string, sessionId?: string): string {
  const compactTimestamp = timestamp.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const safeSessionId = sanitizeSnapshotFileToken(sessionId, "session");
  return `${compactTimestamp}-${safeSessionId}`;
}

function findLastMessageExcerpt(
  messages: AgentMessage[],
  role: "user" | "assistant",
): string | null {
  for (let index = messages.length - 1; index >= 0; index--) {
    const message = messages[index];
    if (!message || message.role !== role) {
      continue;
    }
    const excerpt = extractSessionText(message.content);
    if (excerpt) {
      return excerpt;
    }
  }
  return null;
}

function buildStableStateLines(params: {
  runStatus: HandoffRunStatus;
  sessionKey?: string;
  trigger?: string;
  durationMs?: number;
  lastUserExcerpt?: string;
  lastAssistantExcerpt?: string;
  error?: string;
}): string[] {
  return [
    `- Run status: ${params.runStatus}`,
    `- Session key: ${params.sessionKey ?? "UNKNOWN"}`,
    `- Trigger: ${params.trigger ?? "UNKNOWN"}`,
    `- Latest user request: ${params.lastUserExcerpt ?? "UNKNOWN"}`,
    `- Latest assistant reply: ${params.lastAssistantExcerpt ?? "UNKNOWN"}`,
    `- Duration: ${typeof params.durationMs === "number" ? `${params.durationMs} ms` : "UNKNOWN"}`,
    `- Error state: ${params.error ?? "none"}`,
  ];
}

function buildUnresolvedQuestionLines(params: {
  runStatus: HandoffRunStatus;
  error?: string;
}): string[] {
  if (params.runStatus === "error") {
    return [`- Investigate the runtime error before retrying: ${params.error ?? "UNKNOWN"}`];
  }
  if (params.runStatus === "unknown") {
    return ["- Confirm whether the pre-reset task was fully completed before session rotation."];
  }
  return ["- UNKNOWN"];
}

function buildNextRecommendedAction(params: {
  runStatus: HandoffRunStatus;
  lastUserExcerpt?: string;
  error?: string;
}): string {
  if (params.runStatus === "error") {
    return `Inspect the latest run error before retrying: ${params.error ?? "UNKNOWN"}`;
  }
  if (params.runStatus === "unknown") {
    return "Resume from this pre-reset handoff and confirm the next bounded task before continuing.";
  }
  if (params.lastUserExcerpt) {
    return "Resume from the latest stable state and continue the most recent bounded user task.";
  }
  return "Resume from the latest stable state and confirm the next bounded task.";
}

function buildRiskNoteLines(params: { transcriptRelativePath?: string }): string[] {
  if (!params.transcriptRelativePath) {
    return ["- Transcript path unavailable in the agent workspace."];
  }
  return ["- UNKNOWN"];
}

function buildSummary(params: {
  source: HandoffMemorySource;
  runStatus: HandoffRunStatus;
  messageCount: number;
}): string {
  if (params.source === "before_reset") {
    return `Pre-reset fallback captured | messages=${params.messageCount}`;
  }
  if (params.source === "session_end") {
    return `Session-end fallback captured | messages=${params.messageCount}`;
  }
  if (params.runStatus === "ok") {
    return `Run completed successfully | messages=${params.messageCount}`;
  }
  if (params.runStatus === "error") {
    return `Run ended with an error | messages=${params.messageCount}`;
  }
  return `Run state captured | messages=${params.messageCount}`;
}

function latestHandoffPath(workspaceDir: string): string {
  return path.join(workspaceDir, "memory", "handoff-latest.md");
}

function extractHandoffJsonBlock(raw: string): HandoffSnapshotRecord | null {
  const match = raw.match(/```json\n([\s\S]*?)\n```/);
  if (!match?.[1]) {
    return null;
  }
  try {
    const parsed = JSON.parse(match[1]) as Partial<HandoffSnapshotRecord>;
    if (
      parsed.schema !== HANDOFF_MEMORY_SCHEMA ||
      parsed.compartment !== HANDOFF_MEMORY_COMPARTMENT
    ) {
      return null;
    }
    if (
      parsed.source !== "agent_end" &&
      parsed.source !== "before_reset" &&
      parsed.source !== "session_end"
    ) {
      return null;
    }
    if (
      parsed.runStatus !== "ok" &&
      parsed.runStatus !== "error" &&
      parsed.runStatus !== "unknown"
    ) {
      return null;
    }
    if (typeof parsed.createdAt !== "string" || typeof parsed.agentId !== "string") {
      return null;
    }
    return parsed as HandoffSnapshotRecord;
  } catch {
    return null;
  }
}

async function hasFreshHandoffSnapshot(params: {
  workspaceDir: string;
  sessionId?: string;
  sessionKey?: string;
  sessionFile?: string;
  transcriptMtimeMs?: number;
  allowedSources: HandoffMemorySource[];
}): Promise<boolean> {
  let latestRaw: string;
  try {
    latestRaw = await fs.readFile(latestHandoffPath(params.workspaceDir), "utf8");
  } catch {
    return false;
  }

  const latestRecord = extractHandoffJsonBlock(latestRaw);
  if (!latestRecord || !params.allowedSources.includes(latestRecord.source)) {
    return false;
  }
  if (params.sessionId?.trim() && latestRecord.sessionId !== params.sessionId.trim()) {
    return false;
  }
  if (params.sessionKey?.trim() && latestRecord.sessionKey !== params.sessionKey.trim()) {
    return false;
  }
  if (!params.sessionFile) {
    return true;
  }

  const createdAtMs = Date.parse(latestRecord.createdAt);
  if (!Number.isFinite(createdAtMs)) {
    return false;
  }
  if (typeof params.transcriptMtimeMs === "number" && Number.isFinite(params.transcriptMtimeMs)) {
    return createdAtMs + HANDOFF_FRESHNESS_SKEW_MS >= params.transcriptMtimeMs;
  }
  try {
    const transcriptStat = await fs.stat(params.sessionFile);
    return createdAtMs + HANDOFF_FRESHNESS_SKEW_MS >= transcriptStat.mtimeMs;
  } catch {
    return true;
  }
}

function buildHandoffMarkdown(params: {
  record: HandoffSnapshotRecord;
  stableStateLines: string[];
  unresolvedQuestionLines: string[];
  evidencePointerLines: string[];
  nextRecommendedAction: string;
  riskNoteLines: string[];
}): string {
  return [
    "# Handoff Snapshot",
    "",
    "```json",
    JSON.stringify(params.record, null, 2),
    "```",
    "",
    "## Stable State",
    ...params.stableStateLines,
    "",
    "## Unresolved Questions",
    ...params.unresolvedQuestionLines,
    "",
    "## Key Evidence Pointers",
    ...params.evidencePointerLines,
    "",
    "## Next Recommended Action",
    `- ${params.nextRecommendedAction}`,
    "",
    "## Risks / Notes",
    ...params.riskNoteLines,
    "",
  ].join("\n");
}

async function writeHandoffMemory(params: {
  workspaceDir: string;
  agentId: string;
  sessionId?: string;
  sessionKey?: string;
  sessionFile?: string;
  trigger?: string;
  source: HandoffMemorySource;
  runStatus: HandoffRunStatus;
  messages: AgentMessage[];
  error?: string;
  durationMs?: number;
}): Promise<AgentEndHandoffMemoryWriteResult> {
  const createdAt = new Date().toISOString();
  const lastUserExcerpt = sanitizeMarkdownText(
    findLastMessageExcerpt(params.messages, "user") ?? undefined,
  );
  const lastAssistantExcerpt = sanitizeMarkdownText(
    findLastMessageExcerpt(params.messages, "assistant") ?? undefined,
  );
  const sanitizedError = sanitizeMarkdownText(params.error);
  const snapshotRelativePath = path.posix.join(
    "memory",
    "handoffs",
    createdAt.slice(0, 10),
    `${formatSnapshotStem(createdAt, params.sessionId)}.md`,
  );
  const latestRelativePath = "memory/handoff-latest.md" as const;
  const transcriptRelativePath = params.sessionFile
    ? normalizeRelativeWorkspacePath(params.workspaceDir, params.sessionFile)
    : null;
  const episodicJournalRelativePath = path.posix.join(
    "memory",
    "episodes",
    `${createdAt.slice(0, 10)}.md`,
  );

  const stableStateLines = buildStableStateLines({
    runStatus: params.runStatus,
    sessionKey: params.sessionKey?.trim() || undefined,
    trigger: params.trigger?.trim() || undefined,
    durationMs: params.durationMs,
    lastUserExcerpt: lastUserExcerpt ?? undefined,
    lastAssistantExcerpt: lastAssistantExcerpt ?? undefined,
    error: sanitizedError,
  });
  const unresolvedQuestionLines = buildUnresolvedQuestionLines({
    runStatus: params.runStatus,
    error: sanitizedError,
  });
  const evidencePointerLines = [
    `- Session transcript: ${transcriptRelativePath ?? "UNKNOWN"}`,
    `- Episodic journal: ${episodicJournalRelativePath}`,
    `- Immutable handoff snapshot: ${snapshotRelativePath}`,
  ];
  const nextRecommendedAction = buildNextRecommendedAction({
    runStatus: params.runStatus,
    lastUserExcerpt: lastUserExcerpt ?? undefined,
    error: sanitizedError,
  });
  const riskNoteLines = buildRiskNoteLines({
    transcriptRelativePath: transcriptRelativePath ?? undefined,
  });

  const baseRecord: HandoffSnapshotRecord = {
    schema: HANDOFF_MEMORY_SCHEMA,
    compartment: HANDOFF_MEMORY_COMPARTMENT,
    createdAt,
    agentId: params.agentId,
    ...(params.sessionId?.trim() ? { sessionId: params.sessionId.trim() } : {}),
    ...(params.sessionKey?.trim() ? { sessionKey: params.sessionKey.trim() } : {}),
    ...(params.trigger?.trim() ? { trigger: params.trigger.trim() } : {}),
    source: params.source,
    runStatus: params.runStatus,
    trustState: DEFAULT_TRUST_STATE,
    scope: DEFAULT_SCOPE,
    promotable: false,
    ...(typeof params.durationMs === "number" ? { durationMs: params.durationMs } : {}),
    ...(sanitizedError ? { error: sanitizedError } : {}),
    messageCount: params.messages.length,
    summary: buildSummary({
      source: params.source,
      runStatus: params.runStatus,
      messageCount: params.messages.length,
    }),
  };

  const snapshotMarkdown = buildHandoffMarkdown({
    record: baseRecord,
    stableStateLines,
    unresolvedQuestionLines,
    evidencePointerLines,
    nextRecommendedAction,
    riskNoteLines,
  });
  const latestMarkdown = buildHandoffMarkdown({
    record: {
      ...baseRecord,
      sourceSnapshot: snapshotRelativePath,
    },
    stableStateLines,
    unresolvedQuestionLines,
    evidencePointerLines,
    nextRecommendedAction,
    riskNoteLines,
  });

  try {
    await fs.mkdir(params.workspaceDir, { recursive: true });
    await writeFileWithinRoot({
      rootDir: params.workspaceDir,
      relativePath: snapshotRelativePath,
      data: snapshotMarkdown,
      encoding: "utf-8",
      mkdir: true,
    });
    await writeFileWithinRoot({
      rootDir: params.workspaceDir,
      relativePath: latestRelativePath,
      data: latestMarkdown,
      encoding: "utf-8",
      mkdir: true,
    });
  } catch (err) {
    log.warn("Failed to persist handoff memory snapshot", {
      errorMessage: err instanceof Error ? err.message : String(err),
      agentId: params.agentId,
      sessionKey: params.sessionKey,
    });
    throw err;
  }

  return {
    latestRelativePath,
    snapshotRelativePath,
  };
}

export async function writeAgentEndHandoffMemory(
  params: AgentEndHandoffMemoryParams,
): Promise<AgentEndHandoffMemoryWriteResult> {
  return await writeHandoffMemory({
    workspaceDir: params.workspaceDir,
    agentId: params.agentId,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    sessionFile: params.sessionFile,
    trigger: params.trigger,
    source: "agent_end",
    runStatus: params.success ? "ok" : "error",
    messages: params.messages,
    error: params.error,
    durationMs: params.durationMs,
  });
}

export async function backfillBeforeResetHandoffMemory(
  params: BeforeResetHandoffMemoryParams,
): Promise<BeforeResetHandoffMemoryWriteResult> {
  if (
    await hasFreshHandoffSnapshot({
      workspaceDir: params.workspaceDir,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      sessionFile: params.sessionFile,
      allowedSources: ["agent_end"],
    })
  ) {
    return {
      status: "skipped",
      reason: "fresh-agent-end-snapshot",
    };
  }

  const writeResult = await writeHandoffMemory({
    workspaceDir: params.workspaceDir,
    agentId: params.agentId,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    sessionFile: params.sessionFile,
    trigger: `before_reset:${params.action}`,
    source: "before_reset",
    runStatus: "unknown",
    messages: params.messages,
  });
  return {
    status: "written",
    ...writeResult,
  };
}

export async function backfillSessionEndHandoffMemory(
  params: SessionEndHandoffMemoryParams,
): Promise<SessionEndHandoffMemoryWriteResult> {
  if (
    await hasFreshHandoffSnapshot({
      workspaceDir: params.workspaceDir,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      sessionFile: params.sessionFile,
      transcriptMtimeMs: params.transcriptMtimeMs,
      allowedSources: ["agent_end", "before_reset"],
    })
  ) {
    return {
      status: "skipped",
      reason: "fresh-agent-end-or-before-reset-snapshot",
    };
  }

  const writeResult = await writeHandoffMemory({
    workspaceDir: params.workspaceDir,
    agentId: params.agentId,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    sessionFile: params.sessionFile,
    trigger: "session_end",
    source: "session_end",
    runStatus: "unknown",
    messages: params.messages,
  });
  return {
    status: "written",
    ...writeResult,
  };
}
