# 04 — Prompt Templates

These are paste-ready templates. Replace bracketed placeholders.

## A. Direct execution

```text
You are operating inside [MISSION NAME].
Read `AGENTS.md`, `MISSION_PACK.md`, and `HANDOFF.md` first.

Task for this step:
- [one coherent milestone]

Rules for this step:
- stay inside scope
- do not expand into adjacent cleanup
- [mutation allowed / read-only only]
- preserve user changes

Required output:
1. brief current-state assessment
2. exact actions taken
3. validation receipts
4. remaining unknowns
5. one next action
```

## B. Diagnosis only

```text
You are operating inside [MISSION NAME].
Read `AGENTS.md`, `MISSION_PACK.md`, and `HANDOFF.md` first.

This is a diagnosis-only step.
Do not mutate files.
Do not stage changes.

Investigate:
- [issue / failure / behavior]

Return:
1. proven facts
2. likely cause
3. unknowns
4. smallest sensible next step
```

## C. Plan-first

```text
You are operating inside [MISSION NAME].
Read `AGENTS.md`, `MISSION_PACK.md`, and `HANDOFF.md` first.

Do not mutate anything yet.
Your job is to produce the smallest safe execution plan for:
- [goal]

Return:
1. current state
2. constraints and risks
3. candidate approaches
4. recommended approach
5. exact first execution step
6. validation plan
```

## D. Subagent-assisted reconnaissance

```text
You are operating inside [MISSION NAME].
Read `AGENTS.md`, `MISSION_PACK.md`, and `HANDOFF.md` first.

Use subagents for reconnaissance only.
Spawn:
- one subagent for execution-path mapping
- one subagent for risk review
- one subagent for docs / API / contract verification

Rules:
- no code changes by subagents
- wait for all subagent results
- synthesize locally

Return one merged report with:
1. key findings by lane
2. file / module references
3. main risks
4. conflicts between findings
5. one recommended next action
```

## E. Cloud delegation with local review

```text
You are operating inside [MISSION NAME].
Read `AGENTS.md`, `MISSION_PACK.md`, and `HANDOFF.md` first.

This step is to prepare a cloud delegation package for:
- [goal]

Produce:
1. exact delegated objective
2. scope limits
3. files / subsystems in scope
4. validation expectations
5. review checklist for local acceptance

Do not claim the work accepted. Local review will decide keep / revise / discard.
```

## F. Closeout

```text
Close out this step for [MISSION NAME].

Return:
1. traffic light status
2. what is proven
3. what changed
4. validation receipts
5. what remains unknown
6. exact one next action
```
