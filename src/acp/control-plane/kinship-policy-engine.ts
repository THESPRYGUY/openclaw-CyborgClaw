import COUSIN_TICKET_SCHEMA from "../../../schemas/cousin-ticket.schema.json" with { type: "json" };
import ROUTE_DECISION_SCHEMA from "../../../schemas/route-decision.schema.json" with { type: "json" };
import type {
  SessionAcpRouteClassification,
  SessionAcpRouteLawEnvelope,
  SessionAcpTransportEnvelope,
} from "../../config/sessions/types.js";
import { validateJsonSchemaValue } from "../../plugins/schema-validator.js";
import { normalizeAgentId } from "../../routing/session-key.js";
import { AcpRuntimeError } from "../runtime/errors.js";
import { normalizeText } from "./runtime-options.js";

type M12RouteDecisionArtifact = {
  decisionId: string;
  requester: {
    agentId: string;
    role?: string;
    seatId?: string;
    lineageId?: string;
    runtimeId?: string;
    policyId?: string;
  };
  target: {
    agentId: string;
    role?: string;
    seatId?: string;
    lineageId?: string;
    runtimeId?: string;
    policyId?: string;
  };
  route: {
    classification: SessionAcpRouteClassification;
    requesterPresidentId?: string;
    targetPresidentId?: string;
    sharedPresident?: boolean;
  };
  decision: {
    verdict: SessionAcpRouteLawEnvelope["verdict"];
    requiresPresidentMediation?: boolean;
    mediationState?: string;
    cousinTicketRequired: boolean;
    artifactReturnRequired?: boolean;
    rejectReasons: string[];
  };
  cousinTicket?: {
    ticketId: string;
    ticketDigest: string;
  };
  trace: Pick<
    SessionAcpRouteLawEnvelope,
    | "traceNamespace"
    | "receiptNamespace"
    | "routeLawNamespace"
    | "approvalNamespace"
    | "correlationId"
  >;
};

type M12CousinTicketArtifact = {
  ticketId: string;
  decisionId: string;
  mediation?: {
    required?: boolean;
    state?: string;
  };
  artifactReturn?: {
    required?: boolean;
  };
  receipts: {
    ticketDigest: string;
  };
};

export const KINSHIP_POLICY_ENGINE_ID = "kinship-policy-engine";
export const KINSHIP_POLICY_ENGINE_VERSION = "2026.03.v1";

export type KinshipRouteLawBundle = {
  routeDecision: unknown;
  cousinTicket?: unknown;
};

const ROUTE_DECISION_SCHEMA_CACHE_KEY = "acp-control-plane:route-decision";
const COUSIN_TICKET_SCHEMA_CACHE_KEY = "acp-control-plane:cousin-ticket";

function formatSchemaValidationErrors(errors: { text: string }[]): string {
  return errors.map((error) => error.text).join("; ");
}

function validateRouteLawArtifactOrThrow(params: {
  label: string;
  cacheKey: string;
  schema: Record<string, unknown>;
  value: unknown;
}): void {
  const result = validateJsonSchemaValue({
    schema: params.schema,
    cacheKey: params.cacheKey,
    value: params.value,
  });
  if (result.ok) {
    return;
  }
  throw new AcpRuntimeError(
    "ACP_SESSION_INIT_FAILED",
    `ACP ${params.label} failed frozen M12 schema validation: ${formatSchemaValidationErrors(result.errors)}`,
  );
}

function normalizeRouteLawAgentId(value: string | undefined): string {
  return normalizeText(value) ? normalizeAgentId(value) : "";
}

function routeLawParticipantsMatch(params: {
  routeLaw: SessionAcpRouteLawEnvelope;
  sourceAgentId: string;
  targetAgentId: string;
}): {
  isForwardRoute: boolean;
  isReturnRoute: boolean;
} {
  const requesterAgentId = normalizeRouteLawAgentId(params.routeLaw.requesterAgentId);
  const targetRouteAgentId = normalizeRouteLawAgentId(params.routeLaw.targetAgentId);
  if (!requesterAgentId || !targetRouteAgentId) {
    throw new AcpRuntimeError(
      "ACP_TURN_FAILED",
      "ACP inter-agent transport rejected: route-law participants are incomplete.",
    );
  }
  return {
    isForwardRoute:
      params.sourceAgentId === requesterAgentId && params.targetAgentId === targetRouteAgentId,
    isReturnRoute:
      params.sourceAgentId === targetRouteAgentId && params.targetAgentId === requesterAgentId,
  };
}

function routeLawDecisionMatches(params: {
  sourceRouteLaw: SessionAcpRouteLawEnvelope;
  targetRouteLaw: SessionAcpRouteLawEnvelope;
}): boolean {
  return (
    params.sourceRouteLaw.decisionId === params.targetRouteLaw.decisionId &&
    params.sourceRouteLaw.classification === params.targetRouteLaw.classification &&
    params.sourceRouteLaw.verdict === params.targetRouteLaw.verdict &&
    params.sourceRouteLaw.correlationId === params.targetRouteLaw.correlationId &&
    normalizeText(params.sourceRouteLaw.ticketId) === normalizeText(params.targetRouteLaw.ticketId)
  );
}

export function resolveKinshipRouteLawEnvelopeFromBundle(
  bundle: KinshipRouteLawBundle | undefined,
): SessionAcpRouteLawEnvelope | undefined {
  if (!bundle) {
    return undefined;
  }

  validateRouteLawArtifactOrThrow({
    label: "route decision",
    cacheKey: ROUTE_DECISION_SCHEMA_CACHE_KEY,
    schema: ROUTE_DECISION_SCHEMA as Record<string, unknown>,
    value: bundle.routeDecision,
  });
  if (bundle.cousinTicket !== undefined) {
    validateRouteLawArtifactOrThrow({
      label: "cousin ticket",
      cacheKey: COUSIN_TICKET_SCHEMA_CACHE_KEY,
      schema: COUSIN_TICKET_SCHEMA as Record<string, unknown>,
      value: bundle.cousinTicket,
    });
  }

  const routeDecision = bundle.routeDecision as M12RouteDecisionArtifact;
  if (routeDecision.decision.verdict === "reject") {
    const rejectSummary = routeDecision.decision.rejectReasons.join(", ");
    throw new AcpRuntimeError(
      "ACP_SESSION_INIT_FAILED",
      `ACP session rejected by frozen M12 route decision ${routeDecision.decisionId}: ${rejectSummary}`,
    );
  }
  if (routeDecision.decision.cousinTicketRequired && bundle.cousinTicket === undefined) {
    throw new AcpRuntimeError(
      "ACP_SESSION_INIT_FAILED",
      `ACP session rejected by frozen M12 route decision ${routeDecision.decisionId}: reject-missing-cousin-ticket`,
    );
  }
  if (routeDecision.decision.cousinTicketRequired && bundle.cousinTicket !== undefined) {
    const cousinTicket = bundle.cousinTicket as M12CousinTicketArtifact;
    const ticketBindingMismatched =
      cousinTicket.decisionId !== routeDecision.decisionId ||
      cousinTicket.ticketId !== routeDecision.cousinTicket?.ticketId ||
      cousinTicket.receipts.ticketDigest !== routeDecision.cousinTicket?.ticketDigest;
    if (ticketBindingMismatched) {
      throw new AcpRuntimeError(
        "ACP_SESSION_INIT_FAILED",
        `ACP session rejected by frozen M12 route decision ${routeDecision.decisionId}: reject-cousin-ticket-binding-mismatch`,
      );
    }
  }

  return {
    decisionId: routeDecision.decisionId,
    classification: routeDecision.route.classification,
    verdict: routeDecision.decision.verdict,
    rejectReasons: [...routeDecision.decision.rejectReasons],
    traceNamespace: routeDecision.trace.traceNamespace,
    receiptNamespace: routeDecision.trace.receiptNamespace,
    routeLawNamespace: routeDecision.trace.routeLawNamespace,
    approvalNamespace: routeDecision.trace.approvalNamespace,
    correlationId: routeDecision.trace.correlationId,
    requesterAgentId: normalizeAgentId(routeDecision.requester.agentId),
    requesterRole: normalizeText(routeDecision.requester.role),
    requesterSeatId: normalizeText(routeDecision.requester.seatId),
    requesterPresidentId: normalizeText(routeDecision.route.requesterPresidentId),
    requesterLineageId: normalizeText(routeDecision.requester.lineageId),
    requesterRuntimeId: normalizeText(routeDecision.requester.runtimeId),
    requesterPolicyId: normalizeText(routeDecision.requester.policyId),
    targetAgentId: normalizeAgentId(routeDecision.target.agentId),
    targetRole: normalizeText(routeDecision.target.role),
    targetSeatId: normalizeText(routeDecision.target.seatId),
    targetPresidentId: normalizeText(routeDecision.route.targetPresidentId),
    targetLineageId: normalizeText(routeDecision.target.lineageId),
    targetRuntimeId: normalizeText(routeDecision.target.runtimeId),
    targetPolicyId: normalizeText(routeDecision.target.policyId),
    sharedPresident: routeDecision.route.sharedPresident === true,
    requiresPresidentMediation:
      routeDecision.decision.requiresPresidentMediation === true ||
      (bundle.cousinTicket as M12CousinTicketArtifact | undefined)?.mediation?.required === true,
    mediationState:
      normalizeText(routeDecision.decision.mediationState) ??
      normalizeText((bundle.cousinTicket as M12CousinTicketArtifact | undefined)?.mediation?.state),
    cousinTicketRequired: routeDecision.decision.cousinTicketRequired,
    artifactReturnRequired:
      routeDecision.decision.artifactReturnRequired === true ||
      (bundle.cousinTicket as M12CousinTicketArtifact | undefined)?.artifactReturn?.required ===
        true,
    ...(routeDecision.decision.cousinTicketRequired && routeDecision.cousinTicket
      ? {
          ticketId: routeDecision.cousinTicket.ticketId,
          ticketDigest: routeDecision.cousinTicket.ticketDigest,
        }
      : {}),
  };
}

export function buildKinshipTransportPublicReceipt(routeLaw: SessionAcpRouteLawEnvelope) {
  return {
    classification: routeLaw.classification,
    correlationId: routeLaw.correlationId,
    ...(routeLaw.ticketId ? { ticketId: routeLaw.ticketId } : {}),
    ...(routeLaw.requiresPresidentMediation !== undefined
      ? { requiresPresidentMediation: routeLaw.requiresPresidentMediation }
      : {}),
    ...(routeLaw.artifactReturnRequired !== undefined
      ? { artifactReturnRequired: routeLaw.artifactReturnRequired }
      : {}),
    routeLawNamespace: routeLaw.routeLawNamespace,
    receiptNamespace: routeLaw.receiptNamespace,
  };
}

export function evaluateKinshipTransportAdmission(params: {
  requestId: string;
  sourceSessionKey: string;
  sourceAgentId: string;
  sourceRouteLaw?: SessionAcpRouteLawEnvelope;
  targetSessionKey: string;
  targetAgentId: string;
  targetRouteLaw?: SessionAcpRouteLawEnvelope;
}): SessionAcpTransportEnvelope {
  const routeLaw = params.targetRouteLaw;
  if (!routeLaw) {
    throw new AcpRuntimeError(
      "ACP_TURN_FAILED",
      `ACP native inter-agent transport requires admitted route law on ${params.targetSessionKey}.`,
    );
  }
  if (!params.sourceRouteLaw) {
    throw new AcpRuntimeError(
      "ACP_TURN_FAILED",
      `ACP inter-agent transport rejected for ${params.targetSessionKey}: ${params.sourceSessionKey} is missing admitted route law.`,
    );
  }
  if (
    !routeLawDecisionMatches({
      sourceRouteLaw: params.sourceRouteLaw,
      targetRouteLaw: routeLaw,
    })
  ) {
    throw new AcpRuntimeError(
      "ACP_TURN_FAILED",
      `ACP inter-agent transport rejected for ${params.targetSessionKey}: ${params.sourceSessionKey} route-law decision mismatch.`,
    );
  }

  const { isForwardRoute, isReturnRoute } = routeLawParticipantsMatch({
    routeLaw,
    sourceAgentId: params.sourceAgentId,
    targetAgentId: params.targetAgentId,
  });
  if (!isForwardRoute && !isReturnRoute) {
    throw new AcpRuntimeError(
      "ACP_TURN_FAILED",
      `ACP inter-agent transport rejected for ${params.targetSessionKey}: ${params.sourceSessionKey} violates Kinship route participants.`,
    );
  }
  if (routeLaw.classification === "illegal" || routeLaw.verdict !== "allow") {
    throw new AcpRuntimeError(
      "ACP_TURN_FAILED",
      `ACP inter-agent transport rejected for ${params.targetSessionKey}: route-law verdict is not allow.`,
    );
  }
  if (routeLaw.classification === "cousin" && !routeLaw.ticketId) {
    throw new AcpRuntimeError(
      "ACP_TURN_FAILED",
      `ACP inter-agent transport rejected for ${params.targetSessionKey}: cousin route requires a cousin ticket.`,
    );
  }

  return {
    contractVersion: "kinship-governed-acp-transport.v1",
    transportLayer: "acp_native",
    status: "admitted",
    direction: isForwardRoute ? "request" : "return",
    requestId: params.requestId,
    lastTurnAt: Date.now(),
    sourceSessionKey: params.sourceSessionKey,
    sourceAgentId: params.sourceAgentId,
    targetSessionKey: params.targetSessionKey,
    targetAgentId: params.targetAgentId,
    classification: routeLaw.classification,
    verdict: routeLaw.verdict,
    correlationId: routeLaw.correlationId,
    ...(routeLaw.ticketId ? { ticketId: routeLaw.ticketId } : {}),
    ...(routeLaw.requiresPresidentMediation !== undefined
      ? { requiresPresidentMediation: routeLaw.requiresPresidentMediation }
      : {}),
    ...(routeLaw.artifactReturnRequired !== undefined
      ? { artifactReturnRequired: routeLaw.artifactReturnRequired }
      : {}),
    policySnapshot: {
      engineId: KINSHIP_POLICY_ENGINE_ID,
      engineVersion: KINSHIP_POLICY_ENGINE_VERSION,
      admissionBasis: "route_law_bundle",
      decisionId: routeLaw.decisionId,
      classification: routeLaw.classification,
      verdict: routeLaw.verdict,
      source: {
        sessionKey: params.sourceSessionKey,
        agentId: params.sourceAgentId,
        role:
          routeLaw.requesterAgentId === params.sourceAgentId
            ? routeLaw.requesterRole
            : routeLaw.targetRole,
        seatId:
          routeLaw.requesterAgentId === params.sourceAgentId
            ? routeLaw.requesterSeatId
            : routeLaw.targetSeatId,
        presidentId:
          routeLaw.requesterAgentId === params.sourceAgentId
            ? routeLaw.requesterPresidentId
            : routeLaw.targetPresidentId,
        lineageId:
          routeLaw.requesterAgentId === params.sourceAgentId
            ? routeLaw.requesterLineageId
            : routeLaw.targetLineageId,
        runtimeId:
          routeLaw.requesterAgentId === params.sourceAgentId
            ? routeLaw.requesterRuntimeId
            : routeLaw.targetRuntimeId,
        policyId:
          routeLaw.requesterAgentId === params.sourceAgentId
            ? routeLaw.requesterPolicyId
            : routeLaw.targetPolicyId,
      },
      target: {
        sessionKey: params.targetSessionKey,
        agentId: params.targetAgentId,
        role:
          routeLaw.targetAgentId === params.targetAgentId
            ? routeLaw.targetRole
            : routeLaw.requesterRole,
        seatId:
          routeLaw.targetAgentId === params.targetAgentId
            ? routeLaw.targetSeatId
            : routeLaw.requesterSeatId,
        presidentId:
          routeLaw.targetAgentId === params.targetAgentId
            ? routeLaw.targetPresidentId
            : routeLaw.requesterPresidentId,
        lineageId:
          routeLaw.targetAgentId === params.targetAgentId
            ? routeLaw.targetLineageId
            : routeLaw.requesterLineageId,
        runtimeId:
          routeLaw.targetAgentId === params.targetAgentId
            ? routeLaw.targetRuntimeId
            : routeLaw.requesterRuntimeId,
        policyId:
          routeLaw.targetAgentId === params.targetAgentId
            ? routeLaw.targetPolicyId
            : routeLaw.requesterPolicyId,
      },
      obligations: {
        sharedPresident: routeLaw.sharedPresident === true,
        cousinTicketRequired: routeLaw.cousinTicketRequired === true,
        requiresPresidentMediation: routeLaw.requiresPresidentMediation === true,
        artifactReturnRequired: routeLaw.artifactReturnRequired === true,
        ...(routeLaw.mediationState ? { mediationState: routeLaw.mediationState } : {}),
        ...(routeLaw.ticketId ? { ticketId: routeLaw.ticketId } : {}),
        ...(routeLaw.ticketDigest ? { ticketDigest: routeLaw.ticketDigest } : {}),
      },
      namespaces: {
        traceNamespace: routeLaw.traceNamespace,
        receiptNamespace: routeLaw.receiptNamespace,
        routeLawNamespace: routeLaw.routeLawNamespace,
        approvalNamespace: routeLaw.approvalNamespace,
        correlationId: routeLaw.correlationId,
      },
    },
    publicReceipt: buildKinshipTransportPublicReceipt(routeLaw),
  };
}
