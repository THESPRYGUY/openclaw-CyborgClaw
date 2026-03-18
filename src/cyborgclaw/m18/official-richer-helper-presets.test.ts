import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { runOfficialM18RicherHelperPreset } from "./official-richer-helper-presets.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const tempDirs: string[] = [];

function repoPath(relativePath: string): string {
  return path.join(repoRoot, relativePath);
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe("M18 official richer-helper presets", () => {
  it("runs the clean preset through the existing entrypoint and emits a clean bundle", async () => {
    const preparedDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-preset-clean-prepared-"));
    const bundleDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-preset-clean-bundle-"));
    tempDirs.push(preparedDir, bundleDir);

    const result = await runOfficialM18RicherHelperPreset({
      preset: "source-clean",
      sourceDir: repoPath("examples/m18-official-richer-helper-bundle/source-clean"),
      preparedDir,
      bundleDir,
    });

    expect(result.emitted.disposition).toBe("CLEAN");
    expect(result.emitted.childReceipt.result).toBe("observed");
    await expect(fs.readFile(path.join(bundleDir, "PK-L01.summary"), "utf8")).resolves.toContain(
      "child_event_before_parent=yes",
    );
  });

  it("runs the bad preset through the existing entrypoint and emits an invalid bundle", async () => {
    const preparedDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-preset-bad-prepared-"));
    const bundleDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-preset-bad-bundle-"));
    tempDirs.push(preparedDir, bundleDir);

    const result = await runOfficialM18RicherHelperPreset({
      preset: "source-known-bad",
      sourceDir: repoPath("examples/m18-official-richer-helper-bundle/source-known-bad"),
      preparedDir,
      bundleDir,
    });

    expect(result.emitted.disposition).toBe("INVALID");
    expect(result.emitted.failReason).toBe("missing child evidence");
    await expect(
      fs.readFile(path.join(bundleDir, "comparable-lap-set.tsv"), "utf8"),
    ).resolves.toContain("fail=missing child evidence");
  });

  it("preserves the full expected artifact set through the preset path", async () => {
    const preparedDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-preset-files-prepared-"));
    const bundleDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-preset-files-bundle-"));
    tempDirs.push(preparedDir, bundleDir);

    await runOfficialM18RicherHelperPreset({
      preset: "source-clean",
      sourceDir: repoPath("examples/m18-official-richer-helper-bundle/source-clean"),
      preparedDir,
      bundleDir,
    });

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
