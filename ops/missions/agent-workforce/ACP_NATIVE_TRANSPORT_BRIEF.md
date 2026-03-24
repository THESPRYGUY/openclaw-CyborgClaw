# ACP_NATIVE_TRANSPORT_BRIEF

## Mission title

`Implement full ACP native inter-agent transport (Kinship-governed)`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Replace the earlier workforce session-context bridge assumption with an admitted ACP-native inter-agent transport seam that is explicitly governed by Kinship route law.

The lane was accepted to deliver:

1. Kinship-governed ACP transport admission in OpenClaw
2. transport metadata that carries admitted route-law truth rather than inferring authority from chat context
3. workforce-side transport visibility for President-A and Strike Team Alpha
4. tests proving route-law enforcement, provenance propagation, and cockpit visibility

## Scope delivered

### 1. Kinship-governed ACP admission in OpenClaw

The ACP session layer now admits a first-class transport envelope in session metadata instead of relying only on reduced route-law persistence.

The runtime now carries:

- richer `routeLaw` metadata in `SessionAcpMeta`
- a new `transport` envelope in `SessionAcpMeta`
- `inputProvenance` on ACP turn input and runtime turn input
- route-law and transport visibility in `getSessionStatus(...)`

The admitted transport envelope now records:

- `contractVersion = kinship-governed-acp-transport.v1`
- `transportLayer = acp_native`
- route classification
- source / target session identity
- source / target participant identity
- request / correlation identifiers
- mediation / cousin-ticket obligations
- artifact-return obligations
- a reduced public receipt that preserves the internal-vs-public metadata split

### 2. Route-law enforcement rather than mesh behavior

ACP native transport is now admitted only when Kinship route law already exists and the transport request matches that law.

OpenClaw now rejects transport when:

- no `inter_session` provenance exists
- no admitted source session key exists
- the target session has no admitted route law
- the source session is missing
- source / target participants do not match the admitted route-law requester / target
- the route-law verdict is not `allow`
- cousin routing is attempted without a cousin ticket
- the source session route-law decision disagrees with the target route-law decision

This preserves the governing requirement that ACP transport is not a generic peer mesh.

### 3. Runtime propagation and status truth

The ACP runtime path now preserves Kinship transport truth end to end:

- `dispatch-acp` forwards `InputProvenance`
- `AcpSessionManager.runTurn(...)` admits transport before execution
- `runtime.runTurn(...)` receives the same `inputProvenance`
- identity reconciliation and metadata rewrites preserve both `routeLaw` and `transport`
- status readback exposes both envelopes for operator inspection

### 4. Workforce Alpha product surfacing

The sibling Sprytly workforce surface now reflects the new transport seam truthfully.

It now admits:

- a `nativeTransportPolicy` on active Job Cards
- a `nativeTransportBoard` summarizing admitted transport receipts
- durable `transportReceipts` on job runtime state
- transport metadata on activity events and live stream receipts
- transport visibility in:
  - `Job dispatch`
  - execution feed
  - selected execution event
  - inspector `Job card`
  - President-A dispatch-plan session mirror
  - seat-brief session mirrors

Transport receipts now surface:

- `transportLayer`
- `transportPolicy`
- `transportRouteClass`
- `transportReceiptKind`
- `routeLawNamespace`
- `receiptNamespace`
- `requiresPresidentMediation`
- `artifactReturnRequired`
- `ticketRequired`

### 5. Test hardening

The lane added or expanded proof for:

- richer route-law persistence
- admitted ACP transport status exposure
- rejection of illegal source-session transport
- forwarding of inter-session provenance into ACP turns
- workforce helper proofs for:
  - transport policy shaping
  - transport receipt creation
  - transport board roll-up
  - proof-review transport receipts
- workforce API proofs for:
  - seat dispatch transport
  - seat signal transport
  - seat collaboration transport
  - proof submission transport
  - proof review transport
  - live receipt transport metadata

## Implemented interfaces

### OpenClaw runtime modules

- `src/config/sessions/types.ts`
- `src/acp/control-plane/manager.types.ts`
- `src/acp/runtime/types.ts`
- `src/acp/control-plane/manager.identity-reconcile.ts`
- `src/acp/control-plane/manager.core.ts`
- `src/auto-reply/reply/dispatch-acp.ts`

### OpenClaw tests

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

1. ACP transport admission requires admitted route-law truth
2. transport metadata preserves Kinship classification and policy obligations
3. cousin mediation and artifact-return obligations survive into admitted transport state
4. runtime turn execution receives inter-session provenance intact
5. workforce execution surfaces show transport truth without claiming a generic mesh
6. session mirrors stay synchronized with admitted transport policy and recent receipts
7. unit and API tests prove route-law enforcement and transport visibility end to end

## Validation proof

Implementation proof was accepted against:

- OpenClaw:
  - targeted ACP manager tests
  - targeted `dispatch-acp` tests
  - `pnpm build`
- sibling Sprytly:
  - targeted helper tests
  - targeted API tests
  - full `npm test`
  - `npm run build`
  - `npm run lint`

The workforce full-suite pass also required one small pre-existing hardening update:

- `../sprytly-internal-dashboard/scripts/tests/memory_vault_search.test.mjs`

That test used a brittle date window for a filesystem-backed timestamp assertion. The lane widened the test date bounds so the suite stays stable while still proving the filter contract.

## Risks carried forward

### Immediate blockers

None.

### Accepted follow-on risks

- the Kinship Policy Engine is still distributed across admitted route-law artifacts and ACP validation code, not yet a single named service
- cousin mediation is enforced through admitted ticket truth, but broader multi-president routing remains deferred
- workforce visibility still mirrors admitted transport truth into session files for operator inspection; it is not itself the transport authority
- public transport receipts remain intentionally reduced compared with internal route-law truth

## Recommended next lane

`Implement Kinship Policy Engine consolidation and admitted inspector subscriptions for ACP transport.`
