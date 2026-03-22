# 05 — Subagent Operating Standard

Subagents are powerful parallel processing units that, when leveraged effectively, can significantly enhance discovery, analysis, and implementation planning. Their utilization should be actively considered for most complex tasks.

## House standard

- While single-agent execution is suitable for simple, sequential tasks, _proactively consider subagent utilization_ for any task involving multiple research areas, complex analysis, or distinct components.
- Subagents are _expected_ to be used when parallel exploration or review clearly helps, or when a task can be logically decomposed into independent sub-tasks.
- The lead agent owns synthesis, implementation acceptance, validation, and closeout.
- Default subagent stance is read-heavy, not write-heavy.

## Allowed-by-default use cases

- codebase exploration
- architecture reconnaissance
- diff review by category
- test-failure triage
- risk scanning
- API / docs verification
- summarization of separate evidence lanes

## Conditional use cases

- implementation partitioning after plan approval
- isolated write tasks when work can be safely separated and reconciled

## Disallowed-by-default use cases

- micro tasks
- routine single-file fixes
- destructive changes
- overlapping edits across the same local file cluster
- unresolved scope ambiguity

## Lead-agent responsibilities

The lead agent must:

1. define the work split
2. define whether subagents can mutate
3. define whether to wait for all results
4. reconcile conflicts
5. decide the final recommended path
6. own final validation and closeout

## Prompt contract guidance

A good subagent prompt should state:

- **Explicit Subagent Consideration:** Actively evaluate if subagents _should_ be utilized for the given task, even if not explicitly commanded by Voltaris V2.
- how many subagents to spawn
- exact role for each one
- whether they are read-only or allowed to mutate
- whether the parent should wait for all of them
- desired merged output format

## Default CyborgClaw stance

Use subagents first for reconnaissance and review.
Do not normalize concurrent local code mutation as the house default.
