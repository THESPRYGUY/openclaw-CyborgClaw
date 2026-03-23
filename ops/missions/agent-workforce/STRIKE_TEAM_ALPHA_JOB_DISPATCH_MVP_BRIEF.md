# STRIKE_TEAM_ALPHA_JOB_DISPATCH_MVP_BRIEF

## Mission title

`Strike Team Alpha Job Dispatch MVP`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Establish the first truthful, durable pipeline from staged work intake to Workforce Alpha job delegation so Voltaris can:

1. promote one queued DEV-staging item into a real `Job Card`
2. delegate that `Job Card` to President-A
3. snapshot the currently locked Strike Team Alpha lineup at delegation time
4. bridge the job into the local ACP session seam without pretending Sprytly is the runtime authority
5. read the delegated job back through the Workforce Alpha cockpit, execution feed, and inspector

## Scope delivered

### 1. Durable Job Card seam

The MVP resolves the prior `TO VERIFY` storage question by placing `Job Card` state in the sibling Sprytly SQLite database as `workforce_job_cards`.

This keeps:

- intake truth in existing DEV-staging / Hivemind / Dev Queue tables
- runtime truth in OpenClaw session/run seams
- workforce dispatch truth in one durable, bounded workforce-local table

### 2. Job Card promotion

The MVP only promotes work from a queued DEV-staging To-Do.

Promotion preconditions:

- `staging_state = queued`
- PRD/Hivemind requirement pack admitted
- Dev Pack path admitted
- operator signoff admitted
- no existing live `Job Card` for the same To-Do

The created `Job Card` snapshots:

- title
- objective
- constraints summary
- requirements summary
- acceptance summary
- source To-Do
- source Hivemind session
- source export path
- source Dev Pack path
- optional project/deliverable/version lineage binding
- mission brief
- requirement-pack Hivemind learnings

### 3. Voltaris to President-A delegation

Delegation is implemented as a real durable state transition plus a truthful runtime bridge.

What the MVP does:

- requires a locked President-A team
- snapshots the current locked team into the delegated `Job Card`
- writes:
  - `runtimeDispatch`
  - `a2aCoordination`
  - assigned president
  - assigned team
  - delegated timestamps and reason

What the MVP does not claim:

- Sprytly does **not** directly spawn ACP sessions in this lane
- Sprytly does **not** yet manage seat runtime lifecycle as if it were the ACP authority

Instead, the MVP truthfully uses a `session_context_bridge` model:

- ACP remains the runtime layer
- session context is written into the local OpenClaw session store
- President-A receives the delegated job context
- seat agents receive bounded seat briefs
- A2A is represented as bounded coordination intent, not as durable job ownership

### 4. President-A to seat delegation groundwork

The MVP lays down the interface and durable handoff structure for President-A seat coordination by persisting:

- team seat snapshot
- seat session-key hints
- model/thinking/reasoning policy snapshot
- bounded seat-handoff summaries
- escalation targets back to President-A and Voltaris

This is groundwork only. Real seat runtime fan-out remains a follow-on lane.

### 5. Operator-facing cockpit readback

The Workforce Alpha page now exposes a compact `Job dispatch` strip in the `Command Canopy`.

It shows:

- active `Job Card`
- current status
- source provenance
- locked team / seat count
- ACP runtime seam label
- A2A coordination mode
- promotion controls for queued To-Dos
- delegation control to President-A

The inspector now exposes a `Job card` section for the selected node, including:

- `jobId`
- title
- owner
- source To-Do
- runtime dispatch note
- seat brief when relevant

The execution feed now records persisted lifecycle events for:

- `workforce.job_card.created`
- `workforce.job_card.delegated`
- `workforce.job_card.session_bound`
- `workforce.job_card.seat_brief_prepared`

## Implemented interfaces

### Backend routes

- `POST /api/mission-control/workforce/alpha/job-cards`
- `PATCH /api/mission-control/workforce/alpha/job-cards/:jobId/delegate`

### Backend modules

- `../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`
- `../sprytly-internal-dashboard/server/src/index.js`
- `../sprytly-internal-dashboard/server/src/db.js`

### Frontend surface

- `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

### Test coverage

- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch_api.test.mjs`

## Acceptance criteria for this MVP

This lane is accepted when:

1. a queued DEV-staging To-Do can be promoted into a durable `Job Card`
2. that `Job Card` can be delegated to President-A only when the team is locked
3. delegation snapshots the current team instead of pointing to mutable live seat state
4. delegation writes truthful ACP session-context bridge data and bounded A2A seat-brief intent
5. the cockpit shows the active job and delegation status without inventing runtime truth
6. inspector detail shows the linked `Job Card`
7. execution feed shows persisted job lifecycle events
8. unit and integration tests prove the vertical slice end to end

## Validation proof

Implementation proof was accepted against:

- syntax checks for the new backend modules
- targeted pure Job Card tests
- targeted API flow test:
  - queued To-Do
  - Job Card creation
  - delegation to President-A
  - snapshot readback
  - inspector readback
  - execution feed readback
  - session-store bridge readback
- full sibling Sprytly test suite
- sibling build
- sibling lint with warnings only and no errors

## Risks carried forward

### Immediate blockers

None.

### Accepted follow-on risks

- ACP runtime execution is still bridged through session context, not yet a direct spawned workforce run from Sprytly
- President-A seat delegation remains a bounded handoff plan, not real seat runtime orchestration
- `Job Card` storage is now resolved, but the final long-term split between Sprytly planning state and OpenClaw runtime metadata still needs broader governance
- only queued DEV-staging items are promotable in this MVP
- broader multi-president or multi-team dispatch remains deferred
- real-time job progress/receipt rollups remain thinner than desired until execution-signal hardening lands

## Recommended next lane

`Implement Workforce Alpha real-time job status tracking and execution signal hardening.`

The next lane should:

1. bind live ACP/run truth back to the delegated `Job Card`
2. improve execution-state transitions beyond simple delegated/session-bound signals
3. admit clearer blocked / running / completed / escalated status against the job itself
4. strengthen cockpit truth so Glen can tell what the team is actually doing right now without leaning on projected heuristics
