# Mission 013 - Control-Plane Drift Detection Golden Run

Goal:
Use the next Golden Run to harden CyborgClaw's control-plane truth by detecting and proving drift across manifest, database, runtime, and operator surfaces.

## Mission objective

Turn the existing backlog item
`todo-r6u6m87985l` - `[OpenClaw Hardening T1-P6] Fix control-plane drift detection (manifest vs DB vs runtime)`
into a bounded Golden Run packet that:

1. defines the canonical sources of truth for ownership and state
2. detects divergence between manifest, database, runtime, and UI
3. makes drift visible to operators
4. provides one governed validation path
5. closes with a usable residual-risk report and next-seam recommendation

## Why now

The backlog triage campaign produced a clean three-way vote:

- real `codex`: control-plane drift detection first
- real `voltaris-v2`: control-plane drift detection first
- mission lead: control-plane drift detection first

This seam wins because it improves:

- operator truth
- authority clarity
- downstream reliability
- the proofability of several neighboring hardening items

## Source truth

- triage rubric:
  - `ops/cyborgclaw/RSI_BACKLOG_TRIAGE_RUBRIC.md`
- live triage record:
  - `ops/cyborgclaw/RSI_BACKLOG_TRIAGE_2026-04-06.md`
- current RSI engine:
  - `ops/missions/mission-012/spec.md`
- backlog source item:
  - `todo-r6u6m87985l`

## Scope

In scope:

- manifest vs DB vs runtime ownership drift
- job/state drift where operator surfaces imply truth not backed by live state
- one operator-visible drift signal path
- one proofable validation route
- closeout with residual-risk summary

Out of scope:

- broad board redesign
- Agent Design Studio expansion
- general feature roadmap cleanup
- unbounded full FLOW review

## Acceptance criteria

1. One clear canonical precedence contract exists for the seam under test.
2. At least one real drift condition can be detected or ruled out with evidence.
3. Operator-facing posture becomes more truthful after the patch.
4. The run seals with:
   - proof
   - autopsy
   - next recommended seam

## Success bar

Mission 013 succeeds only if it improves the machine's ability to say:

- what is true
- where that truth came from
- when two sources disagree
- what operators should trust first

without widening authority or inventing fake freshness.
