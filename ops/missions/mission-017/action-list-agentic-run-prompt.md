# Mission 017 Action-List Run Prompt

You are entering a governed agentic run for Mission 017:
`Golden Run Telemetry Truth Hardening`.

## Objective

Work through the current Mission 017 action list one item at a time until each
item is either:

- `pass / closed`, with receipts
- `held`, with a narrower seam and blocker receipt

Do not work multiple action items at once.

## Core operating rule

For each action item, follow this exact loop:

1. Declare the active item
2. Restate the bounded mutation scope
3. Execute the smallest change or audit needed to prove/disprove the item
4. Run `B.R.R.R.`
5. If the item passes and is closed, record receipts and move to the next item
6. If the item fails or truth is mixed, stop, narrow scope, and restate the
   exact remaining seam

## BRRR rule

### Build

- Work exactly one declared focus item at a time
- State the bounded mutation target before changing anything
- Make the smallest change that can prove or disprove the item
- Do not widen scope

### Review

- Review against repo truth, runtime truth, and operator-visible truth
- Require real receipts:
  - tests
  - build
  - live API or board proof where relevant
- Label the result truthfully:
  - `pass / closed`
  - `held`
  - `failed`
  - `unknown`

### Refine

- If the result is mixed, identify the single narrowest remaining seam
- Refine only that seam
- Do not silently move to a neighboring issue

### Repeat

- Repeat only after three-way review
- If the item is closed, admit the next item
- If not, continue only on the narrowed seam for the same item

## Three-way review rule

After every item attempt:

1. Codex gives verdict and one bounded next move
2. Voltaris V2 gives verdict and one bounded next move
3. Mission lead gives verdict and one bounded next move
4. Only if all three align that the item is `pass / closed` do you move to the
   next item
5. If they do not align, hold the item and narrow scope

## Anti-drift rule

Do not mutate any system outside the active focus item unless the dependency is
explicitly named in scope and required for proof.

Never change hero selection, promotion semantics, or unrelated touchpoints
while working a single declared focus item unless that exact dependency is
explicitly admitted into scope.

## Stop conditions

Stop immediately if:

- live proof, test receipts, or BRRR review no longer cleanly support the
  active item’s success bar
- the run begins widening into adjacent systems
- the active item cannot be proven closed by its required receipts
- runtime truth and board truth diverge without a clear narrower seam

When stopping, return only:

- blocker
- current proof state
- one narrower next seam

## Mission 017 current action list

Work these in order. Do not skip ahead unless mission lead explicitly changes
priority.

### Item 1

Keep Golden Run centered on `Break-Out Room Card Truth De-Bug Golden Run`.

Success bar:

- board hero stays centered on the active admitted mission
- no newer idea or side ladder steals focus
- live proof confirms the mission anchor is still correct

### Item 2

Preserve the public truth-posture contract.

Success bar:

- public Golden Run posture stays limited to:
  - `live`
  - `derived`
  - `stale`
  - `unknown`
- no public `fallback` leakage returns

### Item 3

Maintain the Packet 2 guardrail distinction.

Success bar:

- truthful dependency holds remain `WARN`
- illegal downstream promotion attempts remain `BLOCK`
- systems check continues to distinguish those two cases

### Item 4

Maintain the Packet 3 Touchpoint 06 fix.

Success bar:

- boot `seatReadiness` does not show contradictory freshness
- degraded comms posture does not coexist with `recent_session_activity`
- live boot proof stays aligned with workforce comms posture authority

### Item 5

Resolve the two remaining truthfully held touchpoints.

Current held touchpoints:

- `Mission execution`
- `Closeout`

Success bar:

- trace the exact upstream hold source for each one
- define the exact promotion condition for each one
- prove whether each hold should remain or clear

### Item 6

Split the remaining `WARN` semantics.

Success bar:

- operators can distinguish:
  - stale / degraded comms warning
  - lawful upstream-held touchpoint warning
- the board no longer collapses multiple non-blocking truth conditions into one
  ambiguous warning read

## Required receipts for every closed item

- current state
- change made
- proof result
- residual risk
- one bounded next item

## One thing you must not claim

Do not claim Mission 017 is complete or that `/golden-run` is SSOT-ready unless
the board, the systems check, and underlying runtime truth all agree with
visible receipts.
