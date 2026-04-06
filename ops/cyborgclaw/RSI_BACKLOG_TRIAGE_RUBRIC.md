# RSI Backlog Triage Rubric

Date: 2026-04-06

Purpose:
Use one stable value bar to decide whether an Ideas Incubator item or To-Do has material value to CyborgClaw, should stay seeded for a later Golden Run, or should be archived/removed.

## Shared collaborator convergence

Real `codex` and real `voltaris-v2` aligned on the same core evaluation frame:

- strategic alignment to CyborgClaw direction
- shared-platform leverage
- operator-truth improvement
- reliability and hardening impact
- proof readiness
- one bounded next step

## Scoring model

Score each dimension from `0` to `5`.

1. Strategic alignment

- `5`: directly strengthens CyborgClaw control-plane truth, safety, reliability, or core operator capability
- `3`: useful adjacent value, but not a top-line CyborgClaw seam
- `1`: interesting but weakly aligned
- `0`: outside current CyborgClaw strategic lanes

2. Shared-platform leverage

- `5`: improves multiple surfaces, lanes, or workflows at once
- `3`: improves one important surface or subsystem
- `1`: local-only improvement
- `0`: isolated novelty

3. Operator-truth improvement

- `5`: reduces false posture, stale state, ambiguity, or hidden work
- `3`: improves clarity but not correctness
- `1`: cosmetic readability only
- `0`: no operator-truth gain

4. Reliability and hardening impact

- `5`: reduces failure risk, authority drift, security risk, or control-plane instability
- `3`: useful robustness gain
- `1`: low operational impact
- `0`: no real hardening value

5. Proof readiness

- `5`: clear validation path and evidence output already exist
- `3`: validation path is possible with moderate prep
- `1`: proof path is vague
- `0`: cannot be cleanly proven

6. Bounded next step

- `5`: one governed seam, one packet, one proof gate
- `3`: moderately scoped but still tractable
- `1`: broad or fuzzy
- `0`: no clean next slice

## Outcome bands

- `24-30`: `advance_now`
- `18-23`: `keep_seeded`
- `12-17`: `hold`
- `<12`: `archive`

## Immediate archive rules

Archive or remove items immediately if they are:

- obvious duplicates of a newer or already-promoted item
- stale one-off decisions that have already passed or expired
- test junk
- outside current CyborgClaw strategic lanes
- speculative and unable to name a bounded next packet
- superseded by a clearer surviving parent item

## Golden Run fit test

An item is Golden-Run-fit only if it can name:

- one seam
- one mutation scope
- one exclusion boundary
- one proof gate
- one operator-visible validation path
- one closeout packet

If it cannot do that, it is not ready to become a live Golden Run candidate.

## RSI priority heuristic

When multiple survivors remain, prioritize the item that:

1. tightens control-plane truth or reliability
2. collapses multiple downstream drifts at once
3. is evidence-backed
4. has low blast radius
5. can seal one real seam cleanly

## Team closeout rule

After each successful loop:

- `codex` gives the repo-truth recommendation
- `voltaris-v2` gives the operator-truth recommendation
- mission lead gives the continuity recommendation

If all three align on the next bounded seam, that becomes the next Golden Run packet.
