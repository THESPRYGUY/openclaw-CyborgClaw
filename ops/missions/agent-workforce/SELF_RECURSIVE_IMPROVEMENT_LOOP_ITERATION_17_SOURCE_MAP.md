# Self-Recursive Improvement Loop Iteration 17 Source Map

## Primary OpenClaw Surfaces

- `.github/workflows/live-runtime-benchmark.yml`
- `scripts/cyborgclaw/voltaris-v2-live-benchmark-gate.ts`
- `test/voltaris-v2-live-benchmark-gate.test.ts`
- `ops/missions/agent-workforce/SELF_RECURSIVE_IMPROVEMENT_LOOP_ITERATION_17_BRIEF.md`
- `ops/missions/agent-workforce/SELF_RECURSIVE_IMPROVEMENT_LOOP_ITERATION_17_SOURCE_MAP.md`

## Primary Dashboard Surfaces

- `server/src/liveBenchmarkReceipt.js`
- `server/src/llmTelemetryCluster.js`
- `server/src/shellStatusStrip.js`
- `web/src/lib/SurfaceLensControls.jsx`
- `web/src/lib/surfaceLens.js`
- `web/src/lib/surfaceLens.test.js`
- `web/src/pages/LlmTelemetryClusterPage.jsx`
- `web/src/pages/MissionControlWorkforceAlphaPage.jsx`
- `web/src/pages/VerifiedBenchmarkRunwayCard.jsx`
- `web/src/pages/liveBenchmarkRunwaySummary.js`
- `web/src/pages/workforce/WorkforceJobDispatchCommandStrip.jsx`

## Regression And Audit Coverage

- `scripts/tests/live_benchmark_runway_summary.test.mjs`
- `scripts/tests/llm_model_telemetry_api.test.mjs`
- `scripts/tests/shell_status_strip_cache.test.mjs`
- `web/src/lib/surfaceLens.test.js`
- `web/src/pages/workforce/WorkforceLaneSplit.test.js`
- `test/voltaris-v2-live-benchmark-gate.test.ts`

## Subagent Lanes Integrated

- `iter17_operator_ergonomics` -> reusable surface-lens filtering, saved views, and quick actions on the telemetry page
- `iter17_workforce_decompose` -> extracted Workforce dispatch command strip, slimmer page boundary, split-module regression coverage

## Measured Proof Points

- Workflow truth:
  - `gh run list --workflow live-runtime-benchmark.yml --event schedule --limit 20 --json ...`
  - returned `[]`
  - `gh api repos/openclaw/openclaw/contents/.github/workflows/live-runtime-benchmark.yml?ref=main`
  - returned `404`
- OpenClaw focused gate pack:
  - `20/20` passing
- Dashboard focused Iteration 17 pack:
  - `14/14` passing
- Full dashboard regression:
  - `85` passing
  - `1` skipped
- Live authenticated route proof after restart:
  - `/mission-control/model-telemetry` -> `200`
  - `/live-dev-feed` -> `200`
  - `/mission-control/cockpit` -> `200`
- Live runway truth:
  - shell status strip summary returned:
    - `Stable • Verified green • watch • Clear`
  - shell runway detail returned:
    - `0 scheduled • 7.42h window • 7 green`
  - telemetry API returned:
    - `runwayMaturityLabel="Ad hoc runway only"`
    - `scheduledRunwayStatus="missing"`
    - `scheduledReceiptCount=0`
    - `receiptObservationLabel="Scheduled runway requires default branch"`
    - `branchEligibilityState="blocked_non_default_branch"`
    - `branchName="m20-trust-the-refusal-closeout"`
    - `defaultBranch="main"`

## Governance Receipt Map

- Main mission:
  - `development:self-recursive-iteration:iteration-17`
  - checkpoint `checkpoint:5mVxUThKZC`
  - anchor `anchor:hhaQit3XVm`
  - notary `notary:U3E02gKBoL`
- Slice missions:
  - `development:self-recursive-improvement-slice:iteration-17-scheduled-runway-eligibility`
    - checkpoint `checkpoint:r-cdkVuWl0`
    - anchor `anchor:A51c6xs_pq`
    - notary `notary:tpJeh5y3wS`
  - `development:self-recursive-improvement-slice:iteration-17-telemetry-ergonomics`
    - checkpoint `checkpoint:DrFn3u0N86`
    - anchor `anchor:yDOtiD8VZl`
    - notary `notary:1VLUrlQaLm`
  - `development:self-recursive-improvement-slice:iteration-17-workforce-dispatch-extraction`
    - checkpoint `checkpoint:as3c-9JHto`
    - anchor `anchor:GI2Yt2iQ8l`
    - notary `notary:47Xh36zvTu`
  - `development:self-recursive-improvement-slice:iteration-17-ux-validation`
    - checkpoint `checkpoint:_TNwqHCHGR`
    - anchor `anchor:2xucLabK-A`
    - notary `notary:T1-JKxsrmm`

## Evidence Files

- `/tmp/iter17-live-benchmark`
- `/tmp/iter17-self-hosted.json`
- `/tmp/iter17-governance-closeout.json`
