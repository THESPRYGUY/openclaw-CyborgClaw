# Self-Recursive Improvement Loop Iteration 14 Source Map

## Primary Dashboard Surfaces

- `server/src/index.js`
- `server/src/shellStatusStrip.js`
- `server/src/shellStatusStripCache.js`
- `web/src/pages/BacklogPage.jsx`
- `web/src/pages/MissionControlWorkforceAlphaPage.jsx`
- `web/src/pages/workforce/workforceLaneCatalog.js`
- `web/src/pages/workforce/WorkforceDetailRows.jsx`
- `web/src/pages/workforce/WorkforceLaneSection.jsx`
- `web/src/pages/workforce/WorkforceOperationsLane.jsx`
- `web/src/pages/workforce/WorkforceForensicsLane.jsx`

## Regression And Audit Coverage

- `scripts/tests/shell_status_strip_cache.test.mjs`
- `scripts/tests/backlog_surface_contract.test.mjs`
- `scripts/tests/ui_shell_phase2_contract.test.mjs`
- `scripts/tests/operator_surface_audit_manifest.mjs`
- `scripts/tests/operator_surface_audit_manifest.test.mjs`
- `web/src/pages/workforce/WorkforceLaneSplit.test.js`

## Subagent Lanes Integrated

- `iter14_backlog_polish` -> backlog search, saved lenses, and quick actions
- `iter14_workforce_split` -> workforce lane modularization

## Measured Proof Points

- Pre-fix restart-time shell timings under concurrent warmup pressure:
  - `/` -> `200` in `7.781968s`
  - `/backlog` -> `200` in `7.786716s`
- Post-fix restart-time shell timings:
  - `/` -> `200` in `4.468ms`
  - `/backlog` -> `200` in `2.987ms`
  - first authenticated `/api/shell/status-strip?teamKey=alpha` -> `200` in `20.333ms`
  - hydrated `/api/shell/status-strip?teamKey=alpha` -> `200` in `29.289ms`
- Hydrated shell payload returned:
  - `lane=Stable`
  - `benchmark=Verified green`
  - `runway=Ad hoc runway only`

## Governance Receipt Map

- Main mission:
  - `development:self-recursive-iteration:iteration-14`
  - checkpoint `checkpoint:VsZbSjtGVj`
  - anchor `anchor:JuJfU5zf1U`
  - notary `notary:IkqHCuiUk2`
- Slice missions:
  - `development:self-recursive-improvement-slice:iteration-14-shell-warmup-hardening`
    - checkpoint `checkpoint:2r6UKKUpa4`
    - anchor `anchor:vU3EkY-R9x`
    - notary `notary:H0jEAkHVxy`
  - `development:self-recursive-improvement-slice:iteration-14-workforce-modularization`
    - checkpoint `checkpoint:iuwgyT4vuP`
    - anchor `anchor:vbbZ3BC1Ik`
    - notary `notary:moxyFy_Pq-`
  - `development:self-recursive-improvement-slice:iteration-14-backlog-polish`
    - checkpoint `checkpoint:ykCXDLEixt`
    - anchor `anchor:0581ykcbIg`
    - notary `notary:Z9jKRz_M6D`
  - `development:self-recursive-improvement-slice:iteration-14-ux-validation`
    - checkpoint `checkpoint:gaJ-LoTcHR`
    - anchor `anchor:GvMLV_eEHN`
    - notary `notary:qqxYZHQNUz`
  - `development:self-recursive-improvement-slice:iteration-14-governed-closeout`
    - checkpoint `checkpoint:H101lLYiA7`
    - anchor `anchor:6YKY_PwldC`
    - notary `notary:uFTZKWei7s`

## Evidence Files

- `/tmp/iter14-mission-bootstrap.json`
- `/tmp/iter14-self-hosted.json`
- `/tmp/iter14-governance-closeout.json`
