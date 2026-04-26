import { describe, expect, it } from "vitest";
import { buildSharedRoomContextPrompt, summarizeSharedRoomContext } from "./shared-room-context.js";

describe("shared room context epoch receipts", () => {
  it("preserves roomEpochId in the stored summary and prompt", () => {
    const context = {
      roomId: "Break-Out Room Patch Review",
      roomEpochId: "bor-rsi-sprint-001-review-20260426T172400Z",
      roomLabel: "BOR RSI Sprint 001",
      seenThroughSeq: 9,
      messages: [{ seq: 9, author: "codex", text: "ACK" }],
    };

    expect(summarizeSharedRoomContext(context)).toMatchObject({
      roomId: "Break-Out Room Patch Review",
      roomEpochId: "bor-rsi-sprint-001-review-20260426T172400Z",
      roomLabel: "BOR RSI Sprint 001",
      seenThroughSeq: 9,
      lastMessageSeq: 9,
    });
    expect(buildSharedRoomContextPrompt(context)).toContain(
      "Room epoch: bor-rsi-sprint-001-review-20260426T172400Z.",
    );
  });
});
