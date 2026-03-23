# A2A_COLLAB_PROOF_SOURCE_MAP

## Purpose

Record the exact source artifacts used to implement and brief the real-time Strike Team Alpha collaboration and structured proof back-briefing lane.

## Strategic sources

### `ops/strategies/agent-workforce/AGENT_WORKFORCE_OPERATIONALIZATION_STRATEGY.md`

Used to carry forward:

- ACP as the runtime seam
- A2A as bounded coordination rather than an ungoverned job mesh
- the requirement that execution truth should be evidence-backed
- the principle that seat coordination must route back through President-A and the `Job Card`

### `ops/missions/agent-workforce/STRIKE_TEAM_ALPHA_JOB_DISPATCH_MVP_BRIEF.md`

Used to confirm:

- what the dispatch MVP already delivered
- how `Job Card` state was durably stored
- which seams were intentionally left at groundwork level

### `ops/missions/agent-workforce/JOB_STATUS_TRACKING_BRIEF.md`

Used to confirm:

- the admitted Job Card lifecycle and signal model
- the accepted execution-feed / bridge truth model
- the exact next lane that had been authorized after signal hardening

### `ops/missions/agent-workforce/PRESIDENT_A_FAN_OUT_BRIEF.md`

Used to confirm:

- the admitted seat-task board and seat lifecycle states
- the president fan-out API seam
- the accepted bridge synchronization model for President-A and seat agents
- the follow-on gap around collaboration and proof back-briefing

## Workforce product sources

### `../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`

Used to implement:

- collaboration message normalization
- proof back-brief normalization
- collaboration / proof board summaries
- seat-task view enrichment with collaboration/proof counts
- bounded seat collaboration mutation
- structured proof submission
- President-A proof review aggregation

### `../sprytly-internal-dashboard/server/src/index.js`

Used to implement:

- actor/session validation for collaboration and proof routes
- durable DB mutation for collaboration/proof state
- session-context bridge synchronization for President-A and seat sessions
- execution-feed event stamping for collaboration and proof review
- new API routes for collaboration, proof submission, and proof review

### `../sprytly-internal-dashboard/server/src/db.js`

Used to preserve:

- safe startup against older `server/data` workforce job stores
- migration ordering for `workforce_job_cards` last-signal fields before index creation
- truthful runtime handoff after the collaboration/proof lane landed

### `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Used to land:

- collaboration and proof posture in the `Job dispatch` strip
- per-seat collaboration/proof scanability
- inspector drill-down for collaboration and proof back-briefs
- richer execution-feed readback of collaboration/proof events

## Runtime / coordination truth sources

### `src/agents/tools/sessions-send-tool.a2a.ts`

Used to preserve the principle that A2A remains bounded follow-up and not a durable task registry.

### `docs/tools/acp-agents.md`

Used to preserve the principle that ACP remains the runtime execution seam while Sprytly reports and bridges state.

## Mission design inputs from subagent review

### Arendt

Used to drive:

- append-only collaboration and proof record thinking
- explicit proof review semantics instead of automatic verification claims
- truthfulness guardrails between coordination evidence and runtime execution truth

### Poincare

Used to keep:

- the collaboration/proof surfaces compact inside the existing cockpit
- inspector drill-down read-only and evidence-first
- the page from sprawling into a second control plane

### Boole

Used to tighten:

- helper/API proof coverage around collaboration and proof back-briefing
- session-bridge assertions for President-A and seat agents
- execution-feed verification for new collaboration/proof events

## Implementation conclusion

This lane is grounded in already-admitted seams:

1. durable `Job Card` state in Sprytly SQLite
2. bounded seat-task lifecycle beneath President-A fan-out
3. ACP session-context bridging for runtime readback
4. persisted `activity_events` as the collaboration / proof ledger
5. the existing Workforce Alpha cockpit, inspector, and execution feed

That grounding is why the lane delivers:

- bounded seat-to-seat / seat-to-president collaboration visibility
- structured proof back-brief submission and review
- stronger runtime truth for collaboration and evidence
- synchronized readback for President-A and seat agents

and does **not** claim:

- full native inter-agent transport beyond admitted job scope
- push-driven live collaboration updates
- automatic proof verification or autonomous approval outside President-A
