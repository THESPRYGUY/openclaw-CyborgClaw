import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import CLEAN_COUSIN_TICKET_JSON from "../../../examples/route-law-bundle/clean/cousin-ticket.json" with { type: "json" };
import CLEAN_ROUTE_DECISION_JSON from "../../../examples/route-law-bundle/clean/route-decision.json" with { type: "json" };
import { AcpRuntimeError } from "../runtime/errors.js";
import {
  KINSHIP_POLICY_CONFIG_ENV,
  writeKinshipPolicyEngineState,
} from "./kinship-policy-config.js";
import {
  evaluateKinshipTransportAdmission,
  resolveKinshipRouteLawEnvelopeFromBundle,
} from "./kinship-policy-engine.js";

const ORIGINAL_POLICY_CONFIG_PATH = process.env[KINSHIP_POLICY_CONFIG_ENV];

afterEach(() => {
  if (ORIGINAL_POLICY_CONFIG_PATH === undefined) {
    delete process.env[KINSHIP_POLICY_CONFIG_ENV];
  } else {
    process.env[KINSHIP_POLICY_CONFIG_ENV] = ORIGINAL_POLICY_CONFIG_PATH;
  }
});

function withTempPolicyPath(): {
  dir: string;
  filePath: string;
} {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kinship-policy-engine-"));
  return {
    dir,
    filePath: path.join(dir, "kinship-policy-engine.json"),
  };
}

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
        engineVersion: "2026.03.v2",
        admissionBasis: "route_law_bundle",
        decisionId: CLEAN_ROUTE_DECISION_JSON.decisionId,
        classification: "cousin",
        verdict: "allow",
        policySetId: "workforce-alpha-default",
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

  it("reloads dynamic Kinship policy config without requiring a restart", () => {
    const { dir, filePath } = withTempPolicyPath();
    process.env[KINSHIP_POLICY_CONFIG_ENV] = filePath;
    try {
      writeKinshipPolicyEngineState({
        contractVersion: "kinship-policy-engine-config.v1",
        engineId: "kinship-policy-engine",
        engineVersion: "2026.03.v2",
        activePolicySetId: "workforce-alpha-shadow",
        updatedAt: "2026-03-24T04:00:00.000Z",
        policySets: [
          {
            policySetId: "workforce-alpha-shadow",
            label: "Shadow workforce policy",
            scope: "workforce_alpha",
            state: "active",
            updatedAt: "2026-03-24T04:00:00.000Z",
            routeClasses: {
              cousin: {
                allow: true,
                requirePresidentMediation: true,
                requireArtifactReturn: true,
                requireCousinTicket: true,
              },
            },
          },
        ],
      });

      expect(
        resolveKinshipRouteLawEnvelopeFromBundle({
          routeDecision: CLEAN_ROUTE_DECISION_JSON,
          cousinTicket: CLEAN_COUSIN_TICKET_JSON,
        }),
      ).toMatchObject({
        decisionId: CLEAN_ROUTE_DECISION_JSON.decisionId,
      });

      writeKinshipPolicyEngineState({
        contractVersion: "kinship-policy-engine-config.v1",
        engineId: "kinship-policy-engine",
        engineVersion: "2026.03.v2",
        activePolicySetId: "workforce-alpha-shadow",
        updatedAt: "2026-03-24T04:05:00.000Z",
        policySets: [
          {
            policySetId: "workforce-alpha-shadow",
            label: "Shadow workforce policy",
            scope: "workforce_alpha",
            state: "active",
            updatedAt: "2026-03-24T04:05:00.000Z",
            routeClasses: {
              cousin: {
                allow: false,
              },
            },
          },
        ],
      });

      expect(() =>
        resolveKinshipRouteLawEnvelopeFromBundle({
          routeDecision: CLEAN_ROUTE_DECISION_JSON,
          cousinTicket: CLEAN_COUSIN_TICKET_JSON,
        }),
      ).toThrow(/disabled by active Kinship policy/i);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("stamps the active dynamic policy set onto admitted transport metadata", () => {
    const { dir, filePath } = withTempPolicyPath();
    process.env[KINSHIP_POLICY_CONFIG_ENV] = filePath;
    try {
      writeKinshipPolicyEngineState({
        contractVersion: "kinship-policy-engine-config.v1",
        engineId: "kinship-policy-engine",
        engineVersion: "2026.03.v2",
        activePolicySetId: "workforce-alpha-shadow",
        updatedAt: "2026-03-24T04:10:00.000Z",
        policySets: [
          {
            policySetId: "workforce-alpha-shadow",
            label: "Shadow workforce policy",
            scope: "workforce_alpha",
            state: "active",
            updatedAt: "2026-03-24T04:10:00.000Z",
            routeClasses: {
              cousin: {
                allow: true,
                requirePresidentMediation: true,
                requireArtifactReturn: true,
                requireCousinTicket: true,
              },
            },
          },
        ],
      });

      const routeLaw = resolveKinshipRouteLawEnvelopeFromBundle({
        routeDecision: CLEAN_ROUTE_DECISION_JSON,
        cousinTicket: CLEAN_COUSIN_TICKET_JSON,
      });
      if (!routeLaw) {
        throw new Error("expected route law");
      }

      const transport = evaluateKinshipTransportAdmission({
        requestId: "transport-turn-dynamic",
        sourceSessionKey: "agent:engineering-seat:acp:source",
        sourceAgentId: "engineering-seat",
        sourceRouteLaw: routeLaw,
        targetSessionKey: "agent:ops-seat:acp:target",
        targetAgentId: "ops-seat",
        targetRouteLaw: routeLaw,
      });

      expect(transport.policySnapshot).toMatchObject({
        engineId: "kinship-policy-engine",
        engineVersion: "2026.03.v2",
        policySource: "file",
        policySetId: "workforce-alpha-shadow",
        policySetLabel: "Shadow workforce policy",
        policyConfigPath: filePath,
      });
      expect(transport.policySnapshot.policyConfigDigest).toMatch(/[a-f0-9]{16}/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
