# LLM_MODEL_TELEMETRY_CLUSTER_BRIEF

## Mission title

`Full Autonomous CyborgClaw Mission: Implement LLM Model Telemetry Cluster on Sprytly Dashboard`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Deliver a simple operator-facing dashboard page that makes live LLM posture easier to understand than the existing Mission Control surfaces.

The page must:

1. show frontier companies and providers currently in use
2. show the resolved models in active rotation
3. show current token posture and session counts
4. stay simple, navigable, and evidence-backed
5. be advanced through the governed CyborgClaw loop from idea to approved mission closeout

## Scope delivered

### 1. A dedicated telemetry cluster page now exists

The dashboard now exposes a dedicated page for model telemetry rather than burying the data inside broader Mission Control views.

That page surfaces:

- company and provider clustering
- resolved models in active or assigned use
- token totals and context posture
- admitted-session and assignment posture
- live benchmark posture
- top active agents and drift/fallback notices

### 2. The backend now emits a richer telemetry cluster payload

The server aggregates telemetry from the admitted OpenClaw session store and the existing model catalog rather than relying on one flat model list.

The new route is:

- `GET /api/mission-control/llm-telemetry-cluster`

It preserves the simpler operator contract while still exposing enough structure for future cockpit expansion.

### 3. The feature was driven through the governed live loop

This mission was not closed out as a loose code change. It was advanced through the live dashboard control plane:

1. idea created in Ideas Incubator
2. idea promoted to a To-Do
3. To-Do sent through HiveMind PRD
4. Dev Pack built and operator signoff recorded
5. To-Do queued into DEV staging
6. Workforce Job Card created in the `development` mission workspace
7. President-A delegation, fan-out, implementer proof, and proof review recorded
8. mission-registry review thread opened and approved
9. approval checkpoint externally anchored and third-party notarized

## Live governed evidence

The live mission run recorded:

- Idea ID: `I94alKUqLrwHNwJVRdbUB`
- To-Do ID: `PLoWvKzGsvAeIc8jyGK8N`
- HiveMind PRD session: `NInOSAWVm2QkSJWAggH2Y`
- DEV queue binding: `VtXIphkdH339-9Zg733rE`
- Workforce Job Card: `job-_2RqD3VeEi`
- Mission registry entry: `development:workforce-job-card:job-2rqd3veei`
- Review thread: `development-workforce-job-card-job-2rqd3veei:llm-model-telemetry-cluster-closeout:primary:1RoRsXbx`
- Approval checkpoint: `checkpoint:_IhkCq0i6Q`
- External anchor: `anchor:P6Ny9c8hIQ`
- Third-party notary receipt: `notary:tng2sKoXFl`

## Comparative evidence

### Telemetry surface

- Weak before:
  - telemetry existed, but operators had no dedicated simple page for provider, model, and token posture
- What changed:
  - a dedicated page and route now cluster telemetry by company, provider, and model with simpler posture summaries
- Improved signal:
  - operator navigation now lands on a single telemetry page instead of requiring inspection of broader Mission Control surfaces
- New risk introduced:
  - live session counts depend on admitted session-store freshness, so low-activity windows can legitimately look sparse

### Governance closeout

- Weak before:
  - the feature could have been shipped as a code-only change without a full live audit trail
- What changed:
  - the feature was closed through idea, PRD, queue, workforce proof, mission review, anchor, and notary receipts
- Improved signal:
  - the deployment now has concrete mission IDs, proof IDs, checkpoint IDs, and third-party notarization receipts
- New risk introduced:
  - the third-party notary contract is stricter now and will fail loudly if the signed anchor hash and notarized hash ever drift

## Implemented surfaces

### Dashboard

- `../sprytly-internal-dashboard/server/src/llmTelemetryCluster.js`
- `../sprytly-internal-dashboard/server/src/index.js`
- `../sprytly-internal-dashboard/server/src/missionRegistryThirdPartyNotary.js`
- `../sprytly-internal-dashboard/web/src/pages/LlmTelemetryClusterPage.jsx`
- `../sprytly-internal-dashboard/web/src/ui/App.jsx`
- `../sprytly-internal-dashboard/scripts/tests/llm_model_telemetry_api.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/mission_registry_third_party_notary_hash.test.mjs`

### Mission packet

- `ops/missions/agent-workforce/LLM_MODEL_TELEMETRY_CLUSTER_BRIEF.md`
- `ops/missions/agent-workforce/LLM_MODEL_TELEMETRY_CLUSTER_SOURCE_MAP.md`

## Validation proof

Expected proof for this mission includes:

- `node --test scripts/tests/llm_model_telemetry_api.test.mjs`
- `node --test scripts/tests/mission_registry_third_party_notary_hash.test.mjs scripts/tests/mission_registry_review_api.test.mjs`
- `npm test`
- `npm -w server run lint`
- `npm run lint`
- `npm -w web run build`
- `OPENCLAW_LIVE_BENCHMARK_ENABLED=true OPENCLAW_LIVE_BENCHMARK_REPEAT_RUNS=1 pnpm tsx scripts/cyborgclaw/voltaris-v2-live-benchmark-gate.ts --auth-source-state-dir ~/.openclaw --report-dir /tmp/llm-model-telemetry-benchmark`
- the live mission evidence bundle recorded at `/tmp/llm-model-telemetry-mission.json`

## Risks carried forward

### Immediate blockers

None for the telemetry cluster feature itself.

### Accepted follow-on risks

- live session counts can be low when the admitted session store is quiet even though provider/model assignments still exist
- the telemetry page is intentionally simple, so deeper drill-down still belongs in the broader Mission Control surfaces
- the new notary hash fix hardens real Rekor compatibility, but the live server must be reloaded for that adapter change to take effect in operator environments
