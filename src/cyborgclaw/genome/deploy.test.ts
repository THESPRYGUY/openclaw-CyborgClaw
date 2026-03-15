import fs from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { withTempHome } from "../../../test/helpers/temp-home.js";
import { clearConfigCache, loadConfig } from "../../config/config.js";
import { applyVoltarisV2FixtureDeployment, planVoltarisV2FixtureDeployment } from "./deploy.js";
import { resolveVoltarisV2GoldenPackPaths } from "./paths.js";

afterEach(() => {
  clearConfigCache();
  delete process.env.OPENCLAW_PROFILE;
});

describe("CyborgClaw genome deployment bridge", () => {
  it("uses the profile-aware workspace surface when the pack agent is default", async () => {
    await withTempHome(async (home) => {
      process.env.OPENCLAW_PROFILE = "lab";

      const plan = await planVoltarisV2FixtureDeployment({
        cfg: {
          agents: {
            list: [{ id: "voltaris-v2", default: true }],
          },
        },
      });

      expect(plan.target.profile).toBe("lab");
      expect(plan.target.workspaceDir).toBe(path.join(home, ".openclaw", "workspace-lab"));
      expect(plan.target.agentDir).toBe(
        path.join(home, ".openclaw", "agents", "voltaris-v2", "agent"),
      );
      expect(plan.authorityBoundary.touchesGatewaySessionState).toBe(false);
      expect(plan.authorityBoundary.gatewayOwns).toEqual(
        expect.arrayContaining(["session truth", "routing", "channel state"]),
      );
    });
  });

  it("projects compiled artifacts into workspace and agentDir without creating session state", async () => {
    await withTempHome(async (home) => {
      const result = await applyVoltarisV2FixtureDeployment({
        cfg: {},
        writeConfig: true,
      });

      const fixturePaths = resolveVoltarisV2GoldenPackPaths();
      const deployedAgents = await fs.readFile(
        path.join(home, ".openclaw", "workspace-voltaris-v2", "AGENTS.md"),
        "utf8",
      );
      const fixtureAgents = await fs.readFile(
        path.join(fixturePaths.workspaceRoot, "AGENTS.md"),
        "utf8",
      );
      expect(deployedAgents).toBe(fixtureAgents);

      const runtimeManifestPath = path.join(
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
      );
      expect(JSON.parse(await fs.readFile(runtimeManifestPath, "utf8"))).toMatchObject({
        agent: { agentId: "voltaris-v2" },
      });

      await expect(
        fs.stat(path.join(home, ".openclaw", "agents", "voltaris-v2", "sessions")),
      ).rejects.toMatchObject({
        code: "ENOENT",
      });

      clearConfigCache();
      expect(loadConfig().agents?.list).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "voltaris-v2", name: "Voltaris V2" }),
        ]),
      );
      expect(result.configWritten).toBe(true);
    });
  });
});
