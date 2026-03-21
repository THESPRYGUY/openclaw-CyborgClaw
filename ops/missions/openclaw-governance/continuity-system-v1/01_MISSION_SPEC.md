# 01_MISSION_SPEC

## Purpose

Freeze the mission truth, scope, success bar, and proof requirements for the active continuity stream.

## Mission identity

- Mission ID: `openclaw-governance/continuity-system-v1`
- Mission name: `Continuity System V1 Governance`
- Pack version: `dev-pack-v1`
- Mission type: `PLANNING`
- Traffic light at open: `YELLOW`

## Mission intent

- Why this mission exists: `Recent continuity failures exposed the need for a governed, file-backed restart architecture that survives session resets and day-boundary re-entry.`
- Key task: `Preserve the archived continuity pack, its terminal proof set, and its in-place archive record for future audit or reuse.`
- Desired end state: `The continuity pack contains an authoritative re-entry spine, a usable trust/provenance layer, a governed promotion model, a proof-backed ratified service-readiness posture, an implemented optimization pass, a completed operational review report, a recorded final archive decision, a final completion report, and one exact terminal packet at all times.`

## Who owns what

- Sponsor / mission owner: `Voltaris V2`
- Primary operator: `Codex`
- Reviewer / approver: `spryguy`
- Downstream consumer: `Voltaris V2 and future mission governors/operators`

## Verified current state

- VERIFIED: `This repo contains ops/ and ops/missions/, so a dedicated continuity pack can live in-repo.`
- VERIFIED: `A repo-local ops/templates/dev-pack-v1 template does not exist, so the shared workspace template source was required for initialization.`
- VERIFIED: `The working branch at lane start was m20-trust-the-refusal-closeout at bd22e71c9e36806edd9c01a5d53ac3859e8f289e.`
- VERIFIED: `The dedicated continuity governing pack now exists at ops/missions/openclaw-governance/continuity-system-v1/.`
- VERIFIED: `CONTINUITY_SYSTEM_IMPL_PLAN.md now defines the file-backed MVR and the five core continuity artifact contracts.`
- VERIFIED: `BOOTSTRAP.md, CURRENT_LANE_SUMMARY.md, and NEXT_LANE_CONTRACT.md now act as the active synchronized re-entry spine.`
- VERIFIED: `PROMOTION_RULES.md now defines the private/shared boundary and the manual-only v1 promotion model.`
- VERIFIED: `SERVICE_READINESS_RECOMMENDATION.md now records a proof-backed defer recommendation for service abstraction.`
- VERIFIED: `Voltaris V2 explicitly selected Option 1, so service abstraction remains deferred and this continuity stream stays on the file-backed path.`
- VERIFIED: `Phase 4 implementation reduced the live next-lane authority set to the canonical trio, and the completed hygiene pass leaves the active briefing on a local-only 4-core-plus-3-conditional model.`
- VERIFIED: `OPERATIONAL_REVIEW_REPORT.md now records a proof-backed closeout-ready pending ratification recommendation.`
- VERIFIED: `Voltaris V2 selected Option 2, authorizing one final bounded artifact-only receipt-ledger hygiene iteration before archive closeout is reconsidered.`
- VERIFIED: `The final receipt-ledger hygiene iteration is now complete, CURRENT_LANE_BRIEFING.md and RECEIPTS_INDEX.md now separate active re-entry proof from historical baseline context, and the pack has returned to final closeout ratification.`
- VERIFIED: `Voltaris V2 selected Option 1 and the pack is now archived in place with FINAL_MISSION_COMPLETION_REPORT.md as the terminal record.`
- LIKELY: `Continuity System V1 will become cross-mission infrastructure rather than a one-off mission-specific helper.`
- UNKNOWN: `Whether future continuity updates should remain file-driven or later justify a separate service-planning stream.`
- TO VERIFY: `Whether a future separately governed archive-relocation procedure will ever be needed for this archived pack.`

## Scope box

### In scope

- Operating the Phase 0 re-entry spine
- Preserving the explicit private/shared boundary and manual promotion model
- Preserving the proof-backed service-readiness recommendation until a later lane changes it
- Preserving archived mission truth and terminal audit artifacts
- Synchronizing continuity state and handoff artifacts around one exact next lane

### Out of scope

- Product/runtime code changes in `src/`, `apps/`, `extensions/`, or `ui/`
- Implementing continuity automation in this lane
- Introducing a new memory service runtime, database, or external API layer

## Mission law

### MUST

1. `Keep this stream file-backed in v1 and treat runtime/service adoption as explicitly deferred.`
2. `Record truthful startup state, proof pointers, and one exact next lane.`

### MUST NOT

1. `Do not mutate product code or expand this stream beyond governed continuity artifact work without an explicit approved lane.`
2. `Do not rewrite repo state history or switch branches without explicit approval.`

## Required deliverables

- An active authoritative re-entry spine across `BOOTSTRAP.md`, `CURRENT_LANE_SUMMARY.md`, and `NEXT_LANE_CONTRACT.md`
- A synchronized mission truth / handoff / session layer that always points to the current next lane
- A completed operational review report, a recorded final archive decision, a completed final artifact-only hygiene pass, and `FINAL_MISSION_COMPLETION_REPORT.md`

## Required proof package

- startup receipt
- validation receipt
- branch / SHA proof
- handoff artifacts

## Acceptance tests

- `mission.yaml`, `MISSION_PACK.md`, and `01_MISSION_SPEC.md` agree on mission identity and current planning scope`
- `SESSION_MAP.json` parses as valid JSON and records the exact next lane`
- `BOOTSTRAP.md`, `CURRENT_LANE_SUMMARY.md`, and `NEXT_LANE_CONTRACT.md` operate as the authoritative synchronized restart surface`
- `PROMOTION_RULES.md` defines the private/shared boundary and promotion states without leaking private strategist notes`
- `SERVICE_READINESS_RECOMMENDATION.md` records a proof-backed service-readiness decision without authorizing runtime integration`
- `OPERATIONAL_REVIEW_REPORT.md` records a proof-backed closeout recommendation without reopening service-abstraction scope`

## Stop / abort conditions

- `The shared dev-pack-v1 template source is unavailable or unreadable`
- `The active continuity lane would require product/runtime code mutation`
- `Unexpected repo-state conflicts make artifact-only work unsafe`

## Current next action reference

- Lane label: `Continuity System V1 archived in place`
- Canonical packet: `NEXT_LANE_CONTRACT.md`
- Machine mirrors:
  - `mission.yaml.continuity.next_action`
  - `SESSION_MAP.json.currentNextAction`

## What good looks like

`A new operator can open this archived pack cold, trust the active re-entry spine, trust/provenance layer, promotion model, ratified service-readiness posture, completed optimization and hygiene work, and final completion report, with no ambiguity about truth labels, promotion boundaries, archive posture, or scope.`
