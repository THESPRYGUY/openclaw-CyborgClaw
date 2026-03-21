# 09_CLOSEOUT_CHECKLIST

## Purpose

Force final proof, archive discipline, and clean handoff before the mission is called done.

## Before closeout

- [x] mission spec finalized
- [x] scope box respected or deviations documented
- [x] deliverables exist
- [x] validation proof exists
- [x] service-readiness or defer decision captured when the lane reaches that question
- [x] `OPERATIONAL_REVIEW_REPORT.md` exists and records a proof-backed closeout recommendation
- [x] final branch and SHA captured
- [x] dirty tree status explained or cleared
- [x] handover addendum updated
- [x] daily log current

## Continuity-specific proof gates

- [x] current exact terminal packet appears in full text only in `NEXT_LANE_CONTRACT.md`, `mission.yaml`, and `SESSION_MAP.json`
- [x] `CURRENT_LANE_SUMMARY.md`, `CURRENT_LANE_BRIEFING.md`, `HANDOFF.md`, `MISSION_PACK.md`, and `07_HANDOVER_ADDENDUM.md` use label-plus-pointer form for the archived terminal packet
- [x] `CURRENT_LANE_BRIEFING.md` now uses the `4`-core-plus-`3`-conditional local evidence model
- [x] `SESSION_MAP.json`, `HANDOFF.md`, and `RECEIPTS_INDEX.md` are treated as output mirrors or ledgers, not briefing evidence inputs
- [x] `LANDED_STATE_INDEX.md` remains the only external carry-through gateway
- [x] `PROMOTION_RULES.md` remains the canonical four-state promotion model
- [x] service-abstraction scope remains explicitly `DEFERRED`
- [x] `CURRENT_LANE_BRIEFING.md` and `RECEIPTS_INDEX.md` separate active re-entry proof from historical baseline context

## Must-preserve proof package

- [x] startup receipt
- [x] validation receipts
- [x] key output files
- [x] final summary
- [x] final handover addendum
- [x] branch / SHA / PR proof if relevant

## Archive / continuity actions

- [x] archive artifacts to canonical location
- [x] record archive path
- [x] record final mission path
- [x] confirm next operator can rehydrate from artifacts alone
- [x] confirm any decision artifact is synchronized into the hard sync set and mirrored handoff surfaces
- [x] confirm the closeout decision or bounded follow-on iteration is synchronized into `NEXT_LANE_CONTRACT.md`, `mission.yaml`, and `SESSION_MAP.json`

## Closure decision

- Close mission now? `YES`
- If NO, exact remaining gate: `none`
- If YES, approved by: `Voltaris V2`

## Final classification

- Traffic light: `ARCHIVED`
- What is fully proven: `The file-backed continuity spine, promotion model, deferred service posture, optimization pass, operational review, final hygiene pass, and archive-now ratification are all recorded and synchronized.`
- What remains unknown: `Whether a future separately governed archive-relocation procedure will ever be needed.`
- What remains for next mission: `Reuse this archived pack as reference material only unless a new separately governed continuity mission is opened.`

## Decommission rule

Do not mark the mission closed until proof, archive, and handoff are all complete.
