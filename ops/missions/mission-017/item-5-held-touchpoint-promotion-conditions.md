# Mission 017 Item 5 — Held Touchpoint Promotion Conditions

## Scope

- Resolve the two remaining truthfully held touchpoints without changing promotion policy.
- Keep the dependency guardrails intact.
- Improve operator readability only by naming the exact upstream step-3 condition each held touchpoint is waiting on.

## Implemented Change

- Updated the shared Golden Run dependency contract in Sprytly so held touchpoints now surface the exact upstream promotion condition in `countLabel`, `detail`, `nextAction`, and dependency summary copy.
- The contract now emits:
  - `Mission execution` -> `Awaiting STUD preflight / Green-light`
  - `Closeout` -> `Awaiting Development publishing / Handoff packet`

## Proof

- Focused contract test passed:
  - `node --test scripts/tests/operator_visibility_api_contract.test.mjs`
- Dashboard build passed:
  - `pnpm build`
- Live proof after dashboard restart:
  - `/api/flow`
    - `mission.countLabel = Awaiting STUD preflight / Green-light`
    - `mission.nextAction = Clear STUD preflight / Green-light truth`
    - `closeout.countLabel = Awaiting Development publishing / Handoff packet`
    - `closeout.nextAction = Clear Development publishing / Handoff packet truth`
  - `/api/golden-run/test`
    - `verdict = WARN`
    - `blockers = 0`
    - the same `2 truthful held touchpoints` remain, now with more exact operator wording

## Live Consults

- `agent:codex:main`
  - Verdict: `PASS`
  - Next seam: clear the first upstream step-3 promotion truth, starting with `STUD preflight / Green-light`
  - Residual risk: the board is clearer, but WARN will persist until the upstream step-3 truth becomes real
- `agent:voltaris-v2:main`
  - Verdict: `PASS`
  - Next seam: decide whether truthful held touchpoints should remain under `WARN` or gain a distinct non-blocking held classification
  - Residual risk: WARN still conflates lawful held state with other non-blocking caution states

## Residual Gap

- The held touchpoints are now inspectable and exact, but the board still collapses two different caution modes into the same WARN family:
  - stale/degraded comms posture
  - lawful upstream-held promotion

## Bounded Next Move

- Item 6: split the remaining WARN semantics so operators can immediately distinguish stale/degraded caution from truthful dependency-held caution.
