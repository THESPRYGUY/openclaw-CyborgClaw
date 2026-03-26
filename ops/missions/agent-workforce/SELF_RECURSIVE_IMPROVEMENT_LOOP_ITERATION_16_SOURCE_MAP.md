# Self-Recursive Improvement Loop Iteration 16 Source Map

## Primary OpenClaw Surfaces

- `.github/workflows/live-runtime-benchmark.yml`
- `scripts/cyborgclaw/voltaris-v2-live-benchmark-gate.ts`
- `test/voltaris-v2-live-benchmark-gate.test.ts`

## Primary Dashboard Surfaces

- `server/src/liveBenchmarkReceipt.js`
- `server/src/llmTelemetryCluster.js`
- `web/src/pages/liveBenchmarkRunwaySummary.js`
- `web/src/pages/VerifiedBenchmarkRunwayCard.jsx`
- `web/src/pages/LlmTelemetryClusterPage.jsx`
- `web/src/pages/LiveDevFeedPage.jsx`
- `web/src/pages/MissionControlCockpitPage.jsx`
- `web/src/pages/MissionControlWorkforceAlphaPage.jsx`
- `web/src/pages/workforce/WorkforceReviewPanels.jsx`

## Regression And Audit Coverage

- `scripts/tests/live_benchmark_runway_summary.test.mjs`
- `scripts/tests/llm_model_telemetry_api.test.mjs`
- `scripts/tests/operator_surface_audit_manifest.test.mjs`
- `scripts/tests/surface_lens_surface_coverage.test.mjs`
- `web/src/pages/workforce/WorkforceLaneSplit.test.js`
- `test/voltaris-v2-live-benchmark-gate.test.ts`

## Subagent Lanes Integrated

- `iter16_benchmark_runway` -> scheduled-receipt observation metadata, workflow summary truth, gate regression coverage
- `iter16_workforce_extract` -> extracted Workforce review panels, slimmer root page, split-module regression coverage

## Measured Proof Points

- Workflow truth:
  - `gh run list --workflow live-runtime-benchmark.yml --event schedule --limit 20 --json ...`
  - returned `[]`
- OpenClaw focused gate pack:
  - `20/20` passing
- Dashboard focused Iteration 16 pack:
  - `12/12` passing
- Full dashboard regression:
  - `84` passing
  - `1` skipped
- Live authenticated proof after restart:
  - `/` -> `200` in `2.78ms`
  - `/live-dev-feed` -> `200` in `1.61ms`
  - `/mission-control/cockpit` -> `200` in `1.398ms`
  - `/mission-control/model-telemetry` -> `200` in `1.431ms`
  - built asset: `assets/index-DtuPn0WL.js`
  - telemetry API returned:
    - `runtimeStatus=blocked`
    - `runwayMaturityLabel="Ad hoc runway only"`
    - `scheduledRunwayStatus=missing`
    - `scheduledReceiptCount=0`
    - `scheduledReceiptObservationLabel="No scheduled receipts observed"`
    - `latestVerifiedModel="openai-codex/gpt-5.3-codex"`

## Governance Receipt Map

- Main mission:
  - `development:self-recursive-iteration:iteration-16`
  - checkpoint `checkpoint:aMPWDlsoTi`
  - anchor `anchor:6VuHeHi9fX`
  - notary `notary:kUYlsMHnDq`
- Slice missions:
  - `development:self-recursive-improvement-slice:iteration-16-scheduled-runway-truth`
    - checkpoint `checkpoint:clyx5XSZ_F`
    - anchor `anchor:Nlf-eIHFdS`
    - notary `notary:BU_185h7Wx`
  - `development:self-recursive-improvement-slice:iteration-16-workforce-extraction`
    - checkpoint `checkpoint:NaabTfdM2J`
    - anchor `anchor:BCQA0jT1qQ`
    - notary `notary:1-Lb1g3W9E`
  - `development:self-recursive-improvement-slice:iteration-16-surface-lens-expansion`
    - checkpoint `checkpoint:I_e_wc7O0A`
    - anchor `anchor:UdcyizHgs-`
    - notary `notary:CDr70fcwHS`
  - `development:self-recursive-improvement-slice:iteration-16-runway-truth-surfacing`
    - checkpoint `checkpoint:QoOWN9brwf`
    - anchor `anchor:o6L1GZAMpW`
    - notary `notary:KLR_6BcOvk`
  - `development:self-recursive-improvement-slice:iteration-16-ux-validation`
    - checkpoint `checkpoint:0Fiu0VOkmm`
    - anchor `anchor:uCvnrWkR3x`
    - notary `notary:t3HoN5e_hW`

## Evidence Files

- `/tmp/iter16-self-hosted.json`
- `/tmp/iter16-governance-closeout.json`
