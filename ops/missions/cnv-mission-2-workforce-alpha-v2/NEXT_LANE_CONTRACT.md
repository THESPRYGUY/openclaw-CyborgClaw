# NEXT_LANE_CONTRACT

## Purpose

Freeze the next bounded packet for the mission governor and the implementation operator.

## Contract metadata

- Status: `FROZEN`
- Packet owner: `Voltaris V2`
- Synchronization owner: `Codex`
- Current stream: `Workforce Alpha V2 UI deployment ratification`
- File-backed only: `yes`
- Trust posture: `VERIFIED`
- Ratification posture: `APPROVED`

## Frozen next lane

`Ratify Workforce Alpha V2 UI for Deployment by reviewing UI_VALIDATION_REPORT.md and authorizing or rejecting the final deployment process to main.`

## Objective

Treat the current mission state as a finalized build-progress and UI-hardening packet, keep the preserved slices frozen, and make one explicit deployment decision grounded in the refreshed validation result and the remaining execution-feed signal caveat.

## In scope

- review the refreshed UI validation packet and evidence bundle
- decide whether the remaining execution-feed signal caveat is acceptable for deployment
- preserve the already-frozen keep/drop packaging decision and mission memory surfaces while making the deployment decision
- authorize or reject final deployment handling without reopening broad implementation scope

## Out of scope

- new backend contract expansion unrelated to the ratification decision
- new cockpit feature expansion outside the already-completed hardening pass
- deployment to `main` without an explicit ratification decision
- treating runtime DB state as a canonical source artifact

## Required outputs

- one bounded deployment-ratification decision grounded in the current `UI_VALIDATION_REPORT.md`
- synchronized deployment decision across the canonical mission-pack surfaces
- synchronized `mission.yaml`, `HANDOFF.md`, `RECEIPTS_INDEX.md`, and `SESSION_MAP.json`
- one exact next lane mirrored in this file and the machine-readable pack surfaces

## Hard guardrails

- Evidence-first
- File-backed artifacts only
- One bounded next action only
- No silent conversion of `PROJECTED` or `NEW CONTRACT NEEDED` into live contract truth
- No scope drift into broader UI/backend expansion during this ratification lane

## Synchronization rule

This file must match:

- `mission.yaml.continuity.next_action`
- `SESSION_MAP.json.currentNextAction`
- and be reflected by label/pointer in `HANDOFF.md`

## Provenance anchors

- [VERIFIED] `BUILD_PROGRESS_CLOSEOUT.md` now separates the preserved Sprytly product slice, the OpenClaw Control UI sync slice, and the Workforce Alpha V2 mission-pack memory slice from runtime noise.
- [VERIFIED] `REHYDRATION_BRIEF.md` now records the cold-start read order, repo split, live origin, and first safe verification moves.
- [VERIFIED] The sibling sprytly-internal-dashboard backend and frontend still power the live `127.0.0.1:18792` cockpit origin, including the later President-A team-builder and auto-team-assemble work.
- [VERIFIED] `UI_VALIDATION_REPORT.md` is now refreshed against the current hardened cockpit build and reopens deployment ratification with a result of `16 pass`, `1 conditional`, and `0 fail`.
- [VERIFIED] `mission.yaml` and `SESSION_MAP.json` now mirror the deployment-ratification next action.
