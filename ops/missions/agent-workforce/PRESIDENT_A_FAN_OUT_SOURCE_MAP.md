# PRESIDENT_A_FAN_OUT_SOURCE_MAP

## Purpose

Record the exact source artifacts used to implement and brief the President-A fan-out lane for Strike Team Alpha.

## Strategic sources

### `ops/strategies/agent-workforce/AGENT_WORKFORCE_OPERATIONALIZATION_STRATEGY.md`

Used to carry forward:

- the end-to-end delegation workflow from Voltaris to President-A to Strike Team Alpha
- ACP as runtime seam and A2A as bounded coordination
- the requirement that the first execution lanes stay truthful and bounded rather than inventing deeper autonomy than the runtime can admit

### `ops/missions/agent-workforce/STRIKE_TEAM_ALPHA_JOB_DISPATCH_MVP_BRIEF.md`

Used to confirm:

- what the dispatch MVP already delivered
- the admitted `Job Card` storage boundary in Sprytly SQLite
- the seat-brief groundwork that this lane had to turn into real seat-task execution state

### `ops/missions/agent-workforce/JOB_STATUS_TRACKING_BRIEF.md`

Used to confirm:

- the admitted `Job Card` lifecycle and status routes
- the existing session-context bridge sync seam
- the execution-feed / inspector surfaces that this lane needed to extend rather than replace

## Workforce product sources

### `../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`

Used to implement:

- normalized seat-task lifecycle statuses
- seat-task fan-out shaping
- seat-task signal application
- job-status roll-up from seat-task execution truth

### `../sprytly-internal-dashboard/server/src/index.js`

Used to implement:

- durable fan-out writes to `workforce_job_cards`
- President-A fan-out API
- seat-task status API
- session-context bridge synchronization for president and seat agents
- lifecycle event stamping for fan-out and seat-task updates
- snapshot / inspector / execution-feed readback

### `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Used to land:

- the `Fan out to seats` operator action
- seat-task board summary readback
- compact seat-task cards in the command strip
- seat-task visibility in the locked team panel
- richer inspector readback for seat execution

## Runtime / coordination truth sources

### `docs/tools/acp-agents.md`

Used to preserve the boundary that ACP remains the runtime seam and that the product should report observed or requested runtime state rather than claiming Sprytly owns worker execution.

### `src/agents/tools/sessions-spawn-tool.ts`

Used as grounding that runtime session creation belongs to OpenClaw tooling rather than Sprytly planning state.

### `src/agents/tools/sessions-send-tool.ts`

Used to preserve the principle that cross-agent delegation or clarification is bounded coordination rather than a durable job registry.

### `src/agents/tools/sessions-send-tool.a2a.ts`

Used to preserve the principle that A2A is a bounded follow-up seam and not a replacement for durable `Job Card` truth.

## Mission design inputs from subagent review

### Arendt

Used to drive:

- the single normalized seat-task array
- truthful seat-task lifecycle fields
- preference for deriving board counts from durable seat-task state rather than duplicating counters

### Aquinas

Used to tighten:

- the wording boundary between Sprytly delegation intent and OpenClaw runtime ownership
- the actor/session validation expectations for fan-out and seat-task updates
- the distinction between bounded coordination and claimed ACP runtime control

### Poincare

Used to keep:

- `JobDispatchCommandStrip` as the single mutable operator surface
- seat-task visibility compact and command-centric
- `InspectorDrawer` read-only for deeper seat-task detail

### Boole

Used to shape:

- the proof plan for seat fan-out and seat bridge synchronization
- preference for event-led verification over speculative UI-only confidence
- the guardrails around invalid transitions and session mismatches

## Implementation conclusion

This lane is grounded in already-admitted seams:

1. durable `Job Card` storage in Sprytly SQLite
2. session-context bridge synchronization into OpenClaw agent sessions
3. persisted `activity_events` as execution ledger
4. ACP runtime ownership staying outside Sprytly
5. the existing Workforce Alpha canopy / feed / inspector surfaces

That grounding is why the lane delivers:

- a durable seat-task board
- truthful President-A fan-out
- seat-level execution status updates
- synchronized president / seat bridge state
- stronger cockpit and inspector visibility

and does **not** claim:

- native ACP worker spawning owned by Sprytly
- direct runtime supervision of seat agents by the dashboard
- generalized multi-team workforce orchestration
