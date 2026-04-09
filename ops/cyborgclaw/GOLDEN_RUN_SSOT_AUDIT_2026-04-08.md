# Golden Run SSOT Audit - 2026-04-08

## Verdict

The `/golden-run` board is live again, but it is not yet SSOT-ready.

It currently acts as a polished composite of:

- newest idea activity
- Alpha mission-room state
- closeout/docs rails
- flow/build aggregates

rather than one clearly governed active Golden Run truth path.

## Highest-risk findings

1. The board can center the wrong mission.
   - The hero object is selected from the newest idea row instead of the active
     admitted workforce mission.
   - Result: the board can show a fresh idea as the active run even while a
     different Golden Run job remains active in Workforce Alpha.

2. Mission / proof / publish can collapse to `idle` while live mission work
   still exists.
   - Those cards are currently gated by the focused idea / canary linkage.
   - Result: downstream lanes can under-report active work when the hero focus
     and active workforce mission drift apart.

3. `live` telemetry can be overstated.
   - The frontend currently upgrades flow-backed steps to `live` without a real
     freshness/provenance split.
   - Result: operators can be shown `live` where the data is actually derived,
     mixed, or stale.

4. The one-button Golden Run test is not an independent verifier.
   - It validates the same projected contract shape the board already uses.
   - Result: it can return `PASS` even while the board is semantically wrong.

5. Closeout pressure can be team-global rather than mission-scoped.
   - Result: one mission's doc rail pressure can color another mission's board
     posture.

## Audit conclusion

The next Golden Run should not treat this as cosmetic UI cleanup.

It should be a bounded telemetry-truth hardening packet that:

- re-anchors the board on the active admitted mission first
- makes provenance/freshness explicit per touchpoint
- separates live mission truth from broader aggregate ladder truth
- gives the systems check an independent truth contract

Only after that should the follow-on packet tackle broader card/surface
convergence work.
