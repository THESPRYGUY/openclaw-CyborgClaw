import type { Command } from "commander";
import {
  genomeApplyDeployCommand,
  genomePlanDeployCommand,
  genomeShowReceiptCommand,
  genomeValidateCommand,
} from "../commands/genome.command.js";
import { defaultRuntime } from "../runtime.js";
import { theme } from "../terminal/theme.js";
import { runCommandWithRuntime } from "./cli-utils.js";
import { formatHelpExamples } from "./help-format.js";

const GENOME_EXAMPLES = {
  main: [
    ["openclaw genome validate examples/voltaris-v2-pack", "Validate the golden Voltaris pack."],
    ["openclaw genome plan-deploy examples/voltaris-v2-pack --json", "Preview deployment as JSON."],
    [
      "openclaw genome apply-deploy examples/voltaris-v2-pack --force --write-config",
      "Apply the deployment bridge and persist the optional agent config binding.",
    ],
    [
      "openclaw genome show-receipt voltaris-v2.pack --json",
      "Print the build receipt for a package id.",
    ],
  ],
} as const;

export function registerGenomeCli(program: Command) {
  const genome = program
    .command("genome")
    .description("Validate, plan, deploy, and inspect governed CyborgClaw genome packs")
    .addHelpText(
      "after",
      () =>
        `\n${theme.heading("Examples:")}\n${formatHelpExamples(GENOME_EXAMPLES.main)}\n\n${theme.muted(
          "This CLI never writes Gateway-owned session, routing, channel, approval, or control-plane state.",
        )}\n`,
    )
    .action(() => {
      genome.help({ error: true });
    });

  genome
    .command("validate [ref]")
    .description("Validate a genome pack via the canonical genome boundary")
    .option("--json", "Output JSON", false)
    .action(async (ref, opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await genomeValidateCommand(defaultRuntime, {
          ref: typeof ref === "string" ? ref : undefined,
          json: Boolean(opts.json),
        });
      });
    });

  genome
    .command("plan-deploy [ref]")
    .description("Plan a genome pack deployment without writing anything")
    .option("--profile <name>", "Resolve profile-aware target paths against this profile")
    .option("--write-config", "Preview the optional config binding as part of the plan", false)
    .option("--json", "Output JSON", false)
    .action(async (ref, opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await genomePlanDeployCommand(defaultRuntime, {
          ref: typeof ref === "string" ? ref : undefined,
          profile: opts.profile as string | undefined,
          writeConfig: Boolean(opts.writeConfig),
          json: Boolean(opts.json),
        });
      });
    });

  genome
    .command("apply-deploy [ref]")
    .description("Apply a genome pack deployment through the canonical deployment bridge")
    .option("--profile <name>", "Resolve profile-aware target paths against this profile")
    .option("--write-config", "Persist the optional config binding", false)
    .option("--overwrite", "Overwrite drifted allowed artifact files instead of failing", false)
    .option("--force", "Required confirmation flag for real writes", false)
    .option("--json", "Output JSON", false)
    .action(async (ref, opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await genomeApplyDeployCommand(defaultRuntime, {
          ref: typeof ref === "string" ? ref : undefined,
          profile: opts.profile as string | undefined,
          writeConfig: Boolean(opts.writeConfig),
          overwrite: Boolean(opts.overwrite),
          force: Boolean(opts.force),
          json: Boolean(opts.json),
        });
      });
    });

  genome
    .command("show-receipt [ref]")
    .description("Print a genome pack build receipt and resolved deployment target summary")
    .option("--profile <name>", "Resolve target paths against this profile")
    .option("--json", "Output JSON", false)
    .action(async (ref, opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await genomeShowReceiptCommand(defaultRuntime, {
          ref: typeof ref === "string" ? ref : undefined,
          profile: opts.profile as string | undefined,
          json: Boolean(opts.json),
        });
      });
    });
}
