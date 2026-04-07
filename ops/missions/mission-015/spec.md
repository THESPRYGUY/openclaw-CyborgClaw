# Mission 015 - Local Memory Packaging Reproducibility

Goal:
Turn the working but host-specific OpenClaw `2026.4.5` upgrade into a
supportable upgrade path by fixing the local-memory packaging/runtime contract.

## Mission objective

Mission 015 exists to close the exact seam exposed by Mission 014:

1. npm-installed OpenClaw must restore `node-llama-cpp` for local memory
2. operator guidance must match the real install behavior
3. release checks must fail before publish if the local-memory contract drifts
4. the upgrade path must stop depending on hidden host-specific repair steps

## Why now

Mission 014 proved that `2026.4.5` can run cleanly on this host, but only after:

- removing a stale systemd override
- restoring `node-llama-cpp` and `@node-llama-cpp/*` inside the installed npm runtime

That means the upgrade is operational but not yet supportable.

## Source truth

- upgrade evaluation:
  - `ops/cyborgclaw/OPENCLAW_2026_4_5_UPDATE_EVALUATION.md`
- Mission 014 hold closeout:
  - `ops/missions/mission-014/handover.md`
  - `ops/missions/mission-014/runs/20260407_002209Z/receipt_bundle.md`
- next paused Golden Run hardening packet:
  - `ops/missions/mission-013/spec.md`

## Scope

In scope:

- npm packaging contract for local memory runtime
- release guardrails for the packaging contract
- operator-facing install/update/memory guidance
- proof that the seam is fixed in code

Out of scope:

- broad memory redesign
- dreaming product work
- Mission 013 hardening work itself

## Acceptance criteria

1. `node-llama-cpp` is carried by a reproducible runtime packaging contract.
2. release-check fails if that contract drifts.
3. memory guidance matches the real npm/install behavior.
4. the fix is verified with targeted tests plus release/build proof where
   applicable.
5. Mission 014 can be reevaluated from `HOLD` after this seam closes.

## Success bar

Mission 015 succeeds only if the next `2026.4.5+` upgrade path no longer depends
on hidden host surgery to recover local memory.
