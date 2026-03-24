# ACP_NATIVE_TRANSPORT_SOURCE_MAP

## Purpose

Record the exact source artifacts used to implement and brief the Kinship-governed ACP native transport lane.

## Strategic sources

### `ops/strategies/agent-workforce/AGENT_WORKFORCE_OPERATIONALIZATION_STRATEGY.md`

Used to carry forward:

- Voltaris to President-A to seat-agent delegation as the governing workflow
- ACP as runtime seam and A2A as bounded coordination
- the requirement that workforce lanes stay truthful about product state versus runtime ownership

### `ops/missions/agent-workforce/PRESIDENT_A_FAN_OUT_BRIEF.md`

Used to confirm:

- the admitted seat-task board and President-A fan-out seam
- the existing session-mirror visibility that transport visibility had to extend
- the execution-feed / inspector surfaces already available for richer transport readback

### `ops/missions/agent-workforce/A2A_COLLAB_PROOF_BRIEF.md`

Used to confirm:

- the admitted collaboration and proof signals that had to become transport-stamped rather than bridge-only
- the existing proof review seam through President-A
- the product-level visibility expectations for live receipts and execution evidence

### `ops/missions/agent-workforce/COCKPIT_FRESHNESS_BRIEF.md`

Used to confirm:

- the SSE cockpit stream already exists
- live receipts and execution payloads are the correct surfaces for transport visibility
- the next transport lane should enrich those receipts instead of inventing a new parallel channel

## Kinship and memory sources

### `../../intake/CYBORGClaW_Memory_Intake_Batch_01/CYBORGClaW/ACP SSOT/cyborgclaw_developer_ssot_v1_2.md`

Used to carry forward:

- Kinship as governing architecture
- mandatory route classes:
  - `child`
  - `sibling`
  - `escalation`
  - `cousin`
- the requirement that cross-team work returns structured artifacts
- the expectation that routing legality comes from policy artifacts, not conversational inference

### `../../intake/CYBORGClaW_Memory_Intake_Batch_01/CYBORGClaW/normalized/strategy/cyborgclaw-neov2-architecture-truth-and-deployment-strategy.extracted.md`

Used to reinforce:

- gateway-first runtime truth
- Kinship-first organizational routing
- ACP-shaped internals
- A2A edge exposure rather than unconstrained peer mesh

## OpenClaw architecture sources

### `docs/architecture/kinship-route-classification.md`

Used to preserve:

- admitted route classes as already frozen law
- the requirement that route choice is classified, not free-form

### `docs/architecture/cousin-ticket-law.md`

Used to preserve:

- cousin routes require a cousin ticket
- cross-President routing must stay mediated and explicit

### `docs/architecture/design-studio-output-contracts.md`

Used to preserve:

- cross-boundary work returns artifacts rather than informal chat-only completion

### `docs/architecture/lineage-admission-rules.md`

Used to preserve:

- admitted lineage/runtime/policy truth as the gate for execution
- the split between internal admission truth and reduced public receipts

## OpenClaw implementation sources

### `src/config/sessions/types.ts`

Used to implement:

- richer route-law metadata
- the new `transport` envelope
- internal-versus-public transport receipt boundaries

### `src/acp/control-plane/manager.types.ts`

Used to implement:

- provenance-aware turn input
- route-law / transport visibility on status responses

### `src/acp/runtime/types.ts`

Used to carry:

- inter-session provenance into the runtime boundary

### `src/acp/control-plane/manager.core.ts`

Used to implement:

- route-law bundle parsing
- route-law enrichment
- Kinship transport admission
- participant validation
- cousin-ticket enforcement
- reduced public receipt stamping
- route-law / transport preservation across metadata rewrites

### `src/acp/control-plane/manager.identity-reconcile.ts`

Used to preserve:

- transport state during identity reconciliation

### `src/auto-reply/reply/dispatch-acp.ts`

Used to forward:

- `InputProvenance` into ACP turns so runtime admission can verify inter-session transport requests

## Workforce product sources

### `../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`

Used to implement:

- transport policy shaping on Job Cards
- durable transport receipts on job runtime state
- route-classed receipt generation for:
  - President-A seat dispatch
  - seat execution signals
  - seat collaboration
  - proof back-briefing
  - proof review

### `../sprytly-internal-dashboard/server/src/index.js`

Used to implement:

- session-mirror transport visibility for president and seat agents
- transport metadata on event payloads
- transport metadata on live receipts and execution feed rows
- richer job summary payloads for inspector and cockpit

### `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Used to land:

- transport board visibility in `Job dispatch`
- transport pills on live receipts
- transport pills and namespaces in execution feed
- transport detail in the selected-event drawer
- transport summary inside the `Job card` inspector section

## Validation sources

### `src/acp/control-plane/manager.test.ts`

Used to prove:

- richer route-law persistence
- admitted ACP native transport status exposure
- rejection of illegal source-session transport

### `src/auto-reply/reply/dispatch-acp.test.ts`

Used to prove:

- forwarding of inter-session provenance into ACP turns

### `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch.test.mjs`

Used to prove:

- transport policy shaping on helper paths
- transport receipts on fan-out, collaboration, proof, and review paths
- transport board roll-up

### `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch_api.test.mjs`

Used to prove:

- route-classed transport metadata through API responses
- session-mirror transport visibility
- execution feed transport visibility
- live SSE receipt transport visibility

### `../sprytly-internal-dashboard/scripts/tests/memory_vault_search.test.mjs`

Touched only to stabilize a pre-existing date-window assertion that blocked the full sibling Sprytly suite during this lane.

## Implementation conclusion

This lane is grounded in already-admitted Kinship law and ACP session semantics.

That grounding is why it delivers:

- Kinship-governed ACP native transport admission
- route-law-validated inter-session execution
- reduced public receipts rather than mesh flattening
- workforce visibility that reports admitted transport truth

and does **not** claim:

- a generic agent mesh
- authority inferred from chat context or UI state
- product ownership of ACP runtime execution itself
