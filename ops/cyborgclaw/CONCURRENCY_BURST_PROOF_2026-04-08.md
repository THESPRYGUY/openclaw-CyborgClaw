# Modern Bounded Burst Proof — 2026-04-08

## Purpose

Re-run a modern bounded burst proof in the current OpenClaw runtime and compare it against the historical concurrency proof recorded in `ops/cyborgclaw/CONCURRENCY_ARCHAEOLOGY_2026-04-08.md`.

This note is intentionally separate from the archaeology note so the older proof chain remains intact.

## Historical Baseline

The archaeology note and `docs/cyborgclaw/SSOT.md` describe a proof shape centered on:

- `gateway.providerConcurrency.openai-codex = 2`
- a deterministic 10-session smoke via `scripts/strike_echo.sh`
- provider/model receipts pinned to `openai-codex / gpt-5.3-codex`

## Current Runtime Snapshot

Observed from `~/.openclaw/openclaw.json` at run time:

- `agents.defaults.maxConcurrent = 4`
- `agents.defaults.subagents.maxConcurrent = 8`
- `gateway.providerConcurrency = {}`
- `agents.defaults.model.primary = openai-codex/gpt-5.4`

This means the live runtime is no longer configured like the archaeology-era provider-lane proof.

## Proof Shape

Command run:

```bash
MAX_PARALLEL=4 KEEP_TMP=1 ./scripts/strike_echo.sh | tee /tmp/strike_echo_modern_2026-04-08.txt
```

Run metadata:

- `run_id = 142604-2959029`
- preserved JSON receipts under `/tmp/cc-echo-142604-2959029-*.json`
- preserved reset outputs under `/tmp/cc-echo-142604-2959029-*-reset.out`

## Observed Result

### What passed

- `10/10` exact echoes succeeded
- provider stayed `openai-codex` for all 10 runs
- all 10 JSON receipts reported `status = ok`
- no historical error patterns were found:
  - `rate limit`
  - `FailoverError`
  - `INVALID_REQUEST`
  - `No session found`
  - `cooldown`

### What failed

The harness still hard-requires `gpt-5.3-codex`, but the live runtime resolved all 10 runs to `gpt-5.4`.

Representative receipt shape:

```json
{
  "status": "ok",
  "text": "ECHO-9142604295902901",
  "provider": "openai-codex",
  "model": "gpt-5.4"
}
```

Representative harness failure:

```text
[strike_echo][FAIL] 9142604295902901 provider/model mismatch:
provider='openai-codex' model='gpt-5.4'
(expected openai-codex / gpt-5.3-codex)
```

## Reset-Phase Observation

The reset phase was slower and noisier than the historical note. It did eventually clear, but several reset outputs contained generic recovery or greeting text instead of a clean silent reset receipt.

This did not prevent the burst from completing successfully, but it is a meaningful modern-vs-historical behavior change.

## Comparison Against Archaeology

Compared with `ops/cyborgclaw/CONCURRENCY_ARCHAEOLOGY_2026-04-08.md`, today’s bounded burst at `MAX_PARALLEL=4` reproduced the historical `10/10` exact-echo success on `openai-codex`, but the runtime now resolves to `gpt-5.4` instead of the archaeology-era `gpt-5.3-codex`, so the observed failure is harness pin drift, not a concurrency regression.

The bigger structural delta is also configuration drift:

- archaeology-era proof was framed as provider-lane proof
- current proof is better described as agent-lane cap proof

## Codex / Voltaris Verdict

Both live consults converged on the same reading:

- this is **both** runtime evolution and harness drift
- runtime evolution is the larger driver
- the next useful follow-up is a **modernized proof harness**, not a note-only update

## Working Conclusion

The modern bounded burst proof is still useful.

What it proves today:

- the current runtime can complete a bounded 10-session deterministic burst successfully
- the provider remains pinned to `openai-codex`
- the live model lane has evolved to `gpt-5.4`
- the old harness now fails for historical model-pin reasons, not because burst concurrency regressed

## Recommended Follow-Up

Create a modernized successor to `scripts/strike_echo.sh` that:

- preserves deterministic burst validation
- preserves provider verification
- verifies against the current configured primary model, or against an explicit expected model passed at run time
- distinguishes:
  - concurrency failure
  - provider drift
  - model-pin drift
  - reset-path degradation
