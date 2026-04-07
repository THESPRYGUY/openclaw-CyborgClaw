# Mission 016 - Break-Out Room Card Truth De-Bug Golden Run

Goal:
Use the next Golden Run to debug and harden the Break-Out Room page so BORF and
participant cards stay on one canonical card species before and after live room
hydration.

## Mission objective

Turn the Break-Out Room card bug into a bounded De-Bug Golden Run packet that:

1. identifies the exact live-session render seam causing the BORF / participant
   card reversion
2. proves one canonical card path for BORF and participants
3. verifies the page keeps the same card species after live data loads
4. closes with operator-visible before / after proof
5. seeds the next debug or hardening seam from evidence

## Why now

The current Break-Out Room page is damaging operator trust because it can:

- briefly show the newer shared card language
- then revert to older bespoke facilitator / occupant markup

That means the page is not yet a reliable operator surface even if the
underlying card system is improving elsewhere.

The three-way read is aligned:

- real `codex`: the hydrated live-session block is still falling back to old
  hand-built markup
- real `voltaris-v2`: this must be handled as a bounded card-truth reliability
  run, not as decorative redesign work
- mission lead: this is the first proper De-Bug Golden Run candidate

## Source truth

- codex + voltaris consultation:
  - `ops/cyborgclaw/BREAKOUT_ROOM_CARD_DEBUG_REPORT_2026-04-07.md`
- paused next backlog hardening packet:
  - `ops/missions/mission-013/spec.md`
- current RSI / Golden Run engine:
  - `ops/missions/mission-012/spec.md`

## Scope

In scope:

- Break-Out Room BORF render path
- Break-Out Room participant render path
- live hydration / session update reversion seam
- one canonical card contract for this page
- explicit before / after proof on the live page

Out of scope:

- broad Agent OS redesign
- general breakout-room product expansion
- unrelated backlog hardening
- non-Break-Out Room card migrations

## Acceptance criteria

1. BORF renders through one stable canonical manager/card path.
2. participants render through one stable canonical seat-card path.
3. the page does not revert to bespoke card markup after live data hydrates.
4. one focused proof shows correct role/state semantics before closeout.
5. Mission 013 is restored with a clear queue note after Mission 016 closes.

## Success bar

Mission 016 succeeds only if the Break-Out Room can honestly say:

- this is the real BORF card
- these are the real participant cards
- this is their real live state
- and the page will not switch card species after data loads

without widening into adjacent UI work.
