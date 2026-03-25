# SELF_RECURSIVE_IMPROVEMENT_LOOP_ITERATION_3_BRIEF

## Mission title

`Initiate Iteration 3 of the self-recursive improvement loop for the CyborgClaw governed execution system`

## Iteration

- Iteration: `3`
- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Deliver the third bounded proof-plus-improvement slice of the CyborgClaw self-recursive loop while routing the iteration itself through a live mission-registry review lane with third-party-notarized approval proof.

This iteration is accepted when it:

1. self-hosts Iteration 3 as a live mission-registry mission with approved review state, anchored checkpoints, and third-party notarization
2. upgrades checkpoint proof from local plus external anchor to local plus external anchor plus third-party transparency-log witness
3. strengthens the default live Salon benchmark strategy without pretending a secrets-dependent benchmark belongs in every normal CI run
4. clarifies operator-facing `active` versus `freshest` Memory Vault semantics in the UI itself, not only in backend payloads
5. records each bounded improvement slice as its own governed development mission with rollback criteria

## Iteration 3 focus

This iteration was explicitly scoped to:

- third-party checkpoint notarization
- stronger default live Salon benchmark strategy
- clearer operator surfaces for active versus freshest Memory Vault semantics
- continued self-hosting of recursive improvement work in the live mission registry

## Operating discipline used

The iteration followed the ratified self-recursive loop constraints:

1. proof runs stayed distinct from improvement work
2. the canonical benchmark pack stayed bounded and evidence-first
3. each improvement slice recorded comparative before/after evidence
4. stop conditions remained explicit for search ambiguity, receipt regression, and governance bypass
5. each mutation lane was tracked as a governed mission artifact with review checkpoints and rollback criteria

## Scope delivered

### 1. Iteration 3 now self-hosts with third-party-notarized mission proof

Iteration 2 added live development-workspace self-hosting, but its approval proof still stopped at `anchored_valid`.

Iteration 3 closes that gap by creating and closing the following live missions on the running dashboard:

- `development:self-recursive-iteration:iteration-3`
- `development:self-recursive-improvement-slice:iteration-3-third-party-notary`
- `development:self-recursive-improvement-slice:iteration-3-live-salon-benchmark`
- `development:self-recursive-improvement-slice:iteration-3-memory-active-freshest-ui`

Each of those missions now carries:

- an approved review thread
- local signed approval checkpoints
- externally anchored checkpoint receipts
- third-party Rekor transparency-log receipts
- rollback criteria in registry state

### 2. Mission-registry approval checkpoints now support third-party notarization

Iteration 2 introduced local signatures and external anchors, but those receipts were still control-plane local.

Iteration 3 adds:

- `mission_registry_third_party_notary_receipts`
- a dedicated provider module for third-party notarization
- `POST /api/mission-control/mission-registry/:missionId/anchors/:receiptId/notarize`
- Sigstore Rekor submission, verification, persistence, and read-model projection
- support for `ecdsa-p256-sha256` external anchor receipts, which Rekor requires
- duplicate-entry handling by resolving Rekor `409 equivalent entry already exists` responses into fetchable receipts
- UI surfacing of `notarized_valid` on workforce checkpoint history

The proof payload now distinguishes four states:

- checkpoint integrity
- local signature validity
- external anchor validity
- third-party notarization validity

### 3. The default live Salon benchmark strategy is stronger and better separated

Iteration 2 separated production live execution from deterministic fixtures, but the repo still lacked a routine test workflow.

Iteration 3 adds:

- `npm run test:salon:contract`
- `npm run test:salon:live-benchmark`
- `.github/workflows/test.yml` for default deterministic coverage on push and pull request
- `.github/workflows/salon-live-benchmark.yml` for a governed nightly and manual live lane
- explicit environment examples for live Salon benchmark gating

This means the live Salon contract is now exercised by default in normal regression runs while the truly live benchmark remains a secrets-gated operational lane.

### 4. Memory Vault now makes active versus freshest semantics visible to operators

Iteration 2 made `freshestBatchId` queryable, but the primary operator surface still collapsed multiple meanings into a single “active” batch rail.

Iteration 3 adds:

- `web/src/pages/memoryVaultBatchSemantics.js`
- explicit `Selected`, `Active review`, and `Freshest update` pills on intake batch cards
- an intake-rail subtitle that names the distinction directly
- a `Freshest batch` recall mode alongside the selected-batch mode
- selected-scope pills that carry semantic meaning into the recall and reference explorer
- a small node-level proof for these UI semantics

Operators can now see whether a batch is:

- the one they selected
- the review-weighted active batch
- the freshest newly admitted batch

without inferring that state from backend JSON or recall behavior alone.

## Comparative evidence

### Third-party notarization lane

- Weak before:
  - approval proof stopped at `anchored_valid`, with no third-party witness
- What changed:
  - Rekor submission, receipt persistence, verification, and proof projection were added
- Improved signal:
  - mission proof now reports `notarized_valid` in both API payloads and operator surfaces
- New risk introduced:
  - the transparency log proves inclusion, but key ownership is still tied to locally generated ECDSA material rather than a stronger externally attested signer identity

### Default benchmark lane

- Weak before:
  - the live Salon contract existed, but there was no default GitHub test workflow
- What changed:
  - a deterministic default `test.yml` lane now runs the repo test pack, while the real live benchmark moved into its own governed workflow
- Improved signal:
  - default CI now proves the live Salon contract seam routinely instead of relying on manual runs
- New risk introduced:
  - the true live benchmark still depends on secrets and runner readiness, so it remains scheduled/manual rather than universal

### Memory Vault operator lane

- Weak before:
  - `active` and `freshest` were distinct backend concepts but visually collapsed in the UI
- What changed:
  - batch semantics are now surfaced directly in cards, scope pills, and recall-mode controls
- Improved signal:
  - operators can now distinguish review authority from freshness without guessing
- New risk introduced:
  - only the Memory Vault surface is clarified so far; other cockpit surfaces still need the same semantic discipline when they expose batch state

## Live self-hosted mission evidence

The following live mission-registry entries were created and completed on the running dashboard during Iteration 3:

- `development:self-recursive-iteration:iteration-3`
- `development:self-recursive-improvement-slice:iteration-3-third-party-notary`
- `development:self-recursive-improvement-slice:iteration-3-live-salon-benchmark`
- `development:self-recursive-improvement-slice:iteration-3-memory-active-freshest-ui`

Each of the above completed with:

- `reviewState: approved`
- `status: completed`
- `checkpointIntegrityStatus: verified`
- `localSignatureStatus: signed_valid`
- `externalAnchorStatus: anchored_valid`
- `thirdPartyNotarizationStatus: notarized_valid`

## Implemented interfaces

### Dashboard backend surfaces

- `../sprytly-internal-dashboard/server/src/db.js`
- `../sprytly-internal-dashboard/server/src/index.js`
- `../sprytly-internal-dashboard/server/src/missionRegistry.js`
- `../sprytly-internal-dashboard/server/src/missionRegistryThirdPartyNotary.js`

### Dashboard frontend surfaces

- `../sprytly-internal-dashboard/web/src/pages/MemoryVaultPage.jsx`
- `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`
- `../sprytly-internal-dashboard/web/src/pages/memoryVaultBatchSemantics.js`

### Dashboard validation and delivery surfaces

- `../sprytly-internal-dashboard/package.json`
- `../sprytly-internal-dashboard/.env.example`
- `../sprytly-internal-dashboard/server/.env.example`
- `../sprytly-internal-dashboard/.github/workflows/test.yml`
- `../sprytly-internal-dashboard/.github/workflows/salon-live-benchmark.yml`
- `../sprytly-internal-dashboard/scripts/tests/hivemind_salon_version_next_api.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/memory_vault_batch_semantics.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/mission_registry_review_api.test.mjs`

## Validation proof

Iteration 3 proof is expected against:

- `node --test scripts/tests/memory_vault_batch_semantics.test.mjs`
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

- the live Salon benchmark is stronger by default, but the true live benchmark is still scheduled/manual instead of always-on
- Rekor now provides a real third-party witness, but signer identity is still local-key based rather than tied to a stronger external trust chain
- active-versus-freshest semantics are now clear in Memory Vault, but that clarity should be propagated to any other operator surfaces that project batch state
- the self-recursive loop now self-hosts and notarizes itself, but it is still local to this control plane rather than federated across installations

## Exact next action

Initiate Iteration `4` of the self-recursive improvement loop with focus on stronger signer identity for checkpoint notarization, broader propagation of freshest-versus-active operator semantics, and a more automated live benchmark readiness model.
