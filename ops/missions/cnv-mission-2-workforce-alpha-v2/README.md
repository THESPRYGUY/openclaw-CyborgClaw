# Dev Pack v1

## Current operator note

For the live Workforce Alpha V2 build state, start with:

- `BUILD_PROGRESS_CLOSEOUT.md`
- `REHYDRATION_BRIEF.md`

Those two files are the current closeout and restart spine for this mission packet.

Current state after final closeout:

- the build-progress packet is now frozen
- the current `UI_VALIDATION_REPORT.md` is live against the optimized cockpit build
- deployment is now ready for explicit ratification review rather than being held by an unresolved UI hardening blocker

## Purpose

This template turns the Mission 22 dev-pack pattern into a reusable governed mission-pack standard.

Use it for multi-step development lanes that need:

- startup proof before mutation
- durable mission truth
- clear handoff continuity
- explicit receipts
- clean closeout gates

This template is designed to sit on top of the standing Voltaris↔Codex collaboration contract.

It now also includes an integrated `PROMPT_GUIDE/` overlay so route selection, prompt construction, re-anchor discipline, subagent usage, and closeout prompting are part of the standard mission chassis.

## Operating model

Use a two-layer model:

### Layer 1 — Standing contract

Use the standing Voltaris↔Codex contract for:

- authority boundaries
- reporting format
- escalation rules
- default continuity behavior

### Layer 2 — Mission pack

Use this dev pack for:

- mission-specific scope
- startup bootstrap
- dependency freezing
- handoff continuity
- receipt indexing
- closeout discipline

## Modes

### Core mode

Use `core/` when the lane is bounded but still needs governance.

Core files:

- `core/00_START_HERE.md`
- `core/01_MISSION_SPEC.md`
- `core/04_SESSION_BOOTSTRAP_PROMPT.md`
- `core/07_HANDOVER_ADDENDUM.md`
- `core/08_DAILY_LOG.md`
- `core/09_CLOSEOUT_CHECKLIST.md`

### Extended mode

Add `extended/` when the lane is:

- cross-repo
- dependency-heavy
- likely to span multiple sessions
- likely to involve multiple operators or subagents

Extended files:

- `extended/02_SETUP.md`
- `extended/03_PROJECT_INSTRUCTIONS.md`
- `extended/05_KICKOFF_STATE.md`
- `extended/06_DEPENDENCY_MANIFEST.md`
- `extended/RUBRIC_5_POINT_INTERNAL.md`

## Shared root files

These files should be instantiated for both modes:

- `mission.yaml`
- `MISSION_PACK.md`
- `HANDOFF.md`
- `RECEIPTS_INDEX.md`
- `SESSION_MAP.json`

## Prompt-guide overlay

`PROMPT_GUIDE/` is now part of the standard template.

It should be copied into every live mission bundle unless there is an explicit reason not to use the house prompting standard.

Most important files inside it:

- `PROMPT_GUIDE/00_README.md`
- `PROMPT_GUIDE/02_WORKLOAD_AND_ROUTE_MATRIX.md`
- `PROMPT_GUIDE/04_PROMPT_TEMPLATES.md`
- `PROMPT_GUIDE/07_STARTUP_AND_REANCHOR_PROMPTS.md`
- `PROMPT_GUIDE/08_EXECUTION_AND_CLOSEOUT_RULES.md`
- `PROMPT_GUIDE/09_OPERATOR_DECISION_TREE.md`

## Recommended instantiation pattern

Create a mission folder like:

```text
ops/missions/<mission-id>/
```

Then copy:

### Minimum governed lane

- all root files
- the contents of `core/` into the mission folder root
- `PROMPT_GUIDE/` into the mission folder root

### Higher-governance lane

- all root files
- the contents of `core/` into the mission folder root
- the contents of `extended/` into the mission folder root
- `PROMPT_GUIDE/` into the mission folder root

Do not keep `core/` or `extended/` as subfolders inside the live mission bundle unless you have a specific reason to diverge from the standard.
Keep `PROMPT_GUIDE/` as a subfolder in the live mission bundle.

## Placeholder rules

- Replace every template token before execution.
- Keep numbering stable unless the template itself is revised.
- Treat `01_MISSION_SPEC.md` as the canonical mission-truth file.
- Other files should reference `01_MISSION_SPEC.md` instead of restating its truth when possible.

## Improvements over the uploaded Mission 22 pack

- adds `mission.yaml` for machine-readable mission state
- adds compatibility bridge files `MISSION_PACK.md` and `HANDOFF.md` for prompt-layer interoperability
- adds `RECEIPTS_INDEX.md` for canonical proof registration
- keeps `SESSION_MAP.json` for live lineage and subagent continuity
- separates `core` from `extended` to reduce ceremony on smaller lanes
- encourages less duplicated mission truth
- incorporates the uploaded prompt-operations pack as a standardized prompting layer

## What good looks like

A new mission can be instantiated quickly, startup proof happens before edits, mission state is readable by both humans and tools, and a new operator can restart cold from the artifacts alone.
