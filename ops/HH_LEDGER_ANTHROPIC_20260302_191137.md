# CyborgClaw H&H Ledger — Anthropic Lane Added

- When: Mon Mar 2 07:11:37 PM UTC 2026 (local) / Mon Mar 2 07:11:37 PM UTC 2026 (UTC)
- Goal: Add Anthropic models and stand up a quarantined Anthropic lane without disturbing Codex SSOT smoke.

## Current Known-Good

- Codex smoke: `~/bin/cyborg-run health` => strike_echo PASS 10/10 pinned to `openai-codex/gpt-5.3-codex` + `PIN_OK`
- Anthropic lane: `president-a` pinned to `anthropic/claude-sonnet-4-6` with fallbacks:
  - `anthropic/claude-3-7-sonnet-20250219`
  - `anthropic/claude-3-5-haiku-20241022`

## Proof Commands

- Codex: `~/bin/cyborg-run health`
- Anthropic: `timeout 120 ~/bin/openclaw-safe agent --agent president-a --timeout 90 --thinking off --message "Reply with EXACTLY: ANTHROPIC_LANE_OK" --json | jq -r ".result.meta.agentMeta.provider, .result.meta.agentMeta.model, .result.payloads[0].text"`

## Artifacts

- Repo script: `ops/scripts/cyborg-run`
- Installer: `ops/scripts/install-cyborg-run.sh`
- Config snapshot: `ops/config/openclaw.json.snapshot` (commit ec9881443)

## Do Not Repeat

- Don’t let smoke tests fallback cross-provider (Codex smoke must stay pinned).
- Don’t edit openclaw.json “by path guessing” — use targeted searches / safe backups.

## Next single action (next session)

- `~/bin/cyborg-run health`
