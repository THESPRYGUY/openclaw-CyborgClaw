# Strike Team Alpha Delegation Contract Draft

Status: Draft for Mission 008

## Purpose

Define the first admitted contract for bounded subagent spawning inside Strike Team Alpha.

This contract exists to unlock specialist delegation without creating:

- a second authority surface
- silent swarm expansion
- hidden nested work
- unbounded fanout

## Scope boundary

Allowed scope:

- Strike Team Alpha only
- bounded specialist subagent work
- operator-visible delegation
- receipt-backed closeout

Forbidden scope:

- cross-team delegation
- hidden autonomous spawning
- recursive swarm growth beyond admitted depth
- runtime authority changes outside downstream acceptance

## Authorized spawners

Fill before implementation completion:

- President-A: [ALLOW/DENY]
- dir-application-eng-01: [ALLOW/DENY]
- dir-architecture-01: [ALLOW/DENY]
- dir-devex-qa-01: [ALLOW/DENY]
- voltaris-v2: [ALLOW/DENY]

## Allowed mission shapes

Examples of allowed bounded shapes:

- repo inspection
- narrow code-change worker
- read-only explorer analysis
- receipt verification
- proof summarization

Examples of forbidden shapes:

- open-ended autonomous buildout
- cross-team orchestration
- authority escalation without explicit approval
- hidden chain spawning

## Limits

- Max depth: [TBD]
- Max concurrent spawned subagents per parent: [TBD]
- Max total spawned subagents per mission: [TBD]
- Expiration / timeout policy: [TBD]

## Approval and admission

Required before a spawn is valid:

- mission is admitted to Strike Team Alpha
- spawn request matches an allowed mission shape
- parent agent is authorized by this contract
- depth and fanout limits are not exceeded
- receipt path is available

## Receipt requirements

Every spawn must emit:

- spawn request receipt
- spawn admission receipt
- run summary or failure receipt
- closeout receipt

Every denied spawn must emit:

- denial reason
- contract rule triggered
- actor and mission context

Every stopped spawn must emit:

- stop trigger
- stop authority
- final artifact or cleanup note

## Stop conditions

Stop the spawned run immediately if:

- mission shape drifts beyond the admitted scope
- nested depth exceeds the contract limit
- required receipts cannot be written
- parent authority becomes invalid
- operator or contract kill condition is triggered

## Visibility requirements

Operator must be able to answer:

- who spawned what
- under which mission
- under which rule
- whether it is still active
- where the closeout receipt lives

## Acceptance checklist

- [ ] Authorized spawners finalized
- [ ] Allowed mission shapes finalized
- [ ] Forbidden mission shapes finalized
- [ ] Depth and fanout limits finalized
- [ ] Receipt path finalized
- [ ] Denial behavior finalized
- [ ] Stop behavior finalized
- [ ] Operator visibility review completed
- [ ] Proof plan approved
