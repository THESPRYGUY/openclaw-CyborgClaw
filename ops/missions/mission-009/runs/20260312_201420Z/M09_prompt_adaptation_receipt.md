# PROMPT ADAPTATION RECEIPT

## Top 3 prompt patterns that improved execution

1. Read-only bounded audits with explicit subject lists and forbidden actions.
2. Frozen-input passes (manifest drafting/verification) with explicit no-rediscovery constraints.
3. Per-subject deterministic checklists (row/path/hash/status) before advancing to next gate.

## Top 3 prompt patterns or instructions that created friction

1. Missing early path-availability gate for required subjects (caused M05 ambiguity drag).
2. Shell heredoc chaining with post-write verification in one command (caused repeat syntax errors).
3. Repeated append retries without guard checks (caused duplicate prompt-log entries in earlier sprints).

## Specific changes recommended for the next mission kickoff prompt

- Add a mandatory early gate: prove direct artifact availability per required subject (primary + backup path) before any packaging steps.
- Require write and verification as separate commands for multi-line file updates.
- Require append idempotence check for sprint-log updates (confirm sprint_id uniqueness before append).

## Prompt strategy improved over the mission

- YES

## Supporting evidence references

- `ops/missions/mission-009/runs/20260312_201420Z/M09_prompt_improvement_log.md`
- `ops/missions/mission-009/runs/20260312_201420Z/M09_core_subject_manifest.md`
- `ops/missions/mission-009/runs/20260312_201420Z/M09_evidence_bundle_index.md`
- `ops/missions/mission-009/runs/20260312_201420Z/M09_verification_note.md`

## Remaining UNKNOWNs

- Whether direct acceptable local proof for `M05_EXECUTION_ISOLATION` can be produced in-scope.
- Whether external/manager-provided M05 proof will be accepted as direct evidence in this pack.
