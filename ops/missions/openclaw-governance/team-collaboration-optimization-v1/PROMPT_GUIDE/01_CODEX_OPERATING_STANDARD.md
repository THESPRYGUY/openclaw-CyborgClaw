# 01 — Codex Operating Standard

This file defines the default CyborgClaw operating standard for GPT-5.4 inside Codex in VS Code.

## Default model stance

- Primary development model: `gpt-5.4`
- Lighter helper / subagent model when appropriate: `gpt-5.4-mini`
- Use smaller/faster models only when task quality requirements allow it.

## Default mode stance

- Use **Chat** for discussion, diagnosis, planning, and framing.
- Use **Agent** for reading files, editing, running commands, and bounded execution.
- Use **Full Access** only when broader permissions are truly required and operator intent is explicit.

## Prompting stance

- Prefer short, specific prompts over giant wrappers.
- Use open files, selections, and file references to reduce repeated context.
- State one coherent milestone per prompt.
- Make the expected output shape explicit.
- Specify validation requirements before mutation if code changes are expected.

## Governance stance

- Persistent instructions go into `AGENTS.md`, not repeated in every run prompt.
- Mission-specific scope and constraints go into `MISSION_PACK.md`.
- Branch / SHA / blocker / next-step state goes into `HANDOFF.md`.
- Unknowns stay unknown.
- The model must not claim completion without evidence.

## Default execution hierarchy

1. Single-agent direct execution (for simple, sequential tasks)
2. **Proactively consider and leverage Subagent-assisted reconnaissance/review/planning (for complex analysis or decomposable tasks)**
3. Plan-first, then bounded execution (for tasks requiring careful staging)
4. Cloud delegation with local review (for external, high-scale tasks)

Do not invert that order without a clear reason.

## House rules

- Preserve user changes.
- Do not silently expand scope.
- Do not mix multiple milestones into one run.
- Validate after mutation.
- Close out with receipts, current state, and one next action.
