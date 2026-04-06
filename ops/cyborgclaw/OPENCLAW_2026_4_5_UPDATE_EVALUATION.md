# OpenClaw 2026.4.5 Update Evaluation

## Official release truth

Verified from official release and npm sources:

- latest stable release: `v2026.4.5`
- npm latest: `2026.4.5`
- current installed runtime on this machine: `2026.4.3`
- current runtime path reports:
  - `npm update 2026.4.5`
  - gateway reachable
  - local service live

## Why this matters now

`2026.4.5` is not just another patch for this machine.

It carries a material memory surface expansion:

- experimental `Memory/dreaming`
- weighted short-term recall promotion
- `/dreaming` command
- Dreams UI / Dream Diary
- REM preview tooling
- replay-safe promotion
- Bedrock embeddings expansion
- `memory-core` startup recursion fix

This is directly relevant to the long-form RSI / Golden Run phase because that
phase depends on durable, trustworthy context carry-forward rather than local
chat-only continuity.

## Local baseline before any upgrade

### Runtime and repo state

- installed runtime: `2026.4.3`
- local repo package version: `2026.2.26`
- `openclaw status --all` reports:
  - git `main`
  - dirty
  - behind `origin/main` by `1950`
  - recommended update path is npm, not git pull

### Config and migration posture

Current config:

- builtin memory is configured
- dreaming is not configured
- no evidence of the legacy aliases called out in the `2026.4.5` breaking notes:
  - `talk.voiceId`
  - `talk.apiKey`
  - `agents.*.sandbox.perSession`
  - `browser.ssrfPolicy.allowPrivateNetwork`
  - `hooks.internal.handlers`
  - channel / group / room `allow` toggles

This lowers config-migration risk.

### Memory baseline

Current `2026.4.3` CLI surface:

- `openclaw memory` exists
- there is no dreaming subcommand yet in this runtime

Observed baseline:

- builtin memory is enabled
- strong healthy path:
  - `voltaris-v2` indexed `934` files / `15994` chunks
- mixed or weak paths:
  - many agents are dirty
  - several agents have missing memory directories
  - `president-a` is present but low-volume
  - `main` is lightly indexed

Relevant issues observed during baseline capture:

- many agent memory stores are dirty or empty
- several `president-b*` agents report missing memory directories
- `voltaris-v2` has a missing extra memory path note for `intake`
- baseline memory health is uneven enough that a blind upgrade could muddy the
  signal

## Team input

### Real `codex`

- prepare an update-evaluation packet now
- do not blind-upgrade
- gate on:
  - release-note-to-risk review
  - baseline capture
  - voltaris continuity integrity
  - safe handling of dirty/missing-memory agents
  - rollback-ready Golden Run comparison

### Real `voltaris-v2`

- treat the upgrade as its own governed seam
- do not fold it into the active hardening stream
- gate on:
  - replay-safe promotion behavior
  - memory-core startup stability
  - dreaming activation semantics
  - no regression to healthy `voltaris-v2` memory
  - containment for dirty/missing-memory agents

## Evaluation

### Release value

High.

The memory and dreaming additions are directly aligned with CyborgClaw's long
form RSI direction.

### Upgrade risk

Moderate.

Not because the release looks bad, but because the current machine has an
uneven memory estate and the upgrade introduces new optional memory behavior.

### Operational recommendation

Do this in two steps:

1. seal a governed upgrade-prep packet
2. only then decide whether to run the live runtime upgrade

## Go / no-go gates for the actual upgrade

Must-have before running the live update:

1. capture current baseline:
   - `openclaw status --all`
   - `openclaw memory status --json`
   - `openclaw memory status --deep`
2. back up current config and note the active install path
3. confirm post-update migration path:
   - `openclaw doctor --fix --non-interactive`
4. verify post-update memory health:
   - `memory-core` does not regress startup
   - healthy `voltaris-v2` index still reads cleanly
   - dirty/missing-memory agents fail safely
5. verify operator surfaces:
   - gateway boots
   - channels probe cleanly
   - Codex and Voltaris sessions still work
   - dashboard/operator flows still load

## Recommended path

Recommended now:

- create and queue a dedicated upgrade-prep mission
- pause Mission 013 behind it
- do not perform the actual upgrade until the packet is closed with a clear
  go/no-go recommendation

This keeps the upgrade from contaminating the current Golden Run hardening lane
while still treating `2026.4.5` as strategically important.
