# CyborgClaw Mission Prompt Optimization Pack vNext

This pack is the reusable prompt-operations support layer for CyborgClaw mission folders.

It is designed to optimize:

- GPT-5.4 Codex work inside VS Code
- CyborgClaw operator workflow
- mission startup and re-anchor discipline
- direct vs plan-first routing
- subagent-assisted reconnaissance and review
- cloud delegation with local review
- evidence-first closeout and handoff

## Core operating stance

- Single-agent is the default.
- Plan-first is used when ambiguity or scope size justifies it.
- Subagents are explicit-only and mainly for parallel reconnaissance/review.
- Cloud delegation is distinct from subagents and should be reviewed locally before acceptance.
- The lead agent owns synthesis, mutation acceptance, validation, and closeout.
- Persistent rules belong in `AGENTS.md`.
- Mission-specific state belongs in `MISSION_PACK.md` and `HANDOFF.md`.
- Run prompts stay short, concrete, and milestone-bounded.

## Recommended mission root layout

```text
<mission-root>/
  AGENTS.md
  MISSION_PACK.md
  HANDOFF.md
  receipts/
  PROMPT_GUIDE/
```

## File map

### Core files

1. `01_CODEX_OPERATING_STANDARD.md`
2. `02_WORKLOAD_AND_ROUTE_MATRIX.md`
3. `03_CONTEXT_BURDEN_ALLOCATION.md`
4. `04_PROMPT_TEMPLATES.md`
5. `05_SUBAGENT_OPERATING_STANDARD.md`
6. `06_CLOUD_DELEGATION_AND_LOCAL_REVIEW.md`
7. `07_STARTUP_AND_REANCHOR_PROMPTS.md`
8. `08_EXECUTION_AND_CLOSEOUT_RULES.md`
9. `09_OPERATOR_DECISION_TREE.md`
10. `10_BENCHMARK_AND_EVAL.md`
11. `11_ANTI_PATTERNS.md`
12. `12_INSTALL_AND_UPDATE.md`

### Optional overlays

- `90_QUICK_REFERENCE_CARD.md`
- `91_OFFICIAL_OPENAI_SOURCES.md`
- `92_AGENT_ROLE_LIBRARY.md`

## Usage order

1. Install the pack into `PROMPT_GUIDE/`.
2. Populate mission-root `AGENTS.md`, `MISSION_PACK.md`, and `HANDOFF.md`.
3. Use `07_STARTUP_AND_REANCHOR_PROMPTS.md` to begin or re-anchor a session.
4. Route the task using `02_WORKLOAD_AND_ROUTE_MATRIX.md` and `09_OPERATOR_DECISION_TREE.md`.
5. Use the shortest matching template from `04_PROMPT_TEMPLATES.md`.
6. Apply execution and closeout discipline from `08_EXECUTION_AND_CLOSEOUT_RULES.md`.

## Success standard

The pack is working correctly when:

- operators consistently choose the right route before prompting
- prompts are smaller and cleaner than legacy wrappers
- subagents are used deliberately rather than casually
- cloud work is reviewed locally before acceptance
- every mutation step ends with evidence-backed validation and one next action
