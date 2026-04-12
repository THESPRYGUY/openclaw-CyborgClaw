# OpenClaw 2026.4.11 Update Evaluation

Date: 2026-04-12

## Decision

Forward-port completed safely.

- Global/package install upgraded from `2026.4.9` to `2026.4.11`
- Live CyborgClaw gateway runtime now runs a `v2026.4.11`-based room-context forward-port from the repo override
- Packaged install remains on `2026.4.11`
- Rollback remains practical through the existing `/tmp/openclaw-rollback-2026.4.9/` bundle

## Why

This host is not running a plain packaged OpenClaw gateway.

The active user service has a systemd override that replaces the packaged gateway entrypoint with:

- `/home/spryguy/openclaw-workspace/repos/openclaw/dist/index.js`

and sets:

- `OPENCLAW_SERVICE_VERSION=2026.2.26-room-context`

That override is the live room-context runtime used by CyborgClaw Group Chat / Break-Out Room work.

Packaged `2026.4.11` did not contain the room-scoped shared-context path currently relied on by CyborgClaw. Specifically:

- `src/commands/agent/shared-room-context.ts` does not exist in `v2026.4.11`
- `sharedRoomContext` / `seenThroughSeq` / `room_scoped` markers are not present in the packaged tag

This meant a full switchover to packaged `2026.4.11` would risk regressing live CyborgClaw room behavior, so the minimum runtime patch set was forward-ported instead.

## Review Summary

Confirmed release facts:

- GitHub release: `v2026.4.11`
- Published: `2026-04-12T00:18:03Z`
- npm latest: `2026.4.11`

Relevant release-note value:

- Codex OAuth `invalid_scope` fix
- timeout honoring fixes
- WhatsApp fixes
- Codex coordination-chatter leak fix
- plugin setup descriptor improvements
- Ollama model metadata caching

Critical local upgrade seam:

- runtime split-brain between packaged install and repo override

## Rollback Bundle

Created at:

- `/tmp/openclaw-rollback-2026.4.9/`

Contents:

- `global-openclaw-node-modules.tgz`
- `openclaw-room-context.bundle`
- `openclaw-gateway.service`
- `openclaw-gateway.service.d/`
- `openclaw.json`
- `receipt.txt`

## Actions Executed

1. Verified release existence and version availability from GitHub + npm.
2. Verified current install/runtime state and discovered the room-context systemd override.
3. Created rollback bundle before touching the packaged install.
4. Attempted merge feasibility against `v2026.4.11`.
5. Merge attempt produced a large conflict set in runtime-critical files and was aborted.
6. Upgraded the packaged install only:
   - `openclaw update --tag 2026.4.11 --yes --no-restart --json`
7. Updated the non-live base systemd unit to match the new packaged entrypoint:
   - `dist/index.js` -> `dist/entry.js`
   - `OPENCLAW_SERVICE_VERSION=2026.4.11`
8. Created clean branch `cyborgclaw-runtime-v2026.4.11` from `v2026.4.11`.
9. Forward-ported the minimum CyborgClaw runtime patch set:
   - room-scoped shared context
   - hookless persistent subagent spawns
   - `/new` stale skills/prompt reset
10. Validated focused tests + build on the forward-port branch.
11. Updated the live systemd override version marker:

- `OPENCLAW_SERVICE_VERSION=2026.4.11-room-context`

12. Reloaded and restarted the live gateway on the repo override runtime.
13. Ran live acceptance checks for:

- room-scoped session keys
- sharedRoomContext ingress
- peer-visible room chain
- room-scoped subagent spawn
- voice-call skill eligibility
- WhatsApp outbound smoke

## Current State After Action

- `openclaw --version` reports `2026.4.11`
- `openclaw update status` reports up to date
- live gateway service runs the repo override runtime built from `cyborgclaw-runtime-v2026.4.11`
- live gateway process reports `OPENCLAW_SERVICE_VERSION=2026.4.11-room-context`
- packaged base systemd unit remains truthful for packaged `2026.4.11`

This is intentional.

## Validation Outcomes

Successful:

1. Focused forward-port tests passed:
   - room-scoped session key routing
   - gateway agent method shared-room ingress
   - stale session reset clearing `skillsSnapshot` and `systemPromptReport`
   - hookless persistent subagent spawns
2. `pnpm build` passed.
3. Live service restart succeeded.
4. Live peer-visible room proof succeeded:
   - Seat 1 posted
   - Seat 2 quoted the exact admitted Seat 1 text
   - Seat 3 built on the admitted Seat 2 text
5. Room-scoped session keys were persisted under `agent:<id>:room:<roomId>`.
6. Room-scoped persistent subagent spawn succeeded and returned `SUBAGENT_ROOM_OK`.
7. `openclaw skills info voice-call --json` still reports `eligible: true`.
8. WhatsApp outbound smoke succeeded through the live gateway.

Follow-up seam still present:

1. `openclaw channels status --probe` reports WhatsApp healthy and an outbound smoke succeeds, but `openclaw gateway probe --json` still reports the WhatsApp health object as `running: false` / `connected: false`.
2. Fresh room-scoped runs for `president-a` still expose a pre-existing `gpt-5.2-codex` thinking mismatch on this host, even when direct non-room runs succeed. This did not block the room-context forward-port itself, but it remains a host/runtime follow-up.

## Safest Next Move

Keep the live gateway on the `2026.4.11-room-context` forward-port runtime.

Next safe step is:

1. Upstream the room-context path so packaged stable can replace the override truthfully.
2. Resolve the remaining WhatsApp health-report mismatch so probe and smoke tell the same story.
3. Resolve the fresh-room `president-a` thinking mismatch so the Break-Out Room trio is clean on all three seats under fresh room sessions.

## Validation Still Required Before Removing The Override

- packaged stable must gain the room-context path
- BORF moderation path should be re-smoked against the active dashboard after the runtime change
- WhatsApp health probe should align with the proven outbound smoke
- `president-a` fresh room runs should complete without the `gpt-5.2-codex` thinking mismatch
