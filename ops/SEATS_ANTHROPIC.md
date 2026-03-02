# Anthropic Seats — CyborgClaw Ops SSOT

## Burst ceiling (measured)

- Model lane: `president-a` pinned to `anthropic/claude-sonnet-4-6`
- Result: PASS at seats=10,12,14,16 (no failures observed)
- Current burst ceiling: **>= 16 seats** (ceiling not yet found)

## Steady-state guidance (Tier 1 “fair ride” policy)

- Hard cap driver is RPM: **50 requests/min** (global batch also 50/min)
- Recommended steady-state concurrency: set lower than burst (start **8 seats**), then pace requests if running continuous loops.

## Proof

Seat sweep output (verbatim):
== seats=10 == PASS
== seats=12 == PASS
== seats=14 == PASS
== seats=16 == PASS

## Next experiment (if we want the true ceiling)

- Try: 18, 20, 24, 32
- Stop at first: 429/cooldown OR echo mismatch
