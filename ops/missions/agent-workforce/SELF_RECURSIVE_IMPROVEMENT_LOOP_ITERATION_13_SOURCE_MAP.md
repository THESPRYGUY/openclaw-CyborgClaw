# Self-Recursive Improvement Loop Iteration 13 Source Map

## Primary Dashboard Surfaces

- `server/src/index.js`
- `server/src/shellStatusStripCache.js`
- `web/src/ui/App.jsx`
- `web/src/ui/shellNavData.js`
- `web/src/pages/BacklogPage.jsx`
- `web/src/pages/TodosPage.jsx`
- `web/src/pages/IdeasIncubatorPage.jsx`
- `web/src/pages/MissionControlCockpitPage.jsx`
- `web/src/pages/MissionControlGovernancePage.jsx`
- `web/src/pages/MissionControlDrilldownCard.jsx`
- `web/src/pages/MissionControlWorkforceAlphaPage.jsx`
- `web/src/pages/workforce/WorkforceSummaryLane.jsx`
- `web/src/pages/LoginPage.jsx`

## Regression And Audit Coverage

- `scripts/tests/shell_status_strip_cache.test.mjs`
- `scripts/tests/ui_shell_phase1_contract.test.mjs`
- `scripts/tests/ui_shell_phase2_contract.test.mjs`
- `scripts/tests/ux_surface_hierarchy_cleanup.test.mjs`
- `scripts/tests/operator_surface_audit_manifest.mjs`
- `scripts/tests/operator_surface_audit_manifest.test.mjs`

## Subagent Lanes Integrated

- `iter13_shell_perf` -> shell strip cache and startup priming path
- `iter13_backlog_unify` -> unified backlog owner surface
- `iter13_gov_cockpit_roles` -> cockpit/governance role cleanup
- `iter13_workforce_summary` -> summary-first workforce lanes

## Measured Proof Points

- Baseline shell strip timeout:
  - `45.002s` unauthenticated route-level timeout before the cache-backed Phase 2 landing
- Authenticated post-fix shell strip timings:
  - `27.941ms`
  - `51.336ms`
  - `24.747ms`
  - `23.152ms`
- Served routes after landing:
  - `/login` -> `200`
  - `/backlog` -> `200`
  - `/api/shell/status-strip?teamKey=alpha` -> `200`

## Governance Receipt Map

- Main mission:
  - `development:self-recursive-iteration:iteration-13`
  - checkpoint `checkpoint:m7Dob8OE40`
  - anchor `anchor:R5ZmdUKvLn`
  - notary `notary:Wg9Ml2QWD6`
- Slice missions:
  - `development:self-recursive-improvement-slice:iteration-13-shell-status-performance`
    - checkpoint `checkpoint:wzyE424XZk`
    - anchor `anchor:hbwby-Pl-8`
    - notary `notary:AUcozOWhx-`
  - `development:self-recursive-improvement-slice:iteration-13-backlog-unification`
    - checkpoint `checkpoint:UPbBkFtNVE`
    - anchor `anchor:asrCeE0W-W`
    - notary `notary:jsebRGBJTJ`
  - `development:self-recursive-improvement-slice:iteration-13-cockpit-governance-roles`
    - checkpoint `checkpoint:wkpEJxl_xH`
    - anchor `anchor:-6Msntzf52`
    - notary `notary:UW_vU2URDD`
  - `development:self-recursive-improvement-slice:iteration-13-workforce-summary`
    - checkpoint `checkpoint:_4-bv3jurK`
    - anchor `anchor:iuVETgJ3Qq`
    - notary `notary:5v4H0syzwp`
  - `development:self-recursive-improvement-slice:iteration-13-ux-validation`
    - checkpoint `checkpoint:RFaJ4HsOJ5`
    - anchor `anchor:w-cabottOg`
    - notary `notary:XSuTbVw6-0`

## Evidence Files

- `/tmp/iter13-self-hosted.json`
- `/tmp/iter13-governance-closeout.json`
