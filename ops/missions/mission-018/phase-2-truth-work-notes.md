# Mission 018 Phase 2 Truth Work Notes

Date: 2026-04-08
Status: in progress

These notes capture the next-step deltas added after the Phase 1 Mission
Control shell landed.

## Operator notes now folded into Phase 2

- `Mission Control` should remain a top-nav peer to `Agents`.
- `Live Mission Feed` and `Mission Staging` should behave like mode switches
  inside one Mission Control frame.
- `Mission Staging` must not reopen the old Development popup path.
- `Mission Prep` can keep routing to `/flow` for now.
- the Mission Control launcher should stay visible on the prep surface too, so
  the operator can move between live, staging, and prep without using browser
  back navigation.
- `/flow` should be refit toward the Mission Control base layout as best as the
  admitted seams allow.

## Codex implementation guidance

- Keep route-derived launcher highlighting truthful even when multiple Mission
  Control modes share `/live-dev-feed`.
- Treat staging as a same-surface mode with its own query contract rather than a
  second page with copied chrome.
- Keep `/flow` convergence Phase 2 scoped to layout and shell grammar unless a
  stronger mission-truth contract is already admitted.

## VoltarisV2 product guidance

- `Agents` answers who is available.
- `Mission Control` answers what missions are doing.
- `Live Mission Feed` means the operator is still in the Mission Control room.
- `Mission Staging` means the operator is still in the Mission Control room.
- `Mission Prep` is the one deliberate handoff into deeper prep work until Flow
  is fully converged.

## Phase 2 target outcomes

- Button 1 becomes a truthful in-flight-only mission read.
- Button 2 remains inside Mission Control and shows only staging-relevant
  mission posture.
- `/flow` adopts the Mission Control base layout grammar without flattening the
  Flow-specific ladder semantics.
- the operator can move between live, staging, and prep without feeling like
  they are jumping across unrelated products.

## Staging rail follow-on

- The first admitted Golden Run right-rail should land on `Mission Staging`
  tiles before it is attempted on `Live Mission Feed`.
- The staging rail should stay read-only and derive from admitted readiness
  truth plus shared Golden Run touchpoint grammar.
- Freshness on the rail should use the admitted mission update timestamp
  rather than tile-local guesswork.

## 2026-04-08 progress update

- `Live Mission Feed` is now backed by `/api/mission-control/live-feed`
  instead of `/api/evidence/index`.
- Live mission tiles now admit alternating chrome plus the compact Golden Run
  rail from workforce job-card telemetry.
- `Mission Staging` remains the first mode-specific truth rail and continues to
  stay inside the same Mission Control shell.
- The next truth gap is deeper drill-in routing from a live mission tile into a
  mission-specific workforce room rather than the broader team room.

## 2026-04-08 foyer alignment correction

- The graph experiment was rolled back after operator review.
- Mission Control is still keeping the richer overview strip metrics, but the
  graph row has been removed until a clearer visual direction is agreed.
- The active requirement is now simpler: all Mission Control hero tiles should
  match the `Agent Control Foyer` species before new graph work is attempted.
