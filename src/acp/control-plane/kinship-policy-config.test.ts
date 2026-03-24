import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  KINSHIP_POLICY_CONFIG_ENV,
  loadKinshipPolicyEngineState,
  writeKinshipPolicyEngineState,
} from "./kinship-policy-config.js";

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
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kinship-policy-config-"));
  return {
    dir,
    filePath: path.join(dir, "kinship-policy-engine.json"),
  };
}

describe("kinship-policy-config", () => {
  it("falls back to the baked-in Kinship policy floor when no dynamic policy file exists", () => {
    const { dir, filePath } = withTempPolicyPath();
    process.env[KINSHIP_POLICY_CONFIG_ENV] = filePath;
    try {
      const state = loadKinshipPolicyEngineState();

      expect(state.source).toBe("default");
      expect(state.path).toBe(filePath);
      expect(state.activePolicySet.policySetId).toBe("workforce-alpha-default");
      expect(state.activePolicySet.routeClasses.cousin.requireCousinTicket).toBe(true);
      expect(state.activePolicySet.routeClasses.illegal.allow).toBe(false);
      expect(state.issues.length).toBeGreaterThan(0);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("tightens dynamic Kinship policy overlays instead of weakening the baked-in floor", () => {
    const { dir, filePath } = withTempPolicyPath();
    process.env[KINSHIP_POLICY_CONFIG_ENV] = filePath;
    try {
      writeKinshipPolicyEngineState({
        contractVersion: "kinship-policy-engine-config.v1",
        engineId: "kinship-policy-engine",
        engineVersion: "2026.03.v2",
        activePolicySetId: "workforce-alpha-shadow",
        updatedAt: "2026-03-24T05:00:00.000Z",
        policySets: [
          {
            policySetId: "workforce-alpha-shadow",
            label: "Shadow workforce policy",
            scope: "workforce_alpha",
            state: "active",
            updatedAt: "2026-03-24T05:00:00.000Z",
            routeClasses: {
              child: {
                allow: true,
                requireParticipantMatch: false,
                requireDecisionParity: false,
              },
              cousin: {
                allow: false,
                requirePresidentMediation: false,
                requireArtifactReturn: false,
                requireCousinTicket: false,
              },
            },
          },
        ],
      });

      const state = loadKinshipPolicyEngineState();

      expect(state.source).toBe("file");
      expect(state.activePolicySet.policySetId).toBe("workforce-alpha-shadow");
      expect(state.activePolicySet.routeClasses.child.allow).toBe(true);
      expect(state.activePolicySet.routeClasses.child.requireParticipantMatch).toBe(true);
      expect(state.activePolicySet.routeClasses.child.requireDecisionParity).toBe(true);
      expect(state.activePolicySet.routeClasses.cousin.allow).toBe(false);
      expect(state.activePolicySet.routeClasses.cousin.requirePresidentMediation).toBe(true);
      expect(state.activePolicySet.routeClasses.cousin.requireArtifactReturn).toBe(true);
      expect(state.activePolicySet.routeClasses.cousin.requireCousinTicket).toBe(true);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
