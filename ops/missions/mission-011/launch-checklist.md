# Mission 011 Launch Checklist

Generated: `2026-04-05T23:10:00Z`

## Purpose

Use this checklist to keep Mission 011 bounded, execution-real, and publishable.

## Preflight

- Mission 010 source truth is admitted:
  - `ops/cyborgclaw/CANONICAL_AGENT_TILE_VNEXT_SPEC.md`
  - `ops/missions/mission-010/post-run-autopsy.md`
  - `ops/missions/mission-010/runs/20260405_213039Z/receipt_bundle.md`
- Shared renderer seam confirmed:
  - `web/src/pages/agentOs/AgentOsComponents.jsx`
- Drift surfaces confirmed:
  - mission room
  - roster wall
  - barracks
  - studio
  - selector/inspector
- No new card species admitted

## Execution gates

### Gate 1 - Shared seam ready

- `AgentOsSeatTile` remains the shared authority face
- `childWork` rail is defined under the parent card
- freshness/provenance/status logic stays centralized

### Gate 2 - Mission room truthful

- mission room parent cards render child-work truth
- inspector and selector density changes do not change semantics
- no fake freshness or implied child authority appears

### Gate 3 - Roster wall and barracks converge

- roster wall and barracks read as the same card species
- child-work stays attached and bounded
- active/idle/blocked semantics do not drift
- pre-launch roster seams are admitted:
  - `web/src/pages/WorkforceTeamRosterModal.jsx`
  - `web/src/pages/BreakoutRoomAgentRosterModal.jsx`

### Gate 4 - Studio seam converges

- at least one major studio card path adopts the same shared seam
- design-time and runtime remain clearly separated
- breakout-room occupant cards do not keep a shadow card species:
  - `web/src/pages/HiveMindBreakOutRoomPage.jsx`

### Gate 5 - Tests and proof

- shared-seam contract tests pass
- at least one child-work visibility path is under test
- proof bundle explains before/after operator truth
- status/provenance adapter tests cover:
  - foyer roster
  - mission room seat
  - breakout occupant
  - studio blueprint

## Fail-fast conditions

- a surface requires a bespoke card species to land
- child-work rail implies independent child authority
- selectors or inspectors keep a separate status grammar
- rollout requires fake freshness or inferred proof
- implementation increases drift instead of shrinking it

## Publish-ready closeout

Mission 011 is not complete until the closeout packet shows:

- one canonical card species still governs all adopted surfaces
- bounded child-work visibility is live on the parent card
- rollout slices are evidence-backed
- remaining drift is explicit, bounded, and queued rather than hidden
