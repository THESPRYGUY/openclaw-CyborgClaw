# PROMOTION_RULES

## Purpose

Define the file-backed v1 promotion model that separates strategist-private memory from shared mission truth.

This artifact governs when a fact can move from strategist-only context into the governed continuity pack.

## Artifact contract

- Scope: `warm continuity promotion boundary`
- Owner: `Codex`
- Promotion approval: `Voltaris V2`
- Current state: `VERIFIED`
- Update cadence:
  - whenever promotion criteria change
  - whenever a new non-promotable class is admitted
  - whenever the private/shared boundary changes

## Private strategist memory

- Recommended location: `~/private-strategist-notes.md`
- Purpose: `working hypotheses, incomplete synthesis, strategist-only notes, and unpromoted observations`
- Boundary:
  - this location is outside the governing pack
  - it is not canonical team truth
  - it must not be copied into shared artifacts without explicit promotion approval

## Shared mission truth

- Location: `ops/missions/openclaw-governance/continuity-system-v1/`
- Purpose: `receipt-backed continuity state that strategist and operator can both trust`
- Requirements:
  - traceable to a source
  - labeled with trust state where material
  - bounded to the active mission or next lane
  - safe for cold-start re-entry

## Promotion states

- `PRIVATE`: strategist-only memory outside the pack
- `PROMOTABLE`: relevant candidate fact with evidence that is ready for explicit approval
- `PROMOTED`: admitted shared mission truth inside the continuity pack
- `NON_PROMOTABLE`: material that must not be elevated into shared mission truth in v1

## Governance-safe promotion criteria

A fact may move from `PRIVATE` to `PROMOTED` only when all conditions below are satisfied:

1. It is directly relevant to the active mission, current lane, or exact next lane.
2. It is evidence-backed by an artifact, tool output, landed receipt, repo fact, or explicit external baseline source.
3. It can be labeled with both trust posture and provenance.
4. It is bounded and actionable enough to affect planning, execution, verification, or restart behavior.
5. `Voltaris V2` has approved the promotion and `Codex` has synchronized the promoted fact into the governed artifacts.

## Evidence thresholds

- Hard sync set facts require:
  - one authoritative machine-readable or governed source, and
  - direct agreement across the active synchronization surfaces after update
- Briefing and summary facts require:
  - one explicit source pointer, and
  - a truthful trust label such as `VERIFIED`, `OBSERVED`, `PARTIAL`, or `UNKNOWN`
- External carry-through baselines require:
  - explicit upstream receipt or landed proof, and
  - clear labeling that they are external baselines rather than repo-local landed truth

## Non-promotable classes

- raw conversational residue
- unsourced assumptions
- speculative forecasts
- private frustration or emotional notes
- convenience summaries without evidence
- raw tool failures without verified interpretation
- product or runtime claims that remain unverified
- strategist-private notes copied verbatim without approval

## Manual-only v1 rule

- Promotion remains manual in v1.
- No artifact in this pack auto-promotes strategist-private material.
- Runtime services, databases, and memory backends remain out of scope.
- Service abstraction is currently `DEFERRED` under `SERVICE_READINESS_RECOMMENDATION.md`.

## Usage rules for shared artifacts

- `BOOTSTRAP.md` may reference the existence of private strategist memory and point to this artifact, but it must not contain private-note contents.
- `CURRENT_LANE_SUMMARY.md` and `CURRENT_LANE_BRIEFING.md` may describe promoted outcomes, but they must not embed strategist-private raw material.
- When summary or briefing artifacts enumerate promotion states, they should surface the full four-state model: `PRIVATE`, `PROMOTABLE`, `PROMOTED`, and `NON_PROMOTABLE`.
- `LANDED_STATE_INDEX.md` may only contain shared truth or explicitly marked external baselines.
- `NEXT_LANE_CONTRACT.md` may contain promoted packet truth only.
- `CURRENT_LANE_BRIEFING.md` may treat this artifact as a conditional refresh input only when promotion-state posture changed in the just-completed lane.

## Validation

- This file must not contain actual strategist-private note content.
- The promotion states must remain distinct and non-overlapping.
- Any artifact using promotion-state language must stay consistent with this file.
- The private/shared boundary must remain file-backed and artifact-only in v1.
