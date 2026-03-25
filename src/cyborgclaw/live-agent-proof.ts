import fs from "node:fs/promises";
import { countToolResults, extractToolCallNames } from "../utils/transcript-tools.js";

type JsonRecord = Record<string, unknown>;

type UsageSnapshot = {
  input: number | null;
  output: number | null;
  totalTokens: number | null;
};

type PayloadTextMatch = {
  matched: boolean;
  matchType: "exact" | "contains" | "none";
  expectedTexts: string[];
};

type TranscriptAssistantEvidence = {
  text: string | null;
  timestamp: number | null;
  provider: string | null;
  model: string | null;
  usage: UsageSnapshot | null;
  toolCalls: string[];
  toolResults: {
    total: number;
    errors: number;
  };
};

export type LiveAgentTranscriptProof = {
  ok: boolean;
  transcriptPath: string;
  lineCount: number;
  parsedLineCount: number;
  malformedLineCount: number;
  header: {
    sessionId: string | null;
    timestamp: string | null;
    matchesExpectedSessionId: boolean;
  };
  correlation: {
    sessionKey: string;
    expectedSessionId: string;
    agentMetaSessionId: string | null;
    commandStartedAt: number | null;
    sessionUpdatedAt: number | null;
    sessionUpdatedAfterCommand: boolean | null;
    assistantTimestampAfterCommand: boolean | null;
  };
  transcript: {
    userMessageCount: number;
    assistantMessageCount: number;
    userPromptObserved: boolean;
    payloadMatch: PayloadTextMatch;
    latestAssistant: TranscriptAssistantEvidence;
    previewLines: string[];
  };
  failures: string[];
};

export type CollectLiveAgentTranscriptProofParams = {
  sessionKey: string;
  expectedSessionId: string;
  transcriptPath: string;
  expectedUserText?: string;
  payloads?: Array<{ text?: string | null }>;
  agentMeta?: {
    sessionId?: string;
    provider?: string;
    model?: string;
  };
  commandStartedAt?: number;
  sessionUpdatedAt?: number;
  previewLineCount?: number;
};

function asRecord(value: unknown): JsonRecord | null {
  return value && typeof value === "object" ? (value as JsonRecord) : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asTimestampMs(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function extractMessageText(message: JsonRecord): string | null {
  const content = message.content;
  if (typeof content === "string" && content.trim()) {
    return content.trim();
  }
  if (Array.isArray(content)) {
    const text = content
      .flatMap((entry) => {
        const block = asRecord(entry);
        if (!block) {
          return [];
        }
        const type = typeof block.type === "string" ? block.type.trim().toLowerCase() : "";
        if (type && !["text", "input_text", "output_text"].includes(type)) {
          return [];
        }
        return typeof block.text === "string" && block.text.trim() ? [block.text.trim()] : [];
      })
      .join("\n")
      .trim();
    return text || null;
  }
  const text = message.text;
  return typeof text === "string" && text.trim() ? text.trim() : null;
}

function normalizeUsage(value: unknown): UsageSnapshot | null {
  const usage = asRecord(value);
  if (!usage) {
    return null;
  }
  const input = asNumber(usage.input ?? usage.input_tokens);
  const output = asNumber(usage.output ?? usage.output_tokens);
  const totalTokens = asNumber(usage.totalTokens ?? usage.total ?? usage.total_tokens);
  if (input == null && output == null && totalTokens == null) {
    return null;
  }
  return { input, output, totalTokens };
}

function hasPositiveUsage(usage: UsageSnapshot | null): boolean {
  if (!usage) {
    return false;
  }
  return [usage.input, usage.output, usage.totalTokens].some(
    (value) => typeof value === "number" && value > 0,
  );
}

function normalizeExpectedTexts(
  payloads: CollectLiveAgentTranscriptProofParams["payloads"],
): string[] {
  return (payloads ?? [])
    .map((payload) => (typeof payload?.text === "string" ? payload.text.trim() : ""))
    .filter((text) => text.length > 0);
}

function matchExpectedText(actualText: string | null, expectedTexts: string[]): PayloadTextMatch {
  if (!actualText || expectedTexts.length === 0) {
    return {
      matched: expectedTexts.length === 0,
      matchType: expectedTexts.length === 0 ? "exact" : "none",
      expectedTexts,
    };
  }

  for (const expected of expectedTexts) {
    if (actualText === expected) {
      return { matched: true, matchType: "exact", expectedTexts };
    }
  }
  for (const expected of expectedTexts) {
    if (actualText.includes(expected) || expected.includes(actualText)) {
      return { matched: true, matchType: "contains", expectedTexts };
    }
  }
  return { matched: false, matchType: "none", expectedTexts };
}

function buildMissingTranscriptProof(
  params: CollectLiveAgentTranscriptProofParams,
  reason: string,
): LiveAgentTranscriptProof {
  return {
    ok: false,
    transcriptPath: params.transcriptPath,
    lineCount: 0,
    parsedLineCount: 0,
    malformedLineCount: 0,
    header: {
      sessionId: null,
      timestamp: null,
      matchesExpectedSessionId: false,
    },
    correlation: {
      sessionKey: params.sessionKey,
      expectedSessionId: params.expectedSessionId,
      agentMetaSessionId: asString(params.agentMeta?.sessionId),
      commandStartedAt: params.commandStartedAt ?? null,
      sessionUpdatedAt: params.sessionUpdatedAt ?? null,
      sessionUpdatedAfterCommand:
        typeof params.commandStartedAt === "number" && typeof params.sessionUpdatedAt === "number"
          ? params.sessionUpdatedAt >= params.commandStartedAt
          : null,
      assistantTimestampAfterCommand: null,
    },
    transcript: {
      userMessageCount: 0,
      assistantMessageCount: 0,
      userPromptObserved: false,
      payloadMatch: {
        matched: false,
        matchType: "none",
        expectedTexts: normalizeExpectedTexts(params.payloads),
      },
      latestAssistant: {
        text: null,
        timestamp: null,
        provider: null,
        model: null,
        usage: null,
        toolCalls: [],
        toolResults: {
          total: 0,
          errors: 0,
        },
      },
      previewLines: [],
    },
    failures: [reason],
  };
}

export async function collectLiveAgentTranscriptProof(
  params: CollectLiveAgentTranscriptProofParams,
): Promise<LiveAgentTranscriptProof> {
  let raw: string;
  try {
    raw = await fs.readFile(params.transcriptPath, "utf8");
  } catch (error) {
    return buildMissingTranscriptProof(
      params,
      `missing transcript file at ${params.transcriptPath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);
  const previewLines = lines.slice(0, Math.max(1, params.previewLineCount ?? 6));
  if (lines.length === 0) {
    return buildMissingTranscriptProof(
      params,
      `transcript file is empty: ${params.transcriptPath}`,
    );
  }

  const parsedLines: JsonRecord[] = [];
  let malformedLineCount = 0;
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      const record = asRecord(parsed);
      if (!record) {
        malformedLineCount += 1;
        continue;
      }
      parsedLines.push(record);
    } catch {
      malformedLineCount += 1;
    }
  }

  const header = parsedLines.find((entry) => entry.type === "session");
  const headerSessionId = asString(header?.id);
  const headerTimestamp = asString(header?.timestamp);
  const messages = parsedLines
    .map((entry) => asRecord(entry.message))
    .filter((entry): entry is JsonRecord => Boolean(entry));
  const userMessages = messages.filter((message) => message.role === "user");
  const assistantMessages = messages.filter((message) => message.role === "assistant");
  const latestAssistant = assistantMessages.at(-1) ?? null;
  const latestAssistantText = latestAssistant ? extractMessageText(latestAssistant) : null;
  const latestAssistantTimestamp = latestAssistant
    ? asTimestampMs(latestAssistant.timestamp)
    : null;
  const latestAssistantProvider = latestAssistant ? asString(latestAssistant.provider) : null;
  const latestAssistantModel = latestAssistant ? asString(latestAssistant.model) : null;
  const latestAssistantUsage = latestAssistant ? normalizeUsage(latestAssistant.usage) : null;
  const payloadMatch = matchExpectedText(
    latestAssistantText,
    normalizeExpectedTexts(params.payloads),
  );
  const expectedUserText = params.expectedUserText?.trim();
  const userPromptObserved = expectedUserText
    ? userMessages.some((message) => {
        const text = extractMessageText(message);
        return Boolean(text && (text === expectedUserText || text.includes(expectedUserText)));
      })
    : userMessages.length > 0;
  const assistantTimestampAfterCommand =
    typeof params.commandStartedAt === "number" && latestAssistantTimestamp != null
      ? latestAssistantTimestamp >= params.commandStartedAt
      : null;
  const sessionUpdatedAfterCommand =
    typeof params.commandStartedAt === "number" && typeof params.sessionUpdatedAt === "number"
      ? params.sessionUpdatedAt >= params.commandStartedAt
      : null;

  const failures: string[] = [];
  if (headerSessionId !== params.expectedSessionId) {
    failures.push(
      `transcript header sessionId mismatch: expected ${params.expectedSessionId}, found ${headerSessionId ?? "missing"}`,
    );
  }
  const agentMetaSessionId = asString(params.agentMeta?.sessionId);
  if (agentMetaSessionId && agentMetaSessionId !== params.expectedSessionId) {
    failures.push(
      `agent meta sessionId mismatch: expected ${params.expectedSessionId}, found ${agentMetaSessionId}`,
    );
  }
  if (sessionUpdatedAfterCommand === false) {
    failures.push(
      `session store updatedAt did not advance past command start (${params.sessionUpdatedAt} < ${params.commandStartedAt})`,
    );
  }
  if (expectedUserText && !userPromptObserved) {
    failures.push("expected prompt text was not observed in the transcript");
  }
  if (assistantMessages.length === 0) {
    failures.push("transcript did not contain any assistant messages");
  }
  if (!latestAssistantText) {
    failures.push("latest assistant transcript message did not contain text");
  }
  if (assistantTimestampAfterCommand === false) {
    failures.push(
      `latest assistant transcript timestamp did not advance past command start (${latestAssistantTimestamp} < ${params.commandStartedAt})`,
    );
  }
  if (params.agentMeta?.provider && latestAssistantProvider !== params.agentMeta.provider) {
    failures.push(
      `assistant transcript provider mismatch: expected ${params.agentMeta.provider}, found ${latestAssistantProvider ?? "missing"}`,
    );
  }
  if (params.agentMeta?.model && latestAssistantModel !== params.agentMeta.model) {
    failures.push(
      `assistant transcript model mismatch: expected ${params.agentMeta.model}, found ${latestAssistantModel ?? "missing"}`,
    );
  }
  if (!hasPositiveUsage(latestAssistantUsage)) {
    failures.push("latest assistant transcript message did not record positive token usage");
  }
  if (!payloadMatch.matched && payloadMatch.expectedTexts.length > 0) {
    failures.push("latest assistant transcript text did not match the returned payload text");
  }

  return {
    ok: failures.length === 0,
    transcriptPath: params.transcriptPath,
    lineCount: lines.length,
    parsedLineCount: parsedLines.length,
    malformedLineCount,
    header: {
      sessionId: headerSessionId,
      timestamp: headerTimestamp,
      matchesExpectedSessionId: headerSessionId === params.expectedSessionId,
    },
    correlation: {
      sessionKey: params.sessionKey,
      expectedSessionId: params.expectedSessionId,
      agentMetaSessionId,
      commandStartedAt: params.commandStartedAt ?? null,
      sessionUpdatedAt: params.sessionUpdatedAt ?? null,
      sessionUpdatedAfterCommand,
      assistantTimestampAfterCommand,
    },
    transcript: {
      userMessageCount: userMessages.length,
      assistantMessageCount: assistantMessages.length,
      userPromptObserved,
      payloadMatch,
      latestAssistant: {
        text: latestAssistantText,
        timestamp: latestAssistantTimestamp,
        provider: latestAssistantProvider,
        model: latestAssistantModel,
        usage: latestAssistantUsage,
        toolCalls: latestAssistant ? extractToolCallNames(latestAssistant) : [],
        toolResults: latestAssistant ? countToolResults(latestAssistant) : { total: 0, errors: 0 },
      },
      previewLines,
    },
    failures,
  };
}
