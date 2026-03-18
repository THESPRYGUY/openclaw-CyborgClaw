import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendExecApprovalFollowup } from "./bash-tools.exec-approval-followup.js";
import { callGatewayTool } from "./tools/gateway.js";

vi.mock("./tools/gateway.js", () => ({
  callGatewayTool: vi.fn(),
}));

describe("sendExecApprovalFollowup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(callGatewayTool).mockResolvedValue({ ok: true });
  });

  it("does not force delivery for internal session-only follow-ups", async () => {
    await expect(
      sendExecApprovalFollowup({
        approvalId: "approval-1",
        sessionKey: "agent:main:main",
        resultText: "done",
      }),
    ).resolves.toBe(true);

    expect(callGatewayTool).toHaveBeenCalledWith(
      "agent",
      { timeoutMs: 60_000 },
      expect.objectContaining({
        sessionKey: "agent:main:main",
        idempotencyKey: "exec-approval-followup:approval-1",
      }),
      { expectFinal: true },
    );
    expect(callGatewayTool).toHaveBeenCalledWith(
      "agent",
      { timeoutMs: 60_000 },
      expect.not.objectContaining({
        deliver: true,
      }),
      { expectFinal: true },
    );
  });

  it("preserves delivery behavior when an outbound target exists", async () => {
    await expect(
      sendExecApprovalFollowup({
        approvalId: "approval-2",
        sessionKey: "agent:main:main",
        turnSourceChannel: "telegram",
        turnSourceTo: "12345",
        turnSourceAccountId: "acct-1",
        turnSourceThreadId: 99,
        resultText: "done",
      }),
    ).resolves.toBe(true);

    expect(callGatewayTool).toHaveBeenCalledWith(
      "agent",
      { timeoutMs: 60_000 },
      expect.objectContaining({
        sessionKey: "agent:main:main",
        deliver: true,
        bestEffortDeliver: true,
        channel: "telegram",
        to: "12345",
        accountId: "acct-1",
        threadId: "99",
        idempotencyKey: "exec-approval-followup:approval-2",
      }),
      { expectFinal: true },
    );
  });
});
