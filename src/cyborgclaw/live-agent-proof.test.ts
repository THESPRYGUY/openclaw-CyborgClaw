import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { collectLiveAgentTranscriptProof } from "./live-agent-proof.js";

const tempDirs: string[] = [];

async function writeTranscript(lines: unknown[]): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-live-agent-proof-"));
  tempDirs.push(dir);
  const transcriptPath = path.join(dir, "sess-1.jsonl");
  await fs.writeFile(
    transcriptPath,
    `${lines.map((line) => JSON.stringify(line)).join("\n")}\n`,
    "utf8",
  );
  return transcriptPath;
}

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map(async (dir) => {
      await fs.rm(dir, { recursive: true, force: true });
    }),
  );
});

describe("collectLiveAgentTranscriptProof", () => {
  it("verifies transcript-grade correlation for a fresh live assistant reply", async () => {
    const commandStartedAt = Date.now();
    const correlationToken = "voltaris-proof-abc123";
    const transcriptPath = await writeTranscript([
      {
        type: "session",
        id: "sess-1",
        timestamp: new Date(commandStartedAt - 10).toISOString(),
      },
      {
        message: {
          role: "user",
          content: `Probe request. ProofToken=${correlationToken}`,
          timestamp: commandStartedAt + 5,
        },
      },
      {
        message: {
          role: "assistant",
          content: [
            {
              type: "text",
              text: `VOLTARIS-LIVE-OK | ProofToken=${correlationToken} | Name=Voltaris V2 | Role=Master Genome Executive`,
            },
            { type: "tool_use", name: "read" },
            { type: "tool_result", is_error: false },
          ],
          provider: "openai",
          model: "gpt-5.3-codex",
          usage: { input: 12, output: 8, totalTokens: 20 },
          timestamp: commandStartedAt + 25,
        },
      },
    ]);

    const proof = await collectLiveAgentTranscriptProof({
      sessionKey: "agent:voltaris-v2:main",
      expectedSessionId: "sess-1",
      transcriptPath,
      correlationToken,
      payloads: [
        {
          text: `VOLTARIS-LIVE-OK | ProofToken=${correlationToken} | Name=Voltaris V2 | Role=Master Genome Executive`,
        },
      ],
      agentMeta: {
        sessionId: "sess-1",
        provider: "openai",
        model: "gpt-5.3-codex",
      },
      expectedProvider: "openai",
      expectedModel: "gpt-5.3-codex",
      commandStartedAt,
      sessionUpdatedAt: commandStartedAt + 40,
    });

    expect(proof.ok).toBe(true);
    expect(proof.failures).toEqual([]);
    expect(proof.header.matchesExpectedSessionId).toBe(true);
    expect(proof.correlation.sessionUpdatedAfterCommand).toBe(true);
    expect(proof.correlation.assistantTimestampAfterCommand).toBe(true);
    expect(proof.target).toEqual({
      expectedProvider: "openai",
      expectedModel: "gpt-5.3-codex",
      resolvedProvider: "openai",
      resolvedModel: "gpt-5.3-codex",
      requestedProviderMatchedResolved: true,
      requestedModelMatchedResolved: true,
      transcriptProviderMatchedRequested: true,
      transcriptModelMatchedRequested: true,
    });
    expect(proof.transcript.correlationToken).toEqual({
      value: correlationToken,
      userObserved: true,
      latestAssistantObserved: true,
      payloadObserved: true,
    });
    expect(proof.transcript.payloadMatch).toMatchObject({
      matched: true,
      matchType: "exact",
    });
    expect(proof.transcript.latestAssistant.toolCalls).toEqual(["read"]);
    expect(proof.transcript.latestAssistant.toolResults).toEqual({ total: 1, errors: 0 });
    expect(proof.transcript.latestAssistant.usage).toEqual({
      input: 12,
      output: 8,
      totalTokens: 20,
    });
  });

  it("returns structured failures when transcript correlation is stale or mismatched", async () => {
    const commandStartedAt = Date.now();
    const correlationToken = "voltaris-proof-xyz987";
    const transcriptPath = await writeTranscript([
      {
        type: "session",
        id: "sess-other",
        timestamp: new Date(commandStartedAt - 1000).toISOString(),
      },
      {
        message: {
          role: "user",
          content: "Different prompt with no proof token",
          timestamp: commandStartedAt - 500,
        },
      },
      {
        message: {
          role: "assistant",
          content: [{ type: "text", text: "wrong reply" }],
          provider: "anthropic",
          model: "claude-sonnet",
          usage: { input: 0, output: 0, totalTokens: 0 },
          timestamp: commandStartedAt - 100,
        },
      },
    ]);

    const proof = await collectLiveAgentTranscriptProof({
      sessionKey: "agent:voltaris-v2:main",
      expectedSessionId: "sess-1",
      transcriptPath,
      correlationToken,
      payloads: [
        {
          text: "VOLTARIS-LIVE-OK | Name=Voltaris V2 | Role=Master Genome Executive",
        },
      ],
      agentMeta: {
        sessionId: "sess-2",
        provider: "openai",
        model: "gpt-5.3-codex",
      },
      expectedProvider: "openai-codex",
      expectedModel: "gpt-5.4-mini",
      commandStartedAt,
      sessionUpdatedAt: commandStartedAt - 1,
    });

    expect(proof.ok).toBe(false);
    expect(proof.failures).toContain(
      "transcript header sessionId mismatch: expected sess-1, found sess-other",
    );
    expect(proof.failures).toContain(
      "agent meta sessionId mismatch: expected sess-1, found sess-2",
    );
    expect(proof.failures).toContain(
      "agent meta provider mismatch: expected openai-codex, found openai",
    );
    expect(proof.failures).toContain(
      "agent meta model mismatch: expected gpt-5.4-mini, found gpt-5.3-codex",
    );
    expect(proof.failures).toContain(
      "correlation token was not observed in any user transcript message",
    );
    expect(proof.failures).toContain(
      "correlation token was not observed in the latest assistant transcript message",
    );
    expect(proof.failures).toContain(
      "correlation token was not observed in the returned payload text",
    );
    expect(proof.failures).toContain(
      "latest assistant transcript text did not match the returned payload text",
    );
    expect(proof.failures).toContain(
      "assistant transcript provider mismatch: expected openai-codex, found anthropic",
    );
    expect(proof.failures).toContain(
      "assistant transcript model mismatch: expected gpt-5.4-mini, found claude-sonnet",
    );
    expect(proof.failures).toContain(
      "latest assistant transcript message did not record positive token usage",
    );
    expect(proof.correlation.sessionUpdatedAfterCommand).toBe(false);
    expect(proof.correlation.assistantTimestampAfterCommand).toBe(false);
    expect(proof.transcript.correlationToken).toEqual({
      value: correlationToken,
      userObserved: false,
      latestAssistantObserved: false,
      payloadObserved: false,
    });
  });

  it("fails cleanly when the transcript file is missing", async () => {
    const proof = await collectLiveAgentTranscriptProof({
      sessionKey: "agent:voltaris-v2:main",
      expectedSessionId: "sess-1",
      transcriptPath: path.join(os.tmpdir(), "openclaw-live-agent-proof-missing.jsonl"),
      payloads: [{ text: "VOLTARIS-LIVE-OK" }],
    });

    expect(proof.ok).toBe(false);
    expect(proof.failures).toHaveLength(1);
    expect(proof.failures[0]).toContain("missing transcript file");
    expect(proof.transcript.latestAssistant.text).toBeNull();
  });
});
