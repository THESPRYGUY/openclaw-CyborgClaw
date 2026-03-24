# DYNAMIC_KINSHIP_POLICY_BRIEF

## Mission title

`Implement dynamic Kinship policy configuration and broader admitted inspector coverage for ACP transport`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Make Kinship-governed ACP transport more flexible and more visible without weakening the admitted Kinship floor.

The lane was accepted to deliver:

1. dynamic Kinship policy configuration that can tighten active route-law behavior without restart
2. ACP policy-engine behavior that reloads and stamps live policy-file truth
3. broader admitted inspector coverage for policy and lifecycle events
4. improved Memory HQ discoverability for Kinship governance artifacts
5. tests proving live policy updates, broader inspector freshness, and Kinship recall improvement

## Scope delivered

### 1. Dynamic Kinship policy configuration now exists

OpenClaw now has a first-class dynamic Kinship policy config seam instead of relying only on baked-in policy code.

The new config layer now provides:

- a named Kinship policy config contract
- a durable file-backed policy path under the OpenClaw home directory
- live load and write helpers
- active policy-set resolution
- config digest stamping
- tightening-only route-rule normalization so dynamic policy can harden the floor but cannot weaken it

The policy file is now resolved from the admitted environment and home path, which lets runtime and test fixtures bind the same live policy source without restart.

### 2. The Kinship Policy Engine now consumes dynamic policy state

The consolidated ACP-side Kinship Policy Engine now reloads dynamic state during route-law bundle resolution and transport admission.

That means the engine now:

- validates frozen route-law bundle truth
- validates the active dynamic policy set against that route-law truth
- rejects transport when the active policy disables the route class or requires stronger mediation / artifact-return / cousin-ticket guarantees
- stamps admitted transport with a richer `policySnapshot`, including:
  - `policySource`
  - `policySetId`
  - `policySetLabel`
  - `policyConfigPath`
  - `policyConfigDigest`

This keeps ACP as the transport authority while making the active Kinship policy set visible and auditable.

### 3. Workforce Alpha now mirrors dynamic policy truth and broader admitted inspector coverage

The sibling Sprytly workforce surface now mirrors the dynamic Kinship policy seam for operator visibility and controlled updates.

This lane added:

- a workforce-side Kinship policy helper module that mirrors the OpenClaw contract
- `GET /api/mission-control/workforce/alpha/kinship-policy`
- `PATCH /api/mission-control/workforce/alpha/kinship-policy`
- live `workforce.transport.policy_config.updated` events on the admitted stream
- broader admitted inspector coverage for:
  - transport events
  - policy events
  - lifecycle events

The stream normalization now prefers node-scoped `admitted_inspector` subscriptions and carries `eventScopes`, so policy and lifecycle truth can travel through the same admitted live seam.

### 4. Cockpit transport visibility is broader and more truthful

Workforce Alpha now surfaces:

- the active admitted Kinship policy set
- route-class rule cards
- recent policy and lifecycle events
- live policy source, policy-set identity, config path, and digest
- refreshed inspector payloads on policy updates instead of transport-only updates

This extends the existing admitted inspector seam rather than inventing a second authority path.

### 5. Memory HQ Kinship discoverability is improved

Memory HQ search now has better recall for Kinship governance artifacts.

This lane tightened recall by:

- enriching durable and Tier 2 ACP metadata with Kinship and route-law domain tags
- widening indexed semantic fields used by runtime `memory.search`
- adding targeted search tests for queries like `kinship route law`

The result is that the ACP SSOT artifact now surfaces through governance-oriented queries even when the body text alone would not have ranked high enough.

## Implemented interfaces

### OpenClaw runtime modules

- `src/acp/control-plane/kinship-policy-config.ts`
- `src/acp/control-plane/kinship-policy-engine.ts`
- `src/config/sessions/types.ts`

### OpenClaw tests

- `src/acp/control-plane/kinship-policy-config.test.ts`
- `src/acp/control-plane/kinship-policy-engine.test.ts`
- `src/acp/control-plane/manager.test.ts`
- `src/auto-reply/reply/dispatch-acp.test.ts`

### Workforce product surfaces

- `../sprytly-internal-dashboard/server/src/workforceKinshipPolicy.js`
- `../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`
- `../sprytly-internal-dashboard/server/src/index.js`
- `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

### Workforce product tests

- `../sprytly-internal-dashboard/scripts/tests/workforce_kinship_policy.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch_api.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/memory_vault_search.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/memory_vault_multibatch_api.test.mjs`

## Acceptance criteria for this lane

This lane is accepted when:

1. Kinship policy state can be loaded and updated dynamically without code edits or service restart
2. dynamic policy can tighten route-law admission behavior without weakening the baked-in Kinship floor
3. admitted transport state carries dynamic policy snapshot metadata
4. Workforce Alpha exposes a governed API for reading and updating the mirrored Kinship policy state
5. admitted inspector subscriptions receive live policy and lifecycle receipts in addition to transport receipts
6. cockpit inspector surfaces show the active admitted policy set and recent policy receipts truthfully
7. Memory HQ can recall Kinship ACP artifacts through governance-oriented search terms

## Validation proof

Implementation proof was accepted against:

- OpenClaw:
  - targeted Kinship config tests
  - targeted Kinship policy-engine tests
  - targeted ACP manager tests
  - targeted `dispatch-acp` tests
  - `pnpm build`
- sibling Sprytly:
  - targeted Kinship helper tests
  - targeted workforce API tests
  - targeted Memory HQ search tests
  - full `npm test`
  - `npm run build`
  - `npm run lint`

## Risks carried forward

### Immediate blockers

None.

### Accepted follow-on risks

- dynamic policy is now file-backed and hot-reloaded, but there is still no higher-level multi-policy governance workflow beyond the admitted active set
- Sprytly mirrors policy truth and can initiate updates for operators, but ACP remains the transport authority
- broader inspector coverage is improved, but some non-transport inspector sections still rely on selective refresh rather than universal live subscription
- Memory HQ discoverability is improved for Kinship, but broader governance-concept recall still depends on curated metadata quality
- broader multi-president policy composition remains deferred beyond Workforce Alpha

## Recommended next lane

`Implement broader multi-president Kinship policy composition and deeper live inspector coverage for ACP transport.`
