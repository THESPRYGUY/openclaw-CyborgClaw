# Mission 014 Handover

Status:

- concluded `HOLD`

Selected focus:

- evaluate OpenClaw `2026.4.5`
- only upgrade if the system can reach a supportable post-upgrade state

Why this packet exists:

- latest stable is `2026.4.5`
- release includes material memory and dreaming changes
- local runtime started on `2026.4.3`
- local memory posture was uneven enough that a blind upgrade was not safe

What this mission should not become:

- a silent runtime mutation with no receipts
- a proxy for unrelated backlog work
- a broad memory redesign sprint

Closeout expectation:

- official release verified
- baseline captured
- risks and gates explicit
- real host outcome recorded
- `GO / HOLD / NO-GO` vote captured truthfully

## Actual closeout

Mission 014 no longer ends at the original `NO-GO` evaluation.

The follow-on RSI loop did perform the live host upgrade, and the machine is now
running OpenClaw `2026.4.5`.

What is true now:

- `openclaw --version` reports `2026.4.5`
- `openclaw gateway probe` reports app `2026.4.5`
- `codex` memory is healthy again
- `voltaris-v2` memory is healthy again
- `openclaw doctor --non-interactive` is clean

Why the final vote is still `HOLD`:

- the machine only became healthy after two manual remediations:
  - remove a stale user-systemd override that still pinned the gateway to an
    old checkout
  - restore the local memory runtime by wiring `node-llama-cpp` and its
    platform packages back into the installed npm runtime

Result:

- live update was performed
- runtime now lives on `2026.4.5`
- operational health was restored
- but the upgrade path is not yet clean or reproducible enough to call `GO`

Next action:

- run the bounded packaging/runtime reproducibility seam in `MISSION-015`
- keep `MISSION-013` queued behind that seam until the upgrade path is
  supportable without host-specific repair
