import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { resolveAgentWorkspaceDir } from "../agents/agent-scope.js";
import { loadConfig } from "../config/config.js";
import { resolveStateDir } from "../config/paths.js";
import { writeFileWithinRoot } from "../infra/fs-safe.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import {
  DEFAULT_AGENT_ID,
  normalizeAgentId,
  resolveAgentIdFromSessionKey,
} from "../routing/session-key.js";
import type { SessionTranscriptUpdate } from "../sessions/transcript-events.js";
import { countToolResults, extractToolCallNames } from "../utils/transcript-tools.js";
import { extractSessionText } from "./session-files.js";

const log = createSubsystemLogger("memory/episodic-journal");
const EPISODIC_JOURNAL_SCHEMA = "openclaw.episodic-journal.v1";
const EPISODIC_JOURNAL_COMPARTMENT = "episodic_journal";
const DEFAULT_SCOPE = "agent-private";
const DEFAULT_TRUST_STATE = "observed-runtime";
const pendingWrites = new Set<Promise<void>>();

type EpisodicJournalEventType = "transcript.message" | "reset.checkpoint";
type EpisodicJournalLifecycleEventType =
  | EpisodicJournalEventType
  | "session.patch"
  | "compaction.before"
  | "compaction.after";

type EpisodicJournalRecord = {
  schema: typeof EPISODIC_JOURNAL_SCHEMA;
  compartment: typeof EPISODIC_JOURNAL_COMPARTMENT;
  eventId: string;
  eventType: EpisodicJournalLifecycleEventType;
  timestamp: string;
  agentId: string;
  sessionKey?: string;
  sessionId?: string;
  summary: string;
  scope: typeof DEFAULT_SCOPE;
  trustState: typeof DEFAULT_TRUST_STATE;
  promotable: boolean;
  provenance: {
    source: string;
    messageId?: string;
    commandSource?: string;
    action?: "new" | "reset";
  };
  role?: string;
  excerpt?: string;
  toolCalls?: string[];
  toolResults?: {
    total: number;
    errors: number;
  };
};

function fallbackWorkspaceDir(agentId: string): string {
  const normalized = normalizeAgentId(agentId || DEFAULT_AGENT_ID);
  const stateDir = resolveStateDir(process.env, os.homedir);
  if (normalized === DEFAULT_AGENT_ID) {
    return path.join(stateDir, "workspace");
  }
  return path.join(stateDir, `workspace-${normalized}`);
}

function tryResolveWorkspaceDir(agentId: string): string {
  try {
    return resolveAgentWorkspaceDir(loadConfig(), agentId);
  } catch {
    return fallbackWorkspaceDir(agentId);
  }
}

function extractAgentIdFromSessionFilePath(sessionFile: string): string | null {
  const normalized = path.normalize(path.resolve(sessionFile));
  const parts = normalized.split(path.sep).filter(Boolean);
  const sessionsIndex = parts.lastIndexOf("sessions");
  if (sessionsIndex < 2 || parts[sessionsIndex - 2] !== "agents") {
    return null;
  }
  const agentId = parts[sessionsIndex - 1];
  return agentId ? normalizeAgentId(agentId) : null;
}

function resolveAgentIdForTranscriptUpdate(update: SessionTranscriptUpdate): string | null {
  if (update.sessionKey?.trim()) {
    return resolveAgentIdFromSessionKey(update.sessionKey);
  }
  return extractAgentIdFromSessionFilePath(update.sessionFile);
}

function truncateExcerpt(value: string, max = 240): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max - 1).trimEnd()}...`;
}

function resolveEventTimestamp(timestampLike: unknown): string {
  if (typeof timestampLike === "number" && Number.isFinite(timestampLike) && timestampLike > 0) {
    return new Date(timestampLike).toISOString();
  }
  if (typeof timestampLike === "string" && timestampLike.trim()) {
    const parsed = new Date(timestampLike);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }
  return new Date().toISOString();
}

function buildJournalEntry(record: EpisodicJournalRecord): string {
  return [
    `## Episode ${record.timestamp} ${record.eventType}`,
    "",
    "```json",
    JSON.stringify(record, null, 2),
    "```",
    "",
  ].join("\n");
}

function resolvePatchKeys(patch: Record<string, unknown>): string[] {
  return Object.entries(patch)
    .filter(([, value]) => value !== undefined)
    .map(([key]) => key)
    .toSorted((left, right) => left.localeCompare(right));
}

async function appendStructuredRecord(params: {
  workspaceDir: string;
  record: EpisodicJournalRecord;
}): Promise<void> {
  const date = params.record.timestamp.slice(0, 10);
  const relativePath = path.join("memory", "episodes", `${date}.md`);
  const entry = buildJournalEntry(params.record);
  const filePath = path.join(params.workspaceDir, relativePath);
  await fs.mkdir(params.workspaceDir, { recursive: true });
  let payload = entry;
  try {
    const existing = await fs.readFile(filePath, "utf-8");
    payload = existing.trimEnd() ? `${existing.trimEnd()}\n\n${entry}` : entry;
  } catch {
    payload = [`# Episodic Journal: ${date}`, "", entry].join("\n");
  }
  await writeFileWithinRoot({
    rootDir: params.workspaceDir,
    relativePath,
    data: payload,
    encoding: "utf-8",
    mkdir: true,
  });
}

function trackWrite(promise: Promise<void>): void {
  pendingWrites.add(promise);
  void promise.finally(() => {
    pendingWrites.delete(promise);
  });
}

export async function flushEpisodicJournalWritesForTests(): Promise<void> {
  while (pendingWrites.size > 0) {
    await Promise.allSettled(Array.from(pendingWrites));
  }
}

function buildTranscriptRecord(update: SessionTranscriptUpdate): EpisodicJournalRecord | null {
  const message =
    update.message && typeof update.message === "object"
      ? (update.message as Record<string, unknown>)
      : null;
  if (!message) {
    return null;
  }
  const role = typeof message.role === "string" ? message.role.trim().toLowerCase() : "";
  if (!role) {
    return null;
  }

  const excerpt = extractSessionText(message.content);
  const toolCalls = extractToolCallNames(message);
  const toolResults = countToolResults(message);
  if (!excerpt && toolCalls.length === 0 && toolResults.total === 0) {
    return null;
  }

  const normalizedAgentId = resolveAgentIdForTranscriptUpdate(update);
  if (!normalizedAgentId) {
    return null;
  }

  const summaryParts: string[] = [];
  if (role === "assistant") {
    summaryParts.push("Assistant message appended");
  } else if (toolResults.total > 0) {
    summaryParts.push("Tool result recorded");
  } else {
    summaryParts.push("User message appended");
  }
  if (toolCalls.length > 0) {
    summaryParts.push(`tools=${toolCalls.join(",")}`);
  }
  if (toolResults.total > 0) {
    summaryParts.push(`toolResults=${toolResults.total}`);
    if (toolResults.errors > 0) {
      summaryParts.push(`toolErrors=${toolResults.errors}`);
    }
  }

  return {
    schema: EPISODIC_JOURNAL_SCHEMA,
    compartment: EPISODIC_JOURNAL_COMPARTMENT,
    eventId: update.messageId?.trim()
      ? `transcript:${update.messageId.trim()}`
      : crypto.randomUUID(),
    eventType: "transcript.message",
    timestamp: resolveEventTimestamp(message.timestamp),
    agentId: normalizedAgentId,
    sessionKey: update.sessionKey?.trim() || undefined,
    summary: summaryParts.join(" | "),
    scope: DEFAULT_SCOPE,
    trustState: DEFAULT_TRUST_STATE,
    promotable: false,
    provenance: {
      source: "session-transcript-update",
      ...(update.messageId?.trim() ? { messageId: update.messageId.trim() } : {}),
    },
    ...(role ? { role } : {}),
    ...(excerpt ? { excerpt: truncateExcerpt(excerpt) } : {}),
    ...(toolCalls.length > 0 ? { toolCalls } : {}),
    ...(toolResults.total > 0 ? { toolResults } : {}),
  };
}

export function recordTranscriptUpdateInEpisodicJournal(update: SessionTranscriptUpdate): void {
  const record = buildTranscriptRecord(update);
  if (!record) {
    return;
  }
  const workspaceDir = tryResolveWorkspaceDir(record.agentId);
  const write = appendStructuredRecord({ workspaceDir, record }).catch((err) => {
    log.warn("Failed to append transcript update to episodic journal", {
      errorMessage: err instanceof Error ? err.message : String(err),
      agentId: record.agentId,
      sessionKey: record.sessionKey,
    });
  });
  trackWrite(write);
}

export async function appendResetCheckpointToEpisodicJournal(params: {
  action: "new" | "reset";
  workspaceDir: string;
  sessionKey?: string;
  sessionId?: string;
  commandSource?: string;
}): Promise<void> {
  const agentId = params.sessionKey?.trim()
    ? resolveAgentIdFromSessionKey(params.sessionKey)
    : DEFAULT_AGENT_ID;
  const timestamp = new Date().toISOString();
  const record: EpisodicJournalRecord = {
    schema: EPISODIC_JOURNAL_SCHEMA,
    compartment: EPISODIC_JOURNAL_COMPARTMENT,
    eventId: crypto.randomUUID(),
    eventType: "reset.checkpoint",
    timestamp,
    agentId,
    ...(params.sessionKey?.trim() ? { sessionKey: params.sessionKey.trim() } : {}),
    ...(params.sessionId?.trim() ? { sessionId: params.sessionId.trim() } : {}),
    summary: `Session ${params.action} checkpoint captured before transcript rotation`,
    scope: DEFAULT_SCOPE,
    trustState: DEFAULT_TRUST_STATE,
    promotable: false,
    provenance: {
      source: "command-reset-hook",
      action: params.action,
      ...(params.commandSource?.trim() ? { commandSource: params.commandSource.trim() } : {}),
    },
  };
  await appendStructuredRecord({ workspaceDir: params.workspaceDir, record });
}

export async function appendSessionPatchToEpisodicJournal(params: {
  sessionKey: string;
  sessionId?: string;
  patch: Record<string, unknown>;
}): Promise<void> {
  const agentId = resolveAgentIdFromSessionKey(params.sessionKey);
  const workspaceDir = tryResolveWorkspaceDir(agentId);
  const patchKeys = resolvePatchKeys(params.patch);
  const summary =
    patchKeys.length > 0
      ? `Session patch applied | fields=${patchKeys.join(",")}`
      : "Session patch applied";
  const record: EpisodicJournalRecord = {
    schema: EPISODIC_JOURNAL_SCHEMA,
    compartment: EPISODIC_JOURNAL_COMPARTMENT,
    eventId: crypto.randomUUID(),
    eventType: "session.patch",
    timestamp: new Date().toISOString(),
    agentId,
    sessionKey: params.sessionKey.trim(),
    ...(params.sessionId?.trim() ? { sessionId: params.sessionId.trim() } : {}),
    summary,
    scope: DEFAULT_SCOPE,
    trustState: DEFAULT_TRUST_STATE,
    promotable: false,
    provenance: {
      source: "sessions.patch",
    },
    ...(patchKeys.length > 0 ? { excerpt: JSON.stringify(params.patch) } : {}),
  };
  await appendStructuredRecord({ workspaceDir, record });
}

export async function appendCompactionCheckpointToEpisodicJournal(params: {
  eventType: "compaction.before" | "compaction.after";
  agentId: string;
  sessionId: string;
  sessionKey: string;
  workspaceDir: string;
  metrics: Record<string, unknown>;
}): Promise<void> {
  const summaryParts =
    params.eventType === "compaction.before"
      ? [
          "Compaction checkpoint before rewrite",
          typeof params.metrics.messageCount === "number"
            ? `messages=${params.metrics.messageCount}`
            : null,
          typeof params.metrics.tokenCount === "number"
            ? `tokens=${params.metrics.tokenCount}`
            : null,
        ]
      : [
          "Compaction checkpoint after rewrite",
          typeof params.metrics.compactedCount === "number"
            ? `compacted=${params.metrics.compactedCount}`
            : null,
          typeof params.metrics.messageCount === "number"
            ? `messages=${params.metrics.messageCount}`
            : null,
        ];
  const record: EpisodicJournalRecord = {
    schema: EPISODIC_JOURNAL_SCHEMA,
    compartment: EPISODIC_JOURNAL_COMPARTMENT,
    eventId: crypto.randomUUID(),
    eventType: params.eventType,
    timestamp: new Date().toISOString(),
    agentId: normalizeAgentId(params.agentId),
    sessionId: params.sessionId.trim(),
    sessionKey: params.sessionKey.trim(),
    summary: summaryParts.filter(Boolean).join(" | "),
    scope: DEFAULT_SCOPE,
    trustState: DEFAULT_TRUST_STATE,
    promotable: false,
    provenance: {
      source: "session-compaction",
    },
    excerpt: JSON.stringify(params.metrics),
  };
  await appendStructuredRecord({ workspaceDir: params.workspaceDir, record });
}
