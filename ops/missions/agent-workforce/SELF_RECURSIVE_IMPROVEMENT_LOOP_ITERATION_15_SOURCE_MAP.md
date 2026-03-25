# Self-Recursive Improvement Loop Iteration 15 Source Map

## Primary Dashboard Surfaces

- `server/src/shellStatusStrip.js`
- `web/src/lib/surfaceLens.js`
- `web/src/lib/SurfaceLensControls.jsx`
- `web/src/pages/DevelopmentPage.jsx`
- `web/src/pages/MissionControlGovernancePage.jsx`
- `web/src/pages/liveBenchmarkRunwaySummary.js`
- `web/src/ui/CommandCenterPage.jsx`
- `web/src/ui/ShellNav.jsx`
- `web/src/ui/ShellQuickFind.jsx`
- `web/src/ui/ShellStatusStrip.jsx`
- `web/src/ui/shellQuickFindData.js`

## Regression And Audit Coverage

- `scripts/tests/live_benchmark_runway_summary.test.mjs`
- `scripts/tests/operator_surface_audit_manifest.test.mjs`
- `scripts/tests/shell_status_strip_cache.test.mjs`
- `scripts/tests/surface_lens_helper.test.mjs`
- `scripts/tests/ui_shell_phase2_contract.test.mjs`
- `scripts/tests/ui_shell_phase3_contract.test.mjs`

## Subagent Lanes Integrated

- `iter15_global_polish` -> shell quick-find, route-safe shell search, shell shortcut surfacing
- `iter15_surface_filters` -> reusable saved-filter helper and operator-surface lens wiring

## Measured Proof Points

- Live local operator routes after restart:
  - `/` -> `200` in `13.606ms`
  - `/backlog` -> `200` in `3.595ms`
  - first authenticated `/api/shell/status-strip?teamKey=alpha` -> `200` in `37.609ms`
  - second authenticated `/api/shell/status-strip?teamKey=alpha` -> `200` in `24.194ms`
- Hydrated shell strip payload returned:
  - `summary=Warming • Verified green • Ad hoc runway only • Loading`
  - `runwayDetail=0 scheduled • 2.26h window • 6 green`
  - `runwaySummary=Schedule missing • The retained runway is backed by local, push, or manual dispatch proofs, but no scheduled benchmark receipts have accumulated yet. • Receipts are clustered inside a single workday.`
- Focused Iteration 15 pack:
  - `10/10` passing
- Full dashboard regression:
  - `82` passing
  - `1` skipped

## Governance Receipt Map

- Main mission:
  - `development:self-recursive-iteration:iteration-15`
  - checkpoint `checkpoint:n9jyAjll00`
  - anchor `anchor:kPoRaQF3DJ`
  - notary `notary:Fz3xE6pGz5`
- Slice missions:
  - `development:self-recursive-improvement-slice:iteration-15-global-polish`
    - checkpoint `checkpoint:qNkDZEzWV4`
    - anchor `anchor:Ih1IEOMvRB`
    - notary `notary:wcliB2J5Py`
  - `development:self-recursive-improvement-slice:iteration-15-workforce-structure`
    - checkpoint `checkpoint:m3L9xEYDUj`
    - anchor `anchor:ggOgUR2VRh`
    - notary `notary:OIoQN_5jrl`
  - `development:self-recursive-improvement-slice:iteration-15-shell-hydration`
    - checkpoint `checkpoint:98cgyS1hhI`
    - anchor `anchor:e8QjqfYvPZ`
    - notary `notary:ZlGKG9IQSE`
  - `development:self-recursive-improvement-slice:iteration-15-benchmark-maturity`
    - checkpoint `checkpoint:CGvzUJZIYi`
    - anchor `anchor:BJ7f_0QRHD`
    - notary `notary:3uQfwa1-DY`
  - `development:self-recursive-improvement-slice:iteration-15-ux-validation`
    - checkpoint `checkpoint:aNKQEq8br5`
    - anchor `anchor:HYABUGnb9i`
    - notary `notary:zIBsri8cYU`
  - `development:self-recursive-improvement-slice:iteration-15-governed-closeout`
    - checkpoint `checkpoint:HZcx1kiaPy`
    - anchor `anchor:wfNuJIcgCH`
    - notary `notary:F6EMKDy7ux`

## Evidence Files

- `/tmp/iter15-mission-bootstrap.json`
- `/tmp/iter15-self-hosted.json`
- `/tmp/iter15-governance-closeout.json`
