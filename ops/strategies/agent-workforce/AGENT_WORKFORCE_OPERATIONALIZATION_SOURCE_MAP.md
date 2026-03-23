# AGENT_WORKFORCE_OPERATIONALIZATION_SOURCE_MAP

## Purpose

Record the exact artifacts used to prepare `AGENT_WORKFORCE_OPERATIONALIZATION_STRATEGY.md`.

## Workforce baseline sources

### `ops/missions/cnv-mission-2-workforce-alpha-v2/BUILD_PROGRESS_CLOSEOUT.md`

Used to confirm:

- the prior Workforce Alpha V2 work was preserved as a real product slice plus mission-memory trail
- the sibling Sprytly repo is the primary product implementation location

### `ops/missions/cnv-mission-2-workforce-alpha-v2/REHYDRATION_BRIEF.md`

Used to confirm:

- the repo split between `openclaw` mission memory and sibling Sprytly workforce product code
- the live runtime origin for Workforce Alpha

### `ops/missions/cnv-mission-2-workforce-alpha-v2/UI_VALIDATION_REPORT.md`

Used to confirm:

- the cockpit is already structurally landed
- the execution-feed caveat remains the main workforce truth gap

### `ops/missions/agent-workforce-reengagement/AGENT_WORKFORCE_MISSION_01_BRIEF.md`

Used to carry forward:

- the current re-engagement framing
- the already-frozen live backend/UI baseline
- the warning against reopening stale deployment-ratification assumptions as if they were the active strategy

## Current Sprytly intake and planning sources

### `../sprytly-internal-dashboard/web/src/pages/DevelopmentPage.jsx`

Used to confirm:

- DEV staging exists
- staged To-Dos can be sent to Hivemind
- a Dev Pack can be created from a staged To-Do
- operator signoff is required
- the item can then be sent to the Dev Queue

### `../sprytly-internal-dashboard/server/src/index.js` around `dev-staging` and `hivemind`

Used to confirm:

- the actual backend endpoints for:
  - `/api/dev-staging/send-hivemind-prd`
  - `/api/dev-staging/build-pack-for-todo`
  - `/api/dev-staging/signoff`
  - `/api/dev-staging/send-dev-queue`
  - `/api/projects/:projectId/hivemind/sessions`
  - `/api/hivemind/sessions/:sessionId/summon`
  - `/api/hivemind/sessions/:sessionId/iterative-salon`
  - freeze/export/retention/compaction flows
- the current PRD flow from staged To-Do to frozen Hivemind session to Dev Pack to Dev Queue

### `../sprytly-internal-dashboard/web/src/pages/ProjectGroupthink.jsx`

Used to confirm:

- Hivemind supports:
  - objective and constraints
  - allowed roles
  - agent rosters
  - salon scenes
  - summon
  - iterative salon

## Current Workforce Alpha product sources

### `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Used to confirm:

- the live operator surfaces:
  - `Command Canopy`
  - `Live Ops Strip`
  - `Chain of Command Tree`
  - `Execution Feed`
  - `Evidence + Governance Rail`
  - `Inspector Drawer`
- existing operator controls:
  - Voltaris model control
  - President-A team edit/lock
  - President-A auto-team assembly
  - seat-level recommended model or manual pinning

### `../sprytly-internal-dashboard/server/src/index.js` around Workforce Alpha routes

Used to confirm:

- authenticated Workforce Alpha routes already exist
- workforce mutations already exist for:
  - Voltaris model update
  - team lock
  - team auto-assemble
  - seat-level session-policy writes
- important truth still relies on partial/local seams

## ACP and A2A sources

### `docs/tools/acp-agents.md`

Used to confirm:

- ACP sessions are the existing external harness runtime
- ACP supports spawn, persistent mode, thread binding, steering, model/permission/timeouts, and resume

### `src/agents/tools/sessions-spawn-tool.ts`

Used to confirm:

- `sessions_spawn` with `runtime: "acp"` is the real runtime entry point
- ACP runs can be one-shot or persistent and can resume an existing session

### `src/agents/tools/sessions-send-tool.a2a.ts`

Used to confirm:

- A2A already exists as a bounded session-to-session follow-up/announce mechanism
- it is useful for coordination, not yet a durable delegation registry

### `src/agents/tools/sessions-access.ts`

Used to confirm:

- A2A is policy-gated through `tools.agentToAgent`
- cross-agent coordination is not universally open by default

## M13 durable runtime artifact sources

### `ops/missions/mission-013/01_MISSION_SPEC.md`

Used to confirm:

- Mission 013 proved durable artifact contracts, examples, and tests for internal session/run state
- M13 did not prove a full workforce control plane

### `docs/architecture/internal-agent-registry.md`

Used to confirm:

- internal registry entries already carry durable per-session identity and runtime state

### `docs/architecture/run-orchestrator.md`

Used to confirm:

- the current orchestrator seam already models initialize/status/reconcile/run-turn lifecycle
- internal run envelopes already exist as durable truth for execution status

### `docs/architecture/internal-bus-api.md`

Used to confirm:

- the current internal bus is an artifact-contract truth, not a separate public transport endpoint

## Synthesis rules used

- Treat the Sprytly intake/staging flow as the upstream planning seam.
- Treat Workforce Alpha as the existing command/dispatch surface.
- Treat ACP as the runtime execution seam.
- Treat A2A as bounded coordination, not as the canonical task system.
- Treat M13 contracts as the strongest current durable runtime truth.
- Avoid inventing a new control plane when the current seams can be connected by one minimal job-dispatch slice.

## Strategy preparation conclusion

The strategy is grounded in existing:

1. intake and planning artifacts
2. workforce dispatch surfaces
3. ACP/A2A runtime and coordination seams
4. durable M13 runtime/session contracts

That is why the recommended first lane is a minimal `Job Dispatch MVP` rather than a broad workforce redesign.
