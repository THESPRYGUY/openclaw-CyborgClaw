import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AjvPkg from "ajv";
import { describe, expect, it } from "vitest";

const Ajv = AjvPkg as unknown as new (opts?: object) => import("ajv").default;

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

type ValidationResult = {
  ok: boolean;
  errors: Array<{
    instancePath?: string;
    keyword?: string;
    params?: Record<string, unknown>;
  }>;
};

type SeatKind = "engineering" | "ops" | "product" | "support";
type PartyRole = "team-agent" | "president";
type RouteClassification = "child" | "sibling" | "escalation" | "cousin" | "illegal";
type MediationState = "not-required" | "approved" | "missing" | "rejected";
type RejectReason =
  | "reject-binding-mismatch"
  | "reject-classification-mismatch"
  | "reject-missing-route-context"
  | "reject-cross-president-direct-control"
  | "reject-missing-president-mediation"
  | "reject-missing-cousin-ticket"
  | "reject-cousin-ticket-binding-mismatch"
  | "reject-missing-artifact-return";

type M11LineageManifest = {
  agentId: string;
  lineageId: string;
  seat: {
    seatId: string;
    seatKind: SeatKind;
  };
  trace: {
    traceNamespace: string;
    receiptNamespace: string;
    routeLawNamespace: string;
    approvalNamespace: string;
  };
  receipts: {
    lineageDigest: string;
  };
};

type M11RuntimeManifest = {
  runtimeId: string;
  registry: {
    namespace: string;
    recordKey: string;
  };
};

type M11PolicyManifest = {
  policyId: string;
};

type M11Bundle = {
  lineage: M11LineageManifest;
  runtime: M11RuntimeManifest;
  policy: M11PolicyManifest;
};

type PartyBinding = {
  agentId: string;
  role: PartyRole;
  seatId: string;
  seatKind: SeatKind;
  lineageId: string;
  lineageDigest: string;
  runtimeId: string;
  policyId: string;
  registryNamespace: string;
  recordKey: string;
  traceNamespace: string;
  receiptNamespace: string;
  routeLawNamespace: string;
  approvalNamespace: string;
};

type RouteDecision = {
  decisionId: string;
  requester: PartyBinding;
  target: PartyBinding;
  route: {
    requesterPresidentId: string;
    targetPresidentId: string;
    sharedPresident: boolean;
    classification: RouteClassification;
  };
  decision: {
    legal: boolean;
    requiresPresidentMediation: boolean;
    mediationState: MediationState;
    cousinTicketRequired: boolean;
    artifactReturnRequired: boolean;
    rejectReasons: RejectReason[];
  };
  receipts: {
    decisionDigest: string;
    cousinTicketDigest?: string;
  };
};

type CousinTicket = {
  decisionId: string;
  requester: PartyBinding;
  target: PartyBinding;
  mediation: {
    required: boolean;
    requesterPresidentId: string;
    targetPresidentId: string;
    state: "approved" | "pending" | "rejected";
    mediators: Array<Record<string, unknown>>;
  };
  artifactReturn: {
    required: boolean;
    requiredArtifacts: string[];
    requiredReceipts: string[];
    completionSummaryRequired: boolean;
    partialReturnAllowed: boolean;
  };
  receipts: {
    routeDecisionDigest: string;
    ticketDigest: string;
  };
};

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8")) as T;
}

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function validate(schemaPath: string, dataPath: string): ValidationResult {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const schema = readJson<object>(schemaPath);
  const data = readJson<unknown>(dataPath);
  const compiled = ajv.compile(schema);
  const ok = compiled(data);
  return {
    ok,
    errors: (compiled.errors ?? []).map((error) => ({
      instancePath: error.instancePath,
      keyword: error.keyword,
      params: error.params as Record<string, unknown>,
    })),
  };
}

function loadM11Party(bundleDir: string, party: "requester" | "target"): M11Bundle {
  return {
    lineage: readJson<M11LineageManifest>(`${bundleDir}/${party}.agent.lineage.json`),
    runtime: readJson<M11RuntimeManifest>(`${bundleDir}/${party}.agent.runtime.json`),
    policy: readJson<M11PolicyManifest>(`${bundleDir}/${party}.agent.policy.json`),
  };
}

function expectedBinding(bundle: M11Bundle, role: PartyRole): PartyBinding {
  return {
    agentId: bundle.lineage.agentId,
    role,
    seatId: bundle.lineage.seat.seatId,
    seatKind: bundle.lineage.seat.seatKind,
    lineageId: bundle.lineage.lineageId,
    lineageDigest: bundle.lineage.receipts.lineageDigest,
    runtimeId: bundle.runtime.runtimeId,
    policyId: bundle.policy.policyId,
    registryNamespace: bundle.runtime.registry.namespace,
    recordKey: bundle.runtime.registry.recordKey,
    traceNamespace: bundle.lineage.trace.traceNamespace,
    receiptNamespace: bundle.lineage.trace.receiptNamespace,
    routeLawNamespace: bundle.lineage.trace.routeLawNamespace,
    approvalNamespace: bundle.lineage.trace.approvalNamespace,
  };
}

function bindingMatchesM11(bundle: M11Bundle, binding: PartyBinding): boolean {
  const expected = expectedBinding(bundle, binding.role);
  return JSON.stringify(expected) === JSON.stringify(binding);
}

function deriveClassification(routeDecision: RouteDecision): string {
  const requesterRole = routeDecision.requester.role;
  const targetRole = routeDecision.target.role;
  const requesterPresidentId = routeDecision.route.requesterPresidentId;
  const targetPresidentId = routeDecision.route.targetPresidentId;
  const sharedPresident = routeDecision.route.sharedPresident;

  if (!requesterPresidentId || !targetPresidentId) {
    return "illegal";
  }

  const presidentsMatch = requesterPresidentId === targetPresidentId;
  if (sharedPresident !== presidentsMatch) {
    return "illegal";
  }

  if (requesterRole === "president" && targetRole === "team-agent" && sharedPresident) {
    return "child";
  }

  if (requesterRole === "team-agent" && targetRole === "president" && sharedPresident) {
    return "escalation";
  }

  if (requesterRole === "team-agent" && targetRole === "team-agent" && sharedPresident) {
    return "sibling";
  }

  if (requesterRole === "team-agent" && targetRole === "team-agent" && !sharedPresident) {
    return "cousin";
  }

  return "illegal";
}

function validateCousinTicketConsistency(
  routeDecision: RouteDecision,
  cousinTicket: CousinTicket,
): boolean {
  if (cousinTicket.decisionId !== routeDecision.decisionId) {
    return false;
  }

  if (
    cousinTicket.mediation.requesterPresidentId !== routeDecision.route.requesterPresidentId ||
    cousinTicket.mediation.targetPresidentId !== routeDecision.route.targetPresidentId
  ) {
    return false;
  }

  if (JSON.stringify(cousinTicket.requester) !== JSON.stringify(routeDecision.requester)) {
    return false;
  }

  if (JSON.stringify(cousinTicket.target) !== JSON.stringify(routeDecision.target)) {
    return false;
  }

  if (
    cousinTicket.receipts.routeDecisionDigest !== routeDecision.receipts.decisionDigest ||
    routeDecision.receipts.cousinTicketDigest !== cousinTicket.receipts.ticketDigest
  ) {
    return false;
  }

  return true;
}

function hasCanonicalArtifactReturn(cousinTicket: CousinTicket | null): boolean {
  if (!cousinTicket) {
    return false;
  }

  const requiredArtifacts = new Set(cousinTicket.artifactReturn.requiredArtifacts);
  const requiredReceipts = new Set(cousinTicket.artifactReturn.requiredReceipts);

  return (
    cousinTicket.artifactReturn.required &&
    cousinTicket.artifactReturn.completionSummaryRequired &&
    !cousinTicket.artifactReturn.partialReturnAllowed &&
    requiredArtifacts.has("artifact-manifest") &&
    requiredArtifacts.has("completion-summary") &&
    requiredArtifacts.has("diff-or-output") &&
    requiredArtifacts.has("receipt-pack") &&
    requiredArtifacts.has("validation-proof") &&
    requiredReceipts.has("approval-proof") &&
    requiredReceipts.has("artifact-manifest") &&
    requiredReceipts.has("cousin-ticket") &&
    requiredReceipts.has("route-decision") &&
    requiredReceipts.has("validation-proof")
  );
}

function computeRejectReasons(bundleDir: string): string[] {
  const routeDecision = readJson<RouteDecision>(`${bundleDir}/route-decision.json`);
  const requester = loadM11Party(bundleDir, "requester");
  const target = loadM11Party(bundleDir, "target");
  const cousinTicketPath = `${bundleDir}/cousin-ticket.json`;
  const cousinTicket = fileExists(cousinTicketPath)
    ? readJson<CousinTicket>(cousinTicketPath)
    : null;
  const derivedClassification = deriveClassification(routeDecision);

  const rejectReasons: RejectReason[] = [];

  if (
    !bindingMatchesM11(requester, routeDecision.requester) ||
    !bindingMatchesM11(target, routeDecision.target)
  ) {
    rejectReasons.push("reject-binding-mismatch");
  }

  if (derivedClassification === "illegal") {
    rejectReasons.push("reject-missing-route-context");
  }

  if (routeDecision.route.classification !== derivedClassification) {
    rejectReasons.push("reject-classification-mismatch");
  }

  if (derivedClassification === "cousin") {
    const hasApprovedMediation =
      routeDecision.decision.requiresPresidentMediation &&
      routeDecision.decision.mediationState === "approved" &&
      cousinTicket?.mediation.required === true &&
      cousinTicket?.mediation.state === "approved" &&
      cousinTicket.mediation.mediators.length > 0;

    const hasCousinTicket = routeDecision.decision.cousinTicketRequired && cousinTicket !== null;
    const hasArtifactReturn =
      routeDecision.decision.artifactReturnRequired && hasCanonicalArtifactReturn(cousinTicket);
    const ticketMatches = cousinTicket
      ? validateCousinTicketConsistency(routeDecision, cousinTicket)
      : false;

    if (!hasApprovedMediation || !hasCousinTicket || !hasArtifactReturn) {
      rejectReasons.push("reject-cross-president-direct-control");
    }

    if (!hasApprovedMediation) {
      rejectReasons.push("reject-missing-president-mediation");
    }

    if (!hasCousinTicket) {
      rejectReasons.push("reject-missing-cousin-ticket");
    }

    if (cousinTicket && !ticketMatches) {
      rejectReasons.push("reject-cousin-ticket-binding-mismatch");
    }

    if (!hasArtifactReturn) {
      rejectReasons.push("reject-missing-artifact-return");
    }
  }

  return rejectReasons;
}

function routeIsLegal(bundleDir: string): boolean {
  return computeRejectReasons(bundleDir).length === 0;
}

describe("M12 route-law proof", () => {
  const cleanDir = "examples/route-law-bundle/clean";
  const badDir = "examples/route-law-bundle/known-bad-direct-cross-president";
  const m11SchemaPairs = (bundleDir: string) =>
    [
      ["schemas/agent.lineage.schema.json", `${bundleDir}/requester.agent.lineage.json`],
      ["schemas/agent.runtime.schema.json", `${bundleDir}/requester.agent.runtime.json`],
      ["schemas/agent.policy.schema.json", `${bundleDir}/requester.agent.policy.json`],
      ["schemas/agent.lineage.schema.json", `${bundleDir}/target.agent.lineage.json`],
      ["schemas/agent.runtime.schema.json", `${bundleDir}/target.agent.runtime.json`],
      ["schemas/agent.policy.schema.json", `${bundleDir}/target.agent.policy.json`],
    ] as const;

  it("validates the clean route-law bundle against M11 and M12 schemas", () => {
    const routeResult = validate(
      "schemas/route-decision.schema.json",
      `${cleanDir}/route-decision.json`,
    );
    expect(routeResult.ok).toBe(true);
    expect(routeResult.errors).toEqual([]);

    const cousinTicketResult = validate(
      "schemas/cousin-ticket.schema.json",
      `${cleanDir}/cousin-ticket.json`,
    );
    expect(cousinTicketResult.ok).toBe(true);
    expect(cousinTicketResult.errors).toEqual([]);

    for (const [schemaPath, dataPath] of m11SchemaPairs(cleanDir)) {
      const result = validate(schemaPath, dataPath);
      expect(result.ok, `${dataPath} should validate against ${schemaPath}`).toBe(true);
      expect(result.errors).toEqual([]);
    }
  });

  it("proves the clean bundle is a legal mediated cousin route", () => {
    const routeDecision = readJson(`${cleanDir}/route-decision.json`);
    expect(deriveClassification(routeDecision)).toBe("cousin");
    expect(computeRejectReasons(cleanDir)).toEqual([]);
    expect(routeIsLegal(cleanDir)).toBe(true);
    expect(routeDecision.decision.legal).toBe(true);
    expect(routeDecision.decision.rejectReasons).toEqual([]);
  });

  it("validates the known-bad bundle shape while preserving M11 truth", () => {
    const routeResult = validate(
      "schemas/route-decision.schema.json",
      `${badDir}/route-decision.json`,
    );
    expect(routeResult.ok).toBe(true);
    expect(routeResult.errors).toEqual([]);

    expect(fileExists(`${badDir}/cousin-ticket.json`)).toBe(false);

    for (const [schemaPath, dataPath] of m11SchemaPairs(badDir)) {
      const result = validate(schemaPath, dataPath);
      expect(result.ok, `${dataPath} should validate against ${schemaPath}`).toBe(true);
      expect(result.errors).toEqual([]);
    }
  });

  it("rejects direct cross-President peer control without mediation or artifact return", () => {
    const routeDecision = readJson(`${badDir}/route-decision.json`);
    const computedRejects = computeRejectReasons(badDir);

    expect(deriveClassification(routeDecision)).toBe("cousin");
    expect(routeIsLegal(badDir)).toBe(false);
    expect(computedRejects).toEqual([
      "reject-classification-mismatch",
      "reject-cross-president-direct-control",
      "reject-missing-president-mediation",
      "reject-missing-cousin-ticket",
      "reject-missing-artifact-return",
    ]);
    expect(routeDecision.decision.legal).toBe(false);
    expect(routeDecision.decision.rejectReasons).toEqual(computedRejects);
  });
});
