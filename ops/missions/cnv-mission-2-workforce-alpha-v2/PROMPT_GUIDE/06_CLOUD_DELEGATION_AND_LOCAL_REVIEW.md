# 06 — Cloud Delegation and Local Review

Cloud delegation is a separate route from subagent usage.

## Use cloud delegation when

- the implementation run is too large for a tight local loop
- the operator wants longer autonomous execution offloaded
- the team intends to review the resulting work locally before acceptance

## Default flow

1. plan locally
2. define exact delegated scope
3. delegate the work
4. review locally
5. validate locally
6. accept / revise / discard

## Required local review questions

- Did the delegated work stay inside scope?
- Did it mutate the correct files?
- Are the validation receipts real and relevant?
- Did it introduce hidden cleanup or drift?
- Is there any change we should reject even if tests pass?

## Acceptance rule

Cloud-produced work is not accepted until local review and local validation complete.

## When not to use cloud delegation

- tiny fixes
- tasks needing rapid conversational back-and-forth
- ambiguous architecture decisions not yet shaped into a bounded execution brief
