import { describe, expect, it } from "vitest";
import {
  computeVoltarisV2Digests,
  validateVoltarisV2Pack,
} from "../src/cyborgclaw/genome/index.js";

describe("Voltaris V2 pack proof", () => {
  it("validates the governed master-genome pack", async () => {
    const result = await validateVoltarisV2Pack();
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("computes distinct canonical digests for the frozen manifests", async () => {
    const digests = await computeVoltarisV2Digests();
    expect(digests.manifests.lineageCanonicalDigest).not.toBe(
      digests.manifests.runtimeCanonicalDigest,
    );
    expect(digests.manifests.runtimeCanonicalDigest).not.toBe(
      digests.manifests.policyCanonicalDigest,
    );
  });
});
