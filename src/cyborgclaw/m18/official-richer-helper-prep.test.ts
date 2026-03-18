import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { emitOfficialM18RicherHelperBundleFromFixture } from "./official-richer-helper-harness.js";
import { normalizeOfficialM18RicherHelperHarnessInputs } from "./official-richer-helper-prep.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const tempDirs: string[] = [];

function repoPath(relativePath: string): string {
  return path.join(repoRoot, relativePath);
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe("M18 official richer-helper prep", () => {
  it("normalizes preserved-style clean source artifacts into a harness-ready folder", async () => {
    const preparedDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-prep-clean-"));
    const bundleDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-prep-clean-bundle-"));
    tempDirs.push(preparedDir, bundleDir);

    const normalized = await normalizeOfficialM18RicherHelperHarnessInputs({
      outputDir: preparedDir,
      lapId: "PK-L01",
      approvalCheckpointPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-clean/approval-source.json",
      ),
      summaryPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-clean/PK-L01.summary",
      ),
      auditPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-clean/PK-L01.audit.json",
      ),
      parentTranscriptPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-clean/747ce949-f54d-4058-be66-cb63866bd312.jsonl.reset.2026-03-17T16-53-32.513Z",
      ),
      childTranscriptPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-clean/0fda66f8-ed45-4755-ba51-24a92bc1785e.jsonl.deleted.2026-03-17T17-46-52.119Z",
      ),
    });

    await expect(fs.readFile(normalized.files.summaryPath, "utf8")).resolves.toContain(
      "lap=PK-L01",
    );
    await expect(fs.readFile(normalized.files.parentDeltaPath, "utf8")).resolves.toContain(
      "sessions_spawn",
    );

    const result = await emitOfficialM18RicherHelperBundleFromFixture({
      fixtureDir: normalized.fixtureDir,
      outputDir: bundleDir,
      lapId: "PK-L01",
      lapNumber: 1,
    });

    expect(result.disposition).toBe("CLEAN");
    expect(result.childReceipt.result).toBe("observed");
    expect(result.childReceipt.parentRunId).toBe("f52234ef-a04f-42e1-ae25-b82defbd1392");
    expect(result.childReceipt.childSessionId).toBe("0fda66f8-ed45-4755-ba51-24a92bc1785e");
  });

  it("normalizes preserved-style bad source artifacts and the harness grades them invalid", async () => {
    const preparedDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-prep-bad-"));
    const bundleDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-prep-bad-bundle-"));
    tempDirs.push(preparedDir, bundleDir);

    const normalized = await normalizeOfficialM18RicherHelperHarnessInputs({
      outputDir: preparedDir,
      lapId: "PK-L03",
      approvalCheckpointPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-known-bad/approval-source.json",
      ),
      summaryPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-known-bad/PK-L03.summary",
      ),
      auditPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-known-bad/PK-L03.audit.json",
      ),
      parentTranscriptPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-known-bad/747ce949-f54d-4058-be66-cb63866bd312.jsonl.reset.2026-03-17T16-46-18.698Z",
      ),
      childTranscriptPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-known-bad/e83c40cf-4f61-4eaa-8a68-c6465fab85df.jsonl.deleted.2026-03-17T17-46-52.119Z",
      ),
    });

    const result = await emitOfficialM18RicherHelperBundleFromFixture({
      fixtureDir: normalized.fixtureDir,
      outputDir: bundleDir,
      lapId: "PK-L03",
      lapNumber: 3,
    });

    expect(result.disposition).toBe("INVALID");
    expect(result.failReason).toBe("missing child evidence");
    expect(result.childReceipt.result).toBe("invalid");
  });

  it("preserves lap, run, and session identity in the normalized folder shape", async () => {
    const preparedDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-prep-align-"));
    tempDirs.push(preparedDir);

    const normalized = await normalizeOfficialM18RicherHelperHarnessInputs({
      outputDir: preparedDir,
      lapId: "PK-L01",
      approvalCheckpointPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-clean/approval-source.json",
      ),
      summaryPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-clean/PK-L01.summary",
      ),
      auditPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-clean/PK-L01.audit.json",
      ),
      parentTranscriptPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-clean/747ce949-f54d-4058-be66-cb63866bd312.jsonl.reset.2026-03-17T16-53-32.513Z",
      ),
      childTranscriptPath: repoPath(
        "examples/m18-official-richer-helper-bundle/source-clean/0fda66f8-ed45-4755-ba51-24a92bc1785e.jsonl.deleted.2026-03-17T17-46-52.119Z",
      ),
    });

    await expect(fs.readFile(normalized.files.summaryPath, "utf8")).resolves.toContain(
      "parent_run_id=f52234ef-a04f-42e1-ae25-b82defbd1392",
    );
    await expect(fs.readFile(normalized.files.summaryPath, "utf8")).resolves.toContain(
      "child_session_id=0fda66f8-ed45-4755-ba51-24a92bc1785e",
    );
    await expect(fs.readFile(normalized.files.parentDeltaPath, "utf8")).resolves.toContain(
      "020d28fc-d7cc-427b-91e3-ed3cf1b3aa15",
    );
    await expect(fs.readFile(normalized.files.childTranscriptPath, "utf8")).resolves.toContain(
      '"id":"0fda66f8-ed45-4755-ba51-24a92bc1785e"',
    );
  });
});
