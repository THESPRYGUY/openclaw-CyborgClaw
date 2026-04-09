# Mission 017 Launch Checklist

- [x] identify the active admitted Golden Run mission/job that should anchor the board
- [x] define the first bounded telemetry seam for BRRR lap 1
- [x] write the source-precedence hypothesis for BRRR lap 1 before editing
- [x] define the independent review/proof path for lap 1
- [x] define live / derived / stale provenance rules before editing
- [x] define the live-vs-board comparison receipt that the review step must produce
- [x] define explicit stop conditions so the packet cannot widen into redesign
- [x] define the closeout proof bundle needed before Mission 018 can be admitted

## Lap 1 receipt

- `/api/flow` now centers `Break-Out Room Card Truth De-Bug Golden Run` as the active Golden Run mission.
- `currentPhaseKey` now resolves to `mission`.
- Golden Run steps now carry explicit telemetry provenance from the backend instead of inheriting a blanket `live` posture.
- `/api/golden-run/test` now evaluates mission-anchor semantics rather than only structural wiring.
- Mission 017 remains open because the live board is still predominantly `derived`, not yet fully SSOT-ready.
