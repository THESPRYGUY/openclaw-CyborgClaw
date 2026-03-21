# 08 — Execution and Closeout Rules

## Execution rules

- One coherent milestone per prompt.
- Do not combine diagnosis, broad refactor, rollout, and handoff in one step.
- Preserve user changes.
- Stay inside stated scope.
- Unknown stays unknown.
- Validate after mutation.
- Prefer the smallest change that solves the step.
- Do not claim readiness without receipts.

## Closeout rules

Every meaningful step should end with:

1. traffic light status
2. what is proven
3. what changed
4. validation receipts
5. remaining unknowns
6. exact one next action

## Validation rules

- Validation must be relevant to the step.
- If validation was not run, say so explicitly.
- If only partial validation was run, say exactly what remains.

## Handoff discipline

If context is saturating or the work must pause:

- update `HANDOFF.md`
- state current branch / SHA if relevant
- capture incomplete work
- state the clean next step
