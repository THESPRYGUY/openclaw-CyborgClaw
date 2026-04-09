# CyborgClaw Concurrency Archaeology — 2026-04-08

## Purpose

This note captures the early model and agent concurrency work as an evidence-first chronology so the team does not need to re-dig the same trail later.

It separates:

- architecture-pack context
- runtime implementation receipts
- deterministic smoke proof
- later reconciliation notes
- present-day interpretation

## High-confidence summary

The early concurrency work did happen and left a clear paper trail.

The strongest proof chain is:

1. provider-lane concurrency support was added
2. a deterministic `strike_echo` smoke test was created
3. the smoke test was hardened to use unique sessions and isolated resets
4. the smoke test was pinned to `main` and required JSON proof of `openai-codex / gpt-5.3-codex`
5. a later follow-up throttled the smoke test to respect the discovered Codex concurrency cap

The March 6 architecture pack is useful context, but it is not the proof bundle for the concurrency breakthrough. At that point, exact provider concurrency and throttling behavior was still explicitly marked as unknown.

## Primary artifacts

### Runtime and proof receipts

- `docs/cyborgclaw/SSOT.md`
- `scripts/strike_echo.sh`

### Core commit trail

- `2c569fcbfc` — `CyborgClaw: provider lane concurrency override + schema support`
- `a68a8ebb28` — `Add strike echo smoke test`
- `008a49e654` — `Make strike echo smoke test deterministic (reset phase + unique sessions)`
- `d173bf1dbd` — `Pin strike echo smoke test to agent main and assert codex model via JSON`
- `b995284903` — `smoke: throttle strike_echo to respect codex concurrency cap`

### Reconciliation follow-on

- `M10__ACP_FOUNDATION_FREEZE__2026-03-13/M10_update_issue_receipt.md`
- `M10__ACP_FOUNDATION_FREEZE__2026-03-13/M10_reconciliation_design_note.md`

### Architecture-pack context

Uploaded archive reviewed:

- `20260408T140909Z__OpenClaw_Canonical_Intelligence_Repository_Pack_v2_2026-03-06.zip`

Canonical copy observed outside the repo during archaeology:

- `/home/spryguy/openclaw-workspace/inbox/uploads/20260408T140909Z__OpenClaw_Canonical_Intelligence_Repository_Pack_v2_2026-03-06.zip`

## Chronology

### 2026-02-26 17:26 UTC

Commit:

- `2c569fcbfc`

Meaning:

- provider-lane concurrency support was introduced
- the repo gained a config-driven control for provider-specific lane caps
- later SSOT wording describes this as `gateway.providerConcurrency.<providerId> = <maxConcurrent>`

Why it matters:

- this is the first concrete implementation step that turned concurrency from a concept into a runtime control

### 2026-02-26 17:45 UTC

Commit:

- `a68a8ebb28`

Meaning:

- the first `strike_echo` smoke test was added

Why it matters:

- this created a repeatable proof surface instead of relying on vague terminal impressions

### 2026-02-26 19:56 UTC

Commit:

- `008a49e654`

Meaning:

- the smoke test was made deterministic
- resets were isolated
- sessions were made unique

Why it matters:

- this reduced cross-talk and made concurrency proof reproducible

### 2026-02-26 20:40 UTC

Commit:

- `d173bf1dbd`

Meaning:

- the smoke test was pinned to `--agent main`
- JSON receipts were required
- provider and model had to resolve to:
  - `openai-codex`
  - `gpt-5.3-codex`

Why it matters:

- this is the step that converted “it seemed to work” into “we can prove which lane actually answered”

### 2026-02-26 evidence snapshot

Captured in:

- `docs/cyborgclaw/SSOT.md`

Key claims recorded there:

- runtime config set `gateway.providerConcurrency.openai-codex = 2`
- `scripts/strike_echo.sh` passed `10/10`
- the run was pinned to `openai-codex / gpt-5.3-codex`
- no error patterns were detected

Interpretation:

- the strongest early proven lane was the Codex lane
- the practical concurrency story at that point was not “infinite seats”
- it was “bounded provider concurrency with deterministic proof”

### 2026-03-01 05:20 UTC

Commit:

- `b995284903`

Meaning:

- `strike_echo` was throttled to respect the discovered Codex concurrency cap

Why it matters:

- this is a strong sign that the team learned an operational limit from live testing and then encoded it back into the smoke tooling

### 2026-03-06 architecture-pack snapshot

Reviewed from the uploaded canonical intelligence pack.

Important finding:

- `12_UNKNOWNS_LEDGER.md` still marked exact provider concurrency and throttling behavior in core OpenClaw as `UNKNOWN`

Interpretation:

- the pack is useful for architecture and source-authority context
- it is not the decisive proof artifact for the earlier concurrency breakthrough
- it predates or lags the later runtime proof chain

### 2026-03-13 reconciliation framing

Captured in:

- `M10__ACP_FOUNDATION_FREEZE__2026-03-13/M10_update_issue_receipt.md`
- `M10__ACP_FOUNDATION_FREEZE__2026-03-13/M10_reconciliation_design_note.md`

Key meaning:

- local `providerConcurrency` remained a unique local feature
- upstream lane primitives existed
- provider-lane concurrency was treated as a narrow rebuild-on-upstream-primitives problem

Why it matters:

- this moved the conversation from “did we build something?” to “how does this local feature relate to upstream?”

## What the uploaded March 6 zip does prove

- the team had already assembled a serious canonical architecture pack
- the pack understood OpenClaw as a Gateway-centered control plane
- the pack already flagged concurrency and throttling as strategically important
- the pack is a useful context source for how CyborgClaw was thinking about channels, providers, nodes, control plane, and drift

## What the uploaded March 6 zip does not prove

- it does not prove the later runtime concurrency limit
- it does not prove the `10/10` Codex burst result
- it does not prove the exact operational cap currently in force
- it should not be treated as equivalent to the later runtime smoke receipts

## Best current interpretation

The early concurrency story is best understood as:

1. architecture and lane-governance intent existed
2. runtime provider-lane controls were added
3. deterministic smoke proof was built
4. the Codex lane was proven first
5. the smoke was later throttled to respect the practical cap
6. reconciliation then reframed the feature as a local overlay on top of upstream queue primitives

## Current relevance

Still relevant:

- provider-lane concurrency as a control concept
- deterministic session-isolated burst proof
- provider/model pinning in receipts
- separating architecture intent from runtime proof

Historical only unless re-proven:

- the exact old seat count as a present-day operating guarantee
- any assumption that the March 6 architecture pack itself is the live concurrency proof
- any assumption that current provider caps match the 2026-02-26 runtime exactly without re-checking config and logs

## Team consult notes

Live Codex and Voltaris V2 both aligned on the same framing:

- tell the story as a move from planned concurrency model to live runtime proof to present-day operating envelope
- do not mix architecture-pack intent with later runtime evidence as if they are the same evidence tier

## Recommended next move

Before using the old concurrency results as an operating limit again:

1. re-check the live runtime config
2. re-check current provider-lane overrides
3. re-run a bounded modern burst proof
4. compare the result to this chronology rather than replacing it
