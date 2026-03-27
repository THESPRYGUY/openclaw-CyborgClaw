import fs from "node:fs/promises";
import path from "node:path";
import type { AgentMessage } from "@mariozechner/pi-agent-core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";
import type { SessionEntry } from "../../config/sessions.js";
import { writeAgentEndHandoffMemory } from "../../memory/handoff-memory.js";
import type { HookRunner } from "../../plugins/hooks.js";
import { createTempHomeEnv, type TempHomeEnv } from "../../test-utils/temp-home.js";
import type { HandleCommandsParams } from "./commands-types.js";

vi.mock("@mariozechner/pi-ai/oauth", () => ({
  getOAuthApiKey: vi.fn(),
  getOAuthProviders: () => [],
}));

const hookRunnerMocks = vi.hoisted(() => ({
  hasHooks: vi.fn<HookRunner["hasHooks"]>(),
  runBeforeReset: vi.fn<HookRunner["runBeforeReset"]>(),
  runSessionStart: vi.fn<HookRunner["runSessionStart"]>(),
  runSessionEnd: vi.fn<HookRunner["runSessionEnd"]>(),
}));

let initSessionState: typeof import("./session.js").initSessionState;
let emitResetCommandHooks: typeof import("./commands-core.js").emitResetCommandHooks;

async function writeStore(
  storePath: string,
  store: Record<string, SessionEntry | Record<string, unknown>>,
): Promise<void> {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(store), "utf-8");
}

function extractJsonBlock(raw: string): Record<string, unknown> {
  const match = raw.match(/```json\n([\s\S]*?)\n```/);
  expect(match?.[1]).toBeTruthy();
  return JSON.parse(match?.[1] ?? "{}");
}

async function readLatestHandoffRecord(workspaceDir: string): Promise<Record<string, unknown>> {
  const latestPath = path.join(workspaceDir, "memory", "handoff-latest.md");
  return extractJsonBlock(await fs.readFile(latestPath, "utf8"));
}

async function countHandoffSnapshots(workspaceDir: string): Promise<number> {
  const handoffRoot = path.join(workspaceDir, "memory", "handoffs");
  try {
    const dates = await fs.readdir(handoffRoot);
    let total = 0;
    for (const date of dates) {
      const entries = await fs.readdir(path.join(handoffRoot, date));
      total += entries.length;
    }
    return total;
  } catch {
    return 0;
  }
}

async function writeSessionTranscript(
  sessionFile: string,
  messages: AgentMessage[],
): Promise<void> {
  const lines = messages.map((message) =>
    JSON.stringify({
      type: "message",
      message,
    }),
  );
  await fs.mkdir(path.dirname(sessionFile), { recursive: true });
  await fs.writeFile(sessionFile, `${lines.join("\n")}\n`, "utf8");
}

describe("session hook context wiring", () => {
  let tempHome: TempHomeEnv | null = null;

  beforeEach(async () => {
    vi.resetModules();
    vi.doMock("../../plugins/hook-runner-global.js", () => ({
      getGlobalHookRunner: () =>
        ({
          hasHooks: hookRunnerMocks.hasHooks,
          runBeforeReset: hookRunnerMocks.runBeforeReset,
          runSessionStart: hookRunnerMocks.runSessionStart,
          runSessionEnd: hookRunnerMocks.runSessionEnd,
        }) as unknown as HookRunner,
    }));
    hookRunnerMocks.hasHooks.mockReset();
    hookRunnerMocks.runBeforeReset.mockReset();
    hookRunnerMocks.runSessionStart.mockReset();
    hookRunnerMocks.runSessionEnd.mockReset();
    hookRunnerMocks.runBeforeReset.mockResolvedValue(undefined);
    hookRunnerMocks.runSessionStart.mockResolvedValue(undefined);
    hookRunnerMocks.runSessionEnd.mockResolvedValue(undefined);
    hookRunnerMocks.hasHooks.mockImplementation(
      (hookName) =>
        hookName === "before_reset" || hookName === "session_start" || hookName === "session_end",
    );
    ({ initSessionState } = await import("./session.js"));
    ({ emitResetCommandHooks } = await import("./commands-core.js"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  afterEach(async () => {
    if (tempHome) {
      await tempHome.restore();
      tempHome = null;
    }
  });

  it("does not create a session_end fallback when a fresh agent_end handoff already exists", async () => {
    tempHome = await createTempHomeEnv("openclaw-session-hook-end-handoff-");
    const sessionKey = "agent:main:telegram:direct:123";
    const workspaceDir = path.join(tempHome.home, ".openclaw", "workspace");
    const sessionsDir = path.join(tempHome.home, ".openclaw", "sessions");
    const sessionFile = path.join(sessionsDir, "old-session.jsonl");
    await fs.mkdir(sessionsDir, { recursive: true });
    await fs.writeFile(
      sessionFile,
      `${JSON.stringify({
        type: "message",
        message: { role: "assistant", content: "Fresh agent_end state.", timestamp: Date.now() },
      })}\n`,
      "utf-8",
    );

    await writeAgentEndHandoffMemory({
      workspaceDir,
      agentId: "main",
      sessionId: "old-session",
      sessionKey,
      sessionFile,
      messages: [
        {
          role: "assistant",
          content: "Fresh agent_end state.",
          timestamp: Date.now(),
        } as AgentMessage,
      ],
      success: true,
    });

    const storePath = path.join(tempHome.home, ".openclaw", "sessions.json");
    await writeStore(storePath, {
      [sessionKey]: {
        sessionId: "old-session",
        sessionFile,
        updatedAt: Date.now(),
      },
    });
    const cfg = { session: { store: storePath } } as OpenClawConfig;

    await initSessionState({
      ctx: { Body: "/new", SessionKey: sessionKey },
      cfg,
      commandAuthorized: true,
    });

    await vi.waitFor(() => expect(hookRunnerMocks.runSessionEnd).toHaveBeenCalledTimes(1));
    expect(await readLatestHandoffRecord(workspaceDir)).toMatchObject({
      source: "agent_end",
      sessionId: "old-session",
      sessionKey,
    });
  });

  it("creates a session_end fallback when no fresh agent_end or before_reset handoff exists, even without session_end hooks", async () => {
    hookRunnerMocks.hasHooks.mockImplementation((hookName) => hookName === "session_start");

    tempHome = await createTempHomeEnv("openclaw-session-hook-end-fallback-");
    const sessionKey = "agent:main:telegram:direct:123";
    const workspaceDir = path.join(tempHome.home, ".openclaw", "workspace");
    const sessionsDir = path.join(tempHome.home, ".openclaw", "sessions");
    const sessionFile = path.join(sessionsDir, "old-session.jsonl");
    await fs.mkdir(sessionsDir, { recursive: true });
    await fs.writeFile(
      sessionFile,
      [
        JSON.stringify({
          type: "message",
          message: {
            role: "user",
            content: "Capture the old session state.",
            timestamp: Date.now() - 1000,
          },
        }),
        JSON.stringify({
          type: "message",
          message: {
            role: "assistant",
            content: "No prior handoff has been recorded yet.",
            timestamp: Date.now(),
          },
        }),
      ].join("\n") + "\n",
      "utf-8",
    );

    const storePath = path.join(tempHome.home, ".openclaw", "sessions.json");
    await writeStore(storePath, {
      [sessionKey]: {
        sessionId: "old-session",
        sessionFile,
        updatedAt: Date.now(),
      },
    });
    const cfg = { session: { store: storePath } } as OpenClawConfig;

    await initSessionState({
      ctx: { Body: "/new", SessionKey: sessionKey },
      cfg,
      commandAuthorized: true,
    });

    await vi.waitFor(async () => {
      expect(await readLatestHandoffRecord(workspaceDir)).toMatchObject({
        source: "session_end",
        runStatus: "unknown",
        trigger: "session_end",
        sessionId: "old-session",
        sessionKey,
      });
    });
    expect(hookRunnerMocks.runSessionEnd).not.toHaveBeenCalled();
  });

  it("preserves the freshest valid handoff source across emitResetCommandHooks and initSessionState", async () => {
    vi.useFakeTimers();
    tempHome = await createTempHomeEnv("openclaw-session-hook-lifecycle-");

    const baseTime = new Date("2026-03-27T19:00:00.000Z");
    vi.setSystemTime(baseTime);

    const sessionId = "old-session";
    const sessionKey = "agent:voltaris-v2:session:handoff-trigger-lifecycle";
    const workspaceDir = path.join(tempHome.home, ".openclaw", "workspace-voltaris-v2");
    const sessionsDir = path.join(tempHome.home, ".openclaw", "sessions");
    const sessionFile = path.join(sessionsDir, `${sessionId}.jsonl`);
    const storePath = path.join(tempHome.home, ".openclaw", "sessions.json");
    const cfg = { session: { store: storePath } } as OpenClawConfig;
    const resetCommand = {
      surface: "test",
      senderId: "operator",
      channel: "webchat",
      from: "operator",
      to: "voltaris-v2",
      resetHookTriggered: false,
    } as HandleCommandsParams["command"];

    const initialMessages = [
      {
        role: "user",
        content: "Capture the initial trigger-level handoff.",
        timestamp: Date.now() - 1000,
      } as AgentMessage,
      {
        role: "assistant",
        content: "Initial agent_end handoff is complete.",
        timestamp: Date.now(),
      } as AgentMessage,
    ];
    await writeSessionTranscript(sessionFile, initialMessages);
    await fs.utimes(sessionFile, baseTime, baseTime);
    await writeAgentEndHandoffMemory({
      workspaceDir,
      agentId: "voltaris-v2",
      sessionId,
      sessionKey,
      sessionFile,
      trigger: "manual",
      messages: initialMessages,
      success: true,
    });
    await writeStore(storePath, {
      [sessionKey]: {
        sessionId,
        sessionFile,
        updatedAt: Date.now(),
      },
    });

    expect(await readLatestHandoffRecord(workspaceDir)).toMatchObject({
      source: "agent_end",
      runStatus: "ok",
      sessionId,
      sessionKey,
    });
    expect(await countHandoffSnapshots(workspaceDir)).toBe(1);

    vi.setSystemTime(new Date(baseTime.getTime() + 2_000));
    await emitResetCommandHooks({
      action: "reset",
      ctx: {} as HandleCommandsParams["ctx"],
      cfg: {} as HandleCommandsParams["cfg"],
      command: { ...resetCommand },
      sessionKey,
      previousSessionEntry: {
        sessionId,
        sessionFile,
      } as HandleCommandsParams["previousSessionEntry"],
      workspaceDir,
    });

    await vi.waitFor(() => expect(hookRunnerMocks.runBeforeReset).toHaveBeenCalledTimes(1));
    expect(await readLatestHandoffRecord(workspaceDir)).toMatchObject({
      source: "agent_end",
      runStatus: "ok",
      sessionId,
      sessionKey,
    });
    expect(await countHandoffSnapshots(workspaceDir)).toBe(1);

    vi.setSystemTime(new Date(baseTime.getTime() + 4_000));
    const beforeResetMessages = [
      ...initialMessages,
      {
        role: "assistant",
        content: "The transcript advanced after the agent_end handoff.",
        timestamp: Date.now(),
      } as AgentMessage,
    ];
    await writeSessionTranscript(sessionFile, beforeResetMessages);
    const beforeResetTranscriptTime = new Date(Date.now() + 60_000);
    await fs.utimes(sessionFile, beforeResetTranscriptTime, beforeResetTranscriptTime);

    await emitResetCommandHooks({
      action: "reset",
      ctx: {} as HandleCommandsParams["ctx"],
      cfg: {} as HandleCommandsParams["cfg"],
      command: { ...resetCommand },
      sessionKey,
      previousSessionEntry: {
        sessionId,
        sessionFile,
      } as HandleCommandsParams["previousSessionEntry"],
      workspaceDir,
    });

    await vi.waitFor(() => expect(hookRunnerMocks.runBeforeReset).toHaveBeenCalledTimes(2));
    expect(await readLatestHandoffRecord(workspaceDir)).toMatchObject({
      source: "before_reset",
      runStatus: "unknown",
      trigger: "before_reset:reset",
      sessionId,
      sessionKey,
    });
    expect(await countHandoffSnapshots(workspaceDir)).toBe(2);

    vi.setSystemTime(new Date(baseTime.getTime() + 6_000));
    const sessionEndMessages = [
      ...beforeResetMessages,
      {
        role: "assistant",
        content: "The session is rotating after the pre-reset handoff.",
        timestamp: Date.now(),
      } as AgentMessage,
    ];
    await writeSessionTranscript(sessionFile, sessionEndMessages);
    const rolloverTranscriptTime = new Date(Date.now() + 120_000);
    await fs.utimes(sessionFile, rolloverTranscriptTime, rolloverTranscriptTime);
    await writeStore(storePath, {
      [sessionKey]: {
        sessionId,
        sessionFile,
        updatedAt: Date.now(),
      },
    });

    await initSessionState({
      ctx: { Body: "/new", SessionKey: sessionKey },
      cfg,
      commandAuthorized: true,
    });

    await vi.waitFor(() => expect(hookRunnerMocks.runSessionEnd).toHaveBeenCalledTimes(1));
    await expect(fs.access(sessionFile)).rejects.toThrow();
    expect(await readLatestHandoffRecord(workspaceDir)).toMatchObject({
      source: "session_end",
      runStatus: "unknown",
      trigger: "session_end",
      sessionId,
      sessionKey,
    });
    expect(await countHandoffSnapshots(workspaceDir)).toBe(3);
  });
});
