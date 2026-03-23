# COCKPIT_FRESHNESS_SOURCE_MAP

## Purpose

Record the exact source artifacts used to implement and brief the push/subscription-based Workforce Alpha cockpit freshness lane.

## Strategic sources

### `ops/strategies/agent-workforce/AGENT_WORKFORCE_OPERATIONALIZATION_STRATEGY.md`

Used to preserve:

- ACP as the runtime seam
- A2A as bounded coordination
- the requirement that operator-facing truth must remain evidence-backed rather than projected theater

### `ops/missions/agent-workforce/JOB_STATUS_TRACKING_BRIEF.md`

Used to confirm:

- the admitted `Job Card` lifecycle and signal model
- the accepted execution-feed truth seam
- the earlier polling-based cockpit freshness limitation

### `ops/missions/agent-workforce/PRESIDENT_A_FAN_OUT_BRIEF.md`

Used to confirm:

- the admitted seat-task board and seat runtime signals
- the fan-out seam that now needed fresher cockpit visibility

### `ops/missions/agent-workforce/A2A_COLLAB_PROOF_BRIEF.md`

Used to confirm:

- the admitted collaboration / proof record model
- the accepted gap that cockpit freshness remained polling-based
- the exact next lane that was authorized after collaboration / proof landed

## Workforce product sources

### `../sprytly-internal-dashboard/server/src/index.js`

Used to implement:

- the Workforce Alpha SSE route
- live receipt normalization
- subscription broadcast from the existing Workforce lifecycle emitter
- durable event enrichment for collaboration and proof payloads
- refreshed snapshot / execution envelopes for pushed updates

### `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Used to land:

- EventSource subscription handling
- polling fallback when live connection is unavailable
- live seam status badges
- richer execution-feed receipt rendering
- live collaboration receipt cards inside the `Job dispatch` strip
- inbound/outbound node filtering for execution readback

### `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch.test.mjs`

Used to tighten:

- signal-health freshness behavior for `live`, `recent`, and `aging`

### `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch_api.test.mjs`

Used to prove:

- authenticated stream connection
- `connected` envelope delivery
- collaboration receipt push
- proof submission / review receipt push
- refreshed snapshot / execution payloads over the live seam
- freshness advancement after collaboration / proof activity

## Mission design inputs from subagent review

### Arendt

Used to preserve:

- live receipts as a freshness seam, not a second truth store
- `activity_events` as the durable ledger
- truthfulness around collaboration versus actual runtime execution

### Poincare

Used to keep:

- the live seam operator-facing and readable
- richer receipts compact inside the existing cockpit instead of sprawling into a second dashboard
- the page navigation disciplined even as the feed became more real-time

### Boole

Used to tighten:

- freshness-oriented helper coverage
- readback assertions after collaboration / proof activity
- integration proof for the new live seam

## Implementation conclusion

This lane is grounded in already-admitted seams:

1. durable Workforce lifecycle events in `activity_events`
2. current Workforce Alpha snapshot and execution read models
3. bounded seat collaboration and proof records under the active `Job Card`
4. the existing cockpit / inspector / execution surfaces

That grounding is why the lane delivers:

- push-first cockpit freshness
- richer live collaboration and proof receipts
- better operator situational awareness
- stronger agreement between pushed receipts and durable readback

and does **not** claim:

- full native workforce transport beyond the current bounded seam
- live inspector subscriptions for every surface
- broader workforce routing outside the admitted Alpha scope
