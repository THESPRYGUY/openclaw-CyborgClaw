# LLM_MODEL_TELEMETRY_CLUSTER_SOURCE_MAP

## Purpose

This source map anchors the LLM Model Telemetry Cluster mission packet to the concrete dashboard and governance surfaces that were changed and validated.

## Telemetry aggregation lane

- `../sprytly-internal-dashboard/server/src/llmTelemetryCluster.js`
- `../sprytly-internal-dashboard/server/src/index.js`

## Operator page and routing lane

- `../sprytly-internal-dashboard/web/src/pages/LlmTelemetryClusterPage.jsx`
- `../sprytly-internal-dashboard/web/src/ui/App.jsx`

## Governance and notarization lane

- `../sprytly-internal-dashboard/server/src/missionRegistryThirdPartyNotary.js`
- `../sprytly-internal-dashboard/scripts/tests/mission_registry_review_api.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/mission_registry_third_party_notary_hash.test.mjs`

## Telemetry validation lane

- `../sprytly-internal-dashboard/scripts/tests/llm_model_telemetry_api.test.mjs`

## Live mission evidence

- `/tmp/llm-model-telemetry-benchmark/gate-report.json`
- `/tmp/llm-model-telemetry-mission.json`

## Mission packet anchors

- `ops/missions/agent-workforce/LLM_MODEL_TELEMETRY_CLUSTER_BRIEF.md`
- `ops/missions/agent-workforce/LLM_MODEL_TELEMETRY_CLUSTER_SOURCE_MAP.md`
