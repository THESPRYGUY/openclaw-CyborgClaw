# JOB_STATUS_TRACKING_BRIEF

## Mission title

`Implement Workforce Alpha real-time job status tracking and execution signal hardening`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Harden the first Strike Team Alpha dispatch MVP so the Workforce Alpha cockpit can report a more truthful live execution story for delegated `Job Card`s.

The lane was accepted to deliver:

1. a real durable lifecycle for delegated workforce jobs
2. clearer execution signals and bridge synchronization for President-A and locked Alpha seats
3. API surfaces for reading and updating real-time job state
4. cockpit and inspector readback that shows current progress, last signal, and recent lifecycle trail
5. stronger tests proving both happy-path lifecycle flow and runtime guardrails

## Scope delivered

### 1. Durable real-time Job Card lifecycle

The sibling Sprytly `workforce_job_cards` seam now tracks a richer job lifecycle instead of only `draft` and `delegated`.

Admitted statuses now include:

- `draft`
- `delegated`
- `acknowledged`
- `in_progress`
- `awaiting_review`
- `blocked`
- `completed`
- `failed`
- `archived`

Durable runtime-signal fields were added to support live cockpit truth:

- `progressLabel`
- `runtimeStateJson`
- `acknowledgedAt`
- `reviewRequestedAt`
- `blockedAt`
- `failedAt`
- `archivedAt`
- `currentActiveAgentId`
- `currentActiveRole`
- `activeSessionKey`
- `activeRunId`
- `lastSignalAt`
- `lastSignalKind`
- `lastSignalAgentId`
- `lastSignalRole`
- `lastSignalDetail`
- `lastHeartbeatAt`

This resolves the earlier gap where the cockpit had to infer too much from thin or projected signals after delegation.

### 2. Execution signal hardening

The lane hardens the execution seam without pretending Sprytly owns the runtime.

What is now true:

- runtime mutations pass through explicit `action` signals
- actor role and session-key expectations are validated
- invalid lifecycle transitions are rejected
- lead / president / seat permissions are bounded by admitted role
- every status mutation is written back into:
  - `workforce_job_cards`
  - session-context bridge state
  - persisted `activity_events`

President-A and seat agents now receive synchronized session-context updates that include:

- current job status
- status reason
- progress label
- active run / session hints
- last signal actor and kind
- signal-health assessment

### 3. Real-time status APIs

The lane extends the Workforce Alpha API surface with explicit status routes:

- `GET /api/mission-control/workforce/alpha/job-cards/:jobId/status`
- `PATCH /api/mission-control/workforce/alpha/job-cards/:jobId/status`

The status mutation route now supports bounded runtime actions:

- `acknowledge`
- `start`
- `heartbeat`
- `await_review`
- `block`
- `complete`
- `fail`
- `archive`

This creates the first truthful operator-visible lifecycle mutation seam for Alpha job execution.

### 4. Cockpit and inspector readback

The Workforce Alpha cockpit was hardened so operators can see more than “delegated.”

The `Job dispatch` strip now shows:

- current job status
- current owner
- last signal age
- signal health
- progress label
- active session key
- active run id
- recent signal trail
- next admitted actions

The execution feed now admits:

- job status pills
- progress labels
- stronger lifecycle event readback for acknowledged / blocked / review / completed states

The inspector `Job card` surface now admits:

- progress
- signal health
- last signal kind
- recent signals timeline

The canopy keeps the latest relevant job visible even after completion so the operator does not lose the most recent execution truth the moment a job finishes.

### 5. Test hardening

The lane added or expanded test coverage for:

- helper-level lifecycle transitions
- signal-health computation
- DB round-trip of new runtime fields
- full API lifecycle:
  - create
  - delegate
  - acknowledge
  - start
  - block
  - resume
  - await review
  - complete
- negative guardrails:
  - invalid transition rejection
  - mismatched session rejection

## Implemented interfaces

### Backend modules

- `../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`
- `../sprytly-internal-dashboard/server/src/index.js`
- `../sprytly-internal-dashboard/server/src/db.js`

### Frontend surface

- `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

### Test coverage

- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch_api.test.mjs`

## Acceptance criteria for this lane

This lane is accepted when:

1. delegated `Job Card`s can move through a truthful bounded lifecycle beyond `delegated`
2. status updates are durably recorded in the workforce job store
3. runtime signals are validated against admitted actor/session expectations
4. session-context bridge state stays synchronized for President-A and seat agents
5. cockpit readback shows clearer live execution truth for active and recently completed jobs
6. inspector readback exposes recent signal history and signal-health posture
7. execution feed reflects persisted lifecycle events instead of relying on projected heuristics
8. unit and API tests prove the lifecycle and guardrails end to end

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

- promotion from queued DEV-staging To-Do into a `Job Card`
- delegation to President-A
- runtime acknowledgements and starts
- blocked and resumed execution
- awaiting-review transition
- completion with artifact reference
- status endpoint readback
- snapshot readback
- inspector readback
- execution feed readback
- session-store bridge readback
- invalid transition rejection
- mismatched session rejection

## Risks carried forward

### Immediate blockers

None.

### Accepted follow-on risks

- runtime delegation is still a session-context bridge plus bounded coordination, not full workforce-native run orchestration
- President-A seat fan-out remains conceptual / bridged rather than true autonomous runtime ownership per seat
- cockpit freshness still relies on polling rather than a dedicated push/subscription seam
- broader multi-president or multi-team execution routing remains intentionally out of scope
- long-term governance around the final split between Sprytly planning state and OpenClaw runtime metadata still remains broader than this lane

## Recommended next lane

`Implement President-A execution fan-out to Strike Team Agents.`

That next lane should:

1. move from seat-brief preparation to real bounded seat execution dispatch
2. admit seat-owned execution receipts back into the Job Card
3. strengthen President-A orchestration truth beyond status relays alone
4. preserve the same no-invented-runtime-truth discipline established in this hardening pass
