# MULTI_WORKSPACE_MISSION_REGISTRY_REVIEW_BRIEF

## Mission title

`Initiate a mission for a full multi-workspace mission registry and richer executive review flows (threaded rationale, reassignment, and approval audit checkpoints)`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Establish a first-class mission registry that can surface admitted work across multiple control-plane workspaces while upgrading executive review from a bounded single-decision seam into a threaded, reassignable, checkpointed workflow.

The delivered lane is accepted when:

1. missions can be listed and inspected across multiple workspaces from a single cockpit payload
2. workforce Job Cards register into that mission registry durably
3. executive review supports thread opening, rationale comments, reassignment, and append-only approval checkpoints
4. checkpoint history is hash-chained and surfaced back into the active Job Card payload
5. the existing Salon review loop remains compatible while the registry ledger becomes the richer audit source of truth

## Scope delivered

### 1. A first-class mission workspace registry now exists

The dashboard database now carries `mission_workspaces` alongside `mission_registry_entries`, `mission_registry_review_events`, and `mission_registry_review_checkpoints`.

This delivered layer now:

- seeds core workspaces for `workforce`, `hivemind`, and `ideas-incubator`
- admits custom workforce workspaces dynamically when Job Cards arrive with a scoped workspace binding
- provides durable workspace metadata such as labels, default team/president hints, and cockpit open links

### 2. Workforce Job Cards now register durably into the multi-workspace mission registry

Job Cards now carry:

- `workspace_id`
- `workspace_name`
- `mission_registry_id`

The registry entry builder now respects those workspace bindings instead of collapsing every workforce mission into a single hard-coded bucket.

This means the registry can truthfully distinguish:

- shared baseline workforce missions
- team-scoped workforce workspaces such as a locked team lane
- adjacent cross-workspace sources such as Hivemind sessions and Ideas Incubator entries

### 3. Executive review is now threaded, reassignable, and checkpointed

The executive review flow now supports:

- opening a review thread for a Salon back-brief
- adding threaded rationale comments
- reassigning the active reviewer to another admitted executive reviewer
- recording approval checkpoints as append-only checkpoint rows

The checkpoint lane is hash-chained through:

- `payload_digest`
- `previous_checkpoint_hash`
- `checkpoint_hash`

This gives the review flow a durable audit trail instead of depending only on the latest runtime-state mirror.

### 4. The existing Salon review route now mirrors into the registry ledger

The already-admitted route:

- `PATCH /api/mission-control/workforce/:teamKey/job-cards/:jobId/salon-backbriefs/:briefId/review`

still updates the Job Card runtime state and back-brief mirrors, but it now also:

- ensures a review thread exists
- appends a `decision` review event
- writes an `approval_recorded` checkpoint
- reflects the checkpointed state back into `salonIntegration.executiveReview`

This keeps the existing workforce flow intact while making the richer registry ledger available for audit and UI readback.

### 5. The cockpit and workforce UI now expose the new registry lane

The cockpit now renders a mission-registry panel that shows:

- workspace rollups
- mission counts
- review state
- thread counts
- checkpoint counts
- open links back to the admitted source surface

The workforce page now exposes:

- the registry mission detail for the active Job Card
- active thread selection
- comment drafting
- reviewer reassignment
- checkpoint history
- the generic `/mission-control/workforce` route in addition to the Alpha alias

## Implemented interfaces

### OpenClaw mission packet surface

- `ops/missions/agent-workforce/MULTI_WORKSPACE_MISSION_REGISTRY_REVIEW_BRIEF.md`
- `ops/missions/agent-workforce/MULTI_WORKSPACE_MISSION_REGISTRY_REVIEW_SOURCE_MAP.md`

### Dashboard backend surfaces

- `server/src/db.js`
- `server/src/missionRegistry.js`
- `server/src/index.js`
- `server/src/workforceJobDispatch.js`

### Dashboard frontend surfaces

- `web/src/pages/MissionControlCockpitPage.jsx`
- `web/src/pages/MissionControlWorkforceAlphaPage.jsx`
- `web/src/ui/App.jsx`

### Dashboard validation surfaces

- `scripts/tests/mission_registry_review_api.test.mjs`
- `scripts/tests/hivemind_salon_version_next_api.test.mjs`

## Implemented routes

### Workspace registry reads

- `GET /api/mission-control/workspaces`
- `GET /api/mission-control/workspaces/:workspaceKey/missions`
- `GET /api/mission-control/workspaces/:workspaceKey/missions/:missionId`

### Generic mission-registry reads and actions

- `GET /api/mission-control/mission-registry`
- `GET /api/mission-control/mission-registry/:missionId`
- `POST /api/mission-control/mission-registry/:missionId/review-threads`
- `POST /api/mission-control/mission-registry/:missionId/review-threads/:threadId/comments`
- `PATCH /api/mission-control/mission-registry/:missionId/review-threads/:threadId/assignment`

### Workforce review compatibility seam

- `PATCH /api/mission-control/workforce/:teamKey/job-cards/:jobId/salon-backbriefs/:briefId/review`

## Acceptance criteria for this lane

This lane is accepted when:

1. a cockpit payload can show missions across multiple workspaces
2. workforce Job Cards create or refresh a mission-registry entry and workspace binding durably
3. review threads can be opened, commented on, and reassigned through admitted APIs
4. approval checkpoints are hash-chained and queryable
5. workforce Salon review results project both legacy back-brief state and richer registry review state without contradiction

## Validation proof

Implementation proof is expected against:

- `node --test scripts/tests/mission_registry_review_api.test.mjs`
- `node --test scripts/tests/hivemind_salon_version_next_api.test.mjs`
- `npm test`
- `npm -w server run lint`
- `npm run lint`
- `pnpm build`

## Risks carried forward

### Immediate blockers

None.

### Accepted follow-on risks

- the mission workspace registry is durable and queryable, but it is still control-plane local rather than a broader multi-repo or multi-install registry
- executive review is now threaded and checkpointed, but it is still a bounded workflow rather than a fully signed approval chain with role-based escalation gates
- workforce runtime state still mirrors review summaries for compatibility, so the system remains dual-write by design even though the richer audit lane now lives in the registry tables
- some file and component names still carry older Alpha-era naming even though the route model has expanded beyond that alias

## Recommended next lane

`Conduct a cross-workspace deployment and integration test of the mission registry, then add richer executive workflow semantics such as threaded approval closure, signed checkpoints, and reassignment SLAs.`
