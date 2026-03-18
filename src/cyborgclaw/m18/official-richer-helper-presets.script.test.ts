import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const tempDirs: string[] = [];

function repoPath(relativePath: string): string {
  return path.join(repoRoot, relativePath);
}

async function runScript(args: {
  preset: "source-clean" | "source-known-bad";
  sourceDir: string;
  preparedDir: string;
  bundleDir: string;
}): Promise<void> {
  await execFileAsync(
    process.execPath,
    [
      "--import",
      "tsx",
      "src/cyborgclaw/m18/official-richer-helper-presets.script.ts",
      "--preset",
      args.preset,
      "--source-dir",
      args.sourceDir,
      "--prepared-dir",
      args.preparedDir,
      "--bundle-dir",
      args.bundleDir,
    ],
    {
      cwd: repoRoot,
    },
  );
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe("M18 official richer-helper preset script", () => {
  it("runs the clean preset end-to-end and emits a clean bundle", async () => {
    const preparedDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-script-clean-prepared-"));
    const bundleDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-script-clean-bundle-"));
    tempDirs.push(preparedDir, bundleDir);

    await runScript({
      preset: "source-clean",
      sourceDir: repoPath("examples/m18-official-richer-helper-bundle/source-clean"),
      preparedDir,
      bundleDir,
    });

    await expect(fs.readFile(path.join(bundleDir, "PK-L01.summary"), "utf8")).resolves.toContain(
      "result=CLEAN",
    );
    await expect(
      fs.readFile(path.join(bundleDir, "PK-L01.child.receipt.json"), "utf8"),
    ).resolves.toContain('"result": "observed"');
  });

  it("runs the bad preset end-to-end and emits an invalid bundle", async () => {
    const preparedDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-script-bad-prepared-"));
    const bundleDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-script-bad-bundle-"));
    tempDirs.push(preparedDir, bundleDir);

    await runScript({
      preset: "source-known-bad",
      sourceDir: repoPath("examples/m18-official-richer-helper-bundle/source-known-bad"),
      preparedDir,
      bundleDir,
    });

    await expect(fs.readFile(path.join(bundleDir, "PK-L03.summary"), "utf8")).resolves.toContain(
      "result=INVALID",
    );
    await expect(
      fs.readFile(path.join(bundleDir, "comparable-lap-set.tsv"), "utf8"),
    ).resolves.toContain("fail=missing child evidence");
  });

  it("emits the full expected artifact set through the script entry", async () => {
    const preparedDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-script-files-prepared-"));
    const bundleDir = await fs.mkdtemp(path.join(os.tmpdir(), "m18-rh-script-files-bundle-"));
    tempDirs.push(preparedDir, bundleDir);

    await runScript({
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
