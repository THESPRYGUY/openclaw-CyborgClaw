import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

import {
  emitOfficialM18RicherHelperBundleFromFixture,
  loadOfficialM18RicherHelperFixtureInputs,
} from "./official-richer-helper-harness.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const tempDirs: string[] = [];

function fixturePath(relativePath: string): string {
  return path.join(repoRoot, relativePath);
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe("M18 official richer-helper harness", () => {
  it("loads fixture-backed lane inputs and emits a complete clean bundle", async () => {
    const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-harness-clean-"));
    tempDirs.push(outputDir);

    const result = await emitOfficialM18RicherHelperBundleFromFixture({
      fixtureDir: fixturePath("examples/m18-official-richer-helper-bundle/fixture-clean"),
      outputDir,
      lapId: "RH-O01",
      lapNumber: 1,
    });

    expect(result.disposition).toBe("CLEAN");
    expect(result.failReason).toBe("");
    expect(result.childReceipt.result).toBe("observed");
    await expect(fs.readFile(path.join(outputDir, "approval-checkpoint.json"), "utf8")).resolves.toContain(
      "\"kind\": \"approval.checkpoint\"",
    );
    await expect(fs.readFile(path.join(outputDir, "RH-O01.summary"), "utf8")).resolves.toContain(
      "child_event_before_parent=yes",
    );
    await expect(
      fs.readFile(path.join(outputDir, "RH-O01.parent.delta.jsonl"), "utf8"),
    ).resolves.toContain("sessions_spawn");
    await expect(
      fs.readFile(path.join(outputDir, "RH-O01.child.receipt.json"), "utf8"),
    ).resolves.toContain("\"childSessionId\": \"child-session:m18:official-richer-helper:01\"");
    await expect(fs.readFile(path.join(outputDir, "comparable-lap-set.tsv"), "utf8")).resolves.toContain(
      "\tCLEAN\t",
    );
  });

  it("emits an invalid bundle when the fixture lane has ordering contradiction and missing child evidence", async () => {
    const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-harness-bad-"));
    tempDirs.push(outputDir);

    const result = await emitOfficialM18RicherHelperBundleFromFixture({
      fixtureDir: fixturePath("examples/m18-official-richer-helper-bundle/fixture-known-bad"),
      outputDir,
      lapId: "RH-O02",
      lapNumber: 2,
    });

    expect(result.disposition).toBe("INVALID");
    expect(result.failReason).toBe("ordering contradiction");
    expect(result.childReceipt.result).toBe("invalid");
    await expect(fs.readFile(path.join(outputDir, "comparable-lap-set.tsv"), "utf8")).resolves.toContain(
      "fail=ordering contradiction",
    );
  });

  it("keeps child receipt, summary, and parent delta identities aligned for the clean fixture", async () => {
    const inputs = await loadOfficialM18RicherHelperFixtureInputs({
      fixtureDir: fixturePath("examples/m18-official-richer-helper-bundle/fixture-clean"),
      lapId: "RH-O01",
    });
    const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-harness-align-"));
    tempDirs.push(outputDir);

    const result = await emitOfficialM18RicherHelperBundleFromFixture({
      fixtureDir: fixturePath("examples/m18-official-richer-helper-bundle/fixture-clean"),
      outputDir,
      lapId: "RH-O01",
      lapNumber: 1,
    });

    expect(inputs.summaryText).toContain("parent_run_id=run:m18:official-richer-helper:01");
    expect(inputs.summaryText).toContain(
      "child_key=agent:main:subagent:11111111-2222-3333-4444-555555555555",
    );
    expect(inputs.parentDeltaText).toContain("spawn:m18:official-richer-helper:01");
    expect(result.childReceipt.parentRunId).toBe("run:m18:official-richer-helper:01");
    expect(result.childReceipt.childSessionKey).toBe(
      "agent:main:subagent:11111111-2222-3333-4444-555555555555",
    );
    expect(result.childReceipt.spawnRunId).toBe("spawn:m18:official-richer-helper:01");
  });
});
