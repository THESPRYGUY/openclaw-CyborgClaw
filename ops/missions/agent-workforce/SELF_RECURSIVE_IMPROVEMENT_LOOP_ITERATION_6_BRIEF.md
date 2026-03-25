# SELF_RECURSIVE_IMPROVEMENT_LOOP_ITERATION_6_BRIEF

## Mission title

`Initiate Iteration 6 of the self-recursive improvement loop for the CyborgClaw governed execution system`

## Iteration

- Iteration: `6`
- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Deliver the sixth bounded proof-plus-improvement slice of the CyborgClaw self-recursive loop while turning the hard-gated live benchmark lane from `YELLOW` into a real `GREEN` result on the primary provider path.

This iteration is accepted when it:

1. restores benchmark-safe `openai-codex` authentication without mutating the operator's live auth store
2. upgrades transcript-grade proof from raw prompt-text matching to correlation-token evidence
3. keeps the live benchmark lane fail-closed while making the readiness and promotion state explicit
4. continues strengthening actor-bound notary identity projection
5. continues propagating `active` versus `freshest` Memory Vault semantics on operator-facing surfaces

## Iteration 6 focus

This iteration was explicitly scoped to:

- stable primary-provider benchmark auth
- stronger transcript-grade live proof
- a true `GREEN` proof result for the hard-gated live benchmark lane
- more explicit notary-provider identity projection
- broader operator visibility for Memory Vault posture

## Operating discipline used

The iteration followed the ratified self-recursive loop constraints:

1. proof runs remained distinct from implementation work
2. the canonical benchmark pack stayed fixed and evidence-first
3. each mutation lane recorded comparative before/after evidence
4. stop conditions remained explicit for auth failure, transcript-proof failure, and promotion-state failure
5. self-modification stayed governed through the mission packet, review expectations, and explicit checkpoint-ready proof surfaces

## Scope delivered

### 1. The primary live benchmark auth path is stable again

Iteration 5 proved that the lane would fail closed, but it still depended on stale copied auth state and a reused refresh token path.

Iteration 6 fixes that by:

- deriving real expiry from Codex JWT access tokens instead of assuming `mtime + 1h`
- treating expired copied OAuth profiles as not-ready during benchmark preflight
- seeding the copied benchmark auth store from the local Codex CLI credentials when the primary provider is `openai-codex`
- preserving the operator's source auth store while giving the benchmark lane a fresh, benchmark-scoped auth snapshot

### 2. Transcript-grade proof now keys off correlation tokens

Iteration 5 still depended too heavily on raw prompt-text observation.

Iteration 6 upgrades the proof lane by:

- generating a unique governed correlation token on each live smoke run
- embedding that token into the live prompt contract
- requiring the token to appear in the user transcript, the latest assistant transcript, and the returned payload
- continuing to require transcript freshness, session freshness, provider/model identity, and positive usage evidence

This makes the proof resilient to minor wording drift while still remaining transcript-grade rather than session-grade.

### 3. The hard gate now reaches a real `GREEN` live result

With the auth and proof lanes hardened, the live benchmark gate now reports:

- preflight `ready`
- proof `ready`
- promotion `green`

against a real `openai-codex/gpt-5.3-codex` run on `agent:voltaris-v2:main`.

### 4. Notary identity and Memory Vault posture continue to improve

This slice also carries forward two supporting lanes:

- mission-registry third-party notarization now persists a provider-identity snapshot so the notary surface is less opaque
- Live Dev Feed now shows the Memory Vault posture strip using the same `active review` and `freshest update` semantics used elsewhere

## Comparative evidence

### Primary-provider auth lane

- Weak before:
  - copied benchmark auth state could look ready while still relying on a reused or stale refresh path
- What changed:
  - Codex auth expiry is derived from the actual token, expired copied profiles are rejected, and the copied benchmark store can be seeded from the local Codex CLI credentials
- Improved signal:
  - the benchmark lane now reaches the real primary provider instead of failing early on stale copied auth
- New risk introduced:
  - the lane now depends more directly on local Codex credential health, so broken local auth is surfaced immediately

### Correlation-token transcript-proof lane

- Weak before:
  - transcript proof could fail on benign prompt wording differences
- What changed:
  - governed correlation tokens are generated, injected, and verified across transcript and payload evidence
- Improved signal:
  - proof integrity now follows a durable correlation contract rather than brittle text matching
- New risk introduced:
  - transcript redaction or provider-side formatting changes could still affect token visibility if they become more aggressive

### Promotion-state gate lane

- Weak before:
  - the live benchmark lane could be operationally useful but still ambiguous about whether it was truly promotion-ready
- What changed:
  - the gate now reports separate readiness states for preflight, proof, and promotion
- Improved signal:
  - `GREEN` now means auth readiness and transcript-grade proof readiness both passed
- New risk introduced:
  - the lane is stricter, so provider or transcript instability is surfaced more often until all live paths are equally healthy

### Operator-semantic propagation lane

- Weak before:
  - Live Dev Feed still hid Memory Vault posture compared with the richer workforce and vault surfaces
- What changed:
  - the feed now renders posture pills sourced from the same batch-semantic helper
- Improved signal:
  - operators can inspect `selected`, `active review`, and `freshest update` posture without leaving the feed
- New risk introduced:
  - some non-Vault payloads still need fuller batch metadata before every surface can be equally explicit

## Implemented interfaces

### OpenClaw auth and live-proof surfaces

- `src/agents/cli-credentials.ts`
- `src/agents/cli-credentials.test.ts`
- `src/cyborgclaw/live-agent-proof.ts`
- `src/cyborgclaw/live-agent-proof.test.ts`
- `scripts/cyborgclaw/voltaris-v2-live-runtime-smoke.ts`
- `scripts/cyborgclaw/voltaris-v2-live-benchmark-gate.ts`
- `test/voltaris-v2-live-benchmark-gate.test.ts`
- `.github/workflows/live-runtime-benchmark.yml`

### Dashboard supporting surfaces

- `../sprytly-internal-dashboard/server/src/db.js`
- `../sprytly-internal-dashboard/server/src/index.js`
- `../sprytly-internal-dashboard/server/src/missionRegistry.js`
- `../sprytly-internal-dashboard/scripts/tests/mission_registry_review_api.test.mjs`
- `../sprytly-internal-dashboard/web/src/pages/LiveDevFeedPage.jsx`

## Validation proof

Iteration 6 proof is expected against:

- `pnpm vitest src/agents/cli-credentials.test.ts test/voltaris-v2-live-benchmark-gate.test.ts src/cyborgclaw/live-agent-proof.test.ts`
- `pnpm vitest test/voltaris-v2-pack-proof.test.ts test/voltaris-v2-live-benchmark-gate.test.ts src/cyborgclaw/live-agent-proof.test.ts src/agents/cli-credentials.test.ts`
- `pnpm --silent openclaw genome validate examples/voltaris-v2-pack --json`
- `pnpm build`
- `node --test scripts/tests/mission_registry_review_api.test.mjs scripts/tests/memory_vault_batch_semantics.test.mjs`
- `npm -w server run lint`
- `npm -w web run build`
- the live benchmark gate using `OPENCLAW_LIVE_BENCHMARK_ENABLED=true`

## Risks carried forward

### Immediate blockers

None for the primary live lane after the successful `GREEN` proof run.

### Accepted follow-on risks

- actor-bound notary identity is stronger, but still not fully attested end-to-end
- the broader `active` versus `freshest` posture still depends on some non-Vault payloads carrying richer batch ids
- the primary provider lane is now healthy, but alternate-provider parity remains worth monitoring
