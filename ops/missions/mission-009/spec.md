# Mission 009 - Strike Team Alpha Swarm Unlock V2 Live Fire

Goal:
Carry one real Strike Team Alpha implementation job from admitted work to published, sealed closeout with parent-seat-owned child execution visible on the mission surfaces the operator already trusts.

## Mission objective

Deliver the first end-to-end CyborgClaw swarm execution run that proves:

1. one Alpha parent seat owns the work
2. one bounded child unit is spawned under that seat
3. the child unit stays visible in mission telemetry
4. the parent seat explicitly accepts the child output
5. the same job reaches publish and seal without hidden authority drift

This mission is successful only if one real job moves through:

1. idea
2. shaping
3. staging
4. delegated Alpha seat execution
5. bounded child spawn
6. visible child execution
7. parent-seat proof acceptance
8. publish bundle
9. sealed closeout

## Source truth

This mission starts from the V1 canary and V1 autopsy, not from a blank slate.

- Mission 008 implementation packet: `ops/missions/mission-008/spec.md`
- V1 autopsy: `ops/missions/mission-008/swarm-unlock-v1-autopsy.md`
- V2 run brief: `ops/missions/mission-008/swarm-unlock-v2-run.md`
- Delegation contract draft: `ops/missions/mission-008/alpha-subagent-delegation-contract.md`
- Sealed canary job: `job-jYPCQdM9ul`
- Stalled implementation job: `job-66BHu_h1Xd`

## North star

Swarm Unlock V2 is not about proving that spawn is technically possible.

Swarm Unlock V2 is about proving that spawned work can be:

- bounded
- governed
- operator-visible
- job-advancing
- publishable
- sealable

## Non-negotiable rules

- Strike Team Alpha only.
- Parent seat remains the authority face.
- Spawned children remain bounded execution limbs, not peer seats.
- Child work must be visible on the mission room, roster wall, and canonical seat card.
- Workforce job state may not advance past `dispatched` without parent-seat proof acceptance.
- Publish never implies live global swarm enablement.
- No silent runtime mutation.
- No hidden off-surface state changes.

## Preflight gates

### Gate 001 - Runtime truth

Before launch, verify:

- gateway and Control UI are healthy
- Alpha workforce mission surfaces are loading fast enough to trust
- benchmark preflight is green

### Gate 002 - Telemetry truth

Before launch, verify:

- mission room can show parent seat + child unit lineage
- roster wall can show parent card child-summary posture
- canonical seat card has a `spawnSummary` rail
- surfaces label `live`, `derived`, `stale`, and `blocked` honestly

### Gate 003 - Governance truth

Before launch, verify:

- delegation contract is admitted
- allowed spawner set is explicit
- depth and fanout rails are explicit
- positive, denial, and stop-condition receipt shapes are admitted

## Required surfaces

### Mission room

Must show:

- parent seat
- child count
- child lifecycle state
- last child receipt timestamp
- parent acceptance state
- closeout state

### Roster wall

Must show:

- which parent seats have child work active
- blocked child posture
- done child posture
- freshness/truth chip

### Canonical baseball card

Must keep the standard seat identity and add a fixed `spawnSummary` rail with:

- active child count
- child status rollup
- latest child proof timestamp
- blocked child indicator
- expandable lineage/provenance panel

## Seat fanout

### President-A

Owner of:

- sequencing
- admission into execution
- parent-seat acceptance
- publish recommendation

### dir-application-eng-01

Owner of:

- bounded spawn plumbing
- parent-child execution linkage
- seat-task progression beyond `dispatched`

### dir-architecture-01

Owner of:

- delegation contract finalization
- authority boundary enforcement
- depth/fanout guardrails

### dir-devex-qa-01

Owner of:

- positive / denial / stop proofs
- receipt integrity
- regression coverage

### voltaris-v2

Owner of:

- operator trust
- card / roster / mission-room visibility
- stale-vs-live honesty

### codex

Owner of:

- execution-rail integrity
- closeout sanity
- MVP ticker reassessment evidence

## Acceptance criteria

1. One admitted Alpha parent seat reaches `acknowledged` and `in_progress`.
2. That seat spawns one bounded child unit under the current job.
3. The child appears live on the parent seat card in the mission room and roster wall.
4. The child completes bounded work and emits a receipt/proof.
5. The parent seat explicitly accepts the child proof.
6. The workforce job advances beyond `dispatched`.
7. Publish bundle is filed.
8. The job archives and seals cleanly.
9. MVP ticker reassessment is written against observable evidence, not optimism.

## Fail-fast blockers

1. Child spawn is not first-class in the workforce/job state machine.
2. Mission surfaces cannot show parent -> child lineage truthfully.
3. Parent seat cannot explicitly accept or reject child output.
4. Publish/closeout cannot distinguish child proof from parent proof.
5. Any path widens authority silently or implies swarm success without visible work.

## MVP ticker reassessment rule

Raise the CyborgClaw MVP percentage only if this run proves:

- visible child execution advanced real execution state
- parent acceptance was explicit
- publish/closeout were sealed without manual truth stitching
- operators could tell at a glance what was happening

Hold or lower the ticker if:

- spawn proof succeeded but the job stalled
- telemetry truth still required inference
- stale or derived signals masqueraded as live work
- authority or closeout remained ambiguous
