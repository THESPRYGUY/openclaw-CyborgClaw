# RSI Backlog Priority - 2026-04-06

This is the operator-facing shortlist derived from the live backlog cleanup in
`ops/cyborgclaw/RSI_BACKLOG_TRIAGE_2026-04-06.md`.

## Archive outcome

Completed in the live backlog:

- archived ideas: `10`
- deleted stale to-dos: `7`
- downgraded falsely-active to-dos: `2`

Resulting live backlog:

- open ideas: `11`
- open to-dos: `36`

## Immediate queue

### Mission 014 - upgrade prep first

Current team vote:

- real `codex`: prep and evaluate `2026.4.5` first; do not blind-upgrade
- real `voltaris-v2`: prep and evaluate `2026.4.5` first; keep it a governed seam
- mission lead: prep and evaluate `2026.4.5` first because memory/dreaming is a
  material new surface and the local memory estate is uneven

Bounded goal:

- verify the `2026.4.5` release and memory changes
- capture a before/after baseline
- decide whether the live upgrade should proceed

### Mission 013 - next hardening packet after upgrade evaluation

Queued next reliability seam:

- `todo-r6u6m87985l`
- `[OpenClaw Hardening T1-P6] Fix control-plane drift detection (manifest vs DB vs runtime)`

Why it stays next after Mission 014:

- highest converged value among the remaining hardening packets
- strongest operator-truth leverage
- clean bounded proof path once the upgrade decision is settled

## Top remaining packets after Mission 014 / Mission 013

1. `todo-13gq8dwye74`
   `[OpenClaw Hardening T1-P4] Lock owner-lane addressing contract (laneKey + ownerSessionId fallback)`
2. `todo-z3rpv90hm2g`
   `[OpenClaw Hardening T1-P7] Harden group policy and tool scope for shared chats`
3. `todo-v39cdla4tbh`
   `[OpenClaw Hardening T1-P5] Make incident closure dual-gate mandatory`
4. `todo-w449a4fc62j`
   `[OpenClaw Hardening T2-P5] Dev board truth-model alignment`
5. `todo-x235r0uwyp`
   `[OpenClaw Hardening T2-P1] Standardize lane-specific tool profiles`

## Resolve-now backlog hygiene items

These should be closed out truthfully, not left hanging:

- `PLoWvKzGsvAeIc8jyGK8N` `LLM Model Telemetry Cluster 2026-03-25T13-52-29-347Z`
- `40A17ucjW3Gnld7RWf80l` `CyborgClaw Explainer Card`

Both have completed workforce jobs behind them, but their backlog posture still
needs a proper closeout fix.

## Strategic rule

Until the upgrade evaluation is sealed:

- do not widen the queue
- do not launch a fresh Golden Run packet off the remaining list
- treat Mission 014 as the current gating decision
