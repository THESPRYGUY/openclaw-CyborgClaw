import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { AgentMessage } from "@mariozechner/pi-agent-core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { HookRunner } from "../../plugins/hooks.js";
import type { HandleCommandsParams } from "./commands-types.js";

vi.mock("@mariozechner/pi-ai/oauth", () => ({
  getOAuthApiKey: vi.fn(),
  getOAuthProviders: () => [],
}));

const hookRunnerMocks = vi.hoisted(() => ({
  hasHooks: vi.fn<HookRunner["hasHooks"]>(),
  runBeforeReset: vi.fn<HookRunner["runBeforeReset"]>(),
}));

vi.mock("../../plugins/hook-runner-global.js", () => ({
  getGlobalHookRunner: () =>
    ({
      hasHooks: hookRunnerMocks.hasHooks,
      runBeforeReset: hookRunnerMocks.runBeforeReset,
    }) as unknown as HookRunner,
}));

const { emitResetCommandHooks } = await import("./commands-core.js");
const { writeAgentEndHandoffMemory } = await import("../../memory/handoff-memory.js");

function extractJsonBlock(raw: string): Record<string, unknown> {
  const match = raw.match(/```json\n([\s\S]*?)\n```/);
  expect(match?.[1]).toBeTruthy();
  return JSON.parse(match?.[1] ?? "{}");
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

describe("emitResetCommandHooks", () => {
  const tempPaths: string[] = [];

  async function createResetWorkspace(): Promise<{
    workspaceDir: string;
    sessionFile: string;
  }> {
    const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-reset-handoff-"));
    const sessionsDir = path.join(workspaceDir, "sessions");
    await fs.mkdir(sessionsDir, { recursive: true });
    const sessionFile = path.join(sessionsDir, "prev-session.jsonl");
    tempPaths.push(workspaceDir);
    return { workspaceDir, sessionFile };
  }

  async function writeSessionTranscript(
    sessionFile: string,
    messages: Array<{ role: "user" | "assistant"; content: string }>,
  ): Promise<void> {
    const lines = messages.map((message) =>
      JSON.stringify({
        type: "message",
        message: {
          role: message.role,
          content: message.content,
          timestamp: Date.now(),
        },
      }),
    );
    await fs.writeFile(sessionFile, `${lines.join("\n")}\n`, "utf8");
  }

  beforeEach(() => {
    hookRunnerMocks.hasHooks.mockReset();
    hookRunnerMocks.runBeforeReset.mockReset();
    hookRunnerMocks.hasHooks.mockImplementation((hookName) => hookName === "before_reset");
    hookRunnerMocks.runBeforeReset.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(async () => {
    while (tempPaths.length > 0) {
      const target = tempPaths.pop();
      if (target) {
        await fs.rm(target, { recursive: true, force: true });
      }
    }
  });

  it("passes the bound agent id to before_reset hooks for multi-agent session keys", async () => {
    const command = {
      surface: "discord",
      senderId: "rai",
      channel: "discord",
      from: "discord:rai",
      to: "discord:bot",
      resetHookTriggered: false,
    } as HandleCommandsParams["command"];

    await emitResetCommandHooks({
      action: "new",
      ctx: {} as HandleCommandsParams["ctx"],
      cfg: {} as HandleCommandsParams["cfg"],
      command,
      sessionKey: "agent:navi:main",
      previousSessionEntry: {
        sessionId: "prev-session",
      } as HandleCommandsParams["previousSessionEntry"],
      workspaceDir: "/tmp/openclaw-workspace",
    });

    await vi.waitFor(() => expect(hookRunnerMocks.runBeforeReset).toHaveBeenCalledTimes(1));
    const [, ctx] = hookRunnerMocks.runBeforeReset.mock.calls[0] ?? [];
    expect(ctx).toMatchObject({
      agentId: "navi",
      sessionKey: "agent:navi:main",
      sessionId: "prev-session",
      workspaceDir: "/tmp/openclaw-workspace",
    });
  });

  it("does not create a before_reset fallback when a fresh agent_end handoff already exists", async () => {
    const { workspaceDir, sessionFile } = await createResetWorkspace();
    const sessionKey = "agent:voltaris-v2:session:reset-test";

    await writeSessionTranscript(sessionFile, [
      { role: "user", content: "Need a clean handoff." },
      { role: "assistant", content: "Fresh agent_end handoff is already stored." },
    ]);
    await writeAgentEndHandoffMemory({
      workspaceDir,
      agentId: "voltaris-v2",
      sessionId: "prev-session",
      sessionKey,
      sessionFile,
      trigger: "manual",
      messages: [
        {
          role: "user",
          content: "Need a clean handoff.",
          timestamp: Date.now() - 1,
        } as AgentMessage,
        {
          role: "assistant",
          content: "Fresh agent_end handoff is already stored.",
          timestamp: Date.now(),
        } as AgentMessage,
      ],
      success: true,
    });

    expect(await countHandoffSnapshots(workspaceDir)).toBe(1);

    await emitResetCommandHooks({
      action: "reset",
      ctx: {} as HandleCommandsParams["ctx"],
      cfg: {} as HandleCommandsParams["cfg"],
      command: {
        surface: "test",
        senderId: "operator",
        channel: "webchat",
        from: "operator",
        to: "voltaris-v2",
        resetHookTriggered: false,
      },
      sessionKey,
      previousSessionEntry: {
        sessionId: "prev-session",
        sessionFile,
      } as HandleCommandsParams["previousSessionEntry"],
      workspaceDir,
    });

    await vi.waitFor(() => expect(hookRunnerMocks.runBeforeReset).toHaveBeenCalledTimes(1));
    expect(await countHandoffSnapshots(workspaceDir)).toBe(1);

    const latestRaw = await fs.readFile(
      path.join(workspaceDir, "memory", "handoff-latest.md"),
      "utf8",
    );
    expect(extractJsonBlock(latestRaw)).toMatchObject({
      source: "agent_end",
      runStatus: "ok",
      sessionId: "prev-session",
      sessionKey,
    });
  });
});
