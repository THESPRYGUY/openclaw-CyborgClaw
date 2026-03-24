import { describe, expect, it } from "vitest";
import CLEAN_COUSIN_TICKET_JSON from "../../../examples/route-law-bundle/clean/cousin-ticket.json" with { type: "json" };
import CLEAN_ROUTE_DECISION_JSON from "../../../examples/route-law-bundle/clean/route-decision.json" with { type: "json" };
import { AcpRuntimeError } from "../runtime/errors.js";
import {
  evaluateKinshipTransportAdmission,
  resolveKinshipRouteLawEnvelopeFromBundle,
} from "./kinship-policy-engine.js";

describe("kinship-policy-engine", () => {
  it("resolves a Kinship route-law bundle into an admitted envelope", () => {
    const routeLaw = resolveKinshipRouteLawEnvelopeFromBundle({
      routeDecision: CLEAN_ROUTE_DECISION_JSON,
      cousinTicket: CLEAN_COUSIN_TICKET_JSON,
    });

    expect(routeLaw).toMatchObject({
      decisionId: CLEAN_ROUTE_DECISION_JSON.decisionId,
      classification: CLEAN_ROUTE_DECISION_JSON.route.classification,
      verdict: "allow",
      requesterAgentId: CLEAN_ROUTE_DECISION_JSON.requester.agentId,
      targetAgentId: CLEAN_ROUTE_DECISION_JSON.target.agentId,
      sharedPresident: CLEAN_ROUTE_DECISION_JSON.route.sharedPresident,
      cousinTicketRequired: true,
      requiresPresidentMediation: true,
      artifactReturnRequired: true,
      ticketId: CLEAN_ROUTE_DECISION_JSON.cousinTicket.ticketId,
      ticketDigest: CLEAN_ROUTE_DECISION_JSON.cousinTicket.ticketDigest,
    });
  });

  it("rejects route-law bundles that require a cousin ticket but omit it", () => {
    expect(() =>
      resolveKinshipRouteLawEnvelopeFromBundle({
        routeDecision: CLEAN_ROUTE_DECISION_JSON,
      }),
    ).toThrow(AcpRuntimeError);

    expect(() =>
      resolveKinshipRouteLawEnvelopeFromBundle({
        routeDecision: CLEAN_ROUTE_DECISION_JSON,
      }),
    ).toThrow(/reject-missing-cousin-ticket/i);
  });

  it("admits transport through the consolidated policy engine and stamps policy snapshot metadata", () => {
    const routeLaw = resolveKinshipRouteLawEnvelopeFromBundle({
      routeDecision: CLEAN_ROUTE_DECISION_JSON,
      cousinTicket: CLEAN_COUSIN_TICKET_JSON,
    });
    expect(routeLaw).toBeDefined();
    if (!routeLaw) {
      return;
    }

    const transport = evaluateKinshipTransportAdmission({
      requestId: "transport-turn-1",
      sourceSessionKey: "agent:engineering-seat:acp:source",
      sourceAgentId: "engineering-seat",
      sourceRouteLaw: routeLaw,
      targetSessionKey: "agent:ops-seat:acp:target",
      targetAgentId: "ops-seat",
      targetRouteLaw: routeLaw,
    });

    expect(transport).toMatchObject({
      contractVersion: "kinship-governed-acp-transport.v1",
      transportLayer: "acp_native",
      status: "admitted",
      direction: "request",
      classification: "cousin",
      verdict: "allow",
      ticketId: CLEAN_ROUTE_DECISION_JSON.cousinTicket.ticketId,
      policySnapshot: {
        engineId: "kinship-policy-engine",
        engineVersion: "2026.03.v1",
        admissionBasis: "route_law_bundle",
        decisionId: CLEAN_ROUTE_DECISION_JSON.decisionId,
        classification: "cousin",
        verdict: "allow",
        source: {
          sessionKey: "agent:engineering-seat:acp:source",
          agentId: "engineering-seat",
        },
        target: {
          sessionKey: "agent:ops-seat:acp:target",
          agentId: "ops-seat",
        },
        obligations: {
          sharedPresident: false,
          cousinTicketRequired: true,
          requiresPresidentMediation: true,
          artifactReturnRequired: true,
          ticketId: CLEAN_ROUTE_DECISION_JSON.cousinTicket.ticketId,
          ticketDigest: CLEAN_ROUTE_DECISION_JSON.cousinTicket.ticketDigest,
        },
        namespaces: {
          routeLawNamespace: CLEAN_ROUTE_DECISION_JSON.trace.routeLawNamespace,
          receiptNamespace: CLEAN_ROUTE_DECISION_JSON.trace.receiptNamespace,
          approvalNamespace: CLEAN_ROUTE_DECISION_JSON.trace.approvalNamespace,
          correlationId: CLEAN_ROUTE_DECISION_JSON.trace.correlationId,
        },
      },
      publicReceipt: {
        classification: "cousin",
        correlationId: CLEAN_ROUTE_DECISION_JSON.trace.correlationId,
        ticketId: CLEAN_ROUTE_DECISION_JSON.cousinTicket.ticketId,
      },
    });
  });

  it("rejects transport admission when the source session lacks admitted route law", () => {
    const routeLaw = resolveKinshipRouteLawEnvelopeFromBundle({
      routeDecision: CLEAN_ROUTE_DECISION_JSON,
      cousinTicket: CLEAN_COUSIN_TICKET_JSON,
    });
    expect(routeLaw).toBeDefined();
    if (!routeLaw) {
      return;
    }

    expect(() =>
      evaluateKinshipTransportAdmission({
        requestId: "transport-turn-2",
        sourceSessionKey: "agent:engineering-seat:acp:source",
        sourceAgentId: "engineering-seat",
        targetSessionKey: "agent:ops-seat:acp:target",
        targetAgentId: "ops-seat",
        targetRouteLaw: routeLaw,
      }),
    ).toThrow(/missing admitted route law/i);
  });

  it("rejects transport admission when source and target sessions disagree on the Kinship decision", () => {
    const routeLaw = resolveKinshipRouteLawEnvelopeFromBundle({
      routeDecision: CLEAN_ROUTE_DECISION_JSON,
      cousinTicket: CLEAN_COUSIN_TICKET_JSON,
    });
    expect(routeLaw).toBeDefined();
    if (!routeLaw) {
      return;
    }

    expect(() =>
      evaluateKinshipTransportAdmission({
        requestId: "transport-turn-3",
        sourceSessionKey: "agent:engineering-seat:acp:source",
        sourceAgentId: "engineering-seat",
        sourceRouteLaw: routeLaw,
        targetSessionKey: "agent:ops-seat:acp:target",
        targetAgentId: "ops-seat",
        targetRouteLaw: {
          ...routeLaw,
          decisionId: "route-law-mismatch",
        },
      }),
    ).toThrow(/route-law decision mismatch/i);
  });
});
