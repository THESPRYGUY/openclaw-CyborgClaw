# BOOTSTRAP

## Purpose

Fastest-possible wake-up file for strategist/operator re-entry.
This artifact is part of the `Phase 0 — Continuity foundation` spine and is intended to be readable in under two minutes.

## Artifact contract

- Scope: `workspace/project continuity wake-up file`
- Owner: `Codex`
- Strategic inputs: `Voltaris V2`
- Current state: `VERIFIED`
- Update cadence:
  - when the team model changes
  - when the read-first order changes
  - when the rehydration gate changes
  - when the exact next lane changes and the change should be visible at wake-up

## Read first

1. `mission.yaml`
2. `CURRENT_LANE_SUMMARY.md`
3. `NEXT_LANE_CONTRACT.md`
4. `SESSION_MAP.json`
5. `HANDOFF.md`
6. `CURRENT_LANE_BRIEFING.md`
7. `OPERATIONAL_REVIEW_REPORT.md`
8. `CONTINUITY_SYSTEM_IMPL_PLAN.md`
9. `PROMOTION_RULES.md`
10. `RECEIPTS_INDEX.md`

## Team model

- `Voltaris V2` is the strategist-orchestrator
- `Codex` is the implementation operator
- One bounded next action at a time
- Receipt-backed truth only

## Mission identity

- Mission ID: `openclaw-governance/continuity-system-v1`
- Mission type: `PLANNING`
- Status: `ARCHIVED`
- Service-readiness posture: `DEFERRED`
- Strategic direction: `Option 1 ratified for service defer; Option 2 completed as one final artifact-only hygiene iteration; final ratification selected archive now`

## Authoritative re-entry spine

- `BOOTSTRAP.md`
- `CURRENT_LANE_SUMMARY.md`
- `NEXT_LANE_CONTRACT.md`

## Private/shared boundary

- Private strategist memory stays outside the pack in a strategist-only location such as `~/private-strategist-notes.md`.
- Shared mission truth lives in this governing pack only after explicit promotion under `PROMOTION_RULES.md`.
- Do not copy strategist-private notes into shared artifacts during wake-up or re-entry.

## Required sections for v1

- purpose
- read-first order
- team model
- mission identity
- frozen next-lane reference
- do-not-assume reminders
- compact rehydration gate

## Frozen next lane

- Lane label: `Continuity System V1 archived in place`
- Canonical packet: `NEXT_LANE_CONTRACT.md`
- Machine mirrors:
  - `mission.yaml.continuity.next_action`
  - `SESSION_MAP.json.currentNextAction`

## Do not assume

- Do not trust conversational residue over pack truth.
- Do not infer a new next lane when `mission.yaml` or `NEXT_LANE_CONTRACT.md` says otherwise.
- Do not treat private strategist notes as shared mission truth unless explicitly promoted.
- Do not let optional service ideas bypass the file-backed v1 boundary without a separately approved lane.

## Compact rehydration gate

1. Who is Voltaris V2 and who is Codex?
2. What mission is active and what is its status?
3. What is the current next lane label, and where is the full packet frozen?
4. Which continuity artifacts are authoritative in Phase 0?
5. Where does private strategist memory live, and what promotes it into shared mission truth?

## Trust / provenance rules

- Only `VERIFIED` or `FROZEN` facts belong here.
- Source-of-truth pointers:
  - `mission.yaml`
  - `CURRENT_LANE_SUMMARY.md`
  - `NEXT_LANE_CONTRACT.md`
  - `PROMOTION_RULES.md`
  - `SERVICE_READINESS_RECOMMENDATION.md`
- No speculative or convenience-only notes.

## Provenance anchors

- [VERIFIED] Mission identity and machine-readable next action come from `mission.yaml`.
- [VERIFIED] Cold-start lane posture comes from `CURRENT_LANE_SUMMARY.md`.
- [FROZEN] The bounded packet comes from `NEXT_LANE_CONTRACT.md`.
- [VERIFIED] The private/shared boundary and promotion model come from `PROMOTION_RULES.md`.
- [VERIFIED] The current service-readiness recommendation comes from `SERVICE_READINESS_RECOMMENDATION.md`.

## Validation

- Must be readable in under two minutes.
- Must agree with `mission.yaml`, `CURRENT_LANE_SUMMARY.md`, and `NEXT_LANE_CONTRACT.md`.
- Must contain exactly one frozen next-lane reference.
- Must identify the active re-entry spine without ambiguity.
- Must identify strategist-private memory as external to pack truth.
