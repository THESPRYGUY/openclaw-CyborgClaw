# STRIKE_TEAM_ALPHA_JOB_DISPATCH_MVP_SOURCE_MAP

## Purpose

Record the exact source artifacts used to implement and brief the `Strike Team Alpha Job Dispatch MVP`.

## Strategic sources

### `ops/strategies/agent-workforce/AGENT_WORKFORCE_OPERATIONALIZATION_STRATEGY.md`

Used to carry forward:

- the end-to-end delegation workflow
- the bounded Phase 1 scope
- the unresolved storage-boundary question
- the requirement to keep ACP as runtime and A2A as bounded coordination

### `ops/strategies/agent-workforce/AGENT_WORKFORCE_OPERATIONALIZATION_SOURCE_MAP.md`

Used to confirm:

- which prior workforce, ACP, A2A, and M13 seams had already been verified
- which existing artifacts were safe to reuse instead of reinventing

## Workforce product sources

### `../sprytly-internal-dashboard/server/src/index.js`

Used to confirm:

- the existing Workforce Alpha routes and payload builders
- DEV-staging / Hivemind / queue seams
- current execution-feed and inspector truth gaps
- the existing mutable President-A team-selection seam

### `../sprytly-internal-dashboard/server/src/db.js`

Used to confirm:

- SQLite is already the durable operational store for Sprytly
- a bounded `workforce_job_cards` table is the cleanest MVP storage boundary

### `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Used to confirm:

- the current canopy / commander / team / execution / inspector layout
- the best place to land a compact job-dispatch strip without creating a second control plane

## Runtime and coordination sources

### `docs/tools/acp-agents.md`

Used to confirm:

- ACP remains the truthful runtime seam
- session spawn/resume/steering exists already

### `src/agents/tools/sessions-spawn-tool.ts`

Used to confirm:

- session-spawn truth lives in OpenClaw, not in Sprytly
- the MVP should not pretend to directly own ACP runtime lifecycle from the dashboard

### `src/agents/tools/sessions-send-tool.a2a.ts`

Used to confirm:

- A2A is appropriate for bounded coordination and escalation
- A2A is not yet a durable workforce-delegation registry

## Hivemind / intake sources

### `../sprytly-internal-dashboard/web/src/pages/DevelopmentPage.jsx`

Used to confirm:

- staged To-Do -> Hivemind -> Dev Pack -> signoff -> queue already exists as a real upstream seam

### `../sprytly-internal-dashboard/server/src/index.js` around `dev-staging` and `hivemind`

Used to confirm:

- the exact queued-state and PRD/Dev Pack/signoff prerequisites the MVP should reuse rather than rebuild

## Implementation conclusion

The MVP is grounded in already-admitted seams:

1. staged intake in Sprytly
2. locked President-A team selection
3. ACP runtime truth in OpenClaw
4. A2A bounded follow-up for coordination
5. durable job-dispatch state in a new Sprytly SQLite seam

This is why the implemented MVP is:

- one durable `Job Card`
- one delegation seam
- one truthful runtime bridge
- one compact cockpit readback

and not a broad workforce redesign.
