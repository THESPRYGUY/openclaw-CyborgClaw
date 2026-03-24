# MULTI_WORKSPACE_MISSION_REGISTRY_REVIEW_SOURCE_MAP

## Purpose

Record the exact runtime surfaces, predecessor mission packets, and validation artifacts used to land the multi-workspace mission registry plus the richer executive review workflow.

## Governing mission inputs

### `ops/missions/agent-workforce/MULTI_TEAM_COCKPIT_KINSHIP_REVIEW_BRIEF.md`

Used for:

- the already-landed multi-team cockpit promotion
- the team-scoped Kinship registry work
- the accepted follow-on gap around richer review workflow depth and broader registry scope

### `ops/missions/agent-workforce/PRESIDENT_A_REVIEW_ORCHESTRATION_BRIEF.md`

Used for:

- the explicit President review seam for Salon back-briefs
- the existing review-board mirrors and cross-team orchestration assumptions

### `ops/missions/agent-workforce/JOB_CARD_SALON_MEMORY_LOOP_BRIEF.md`

Used for:

- the admitted `Job Card -> Salon -> Memory HQ -> synthesis back-brief` path
- the durable runtime-state fields for Salon runs, memory imports, and President back-briefs

### `ops/missions/agent-workforce/HIVEMIND_SALON_UPGRADE_BRIEF.md`

Used for:

- the revived Hivemind Salon runtime contract
- the initial Salon integration seams that the new mission registry now wraps

## Existing runtime code used as source truth

### `server/src/db.js`

Used for:

- the durable Job Card schema
- the adjacent `ideas` and `hivemind_sessions` source records
- the new workspace, registry, review-event, and checkpoint tables

### `server/src/index.js`

Used for:

- mission-registry entry construction and payload shaping
- workforce Job Card lifecycle routes
- Salon launch and Salon review write seams
- mission-registry workspace and review-thread APIs
- cockpit payload assembly

### `server/src/workforceJobDispatch.js`

Used for:

- Job Card row parsing and DB writes
- team-aware president and seat execution context
- the durable `workspace_id`, `workspace_name`, and `mission_registry_id` linkage fields

### `server/src/hivemindSalonVersionNext.js`

Used for:

- the President back-brief contract that now seeds review threads and later decision checkpoints

### `server/src/workforceSalonMemoryLoop.js`

Used for:

- the durable Memory HQ import shape
- the synthesized back-brief payload that the new executive review lane operates on

### `web/src/pages/MissionControlCockpitPage.jsx`

Used for:

- the mission-control cockpit presentation seam
- the new multi-workspace mission-registry rollup panel

### `web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Used for:

- the active workforce Job Card surface
- the Salon review card
- the new threaded rationale, reassignment, and checkpoint readback controls

### `web/src/ui/App.jsx`

Used for:

- promotion of the generic `/mission-control/workforce` route while preserving the Alpha alias

## New implementation surfaces

### `server/src/db.js`

Adds:

- `mission_workspaces`
- `mission_registry_entries`
- `mission_registry_review_events`
- `mission_registry_review_checkpoints`
- registry-focused indexes for workspace/status lookups and checkpoint traversal

### `server/src/missionRegistry.js`

Adds:

- workspace listing and lookup helpers
- mission entry upsert helpers
- append-only review-event insertion
- hash-chained review checkpoints
- review-thread derivation and review summary payload shaping

### `server/src/index.js`

Adds:

- workspace registry read APIs
- generic mission-registry detail and mutation APIs
- workforce Job Card workspace registration and mission linkage
- automatic thread opening when a new Salon back-brief lands
- automatic decision checkpointing when the existing Salon review endpoint is used
- richer `salonIntegration.executiveReview` mirrors on Job Card payloads

### `server/src/workforceJobDispatch.js`

Adds:

- DB round-trip support for `workspaceId`, `workspaceName`, and `missionRegistryId`

### `web/src/pages/MissionControlCockpitPage.jsx`

Adds:

- the cockpit mission-registry panel with workspace rollups, review state, thread counts, checkpoint counts, and open-source links

### `web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Adds:

- mission-registry detail loading for the active Job Card
- thread open, comment, and reviewer reassignment controls
- checkpoint history readback and reviewer-option visibility

### `web/src/ui/App.jsx`

Adds:

- the top-level `/mission-control/workforce` route and navigation link

### `scripts/tests/mission_registry_review_api.test.mjs`

Adds:

- direct proof for threaded rationale
- reviewer reassignment
- hash-chain checkpoint integrity
- cockpit mission-registry cross-workspace payload visibility

### `scripts/tests/hivemind_salon_version_next_api.test.mjs`

Extends:

- proof that a workforce Salon back-brief review now also exposes registry-backed executive review state and approval checkpoints

## Source-grounded conclusions

This mission rests on four admitted truths:

1. Workforce Job Cards are still the strongest durable operational object in the current control plane
2. Salon back-brief review was already the natural executive decision seam
3. runtime-state mirrors alone were insufficient for threaded rationale, reassignment, and audit checkpoints
4. cross-workspace visibility required a registry layer above any single workforce team route

The correct implementation was therefore not a brand-new orchestration engine. It was a durable workspace-and-mission registry, plus an append-only executive review ledger wired into the already-admitted Salon flow.
