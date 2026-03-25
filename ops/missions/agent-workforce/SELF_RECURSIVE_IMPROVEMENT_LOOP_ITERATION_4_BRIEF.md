# SELF_RECURSIVE_IMPROVEMENT_LOOP_ITERATION_4_BRIEF

## Mission title

`Initiate Iteration 4 of the self-recursive improvement loop for the CyborgClaw governed execution system`

## Iteration

- Iteration: `4`
- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Deliver the fourth bounded proof-plus-improvement slice of the CyborgClaw self-recursive loop while proving the live utilization of actual recruited main agents in governed overnight runs.

This iteration is accepted when it:

1. self-hosts Iteration 4 as a live mission-registry mission with approved review state, explicit rollback criteria, and checkpoint proof
2. proves that live Salon and artifact-execution flows can summon actual admitted main agents, record their session provenance, and preserve their contributions in governed receipts
3. strengthens live-run stability by bounding prompt-context growth and allowing benchmark-safe model overrides for named agents
4. broadens signer-identity and Memory Vault batch-semantic visibility on the operator surfaces used to inspect overnight outcomes
5. turns the overnight live benchmark lane into a repeatable operational pack rather than a single ad hoc proof

## Iteration 4 focus

This iteration was explicitly scoped to:

- actual main-agent summoning and verifiable live utilization
- a longer overnight test pack with repeated governed runs
- stronger signer-identity projection in checkpoint and mission-review proof
- broader propagation of `active` versus `freshest` Memory Vault semantics on operator surfaces
- a more stable and automated live benchmark readiness lane

## Operating discipline used

The iteration followed the ratified self-recursive loop constraints:

1. proof runs stayed distinct from implementation work
2. the canonical benchmark pack remained evidence-first
3. each improvement slice recorded comparative before/after evidence
4. stop conditions remained explicit for template fallback, missing session correlation, and governance bypass
5. each mutation lane was tracked as a governed mission artifact with review checkpoints and rollback criteria

## Scope delivered

### 1. Iteration 4 now proves actual main-agent utilization

Previous iterations proved live seams, not the repeatable summon-and-work behavior of actual recruited main agents.

Iteration 4 adds a governed overnight runner that:

- creates a live self-hosted iteration mission and bounded improvement-slice missions
- locks responsive rosters for `president-a`, `president-b`, and admitted Alpha/Beta seat agents
- runs repeated live Salon scenarios plus a real artifact-production scenario
- rejects template fallback or missing session-correlation evidence as proof failure
- captures `openclaw:agent:*`, `openclaw:run-session:*`, `openclaw:session-key:*`, and `openclaw:session-store:*` provenance for every live summon

The overnight pack is centered on four scenario types:

- Alpha live Salon stress test
- Beta live Salon flesh-out
- direct main-agent artifact execution with proof and President review
- Alpha live Salon value-versus-effort closure

### 2. Live-run stability is hardened for repeated overnight cycles

Cycle-level live runs exposed two concrete instability sources during Iteration 4 hardening:

- repeated Memory HQ recall expansion could overgrow prompt context and degrade late-cycle Salon summons
- provider-specific rate limits on President runs could destabilize otherwise healthy live packs

Iteration 4 addresses both by adding:

- bounded prompt-context shaping for Version Next Salon memory recall
- named benchmark model overrides for presidents and recruited seat agents
- benchmark-readiness surfaces that expose whether a team can run the live lane without silent degradation

### 3. Signer identity is clearer in review proof and operator UI

Iteration 3 added notarized checkpoint proof, but signer identity still needed better projection in both backend proof payloads and the operator surfaces that inspect review outcomes.

Iteration 4 adds:

- durable signer-identity JSON on review checkpoints
- durable notary-identity JSON on external anchor receipts
- proof payload projection for signer and notary identity snapshot status
- cockpit, Workforce, and Ideas Incubator visibility for signer identity on the latest review and memory-import rails

### 4. Memory Vault batch semantics now reach more operator surfaces

Iteration 3 clarified `selected`, `active review`, and `freshest update` semantics in Memory Vault itself, but neighboring cockpit surfaces still hid that distinction when projecting imported memory.

Iteration 4 broadens those semantics by surfacing batch-scope lineage and signer-aware pills across:

- Mission Control Workforce
- Mission Control Cockpit
- Ideas Incubator

This lets operators inspect overnight memory outcomes without collapsing authority, recency, and selection into one ambiguous state.

## Comparative evidence

### Actual main-agent utilization lane

- Weak before:
  - live benchmark proof relied on deterministic seams and did not yet prove repeatable main-agent summon activity in governed overnight runs
- What changed:
  - a dedicated overnight runner now selects admitted rosters, executes live scenarios, and records session-correlation evidence for summoned agents
- Improved signal:
  - live proof now requires real agent/session provenance, non-degraded live mode, and concrete output contributions from named main agents
- New risk introduced:
  - proof quality now depends more directly on provider availability and healthy admitted sessions, which makes the lane intentionally stricter

### Stability lane

- Weak before:
  - late-cycle Salon runs could fail from prompt bloat or provider-specific cooldowns
- What changed:
  - prompt context is now capped and benchmark-safe model overrides can be applied to named agents
- Improved signal:
  - the overnight lane is more repeatable under sustained load instead of succeeding only in short smoke runs
- New risk introduced:
  - operator expectations around model identity now need to account for benchmark overrides when reviewing receipts

### Signer-identity lane

- Weak before:
  - proof carried notarization state but not enough signer/notary identity detail in the read model
- What changed:
  - signer and notary identity snapshots are persisted and projected across proof and UI surfaces
- Improved signal:
  - checkpoint review can now distinguish validity from identity-snapshot integrity
- New risk introduced:
  - identity strength is improved in visibility, but final trust still depends on the underlying key-management model

### Broader Memory Vault semantics lane

- Weak before:
  - non-Memory-Vault surfaces still collapsed batch authority and recency
- What changed:
  - the same semantic language now appears in the cockpit surfaces that inspect overnight memory outcomes
- Improved signal:
  - operators can reason about live-run evidence lineage more consistently
- New risk introduced:
  - surface-level consistency is broader, but not yet universal across every dashboard view

## Live self-hosted mission evidence

Iteration 4 uses a live self-hosted development mission plus bounded slice missions for:

- the Iteration 4 loop itself
- live main-agent proof
- signer-identity hardening
- memory-semantic surface propagation
- benchmark-readiness automation

Each slice is expected to complete with:

- approved review state
- explicit checkpoint proof
- rollback criteria in registry state
- agent provenance captured when the slice exercises live summons

## Implemented interfaces

### Dashboard backend surfaces

- `../sprytly-internal-dashboard/server/src/db.js`
- `../sprytly-internal-dashboard/server/src/hivemindSalonVersionNext.js`
- `../sprytly-internal-dashboard/server/src/index.js`
- `../sprytly-internal-dashboard/server/src/missionRegistry.js`
- `../sprytly-internal-dashboard/server/src/missionRegistryThirdPartyNotary.js`

### Dashboard frontend surfaces

- `../sprytly-internal-dashboard/web/src/pages/IdeasIncubatorPage.jsx`
- `../sprytly-internal-dashboard/web/src/pages/MissionControlCockpitPage.jsx`
- `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`
- `../sprytly-internal-dashboard/web/src/pages/memoryVaultBatchSemantics.js`

### Dashboard validation and delivery surfaces

- `../sprytly-internal-dashboard/package.json`
- `../sprytly-internal-dashboard/.github/workflows/salon-live-benchmark.yml`
- `../sprytly-internal-dashboard/scripts/iteration4_live_agent_overnight_pack.mjs`
- `../sprytly-internal-dashboard/scripts/tests/hivemind_salon_version_next_api.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/mission_registry_review_api.test.mjs`

## Validation proof

Iteration 4 proof is expected against:

- `npm run test:salon:overnight -- --out=/tmp/iter4-live-agent-pack.json --live-home="$HOME" --live-config="$HOME/.openclaw/openclaw.json" --runs=3 --sleep-ms=1000`
- `node --test scripts/tests/hivemind_salon_version_next_api.test.mjs`
- `node --test scripts/tests/mission_registry_review_api.test.mjs`
- `npm -w server run lint`
- `npm run lint`
- `pnpm build`

## Risks carried forward

### Immediate blockers

None, assuming the live overnight pack remains non-degraded and preserves main-agent session correlation.

### Accepted follow-on risks

- the strongest proof lane now depends on external model/provider availability because it requires real main-agent summons instead of fixtures
- benchmark model overrides improve stability, but they add one more control-plane variable that operators must inspect in receipts
- signer identity is projected more clearly, but stronger attested key identity remains a follow-on hardening area
- active-versus-freshest semantics are broader, but still not yet propagated to every dashboard surface

## Exact next action

Initiate Iteration `5` of the self-recursive improvement loop with focus on stronger attested signer identity, broader operator-semantic propagation, and an even more autonomous live-agent benchmark schedule.
