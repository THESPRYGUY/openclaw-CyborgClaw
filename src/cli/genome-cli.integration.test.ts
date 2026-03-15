import fs from "node:fs/promises";
import path from "node:path";
import { Command } from "commander";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withTempHome } from "../../test/helpers/temp-home.js";
import { clearConfigCache, loadConfig, writeConfigFile } from "../config/config.js";

const runtimeCapture = vi.hoisted(() => {
  const runtimeLogs: string[] = [];
  const runtimeErrors: string[] = [];
  const stringifyArgs = (args: unknown[]) => args.map((value) => String(value)).join(" ");

  return {
    runtimeLogs,
    runtimeErrors,
    defaultRuntime: {
      log: (...args: unknown[]) => {
        runtimeLogs.push(stringifyArgs(args));
      },
      error: (...args: unknown[]) => {
        runtimeErrors.push(stringifyArgs(args));
      },
      exit: (code: number) => {
        throw new Error(`__exit__:${code}`);
      },
    },
    resetRuntimeCapture: () => {
      runtimeLogs.length = 0;
      runtimeErrors.length = 0;
    },
  };
});

vi.mock("../runtime.js", () => ({
  defaultRuntime: runtimeCapture.defaultRuntime,
}));

const { runtimeLogs, runtimeErrors, resetRuntimeCapture } = runtimeCapture;

const { registerGenomeCli } = await import("./genome-cli.js");

describe("genome CLI integration", () => {
  async function runCli(args: string[]) {
    const program = new Command();
    registerGenomeCli(program);
    try {
      await program.parseAsync(args, { from: "user" });
    } catch (error) {
      if (!(error instanceof Error && error.message.startsWith("__exit__:"))) {
        throw error;
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks();
    resetRuntimeCapture();
    clearConfigCache();
  });

  afterEach(() => {
    clearConfigCache();
    delete process.env.OPENCLAW_PROFILE;
  });

  it("validates the Voltaris golden fixture through the real CLI path", async () => {
    await runCli(["genome", "validate", "examples/voltaris-v2-pack", "--json"]);

    const payload = JSON.parse(runtimeLogs[0] ?? "{}") as {
      status?: string;
      packageId?: string;
      genomeId?: string | null;
      lineageId?: string | null;
    };
    expect(payload.status).toBe("valid");
    expect(payload.packageId).toBe("voltaris-v2.pack");
    expect(payload.genomeId).toBe("cyborgclaw/voltaris-v2/master");
    expect(payload.lineageId).toBe("lineage.cyborgclaw.voltaris-v2.master");
  });

  it("plans deployment with profile-aware paths and performs no writes", async () => {
    await withTempHome(async (home) => {
      await writeConfigFile({
        agents: {
          list: [{ id: "voltaris-v2", default: true }],
        },
      });
      clearConfigCache();

      await runCli([
        "genome",
        "plan-deploy",
        "examples/voltaris-v2-pack",
        "--profile",
        "lab",
        "--json",
      ]);

      const payload = JSON.parse(runtimeLogs[0] ?? "{}") as {
        status?: string;
        dryRun?: boolean;
        target?: {
          profile?: string;
          workspaceDir?: string;
          agentDir?: string;
          managedPackRoot?: string;
        };
        untouchedGatewaySurfaces?: string[];
      };
      expect(payload.status).toBe("planned");
      expect(payload.dryRun).toBe(true);
      expect(payload.target?.profile).toBe("lab");
      expect(payload.target?.workspaceDir).toBe(path.join(home, ".openclaw", "workspace-lab"));
      expect(payload.target?.agentDir).toBe(
        path.join(home, ".openclaw", "agents", "voltaris-v2", "agent"),
      );
      expect(payload.target?.managedPackRoot).toContain(
        path.join(
          ".openclaw",
          "agents",
          "voltaris-v2",
          "agent",
          "cyborgclaw",
          "genome",
          "packs",
          "voltaris-v2.pack",
        ),
      );
      expect(payload.untouchedGatewaySurfaces).toEqual(
        expect.arrayContaining([
          "sessions",
          "routing",
          "channel state",
          "approvals",
          "control-plane truth",
        ]),
      );

      await expect(fs.stat(path.join(home, ".openclaw", "workspace-lab"))).rejects.toMatchObject({
        code: "ENOENT",
      });
      await expect(
        fs.stat(path.join(home, ".openclaw", "agents", "voltaris-v2", "agent")),
      ).rejects.toMatchObject({
        code: "ENOENT",
      });
    });
  });

  it("requires explicit confirmation before apply-deploy writes", async () => {
    await withTempHome(async () => {
      await runCli(["genome", "apply-deploy", "examples/voltaris-v2-pack"]);

      expect(runtimeErrors[0]).toContain("apply-deploy requires --force");
    });
  });

  it("applies only allowed artifact surfaces and leaves Gateway-owned state untouched", async () => {
    await withTempHome(async (home) => {
      await runCli([
        "genome",
        "apply-deploy",
        "examples/voltaris-v2-pack",
        "--force",
        "--write-config",
        "--json",
      ]);

      const payload = JSON.parse(runtimeLogs[0] ?? "{}") as {
        status?: string;
        writtenFiles?: string[];
        configWritten?: boolean;
        buildReceipt?: { deployedPath?: string };
      };
      expect(payload.status).toBe("applied");
      expect(payload.configWritten).toBe(true);
      expect(payload.writtenFiles).toEqual(
        expect.arrayContaining([
          path.join(home, ".openclaw", "workspace-voltaris-v2", "AGENTS.md"),
          path.join(
            home,
            ".openclaw",
            "agents",
            "voltaris-v2",
            "agent",
            "cyborgclaw",
            "genome",
            "packs",
            "voltaris-v2.pack",
            "compiled",
            "manifests",
            "agent.runtime.json",
          ),
        ]),
      );
      expect(payload.buildReceipt?.deployedPath).toContain(
        path.join(
          "agents",
          "voltaris-v2",
          "agent",
          "cyborgclaw",
          "genome",
          "packs",
          "voltaris-v2.pack",
        ),
      );

      await expect(
        fs.stat(path.join(home, ".openclaw", "agents", "voltaris-v2", "sessions")),
      ).rejects.toMatchObject({
        code: "ENOENT",
      });

      clearConfigCache();
      const cfg = loadConfig();
      expect(cfg.agents?.list).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: "voltaris-v2" })]),
      );
      expect(cfg.bindings).toBeUndefined();
      expect(cfg.channels).toBeUndefined();
      expect((cfg as { approvals?: unknown }).approvals).toBeUndefined();
    });
  });

  it("loads and renders the build receipt shape through show-receipt", async () => {
    await runCli(["genome", "show-receipt", "voltaris-v2.pack", "--json"]);

    const payload = JSON.parse(runtimeLogs[0] ?? "{}") as {
      status?: string;
      packageId?: string;
      genomeId?: string | null;
      lineageId?: string | null;
      buildReceipt?: { kind?: string; buildEpoch?: string };
      resolvedCurrentTarget?: { workspaceDir?: string };
    };
    expect(payload.status).toBe("ok");
    expect(payload.packageId).toBe("voltaris-v2.pack");
    expect(payload.genomeId).toBe("cyborgclaw/voltaris-v2/master");
    expect(payload.lineageId).toBe("lineage.cyborgclaw.voltaris-v2.master");
    expect(payload.buildReceipt?.kind).toBe("agent.build-receipt");
    expect(payload.buildReceipt?.buildEpoch).toBe("2026-03-15T00:00:00Z");
    expect(payload.resolvedCurrentTarget?.workspaceDir).toBeDefined();
  });

  it("shows the deployed receipt for an installed genome pack by package id", async () => {
    await withTempHome(async (home) => {
      await runCli(["genome", "apply-deploy", "examples/voltaris-v2-pack", "--force", "--json"]);

      resetRuntimeCapture();

      await runCli(["genome", "show-receipt", "voltaris-v2.pack", "--json"]);

      const payload = JSON.parse(runtimeLogs[0] ?? "{}") as {
        status?: string;
        sourceKind?: string;
        buildReceiptPath?: string;
        resolvedCurrentTarget?: { managedPackRoot?: string };
        genomeId?: string | null;
      };
      expect(payload.status).toBe("ok");
      expect(payload.sourceKind).toBe("package-id");
      expect(payload.genomeId).toBe("cyborgclaw/voltaris-v2/master");
      expect(payload.buildReceiptPath).toBe(
        path.join(
          home,
          ".openclaw",
          "agents",
          "voltaris-v2",
          "agent",
          "cyborgclaw",
          "genome",
          "packs",
          "voltaris-v2.pack",
          "compiled",
          "build.receipt.json",
        ),
      );
      expect(payload.resolvedCurrentTarget?.managedPackRoot).toBe(
        path.join(
          home,
          ".openclaw",
          "agents",
          "voltaris-v2",
          "agent",
          "cyborgclaw",
          "genome",
          "packs",
          "voltaris-v2.pack",
        ),
      );
    });
  });
});
