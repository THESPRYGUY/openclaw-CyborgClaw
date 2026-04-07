# STUD RSI Loop 0 Mission Packet — 2026-04-05

## Mission

Turn **STUD** into a real promoted **main-agent seat** that can occupy its current mission-control role with clear boundaries, governed deployment, and repeatable RSI build/test loops.

## Why now

Recent convergence with Codex and operator direction established that STUD should no longer remain an implicit surface/concept only. STUD should become a first-class main agent that is designed, built, tested in-role, and iteratively improved.

## Standing Constraints

- Runtime remains the **downstream source of truth**.
- STUD must **not** become a second runtime authority.
- STUD should consume published studio artifacts **read-only**.
- STUD should **not** own seat authoring or team composition design.
- STUD should **not** gain hidden mutation powers or silent activation paths.
- STUD should be promoted/deployed through the **normal seat → publish → runtime path** where possible, not a bespoke hardcoded exception.
- Every loop must emit durable receipts.

## STUD Should Own

- Boot / preflight readiness evaluation
- Roster / seat / kinship / comms / paperwork-path checks before launch
- Mission-state narration for operator visibility
- Governed handoff checks across mission-control stages
- Drift / missing-prerequisite detection
- Closeout packet assembly and next-mission recommendation framing

## STUD Should Not Own

- Seat authoring
- Team composition design
- Runtime policy truth
- Hidden delegation authority
- Silent activation
- Mutation of published artifacts behind operator review

## RSI Loop Shape

### Loop 0 — Inspection + Contract

Goal: establish repo-grounded truth of what STUD currently is, where those responsibilities live, and what seat contract must exist.
Outputs:

1. current-state map
2. STUD seat charter
3. build/deploy seam map
4. eval contract for Loop 1

### Loop 1 — First Viable STUD Main-Agent Build

Goal: first bounded implementation of STUD as a real main-agent seat with explicit authority limits.

### Loop 2 — In-Role Test

Goal: test STUD in its real current role/responsibility surfaces.

### Loop 3+ — Optimize

Goal: iterate on authority discipline, operator clarity, receipts, failure honesty, and closeout quality.

## Core Evaluation Axes

- Boot/preflight accuracy
- Mission-state narration quality
- Handoff clarity
- Closeout completeness
- Failure honesty
- Operator calm / readability
- Boundary discipline
- Receipt quality

## Loop 0 Immediate Questions

1. Where do STUD responsibilities currently live in code and UI?
2. What existing APIs already represent STUD’s control path?
3. What identity/seat contract must exist for STUD to be a real main agent?
4. What deploy path can place STUD into role without hardcoding a special-case runtime bypass?
5. What tests/evals prove STUD is helping instead of becoming a second authority surface?

## Current Collaboration State

Codex convergence packet indicates:

- STUD is already acting like the authority surface for boot/preflight, mission-room visibility, design/runtime boundary handling, and closeout/governance.
- Best path is to build STUD as a **real promoted main-agent seat** with explicit boot/mission/closeout authority, read-only consumption of studio artifacts, and deployment through the normal publish-to-runtime path.

## Next

Produce the Loop 0 current-state map and STUD seat charter before implementation begins.
