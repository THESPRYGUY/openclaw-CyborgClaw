import { Command } from "commander";
import { beforeEach, describe, expect, it, vi } from "vitest";

const genomeValidateCommand = vi.fn();
const genomePlanDeployCommand = vi.fn();
const genomeApplyDeployCommand = vi.fn();
const genomeShowReceiptCommand = vi.fn();

const runtime = {
  log: vi.fn(),
  error: vi.fn(),
  exit: vi.fn(),
};

vi.mock("../commands/genome.command.js", () => ({
  genomeValidateCommand,
  genomePlanDeployCommand,
  genomeApplyDeployCommand,
  genomeShowReceiptCommand,
}));

vi.mock("../runtime.js", () => ({
  defaultRuntime: runtime,
}));

const { registerGenomeCli } = await import("./genome-cli.js");

describe("genome-cli", () => {
  async function runCli(args: string[]) {
    const program = new Command();
    registerGenomeCli(program);
    await program.parseAsync(args, { from: "user" });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    genomeValidateCommand.mockResolvedValue(undefined);
    genomePlanDeployCommand.mockResolvedValue(undefined);
    genomeApplyDeployCommand.mockResolvedValue(undefined);
    genomeShowReceiptCommand.mockResolvedValue(undefined);
  });

  it("forwards validate options", async () => {
    await runCli(["genome", "validate", "examples/voltaris-v2-pack", "--json"]);

    expect(genomeValidateCommand).toHaveBeenCalledWith(runtime, {
      ref: "examples/voltaris-v2-pack",
      json: true,
    });
  });

  it("forwards plan-deploy options", async () => {
    await runCli([
      "genome",
      "plan-deploy",
      "examples/voltaris-v2-pack",
      "--profile",
      "lab",
      "--write-config",
    ]);

    expect(genomePlanDeployCommand).toHaveBeenCalledWith(runtime, {
      ref: "examples/voltaris-v2-pack",
      profile: "lab",
      writeConfig: true,
      json: false,
    });
  });

  it("forwards apply-deploy options", async () => {
    await runCli([
      "genome",
      "apply-deploy",
      "examples/voltaris-v2-pack",
      "--profile",
      "lab",
      "--write-config",
      "--overwrite",
      "--force",
      "--json",
    ]);

    expect(genomeApplyDeployCommand).toHaveBeenCalledWith(runtime, {
      ref: "examples/voltaris-v2-pack",
      profile: "lab",
      writeConfig: true,
      overwrite: true,
      force: true,
      json: true,
    });
  });

  it("forwards show-receipt options", async () => {
    await runCli(["genome", "show-receipt", "voltaris-v2.pack", "--json"]);

    expect(genomeShowReceiptCommand).toHaveBeenCalledWith(runtime, {
      ref: "voltaris-v2.pack",
      profile: undefined,
      json: true,
    });
  });
});
