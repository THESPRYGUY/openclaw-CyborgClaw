# PRESIDENT_A_FAN_OUT_BRIEF

## Mission title

`Implement President-A execution fan-out to Strike Team Agents`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Turn the previously prepared Strike Team Alpha seat briefs into a truthful, bounded execution seam where President-A can fan out a delegated `Job Card` to individual seat agents and where those seat agents can report execution state back into the Workforce Alpha command surface.

The lane was accepted to deliver:

1. a durable seat-task structure beneath each delegated `Job Card`
2. a President-A fan-out seam that requests bounded seat execution without pretending Sprytly owns ACP runtime
3. seat-agent status updates that roll back into overall `Job Card` truth
4. cockpit, inspector, and execution-feed visibility for seat-level execution
5. tests proving end-to-end fan-out, seat updates, and bridge synchronization

## Scope delivered

### 1. Durable seat-task board

The sibling Sprytly `Job Card` runtime state now carries one normalized seat-task board instead of leaving seat execution implied across multiple partial payloads.

Each seat task now admits:

- `seatTaskId`
- `seatIndex`
- `agentId`
- `displayName`
- `roleLabel`
- `resolvedModelRef`
- `thinkingLevel`
- `reasoningLevel`
- `sessionKeyHint`
- `handoffLabel`
- `handoffSummary`
- `escalationTarget`
- `status`
- `statusReason`
- `progressLabel`
- lifecycle timestamps:
  - `briefPreparedAt`
  - `dispatchRequestedAt`
  - `acknowledgedAt`
  - `activatedAt`
  - `reviewRequestedAt`
  - `blockedAt`
  - `failedAt`
  - `completedAt`
  - `archivedAt`
- runtime evidence fields:
  - `lastSignalAt`
  - `lastSignalKind`
  - `lastSignalDetail`
  - `lastHeartbeatAt`
  - `activeSessionKey`
  - `activeRunId`
  - `artifactRef`

This resolves the earlier gap where the cockpit could only show seat briefs and not an admitted seat execution board.

### 2. President-A fan-out seam

The lane adds a bounded President-A fan-out route that:

- validates the president/session actor
- turns prepared seat briefs into dispatched seat tasks
- updates top-level `Job Card` orchestration truth to active fan-out
- writes the updated seat-task board back into the durable `workforce_job_cards` record
- synchronizes the refreshed task board into the OpenClaw session-context bridge
- stamps lifecycle events into `activity_events`

This is intentionally truthful:

- Sprytly owns delegation intent and observed bridge state
- ACP remains the runtime seam
- A2A remains bounded coordination
- the product does **not** claim Sprytly directly spawned ACP worker runs

### 3. Seat-agent execution updates

The lane adds a bounded seat-task status route so seat agents can report execution truth back into the system.

Admitted seat-task actions now include:

- `acknowledge`
- `start`
- `heartbeat`
- `await_review`
- `block`
- `complete`
- `fail`
- `archive`

Seat-task updates now:

- validate the actor against the admitted seat owner or leadership boundary
- validate the expected session key
- reject invalid seat-task lifecycle transitions
- update the individual seat task
- roll up the overall `Job Card` status truthfully:
  - blocked / failed seat work rolls up to job `blocked`
  - all completed seat work rolls up to job `awaiting_review`
  - active seat work rolls up to job `in_progress`

### 4. Cockpit and inspector visibility

The Workforce Alpha cockpit now admits seat-level fan-out visibility.

The `Job dispatch` strip now shows:

- a seat-task board summary
- seat dispatch status counts
- a `Fan out to seats` action
- compact seat-task cards with:
  - seat owner
  - seat status
  - model
  - session / run hints
  - latest seat signal detail

The locked team panel now shows seat-task posture alongside the saved seat assignment.

The inspector `Job card` surface now admits:

- seat-task board summary
- seat execution detail for the selected seat
- seat-status pills in the timeline
- a richer readback of seat-level execution progression

The execution feed now surfaces seat-status context for fan-out and seat-task lifecycle events.

### 5. Test hardening

The lane added or expanded test coverage for:

- seed-time creation of the seat-task board from the locked team snapshot
- President-A fan-out state updates
- seat-agent start / block / complete mutations
- roll-up from seat-task state into overall `Job Card` state
- API proof for:
  - create
  - delegate
  - fan-out
  - seat acknowledge
  - seat start
  - seat block
  - status readback
  - snapshot readback
  - inspector readback
  - session-store bridge readback

## Implemented interfaces

### Backend modules

- `../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`
- `../sprytly-internal-dashboard/server/src/index.js`

### Frontend surface

- `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

### Test coverage

- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch_api.test.mjs`

## Acceptance criteria for this lane

This lane is accepted when:

1. delegated `Job Card`s admit a durable seat-task board for the locked Alpha lineup
2. President-A can fan out execution requests to seats through a bounded product seam
3. seat-agent status updates are durably recorded and validated
4. seat-task roll-up truthfully updates the overall `Job Card` lifecycle
5. session-context bridge state stays synchronized for President-A and seat agents
6. cockpit and inspector surfaces expose seat-level execution truth
7. execution feed reflects fan-out and seat-task lifecycle events
8. unit and API tests prove the new fan-out seam end to end

## Validation proof

Implementation proof was accepted against:

- syntax checks:
  - `node --check ../sprytly-internal-dashboard/server/src/index.js`
  - `node --check ../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`
- targeted dispatch helper tests
- targeted dispatch API tests
- full sibling Sprytly test suite
- sibling build
- sibling lint with warnings only and no errors

The API integration proof specifically covered:

- `Job Card` creation from queued DEV-staging work
- delegation to President-A
- President-A seat fan-out
- seat-level acknowledgement and start
- seat-level block
- status endpoint readback
- snapshot readback
- inspector readback
- session-store bridge readback for President-A and the affected seat

## Risks carried forward

### Immediate blockers

None.

### Accepted follow-on risks

- seat execution is still mediated through session-context bridge truth rather than native ACP worker lifecycle receipts
- seat fan-out remains bounded to the locked Strike Team Alpha lineup and does not yet generalize to broader multi-team routing
- cockpit freshness is still polling-based rather than push/subscription based
- President-A still coordinates seat work through bounded handoff state; deeper inter-seat collaboration is not yet implemented
- the final planning/runtime boundary between Sprytly state and OpenClaw runtime metadata remains broader than this lane

## Recommended next lane

`Implement real-time agent-to-agent collaboration and proof back-briefing for Strike Team Alpha seat execution.`

That next lane should:

1. let seat agents exchange bounded collaboration signals during active work
2. let seats back-brief proof, blockers, and clarifications directly to President-A
3. keep those collaboration receipts visible in the cockpit without collapsing them into a second control plane
