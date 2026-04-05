# Mission 008 - Strike Team Alpha Swarm Unlock Implementation

Goal:
Convert the sealed Swarm Unlock canary into a real bounded implementation mission for Strike Team Alpha, then carry the feature through guarded implementation, proof, publish, and closeout without widening runtime authority beyond the admitted contract.

## Mission objective

Deliver the first real CyborgClaw swarm capability in a tightly bounded form:

1. Strike Team Alpha only
2. operator-approved subagent spawning only
3. bounded mission shapes only
4. explicit max depth and stop conditions
5. visible spawn ledger and closeout receipts
6. no hidden runtime authority and no silent swarm expansion

This mission is successful only if Alpha can implement the bounded spawning path, prove it with receipts, publish the outcome, and leave a sealed closeout packet that makes the rollout safe to understand and safe to audit.

## Source artifacts already admitted

This mission starts from the sealed Phase 1 canary rather than from a fresh idea.

- Idea ID: `4FnUAhwOMznsfYmXG2Xdd`
- Promoted idea title: `Strike Team Alpha Swarm Unlock Canary`
- To-do ID: `tT9DoFo_FSIfimzoPomIi`
- PRD session: `M3Utw-QnOBBkerYB31edq`
- Sealed canary job: `job-jYPCQdM9ul`

The archived canary proved the runway. It is not the implementation job to reuse.

## North star

This is the first real swarm feature implementation mission.

We are not validating whether the idea is good anymore.

We are implementing the bounded Alpha-only version of the feature with the same discipline we used to validate the runway:

- operator-visible truth
- strict publish/runtime separation
- bounded authority
- receipts at every meaningful step
- closeout clean enough to audit

## Non-negotiable rules

- Strike Team Alpha only. No spillover to other teams.
- Runtime authority stays downstream. Publish never implies live.
- No autonomous or silent spawn behavior.
- Every spawn must be operator-approved or contract-approved under explicit admitted rules.
- Every spawn must emit a ledger row and a closeout receipt.
- Nested spawning must stay bounded by explicit max depth.
- If the spawn path cannot be audited, the mission is not complete.
- If the feature would create a second authority surface, stop immediately.

## Deliverables

### Deliverable 001 - Delegation contract

Admit a written Strike Team Alpha delegation contract covering:

- who may spawn
- allowed mission shapes
- max depth
- max concurrent spawns
- stop conditions
- approval path
- visibility requirements
- ledger and receipt requirements

### Deliverable 002 - Runtime guardrails

Implement the runtime boundary for Alpha-only spawning:

- allowlist or policy gate
- mission-shape checks
- depth checks
- denial behavior
- stop behavior

### Deliverable 003 - Operator visibility

Expose the feature clearly enough that an operator can answer:

- who spawned what
- why it was allowed
- what mission shape it used
- whether it is still active
- where its closeout receipt lives

### Deliverable 004 - Proof and test bundle

Produce:

- positive-path proof
- denial-path proof
- stop-condition proof
- receipt-path proof
- publish recommendation note

### Deliverable 005 - Publish and closeout packet

Capture:

- publish bundle
- rollout note
- accepted proofs
- receipt inventory
- closeout summary

## Seat fanout

### President-A

Owner of:

- sequencing
- coordination
- acceptance ordering
- final publish recommendation

### dir-architecture-01

Owner of:

- delegation contract shape
- runtime boundary rules
- policy and depth guardrails

### dir-application-eng-01

Owner of:

- subagent spawn plumbing
- bounded mission-shape enforcement path
- runtime implementation integration

### dir-devex-qa-01

Owner of:

- proof plan
- regression coverage
- denial and stop-condition testing
- receipt verification

### voltaris-v2

Owner of:

- operator visibility
- ledger and closeout readability
- control-plane clarity for the first swarm feature

## Mission phases

### Phase 1 - Contract admission

Before code changes are treated as valid implementation, admit the delegation contract and acceptance gates.

### Phase 2 - Runtime implementation

Implement the bounded Alpha-only spawn path and guardrails.

### Phase 3 - Proof

Run the positive, negative, and stop-condition proofs and verify the receipts.

### Phase 4 - Publish

Publish the implementation outcome with explicit rollout notes and no implied live expansion.

### Phase 5 - Closeout

Seal the run with a clean packet that links:

- contract
- implementation proofs
- publish bundle
- receipt ledger
- next rollout recommendation

## Acceptance criteria

1. A written and admitted Strike Team Alpha delegation contract exists.
2. Alpha-only spawning is enforced in runtime or policy checks.
3. Out-of-contract spawn attempts are denied with visible receipts.
4. Allowed bounded spawns produce visible ledger and closeout receipts.
5. Max depth and stop conditions are test-proven.
6. Operator can inspect the first swarm feature without confusing publish with live.
7. The implementation outcome is published and the run is sealed cleanly.

## Stop conditions

Stop immediately if any of the following occur:

- any code path enables spawning outside Strike Team Alpha
- any code path allows spawning without the admitted contract
- nested depth is not bounded
- receipts are missing or unverifiable
- publish is presented as runtime effective
- operator cannot tell who spawned what and why

## Definition of done

Mission 008 is done only when:

- the bounded Alpha-only spawn feature is implemented
- guardrails and receipts are proven
- the publish bundle exists
- the closeout packet is sealed
- the next rollout recommendation is explicit about whether wider expansion is allowed or forbidden
