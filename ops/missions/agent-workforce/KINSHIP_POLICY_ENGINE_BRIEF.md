# KINSHIP_POLICY_ENGINE_BRIEF

## Mission title

`Implement Kinship Policy Engine consolidation and admitted inspector subscriptions for ACP transport`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Consolidate the Kinship transport-policy logic into a named ACP policy engine and expose admitted transport truth to operators through governed inspector subscriptions.

The lane was accepted to deliver:

1. a standalone Kinship Policy Engine in OpenClaw
2. ACP transport admission that explicitly routes through that engine
3. admitted inspector subscriptions for ACP transport visibility in Workforce Alpha
4. tests proving policy enforcement, policy snapshot propagation, and live inspector freshness

## Scope delivered

### 1. Standalone Kinship Policy Engine in OpenClaw

Kinship policy enforcement is now extracted into a dedicated module instead of remaining embedded across ACP session initialization and transport admission code.

The new engine now owns:

- frozen M12 route-decision validation
- frozen M12 cousin-ticket validation
- route-law bundle resolution into admitted ACP session metadata
- Kinship transport admission evaluation
- public receipt reduction for transport visibility

The engine now stamps a first-class policy snapshot onto admitted transport state, including:

- `engineId = kinship-policy-engine`
- `engineVersion = 2026.03.v1`
- `admissionBasis = route_law_bundle`
- decision / classification / verdict
- source and target participant identity
- mediation / ticket / artifact-return obligations
- route-law / receipt / approval namespace lineage

### 2. ACP transport now routes through the consolidated engine

ACP session initialization and inter-session transport admission now delegate Kinship rule interpretation to the policy engine.

This preserves the earlier Kinship constraints while making the enforcement seam explicit and auditable.

OpenClaw now centralizes the following checks in the engine:

- admitted target route law is required
- admitted source route law is required
- source and target route-law decisions must agree
- requester/target participants must match the transport participants
- `reject` verdicts are not admitted
- cousin routing requires a bound cousin ticket
- public transport receipts stay reduced rather than flattening internal policy truth

### 3. Admitted inspector subscriptions in Workforce Alpha

The sibling Sprytly workforce surface now supports node-scoped admitted inspector subscriptions for ACP transport truth.

The existing SSE seam is extended rather than replaced.

The live stream now admits:

- `subscriptionMode = transport_inspector`
- node-scoped subscriptions through `nodeId`
- subscription state echoed on `connected`, `ping`, and pushed update envelopes
- embedded `inspectorPayload` on pushed transport-relevant updates

The inspector payload now surfaces:

- transport layer and policy mode
- policy decision identity
- admitted route-law summary
- session mirror binding
- recent transport receipts
- missing-field truth when the policy decision is not admitted yet

### 4. Cockpit transport visibility is now live and governed

Workforce Alpha now renders a dedicated `Transport Activity Feed` and a richer transport inspector panel.

Operators can now see:

- live admitted transport receipts as they arrive
- policy verdict and route class on each receipt
- engine identity and engine version
- participant pair labeling
- route-law and receipt namespaces
- ticket / mediation / artifact-return obligations
- node-specific inspector freshness without waiting for broad polling refresh

### 5. Test hardening

The lane added or expanded proof for:

- standalone policy-engine resolution of route-law bundles
- policy-engine rejection of missing / mismatched cousin mediation artifacts
- policy-engine rejection of source / target decision mismatches
- policy snapshot propagation into admitted ACP transport state
- Workforce helper proofs for policy-engine metadata on transport receipts
- Workforce API proofs for transport-inspector subscription delivery and freshness

## Implemented interfaces

### OpenClaw runtime modules

- `src/acp/control-plane/kinship-policy-engine.ts`
- `src/acp/control-plane/manager.core.ts`
- `src/acp/control-plane/manager.types.ts`
- `src/config/sessions/types.ts`

### OpenClaw tests

- `src/acp/control-plane/kinship-policy-engine.test.ts`
- `src/acp/control-plane/manager.test.ts`
- `src/auto-reply/reply/dispatch-acp.test.ts`

### Workforce product surfaces

- `../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`
- `../sprytly-internal-dashboard/server/src/index.js`
- `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

### Workforce product tests

- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch_api.test.mjs`

## Acceptance criteria for this lane

This lane is accepted when:

1. Kinship policy enforcement is extracted into a named ACP policy engine
2. ACP transport admission explicitly routes through that engine
3. admitted transport state carries policy snapshot metadata
4. Workforce Alpha can subscribe to node-scoped admitted transport inspector updates
5. live stream envelopes carry inspector payload truth on transport-relevant events
6. cockpit transport receipts and inspector surfaces show policy decisions without claiming transport authority
7. targeted tests prove policy enforcement and admitted inspector freshness end to end

## Validation proof

Implementation proof was accepted against:

- OpenClaw:
  - targeted Kinship policy-engine tests
  - targeted ACP manager tests
  - targeted `dispatch-acp` tests
  - `pnpm build`
- sibling Sprytly:
  - targeted helper tests
  - targeted API tests
  - full `npm test`
  - `npm run build`
  - `npm run lint`

## Risks carried forward

### Immediate blockers

None.

### Accepted follow-on risks

- the policy engine is now named and centralized in ACP, but broader dynamic policy configuration is still not implemented
- Sprytly inspector subscriptions mirror admitted transport truth for operators; they are not transport authority
- live inspector freshness is improved for admitted transport, but broader inspector sections are still partly refetch-based
- broader multi-president routing and policy composition remain deferred beyond Workforce Alpha
- Memory HQ still has a Kinship recall/indexing discoverability gap for naive search queries

## Recommended next lane

`Implement dynamic Kinship policy configuration and broader admitted inspector coverage for ACP transport.`
