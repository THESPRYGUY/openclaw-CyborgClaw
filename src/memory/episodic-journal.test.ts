import fs from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { emitResetCommandHooks } from "../auto-reply/reply/commands-core.js";
import {
  clearConfigCache,
  clearRuntimeConfigSnapshot,
  type OpenClawConfig,
} from "../config/config.js";
import { clearInternalHooks } from "../hooks/internal-hooks.js";
import { resetGlobalHookRunner } from "../plugins/hook-runner-global.js";
import { emitSessionTranscriptUpdate } from "../sessions/transcript-events.js";
import { createTempHomeEnv, type TempHomeEnv } from "../test-utils/temp-home.js";
import {
  appendCompactionCheckpointToEpisodicJournal,
  appendSessionPatchToEpisodicJournal,
  flushEpisodicJournalWritesForTests,
} from "./episodic-journal.js";

vi.mock("@mariozechner/pi-ai/oauth", () => ({
  getOAuthApiKey: vi.fn(),
  getOAuthProviders: () => [],
}));

function extractJsonRecords(raw: string): Array<Record<string, unknown>> {
  return Array.from(raw.matchAll(/```json\n([\s\S]*?)\n```/g)).map((match) =>
    JSON.parse(match[1] ?? "{}"),
  );
}

describe("episodic journal", () => {
  let tempHome: TempHomeEnv | null = null;

  afterEach(async () => {
    clearInternalHooks();
    resetGlobalHookRunner();
    clearRuntimeConfigSnapshot();
    clearConfigCache();
    vi.useRealTimers();
    if (tempHome) {
      await tempHome.restore();
      tempHome = null;
    }
  });

  it("appends transcript and reset checkpoint episodes into the agent workspace", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-27T12:00:00.000Z"));

    tempHome = await createTempHomeEnv("openclaw-episodic-journal-");
    clearRuntimeConfigSnapshot();
    clearConfigCache();

    const workspaceDir = path.join(tempHome.home, ".openclaw", "workspace-voltaris-v2");
    await fs.mkdir(workspaceDir, { recursive: true });

    emitSessionTranscriptUpdate({
      sessionFile: path.join(
        tempHome.home,
        ".openclaw",
        "agents",
        "voltaris-v2",
        "sessions",
        "session-1.jsonl",
      ),
      sessionKey: "agent:voltaris-v2:session:test-journal",
      messageId: "message-1",
      message: {
        role: "assistant",
        timestamp: Date.parse("2026-03-27T12:00:00.000Z"),
        content: [{ type: "text", text: "Drafted the Memory HQ roadmap." }],
      },
    });
    await flushEpisodicJournalWritesForTests();

    await emitResetCommandHooks({
      action: "reset",
      ctx: {} as Parameters<typeof emitResetCommandHooks>[0]["ctx"],
      cfg: {} as OpenClawConfig,
      command: {
        surface: "test",
        senderId: "operator",
        channel: "webchat",
        from: "operator",
        to: "voltaris-v2",
        resetHookTriggered: false,
      },
      sessionKey: "agent:voltaris-v2:session:test-journal",
      previousSessionEntry: {
        sessionId: "session-1",
      },
      workspaceDir,
    });
    await vi.waitFor(async () => {
      await fs.access(path.join(workspaceDir, "memory", "handoff-latest.md"));
    });

    const journalPath = path.join(workspaceDir, "memory", "episodes", "2026-03-27.md");
    const raw = await fs.readFile(journalPath, "utf-8");
    const records = extractJsonRecords(raw);

    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({
      eventType: "transcript.message",
      agentId: "voltaris-v2",
      sessionKey: "agent:voltaris-v2:session:test-journal",
      provenance: {
        source: "session-transcript-update",
        messageId: "message-1",
      },
      excerpt: "Drafted the Memory HQ roadmap.",
    });
    expect(records[1]).toMatchObject({
      eventType: "reset.checkpoint",
      agentId: "voltaris-v2",
      sessionId: "session-1",
      sessionKey: "agent:voltaris-v2:session:test-journal",
      provenance: {
        source: "command-reset-hook",
        action: "reset",
        commandSource: "test",
      },
    });
  });

  it("records session patch and compaction checkpoints in the private episodic journal", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-27T13:00:00.000Z"));

    tempHome = await createTempHomeEnv("openclaw-episodic-journal-");
    clearRuntimeConfigSnapshot();
    clearConfigCache();

    const workspaceDir = path.join(tempHome.home, ".openclaw", "workspace-voltaris-v2");
    await fs.mkdir(workspaceDir, { recursive: true });

    await appendSessionPatchToEpisodicJournal({
      sessionKey: "agent:voltaris-v2:session:patch-test",
      sessionId: "session-2",
      patch: { label: "updated-label" },
    });
    await appendCompactionCheckpointToEpisodicJournal({
      eventType: "compaction.before",
      agentId: "voltaris-v2",
      sessionId: "session-2",
      sessionKey: "agent:voltaris-v2:session:patch-test",
      workspaceDir,
      metrics: { messageCount: 4 },
    });
    await appendCompactionCheckpointToEpisodicJournal({
      eventType: "compaction.after",
      agentId: "voltaris-v2",
      sessionId: "session-2",
      sessionKey: "agent:voltaris-v2:session:patch-test",
      workspaceDir,
      metrics: { compactedCount: 2, messageCount: 2 },
    });

    const journalPath = path.join(workspaceDir, "memory", "episodes", "2026-03-27.md");
    const raw = await fs.readFile(journalPath, "utf-8");
    const records = extractJsonRecords(raw);

    expect(records).toHaveLength(3);
    expect(records[0]).toMatchObject({
      eventType: "session.patch",
      summary: "Session patch applied | fields=label",
    });
    expect(records[1]).toMatchObject({
      eventType: "compaction.before",
      provenance: { source: "session-compaction" },
    });
    expect(records[2]).toMatchObject({
      eventType: "compaction.after",
      provenance: { source: "session-compaction" },
    });
  });
});
