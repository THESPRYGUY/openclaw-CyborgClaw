# AGENT_WORKFORCE_MISSION_01_SOURCE_MAP

## Purpose

Record the exact artifacts used to prepare `AGENT_WORKFORCE_MISSION_01_BRIEF.md` so the re-engagement packet can be audited and rehydrated without chat history.

## Historical mission-pack sources

### `ops/missions/cnv-mission-2-workforce-alpha-v2/BUILD_PROGRESS_CLOSEOUT.md`

Used to confirm:

- the prior mission closed out as three preserved slices
- the sibling Sprytly product implementation is the primary workforce product slice
- the historical next action was still deployment ratification

### `ops/missions/cnv-mission-2-workforce-alpha-v2/REHYDRATION_BRIEF.md`

Used to confirm:

- the repo split between `openclaw` mission memory and sibling Sprytly product code
- the live server origin and runtime route for Workforce Alpha
- the correct re-entry order for older workforce artifacts

### `ops/missions/cnv-mission-2-workforce-alpha-v2/UI_VALIDATION_REPORT.md`

Used to confirm:

- the current accepted cockpit structure
- the remaining execution-feed caveat
- the fact that the main structural blocker had already moved from responsive collapse to execution-feed signal quality

### `ops/missions/cnv-mission-2-workforce-alpha-v2/NEXT_LANE_CONTRACT.md`

Used to confirm:

- the prior frozen lane was still deployment ratification
- that contract is historical context now, not the recommended next action for re-engagement

### `ops/missions/cnv-mission-2-workforce-alpha-v2/mission.yaml`

Used to confirm:

- the old mission summary
- the frozen scope/out-of-scope boundaries
- the historical continuity pointer that still names deployment ratification

### `ops/missions/cnv-mission-2-workforce-alpha-v2/HANDOFF.md`

Used to confirm:

- the older narrative state still pointed at the closed-out Alpha V2 packet rather than a new re-engagement lane

## Current live product sources in the sibling Sprytly repo

### `../sprytly-internal-dashboard/server/src/index.js`

Used to confirm:

- authenticated Workforce Alpha routes are live
- mutable controls already exist for:
  - Voltaris model changes
  - President-A team locking
  - President-A auto-team assembly
  - seat-level session-policy writes
- important truth seams still remain local or projected, including:
  - saved president-team assignment store
  - local roster fallback
  - session-freshness heuristics
  - local A2A/subagent allow-list seams
- the explicit contract-gap statements around:
  - team membership contract
  - role label contract
  - execution / telemetry truth gaps

### `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Used to confirm:

- the six major cockpit surfaces are already rendered
- Voltaris and President-A tiles already exist in a richer current form
- President-A team-builder controls already exist, including:
  - `Auto team assemble`
  - `Lock team`
  - `Edit team`
  - seat-level agent selection
  - seat-level recommended model or manual model pinning
- the current page is an operator management surface already, so the next lane should not restart from UI scaffolding

### `../sprytly-internal-dashboard/web/src/ui/App.jsx`

Used to confirm:

- Workforce Alpha remains a first-class top-level route in the sibling product
- it coexists with the newly-landed `Memory Vault`, which marks the memory sprint pivot as complete rather than active

## Synthesis rules used for the new packet

- Historical workforce documents were treated as canonical for prior decisions, preserved slices, and old risks.
- Current sibling Sprytly code was treated as canonical for the live backend/UI state and already-landed operator controls.
- Any old assumption contradicted by the current sibling product was classified as stale and not carried forward as the next lane.

## Packet preparation conclusion

The new re-engagement packet is grounded in both:

1. the preserved Workforce Alpha V2 closeout history in `openclaw`
2. the current live Workforce Alpha implementation state in the sibling Sprytly repo

That dual-source grounding is why the recommended first lane hardens execution signal instead of reopening packaging, restart, or baseline UI build work.
