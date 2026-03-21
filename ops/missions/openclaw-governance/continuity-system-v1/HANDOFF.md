# HANDOFF

## Purpose

This is a compatibility bridge for the integrated `PROMPT_GUIDE/`.

The canonical live handoff state still lives in:

- `07_HANDOVER_ADDENDUM.md`
- `08_DAILY_LOG.md`
- `RECEIPTS_INDEX.md`
- `SESSION_MAP.json`

## Rule

If this file and `07_HANDOVER_ADDENDUM.md` ever disagree, `07_HANDOVER_ADDENDUM.md` wins for narrative state and `RECEIPTS_INDEX.md` wins for proof registration.

## Current session state

- Branch: `m20-trust-the-refusal-closeout`
- SHA: `bd22e71c9e36806edd9c01a5d53ac3859e8f289e`
- Proven current state: `The continuity pack exists, the re-entry spine, trust/provenance layer, and promotion model are active, the service-readiness recommendation is explicitly ratified as DEFERRED, the optimization and hygiene work are complete, final closeout ratification selected archive now, and the pack is archived in place with a terminal completion report.`
- Blockers: `Repo-local ops/templates/dev-pack-v1 is missing, so this pack currently depends on the shared workspace template source for provenance.`
- One next action: `Continuity System V1 archived in place` — terminal packet in `NEXT_LANE_CONTRACT.md`; machine mirrors in `mission.yaml` and `SESSION_MAP.json`.

## Trust / provenance posture

- [VERIFIED] The active re-entry spine remains `BOOTSTRAP.md`, `CURRENT_LANE_SUMMARY.md`, and `NEXT_LANE_CONTRACT.md`.
- [VERIFIED] The current briefing is operator-generated and now refreshes from canonical local sources only.
- [OBSERVED] External landed-state carry-through currently depends on the shared workspace Mission 2 pack.
- [VERIFIED] Private strategist memory remains outside the pack and is governed by `PROMOTION_RULES.md`.
- [VERIFIED] Service abstraction is currently `DEFERRED` under `SERVICE_READINESS_RECOMMENDATION.md`.
- [VERIFIED] Voltaris V2 selected `Option 1`, keeping the continuity stream on the file-backed optimization path.
- [VERIFIED] Phase 4 implementation reduced authority to the canonical trio, and the completed hygiene pass leaves the active briefing on a local-only 4-core-plus-3-conditional model.
- [VERIFIED] The operational review now confirms the implemented continuity spine is functional end to end and recommends closeout-ready pending ratification.
- [VERIFIED] Voltaris V2 selected `Option 2`, authorizing one final bounded artifact-only receipt-ledger hygiene iteration before archive closeout is reconsidered.
- [VERIFIED] The hygiene pass is now complete, `RECEIPTS_INDEX.md` is a post-refresh ledger rather than briefing evidence, and the pack has returned to final closeout ratification.
- [VERIFIED] Voltaris V2 selected `Option 1`, ratifying archive now.
- [VERIFIED] `FINAL_MISSION_COMPLETION_REPORT.md` records the terminal archive state and archive path.

## Briefing refresh flow v1

1. Refresh the canonical local briefing set first: `mission.yaml`, `CURRENT_LANE_SUMMARY.md`, `NEXT_LANE_CONTRACT.md`, and `OPERATIONAL_REVIEW_REPORT.md`.
2. Refresh `PROMOTION_RULES.md`, `SERVICE_READINESS_RECOMMENDATION.md`, and `LANDED_STATE_INDEX.md` only when their governance or external-baseline context is needed for the just-completed lane.
3. Regenerate `CURRENT_LANE_BRIEFING.md` from those local sources with trust/provenance labels only.
4. Mirror the refreshed state into `SESSION_MAP.json`, `HANDOFF.md`, and `RECEIPTS_INDEX.md` after evidence synthesis.

## Canonical pointers

- Narrative handoff: `07_HANDOVER_ADDENDUM.md`
- Session ledger: `08_DAILY_LOG.md`
- Receipt ledger: `RECEIPTS_INDEX.md`
- Live lineage/state: `SESSION_MAP.json`
- Current lane summary: `CURRENT_LANE_SUMMARY.md`
- Current lane briefing: `CURRENT_LANE_BRIEFING.md`
- Promotion model: `PROMOTION_RULES.md`
- Service-readiness review: `SERVICE_READINESS_RECOMMENDATION.md`
- Operational review report: `OPERATIONAL_REVIEW_REPORT.md`
