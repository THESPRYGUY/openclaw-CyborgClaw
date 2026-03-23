# JOB_STATUS_TRACKING_SOURCE_MAP

## Purpose

Record the exact source artifacts used to implement and brief the real-time Workforce Alpha job status tracking and execution-signal hardening lane.

## Strategic sources

### `ops/strategies/agent-workforce/AGENT_WORKFORCE_OPERATIONALIZATION_STRATEGY.md`

Used to carry forward:

- the ACP-as-runtime principle
- A2A as bounded coordination rather than ungoverned delegation
- the requirement to improve execution truth in the cockpit
- the recommendation that the first hardening pass should focus on execution signal quality before broader org expansion

### `ops/missions/agent-workforce/STRIKE_TEAM_ALPHA_JOB_DISPATCH_MVP_BRIEF.md`

Used to confirm:

- what the dispatch MVP already delivered
- what remained intentionally deferred
- the previously accepted storage boundary for `Job Card` state
- the exact next lane that had been authorized after the MVP

### `ops/missions/agent-workforce/STRIKE_TEAM_ALPHA_JOB_DISPATCH_MVP_SOURCE_MAP.md`

Used to confirm:

- which upstream workforce, ACP, A2A, and Hivemind seams were already admitted
- which artifacts were safe to reuse instead of redesigning

## Workforce product sources

### `../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`

Used to implement:

- normalized workforce job lifecycle statuses
- signal actions and transition rules
- signal-health computation
- durable signal application to `Job Card` state

### `../sprytly-internal-dashboard/server/src/db.js`

Used to extend:

- `workforce_job_cards` with durable status and runtime-signal fields
- the index and migration layer needed for the new state model

### `../sprytly-internal-dashboard/server/src/index.js`

Used to implement:

- status-summary payloads
- signal timeline readback
- bridge synchronization
- validation of actor/session runtime signals
- real-time status APIs
- execution-feed lifecycle event emission

### `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Used to land:

- clearer active-job readback
- signal-health and progress labels
- recent signal trail
- inspector timeline drill-down
- passive refresh for fresher cockpit truth

## Runtime / coordination truth sources

### `src/agents/tools/sessions-send-tool.a2a.ts`

Used to preserve the principle that seat coordination remains bounded and intentional rather than an untyped durable delegation registry.

### `docs/tools/acp-agents.md`

Used to preserve the principle that ACP remains the runtime seam while Sprytly reports and bridges state rather than claiming runtime ownership.

## Mission design inputs from subagent review

### Arendt

Used to drive:

- minimal truthful state-machine design
- preference for explicit signal fields over heuristic node matching
- reuse of `activity_events` as the durable signal ledger

### Poincare

Used to keep:

- `JobDispatchCommandStrip` as the only mutable operator surface
- `InspectorDrawer` as read-only drill-down
- execution feed and live ops as passive monitoring rather than new control planes

### Aquinas

Used to shape:

- lifecycle-sequence proof
- negative transition tests
- “no invented runtime truth” assertions
- session-bridge hardening proof

### Boole

Used to tighten:

- lifecycle event stamping into `activity_events`
- bridge-sync result surfacing
- emphasis on durable job truth over projected execution fallback

## Implementation conclusion

This lane is grounded in already-admitted seams:

1. durable `Job Card` storage in Sprytly SQLite
2. ACP session-context bridging for runtime state
3. persisted `activity_events` as lifecycle ledger
4. the existing Workforce Alpha canopy / feed / inspector surfaces

That grounding is why the lane delivers:

- a richer admitted job lifecycle
- bounded runtime-signal mutation
- synchronized bridge state
- stronger cockpit readback

and does **not** claim:

- full workforce-native seat orchestration
- push-driven live telemetry
- broad multi-team execution routing
