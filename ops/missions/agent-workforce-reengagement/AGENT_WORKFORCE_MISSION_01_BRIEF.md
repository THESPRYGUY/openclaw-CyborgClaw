# AGENT_WORKFORCE_MISSION_01_BRIEF

## Mission title

`Agent Workforce Re-engagement — Mission 01`

## Mission objective

Re-enter the Agent Workforce domain from the current live Workforce Alpha product state, freeze the accepted baseline and open risks from the prior Workforce Alpha V2 mission, and authorize one bounded first implementation lane that strengthens runtime truth before any broader workforce expansion.

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `READY FOR RATIFICATION`
- Mutation scope for this packet: `new mission artifacts only`

## VERIFIED CURRENT STATE

### Historical baseline that still matters

- The prior Workforce Alpha V2 mission is fully preserved in `ops/missions/cnv-mission-2-workforce-alpha-v2/`.
- Its closeout packet froze three preserved slices:
  1. sibling Sprytly product implementation
  2. smaller OpenClaw Control UI sync fix
  3. Workforce Alpha V2 mission-memory trail
- The historical packet is still valuable for restart, evidence, and design intent, especially:
  - `ops/missions/cnv-mission-2-workforce-alpha-v2/BUILD_PROGRESS_CLOSEOUT.md`
  - `ops/missions/cnv-mission-2-workforce-alpha-v2/REHYDRATION_BRIEF.md`
  - `ops/missions/cnv-mission-2-workforce-alpha-v2/UI_VALIDATION_REPORT.md`
  - `ops/missions/cnv-mission-2-workforce-alpha-v2/DATA_CONTRACTS_AND_APIS_PLAN.md`

### Current live backend state in the sibling Sprytly product

- Workforce Alpha is no longer planning-only. The sibling product exposes authenticated live routes for:
  - `GET /api/mission-control/workforce/alpha`
  - `GET /api/mission-control/workforce/alpha/snapshot`
  - `PATCH /api/mission-control/workforce/alpha/model`
  - `PATCH /api/mission-control/workforce/alpha/team`
  - `POST /api/mission-control/workforce/alpha/team/assemble`
  - `GET /api/mission-control/workforce/alpha/execution`
  - `GET /api/mission-control/workforce/alpha/inspector`
- The backend currently supports real mutations for:
  - Voltaris primary-model changes
  - President-A team seat locking
  - President-A auto-team assembly
  - seat-level session-policy writes
- The backend still admits important seams as partial or local:
  - saved president-team assignment store
  - local roster fallback
  - local session freshness heuristics
  - local A2A/subagent allow-list seams

### Current live UI state in the sibling Sprytly product

- The current Workforce Alpha page is a shipped operator surface, not a wireframe.
- The UI contains the six major cockpit surfaces:
  - `Command Canopy`
  - `Live Ops Strip`
  - `Chain of Command Tree`
  - `Execution Feed`
  - `Evidence + Governance Rail`
  - `Inspector Drawer`
- Voltaris renders as a unified command tile with:
  - model control
  - token telemetry
  - tool and skill drill-through
- President-A renders as a structured commander tile with:
  - editable team-builder controls
  - `Auto team assemble`
  - seat count control
  - seat-level agent selection
  - seat-level recommended model policy or manual model pinning
  - `Lock team` and `Edit team`
- The UI already supports meaningful operator actions. The current gap is not “build a workforce UI from scratch.” The current gap is “make the truth path behind the existing workforce UI more reliable and higher-signal.”

## FROZEN ACCEPTED BASELINE

### Baseline decisions to keep

- Keep Workforce Alpha scoped to Alpha-first operator truth rather than widening immediately to broader org expansion.
- Keep the honesty rules from the prior mission:
  - do not invent runtime truth
  - keep `Projected` and `Missing` explicit
  - do not silently convert local seams into admitted contracts
- Keep the current command-first surface as the active UI baseline.
- Keep the existing President-A team-builder and Voltaris command controls as landed product scope, not fresh design work.

### Historical assumptions that are now stale and should not be carried forward unchanged

- Do not carry forward the old assumption that the next workforce step is still only deployment ratification.
- Do not carry forward the older view that the President-A team-builder and auto-team-assemble work are future or optional; they are already landed in the live sibling product.
- Do not carry forward the older packaging-only posture as if workforce work were still waiting on basic UI implementation.

## OPEN RISKS TO CARRY FORWARD

### Backend / truth risks

- Team membership is still admitted through the saved president-team assignment store with roster fallback defaults, not a first-class team membership contract.
- Role labels still rely on local placeholders or roster/config seams rather than a canonical org contract.
- Working status and live-ops rollups still rely partly on local session freshness heuristics.
- Voltaris command scope is still derived from local Alpha view, local session evidence, and local allow-list seams rather than a first-class management contract.
- Model and team mutations currently write through local OpenClaw config and local session-policy seams, which is useful but tightly coupled.

### Operator / UX risks

- The execution feed is still the weakest operational surface because much of the live payload remains projected cross-domain activity rather than high-signal Workforce-specific action with mapped actor and outcome.
- The current product can manage teams, models, and telemetry, but it still does not fully answer the operator question: `what changed, who did it, and what state is it in now?`

## PROPOSED FIRST BOUNDED LANE

### Lane title

`Workforce Alpha Execution Signal Hardening`

### Why this lane should go first

- The cockpit already exists.
- The primary team-management controls already exist.
- The next highest-leverage move is to strengthen the runtime truth path behind the current UI, not to expand the UI again.
- If workforce expansion happens before execution truth is stronger, projected ambiguity scales with it.

### Lane objective

Keep the already-landed team-builder and command-surface baseline intact while turning Workforce Alpha into a higher-signal operator surface by normalizing the execution story first: who acted, what happened, and whether the event succeeded, stalled, blocked, degraded, or escalated.

### In scope

- Improve `GET /api/mission-control/workforce/alpha/execution` so Workforce-relevant rows resolve:
  - `actorNodeId`
  - `actorDisplayName`
  - normalized `outcome`
- Reduce generic cross-domain noise in the default execution story without hiding useful projected rows.
- Admit only the minimum live-ops rollups that can be truthfully derived from the same normalized execution path:
  - `awaitingApproval`
  - `blocked`
  - `degraded`
  - `failedGates` only if a real source exists
- Keep missing fields, projected state, and source provenance explicit anywhere stronger truth still does not exist.

### Out of scope

- New presidents, new teams, or broader org expansion beyond Alpha
- Replacing the entire Workforce cockpit design
- New major cockpit surfaces
- Broad inspector expansion unrelated to execution truth
- Reopening memory-work sprint scope
- Broad deployment packaging or release handling work

### Acceptance criteria

- The live execution API returns materially better Workforce-owned rows with mapped actor identity whenever derivable from current seams.
- The live execution API returns normalized outcome values whenever derivable from current seams.
- The default execution surface no longer reads primarily as generic cross-domain activity.
- The snapshot / live-ops surface only admits new counts where they are supported by the same execution-normalization path; unsupported counts remain explicit gaps.
- The resulting UI validation caveat narrows from a broad execution-signal warning to a smaller residual truth gap.
- No new workforce org expansion or broad UI redesign is required to satisfy the lane.

## INITIAL RESOURCE AND TOOL REQUIREMENTS

- Read access to `ops/missions/cnv-mission-2-workforce-alpha-v2/`
- Read/write access to the sibling Sprytly repo at `../sprytly-internal-dashboard/`
- Access to the live local Sprytly runtime on `127.0.0.1:18792`
- Authenticated API proof path for the Workforce Alpha routes
- Headless browser validation for the live cockpit after any execution-signal change

## RECOMMENDED STARTUP READ ORDER FOR THE NEXT IMPLEMENTATION LANE

1. `ops/missions/cnv-mission-2-workforce-alpha-v2/BUILD_PROGRESS_CLOSEOUT.md`
2. `ops/missions/cnv-mission-2-workforce-alpha-v2/REHYDRATION_BRIEF.md`
3. `ops/missions/cnv-mission-2-workforce-alpha-v2/UI_VALIDATION_REPORT.md`
4. `ops/missions/cnv-mission-2-workforce-alpha-v2/DATA_CONTRACTS_AND_APIS_PLAN.md`
5. `ops/missions/agent-workforce-reengagement/AGENT_WORKFORCE_MISSION_01_SOURCE_MAP.md`

## RATIFICATION QUESTION

Should `Agent Workforce Re-engagement — Mission 01` be ratified with `Workforce Alpha Execution Signal Hardening` as the first bounded implementation lane?

## What good looks like

The next workforce implementation lane starts from the real shipped Alpha cockpit, preserves the old mission pack as historical truth instead of stale next-action truth, and hardens execution signal before the team widens scope into broader workforce expansion.
