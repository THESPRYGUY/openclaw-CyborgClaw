import fs from "node:fs/promises";
import path from "node:path";

export type M18ChildReceipt = {
  kind: "m18.child.receipt";
  schemaVersion: 1;
  lapId: string;
  parentRunId: string;
  parentSessionId: string;
  childSessionKey: string;
  childSessionId: string;
  spawnRunId: string;
  observedInParent: boolean;
  childResultText: string;
  childReceiptPayload: Record<string, unknown>;
  observedAt: string;
  result: "observed" | "invalid";
};

export type EmitOfficialM18RicherHelperBundleParams = {
  outputDir: string;
  lapId: string;
  lapNumber: number;
  lapClass: string;
  summaryText: string;
  auditText: string;
  parentDeltaText: string;
  childTranscriptText: string;
  approvalCheckpoint: Record<string, unknown>;
};

export type EmitOfficialM18RicherHelperBundleResult = {
  childReceipt: M18ChildReceipt;
  disposition: "CLEAN" | "INVALID";
  failReason: string;
  files: {
    approvalCheckpointPath: string;
    summaryPath: string;
    auditPath: string;
    parentDeltaPath: string;
    childReceiptPath: string;
    comparabilityManifestPath: string;
  };
};

type SummaryFields = Record<string, string>;

type ParentDeltaEntry = {
  type?: string;
  timestamp?: string;
  message?: {
    role?: string;
    toolName?: string;
    details?: Record<string, unknown>;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  };
};

type ChildObservation = {
  childSessionId: string;
  childResultText: string;
  observedAt: string;
};

type ChildTranscriptDetails = {
  sessionId: string;
  finalAssistantText: string;
};

function parseSummary(summaryText: string): SummaryFields {
  const fields: SummaryFields = {};
  for (const line of summaryText.trim().split("\n")) {
    const splitIndex = line.indexOf("=");
    if (splitIndex <= 0) {
      continue;
    }
    fields[line.slice(0, splitIndex)] = line.slice(splitIndex + 1);
  }
  return fields;
}

function parseJsonLines(text: string): ParentDeltaEntry[] {
  return text
    .trim()
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => JSON.parse(line) as ParentDeltaEntry);
}

function extractChildObservation(parentDeltaText: string, childSessionKey: string): ChildObservation | null {
  const entries = parseJsonLines(parentDeltaText);
  for (const entry of entries) {
    const messageText = entry.message?.content
      ?.map((content) => content.text ?? "")
      .join("\n")
      .trim();
    if (!messageText?.includes("[Internal task completion event]")) {
      continue;
    }
    if (!messageText.includes(`session_key: ${childSessionKey}`)) {
      continue;
    }
    const sessionIdMatch = messageText.match(/session_id:\s+([^\n]+)/);
    const resultMatch = messageText.match(
      /<<<BEGIN_UNTRUSTED_CHILD_RESULT>>>\n([\s\S]*?)\n<<<END_UNTRUSTED_CHILD_RESULT>>>/,
    );
    if (!sessionIdMatch?.[1] || !resultMatch?.[1] || !entry.timestamp) {
      return null;
    }
    return {
      childSessionId: sessionIdMatch[1].trim(),
      childResultText: resultMatch[1].trim(),
      observedAt: entry.timestamp,
    };
  }
  return null;
}

function extractChildTranscriptDetails(childTranscriptText: string): ChildTranscriptDetails | null {
  const entries = parseJsonLines(childTranscriptText);
  const sessionEntry = entries.find((entry) => entry.type === "session");
  const sessionId = typeof sessionEntry?.id === "string" ? sessionEntry.id : "";
  const assistantEntries = entries.filter((entry) => entry.message?.role === "assistant");
  const finalAssistantText = assistantEntries
    .flatMap((entry) => entry.message?.content ?? [])
    .map((content) => content.text ?? "")
    .filter((text) => text.trim() !== "")
    .at(-1);

  if (!sessionId || !finalAssistantText) {
    return null;
  }

  return {
    sessionId,
    finalAssistantText: finalAssistantText.trim(),
  };
}

function parseChildPayload(childResultText: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(childResultText) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function stringifyJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function buildComparabilityManifestRow(params: {
  lapNumber: number;
  lapClass: string;
  disposition: "CLEAN" | "INVALID";
  runId: string;
  receiptPath: string;
  note: string;
}): string {
  return [
    String(params.lapNumber),
    params.lapClass,
    params.disposition,
    params.runId,
    params.receiptPath,
    params.note,
  ].join("\t");
}

export function buildM18ChildReceipt(params: {
  lapId: string;
  summaryText: string;
  parentDeltaText: string;
  childTranscriptText: string;
}): { childReceipt: M18ChildReceipt; failReason: string } {
  const summary = parseSummary(params.summaryText);
  const childSessionKey = summary.child_key ?? "";
  const parentRunId = summary.parent_run_id ?? "";
  const parentSessionId = summary.parent_session_id ?? "";
  const spawnRunId = summary.spawn_run_id ?? "";

  const observation = childSessionKey
    ? extractChildObservation(params.parentDeltaText, childSessionKey)
    : null;
  const childTranscript = extractChildTranscriptDetails(params.childTranscriptText);
  const childResultText = observation?.childResultText ?? childTranscript?.finalAssistantText ?? "";
  const childReceiptPayload = parseChildPayload(childResultText);
  const childSessionId = observation?.childSessionId ?? childTranscript?.sessionId ?? "";
  const summaryOrderingOkay = (summary.child_event_before_parent ?? "") === "yes";
  const summaryAccepted = (summary.accepted ?? "") === "yes";
  const summaryChildArtifact = (summary.child_artifact ?? "") === "yes";
  const summaryChildReceiptCount = Number.parseInt(summary.child_receipt_count ?? "0", 10);

  let failReason = "";
  if (!summaryOrderingOkay) {
    failReason = "ordering contradiction";
  } else if (!summaryAccepted) {
    failReason = "spawn not accepted";
  } else if (!summaryChildArtifact || summaryChildReceiptCount < 1) {
    failReason = "missing child evidence";
  } else if (!observation) {
    failReason = "missing parent child completion event";
  } else if (!childSessionId) {
    failReason = "missing child session id";
  } else if (!spawnRunId) {
    failReason = "missing spawn run id";
  } else if (!childReceiptPayload) {
    failReason = "invalid child receipt payload";
  }

  return {
    childReceipt: {
      kind: "m18.child.receipt",
      schemaVersion: 1,
      lapId: params.lapId,
      parentRunId,
      parentSessionId,
      childSessionKey,
      childSessionId,
      spawnRunId,
      observedInParent: observation !== null,
      childResultText,
      childReceiptPayload: childReceiptPayload ?? {},
      observedAt: observation?.observedAt ?? "",
      result: failReason === "" ? "observed" : "invalid",
    },
    failReason,
  };
}

export async function emitOfficialM18RicherHelperBundle(
  params: EmitOfficialM18RicherHelperBundleParams,
): Promise<EmitOfficialM18RicherHelperBundleResult> {
  const { childReceipt, failReason } = buildM18ChildReceipt({
    lapId: params.lapId,
    summaryText: params.summaryText,
    parentDeltaText: params.parentDeltaText,
    childTranscriptText: params.childTranscriptText,
  });

  const disposition = failReason === "" ? "CLEAN" : "INVALID";
  await fs.mkdir(params.outputDir, { recursive: true });

  const approvalCheckpointPath = path.join(params.outputDir, "approval-checkpoint.json");
  const summaryPath = path.join(params.outputDir, `${params.lapId}.summary`);
  const auditPath = path.join(params.outputDir, `${params.lapId}.audit.json`);
  const parentDeltaPath = path.join(params.outputDir, `${params.lapId}.parent.delta.jsonl`);
  const childReceiptPath = path.join(params.outputDir, `${params.lapId}.child.receipt.json`);
  const comparabilityManifestPath = path.join(params.outputDir, "comparable-lap-set.tsv");

  await fs.writeFile(approvalCheckpointPath, stringifyJson(params.approvalCheckpoint), "utf8");
  await fs.writeFile(summaryPath, params.summaryText.trimEnd() + "\n", "utf8");
  await fs.writeFile(auditPath, params.auditText.trimEnd() + "\n", "utf8");
  await fs.writeFile(parentDeltaPath, params.parentDeltaText.trimEnd() + "\n", "utf8");
  await fs.writeFile(childReceiptPath, stringifyJson(childReceipt), "utf8");

  const summary = parseSummary(params.summaryText);
  const manifestHeader = "lap_number\tclass\tdisposition\trun_id\treceipt_path\tnote";
  const manifestRow = buildComparabilityManifestRow({
    lapNumber: params.lapNumber,
    lapClass: params.lapClass,
    disposition,
    runId: summary.parent_run_id ?? "",
    receiptPath: `${params.lapId}.summary`,
    note:
      failReason === ""
        ? "approval+summary+audit+parent-delta+child-receipt emitted"
        : `approval+summary+audit+parent-delta+child-receipt emitted; fail=${failReason}`,
  });
  await fs.writeFile(comparabilityManifestPath, `${manifestHeader}\n${manifestRow}\n`, "utf8");

  return {
    childReceipt,
    disposition,
    failReason,
    files: {
      approvalCheckpointPath,
      summaryPath,
      auditPath,
      parentDeltaPath,
      childReceiptPath,
      comparabilityManifestPath,
    },
  };
}
