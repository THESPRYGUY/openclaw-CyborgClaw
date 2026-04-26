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

  it("does not admit messages beyond seenThroughSeq", () => {
    const context = {
      roomId: "Break-Out Room Patch Review",
      roomEpochId: "bor-rsi-sprint-001-review-20260426T172400Z",
      seenThroughSeq: 9,
      messages: [
        { seq: 8, author: "codex", text: "First admitted point." },
        { seq: 9, author: "cody", text: "Latest admitted point." },
        { seq: 10, author: "voltaris-v2", text: "Future point." },
      ],
    };

    expect(summarizeSharedRoomContext(context)).toMatchObject({
      seenThroughSeq: 9,
      lastMessageSeq: 9,
    });
    const prompt = buildSharedRoomContextPrompt(context);
    expect(prompt).toContain("[#8] codex: First admitted point.");
    expect(prompt).toContain("[#9] cody: Latest admitted point.");
    expect(prompt).not.toContain("Future point.");
  });

  it("keeps same-epoch shared room cursors monotonic", () => {
    const previous = {
      roomId: "Break-Out Room Patch Review",
      roomEpochId: "bor-rsi-sprint-001-review-20260426T172400Z",
      seenThroughSeq: 42,
      lastMessageSeq: 42,
    };
    const context = {
      roomId: "Break-Out Room Patch Review",
      roomEpochId: "bor-rsi-sprint-001-review-20260426T172400Z",
      seenThroughSeq: 9,
      messages: [{ seq: 9, author: "codex", text: "Stale proof." }],
    };

    expect(summarizeSharedRoomContext(context, previous)).toMatchObject({
      seenThroughSeq: 42,
      lastMessageSeq: 42,
    });
    const prompt = buildSharedRoomContextPrompt(context, previous);
    expect(prompt).toContain(
      "The supplied room context cursor seq 9 is stale or regressive compared with stored room cursor seq 42.",
    );
    expect(prompt).toContain("Admitted room messages: none from the supplied stale context.");
    expect(prompt).not.toContain("Stale proof.");
  });

  it("treats a new room epoch as a fresh cursor lane", () => {
    const previous = {
      roomId: "Break-Out Room Patch Review",
      roomEpochId: "bor-rsi-sprint-001-review-20260426T172400Z",
      seenThroughSeq: 42,
      lastMessageSeq: 42,
    };
    const context = {
      roomId: "Break-Out Room Patch Review",
      roomEpochId: "bor-rsi-sprint-002-review-20260426T183000Z",
      seenThroughSeq: 3,
      messages: [{ seq: 3, author: "codex", text: "Fresh epoch proof." }],
    };

    expect(summarizeSharedRoomContext(context, previous)).toMatchObject({
      roomEpochId: "bor-rsi-sprint-002-review-20260426T183000Z",
      seenThroughSeq: 3,
      lastMessageSeq: 3,
    });
    expect(buildSharedRoomContextPrompt(context, previous)).toContain("Fresh epoch proof.");
  });

  it("keeps legacy no-epoch room cursors monotonic without crossing epoch lanes", () => {
    const previousLegacy = {
      roomId: "Break-Out Room Patch Review",
      seenThroughSeq: 42,
      lastMessageSeq: 42,
    };

    expect(
      summarizeSharedRoomContext(
        {
          roomId: "Break-Out Room Patch Review",
          seenThroughSeq: 9,
          messages: [{ seq: 9, author: "codex", text: "Legacy stale proof." }],
        },
        previousLegacy,
      ),
    ).toMatchObject({
      seenThroughSeq: 42,
      lastMessageSeq: 42,
    });

    expect(
      summarizeSharedRoomContext(
        {
          roomId: "Break-Out Room Patch Review",
          roomEpochId: "bor-rsi-sprint-005-review-20260426T210000Z",
          seenThroughSeq: 1,
          messages: [{ seq: 1, author: "codex", text: "Epoch-isolated proof." }],
        },
        previousLegacy,
      ),
    ).toMatchObject({
      roomEpochId: "bor-rsi-sprint-005-review-20260426T210000Z",
      seenThroughSeq: 1,
      lastMessageSeq: 1,
    });
  });
});
