# Self-Recursive Improvement Loop Iteration 17

## Objective

Make the scheduled benchmark-runway blocker explicit and actionable, continue decomposing the Workforce surface, and extend shared operator ergonomics without adding new top-level sprawl.

## Scope

- Prove why scheduled runway receipts are still missing on this branch.
- Emit branch-eligibility truth through the live benchmark gate, workflow summary, and dashboard runway surfaces.
- Extend reusable surface-lens ergonomics onto the model telemetry surface.
- Extract the remaining inline Workforce dispatch command strip into a dedicated module.
- Keep the closeout externally anchored and Rekor-notarized.

## Comparative Evidence

### What was weak before

- The retained runway still showed `Ad hoc runway only`, but the reason no scheduled receipts existed was still too implicit.
- The gate summary could say schedule posture was missing without telling operators that the workflow must live on the default branch for GitHub schedule events to run.
- The telemetry surface still lacked the shared saved-view and quick-action ergonomics now present on other operator pages.
- `web/src/pages/MissionControlWorkforceAlphaPage.jsx` still carried an inline dispatch command strip instead of delegating it to a narrower component boundary.

### What changed

- `.github/workflows/live-runtime-benchmark.yml`, `scripts/cyborgclaw/voltaris-v2-live-benchmark-gate.ts`, and `test/voltaris-v2-live-benchmark-gate.test.ts` now model scheduled-branch eligibility explicitly, including current branch, default branch, and a blocked state when the workflow is not running from the default branch.
- `server/src/liveBenchmarkReceipt.js`, `server/src/llmTelemetryCluster.js`, `server/src/shellStatusStrip.js`, `web/src/pages/liveBenchmarkRunwaySummary.js`, and `web/src/pages/VerifiedBenchmarkRunwayCard.jsx` now project the sharper schedule truth into operator-facing runway summaries.
- `web/src/lib/surfaceLens.js`, `web/src/lib/SurfaceLensControls.jsx`, `web/src/lib/surfaceLens.test.js`, and `web/src/pages/LlmTelemetryClusterPage.jsx` extend reusable saved-view, quick-action, and local filtering ergonomics onto the telemetry page.
- `web/src/pages/MissionControlWorkforceAlphaPage.jsx` now delegates the dispatch command strip to `web/src/pages/workforce/WorkforceJobDispatchCommandStrip.jsx`, with split coverage in `web/src/pages/workforce/WorkforceLaneSplit.test.js`.

### What measurable signal improved

- OpenClaw focused gate pack:
  - `pnpm exec vitest run test/voltaris-v2-live-benchmark-gate.test.ts`
  - `20/20` passing
- Dashboard focused Iteration 17 pack:
  - `node --test scripts/tests/live_benchmark_runway_summary.test.mjs scripts/tests/llm_model_telemetry_api.test.mjs scripts/tests/shell_status_strip_cache.test.mjs web/src/lib/surfaceLens.test.js web/src/pages/workforce/WorkforceLaneSplit.test.js`
  - `14/14` passing
- Full dashboard regression:
  - `npm test`
  - `86` total
  - `85` passing
  - `1` skipped by design
- Live benchmark proof after rerun:
  - `23` assertions passed
  - `0` failed
  - `promotion.status=green`
  - `modelRef="openai-codex/gpt-5.3-codex"`
- Persisted runway summary after rerun:
  - `retainedHistoryCount=10`
  - `greenReceiptCount=9`
  - `consecutiveGreenCount=7`
  - `runwayMaturityLabel="Ad hoc runway only"`
  - `schedule.receiptCount=0`
  - `schedule.receiptObservationLabel="Scheduled runway requires default branch"`

### New risk introduced

- The sharper runway truth now makes the default-branch scheduling constraint impossible to ignore on this branch.
- Telemetry saved views stay intentionally browser-local.
- Workforce is slimmer in one more area, but the root page still carries too much implementation weight overall.

## Validation

- OpenClaw:
  - `pnpm exec vitest run test/voltaris-v2-live-benchmark-gate.test.ts`
  - `pnpm build`
- Dashboard focused pack:
  - `node --test scripts/tests/live_benchmark_runway_summary.test.mjs scripts/tests/llm_model_telemetry_api.test.mjs scripts/tests/shell_status_strip_cache.test.mjs web/src/lib/surfaceLens.test.js web/src/pages/workforce/WorkforceLaneSplit.test.js`
- Dashboard full regression:
  - `npm test`
  - `npm -w server run lint`
  - `npm -w web run build`
  - `npm -w web run lint`
- Workflow truth:
  - `gh run list --workflow live-runtime-benchmark.yml --event schedule --limit 20 --json databaseId,event,headBranch,headSha,conclusion,createdAt,displayTitle,url`
  - result: `[]`
  - `gh api repos/openclaw/openclaw/contents/.github/workflows/live-runtime-benchmark.yml?ref=main`
  - result: `404`, so the workflow is not present on the default branch and cannot accumulate real `schedule` receipts yet

## Governance

- Main mission: `development:self-recursive-iteration:iteration-17`
- Main thread: `development-self-recursive-iteration-iteration-17:iteration-17-primary:primary:H2-IjPLv`
- Main checkpoint: `checkpoint:5mVxUThKZC`
- Main anchor: `anchor:hhaQit3XVm`
- Main notary: `notary:U3E02gKBoL`

### Slice missions

- `development:self-recursive-improvement-slice:iteration-17-scheduled-runway-eligibility`
- `development:self-recursive-improvement-slice:iteration-17-telemetry-ergonomics`
- `development:self-recursive-improvement-slice:iteration-17-workforce-dispatch-extraction`
- `development:self-recursive-improvement-slice:iteration-17-ux-validation`

### Slice checkpoints

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

All Iteration 17 missions end with:

- `checkpointIntegrity=verified`
- `localSignature=signed_valid`
- `externalAnchor=anchored_valid`
- `thirdPartyNotarization=notarized_valid`

## Landed Refs

- Governance evidence:
  - `/tmp/iter17-self-hosted.json`
  - `/tmp/iter17-governance-closeout.json`
