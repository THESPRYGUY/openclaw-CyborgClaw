# Mission 014 - OpenClaw 2026.4.5 Upgrade Evaluation

Goal:
Evaluate OpenClaw `2026.4.5` as a bounded upgrade seam before any live runtime
change, with special attention to the new memory and dreaming capabilities.

## Mission objective

Turn the `2026.4.5` release into a governed preparation packet that:

1. verifies the official release and its memory-related changes
2. captures the current system baseline on `2026.4.3`
3. identifies migration and rollout risks
4. defines go / no-go gates for the actual upgrade
5. closes with a clear recommendation and return path to Mission 013

## Why now

OpenClaw `2026.4.5` is the newest stable release and introduces material memory
surface changes:

- experimental dreaming
- Dream Diary / Dreams UI
- replay-safe promotion
- REM tooling
- memory-core startup fix
- expanded embeddings support

The local system is already using builtin memory, but the current memory estate
is uneven across agents. That makes the release strategically relevant and
operationally risky enough to justify its own packet.

## Source truth

- official release:
  - `v2026.4.5`
- update evaluation:
  - `ops/cyborgclaw/OPENCLAW_2026_4_5_UPDATE_EVALUATION.md`
- backlog queue:
  - `ops/cyborgclaw/RSI_BACKLOG_PRIORITY_2026-04-06.md`
- paused next hardening packet:
  - `ops/missions/mission-013/spec.md`

## Scope

In scope:

- official release verification
- local baseline capture
- memory / dreaming impact assessment
- migration and rollback planning
- go / no-go recommendation for live update

Out of scope:

- performing the live upgrade itself
- general backlog hardening unrelated to the upgrade
- expanding RSI scope beyond upgrade prep

## Acceptance criteria

1. The release is verified from official sources.
2. Current runtime, memory, and config baseline are captured.
3. Upgrade risks and gates are explicit.
4. The mission closes with one of:
   - go
   - hold
   - pilot first
5. Mission 013 can resume with a clear queue decision afterward.

## Success bar

Mission 014 succeeds only if it leaves the system with:

- a truthful understanding of what `2026.4.5` changes
- a realistic view of local memory readiness
- a bounded update path
- no blind runtime mutation
