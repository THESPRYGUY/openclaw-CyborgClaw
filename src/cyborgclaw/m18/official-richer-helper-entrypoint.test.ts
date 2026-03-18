import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

import { runOfficialM18RicherHelperEntrypoint } from "./official-richer-helper-entrypoint.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const tempDirs: string[] = [];

function repoPath(relativePath: string): string {
  return path.join(repoRoot, relativePath);
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe("M18 official richer-helper entrypoint", () => {
  it("runs prep plus harness for the clean preserved-style source folder and emits a clean bundle", async () => {
    const preparedDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-entry-clean-prepared-"));
    const bundleDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-entry-clean-bundle-"));
    tempDirs.push(preparedDir, bundleDir);

    const result = await runOfficialM18RicherHelperEntrypoint({
      sourceDir: repoPath("examples/m18-official-richer-helper-bundle/source-clean"),
      preparedDir,
      bundleDir,
      lapId: "PK-L01",
      lapNumber: 1,
      approvalFileName: "approval-source.json",
      parentTranscriptFileName: "747ce949-f54d-4058-be66-cb63866bd312.jsonl.reset.2026-03-17T16-53-32.513Z",
      childTranscriptFileName: "0fda66f8-ed45-4755-ba51-24a92bc1785e.jsonl.deleted.2026-03-17T17-46-52.119Z",
    });

    expect(result.emitted.disposition).toBe("CLEAN");
    expect(result.emitted.childReceipt.result).toBe("observed");
    await expect(fs.readFile(path.join(bundleDir, "approval-checkpoint.json"), "utf8")).resolves.toContain(
      "\"kind\": \"approval.checkpoint\"",
    );
    await expect(fs.readFile(path.join(bundleDir, "PK-L01.summary"), "utf8")).resolves.toContain(
      "child_event_before_parent=yes",
    );
    await expect(
      fs.readFile(path.join(bundleDir, "PK-L01.child.receipt.json"), "utf8"),
    ).resolves.toContain("\"result\": \"observed\"");
  });

  it("runs prep plus harness for the bad preserved-style source folder and emits an invalid bundle", async () => {
    const preparedDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-entry-bad-prepared-"));
    const bundleDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-entry-bad-bundle-"));
    tempDirs.push(preparedDir, bundleDir);

    const result = await runOfficialM18RicherHelperEntrypoint({
      sourceDir: repoPath("examples/m18-official-richer-helper-bundle/source-known-bad"),
      preparedDir,
      bundleDir,
      lapId: "PK-L03",
      lapNumber: 3,
      approvalFileName: "approval-source.json",
      parentTranscriptFileName: "747ce949-f54d-4058-be66-cb63866bd312.jsonl.reset.2026-03-17T16-46-18.698Z",
      childTranscriptFileName: "e83c40cf-4f61-4eaa-8a68-c6465fab85df.jsonl.deleted.2026-03-17T17-46-52.119Z",
    });

    expect(result.emitted.disposition).toBe("INVALID");
    expect(result.emitted.failReason).toBe("missing child evidence");
    await expect(fs.readFile(path.join(bundleDir, "comparable-lap-set.tsv"), "utf8")).resolves.toContain(
      "fail=missing child evidence",
    );
  });

  it("emits the full expected artifact set through the entrypoint path", async () => {
    const preparedDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-entry-files-prepared-"));
    const bundleDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-entry-files-bundle-"));
    tempDirs.push(preparedDir, bundleDir);

    await runOfficialM18RicherHelperEntrypoint({
      sourceDir: repoPath("examples/m18-official-richer-helper-bundle/source-clean"),
      preparedDir,
      bundleDir,
      lapId: "PK-L01",
      lapNumber: 1,
      approvalFileName: "approval-source.json",
      parentTranscriptFileName: "747ce949-f54d-4058-be66-cb63866bd312.jsonl.reset.2026-03-17T16-53-32.513Z",
      childTranscriptFileName: "0fda66f8-ed45-4755-ba51-24a92bc1785e.jsonl.deleted.2026-03-17T17-46-52.119Z",
    });

    await expect(fs.readFile(path.join(preparedDir, "approval-checkpoint.json"), "utf8")).resolves.toContain(
      "\"checkpointId\"",
    );
    await expect(fs.readFile(path.join(preparedDir, "PK-L01.parent.delta.jsonl"), "utf8")).resolves.toContain(
      "sessions_spawn",
    );
    await expect(fs.readFile(path.join(preparedDir, "PK-L01.child.transcript.jsonl"), "utf8")).resolves.toContain(
      "\"id\":\"0fda66f8-ed45-4755-ba51-24a92bc1785e\"",
    );

    const emittedFiles = await fs.readdir(bundleDir);
    expect(emittedFiles.toSorted()).toEqual([
      "PK-L01.audit.json",
      "PK-L01.child.receipt.json",
      "PK-L01.parent.delta.jsonl",
      "PK-L01.summary",
      "approval-checkpoint.json",
      "comparable-lap-set.tsv",
    ]);
  });
});
