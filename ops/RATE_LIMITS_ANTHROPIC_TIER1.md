# Anthropic Rate Limits — Tier 1 (CyborgClaw Ops SSOT)

Analogy: Theme park “fair ride” policy.

- We can sprint (burst concurrency), but the line only moves at a fixed rate.
- Our ops model must respect RPM + tokens/min so we don’t get throttled.

## Limits (as observed in Anthropic console screenshot)

Per-model (Claude Sonnet Active / Claude Opus Active / Claude Haiku Active / Claude Haiku 3)

- Requests per minute (RPM): 50
- Input tokens per minute (TPM):
  - Sonnet/Opus: 30K (<=200k context, excluding cache reads)
  - Haiku/Haiku 3: 50K (<=200k context, excluding cache reads)
- Output tokens per minute (OPM):
  - Sonnet/Opus: 8K (<=200k context)
  - Haiku/Haiku 3: 10K (<=200k context)

Global

- Batch requests: 50 per minute across all models

## Operational implications for CyborgClaw

1. Bursts can pass (e.g., seat sweep), but sustained concurrency must be paced by RPM.
2. Our usage is cache-heavy (cacheRead high), so billable input can remain low, but RPM still applies.
3. Lane policy:
   - Codex lane remains SSOT for smoke tests.
   - Anthropic lane is quarantined by explicit agent binding (e.g., president-a).
4. Stop conditions:
   - First 429/cooldown => halt seat ramp and record ceiling.
   - Quality regression (echo mismatch) => halt and reduce concurrency.

## Suggested pacing rule-of-thumb (Tier 1)

- Keep sustained calls <= ~40 RPM total per model family to leave headroom for retries and other agents.
- Use burst tests to find instantaneous seat ceiling, then set steady-state concurrency lower.
