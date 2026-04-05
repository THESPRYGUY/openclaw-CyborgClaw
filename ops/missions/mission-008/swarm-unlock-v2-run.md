# Swarm Unlock V2 - Run Setup

## Autopsy verdict

Swarm Unlock V1 produced a successful canary and a successful bounded spawn proof, but it did not produce a successful end-to-end implementation run.

- Canary rail succeeded: idea -> shaping -> staging -> Alpha canary -> accepted proofs -> archive.
- Runtime proof rail succeeded: bounded subagent spawn returned a real child result and denial rails worked.
- Implementation execution rail failed: the Alpha implementation job reached `dispatched` and stopped there.
- Core lesson: `spawn worked` is not the same as `mission advanced`.

## Shared diagnosis

This V2 setup converges the live guidance from `codex`, `voltaris-v2`, and the dashboard card audit.

- Top execution-rail failure: spawned work was not modeled as a first-class child of a parent seat task, so the workforce state machine could not advance the implementation job cleanly after dispatch.
- Top telemetry failure: mission surfaces could not show parent -> child lineage, live child posture, and accepted child proof clearly enough for operators to trust that swarm work was actually happening.
- Top product requirement: subagents must remain bounded child work units under a parent seat, not new peer seats or hidden background magic.

## V2 objective

Get one Swarm Unlock job all the way through:

1. idea
2. shaping
3. staging
4. delegated Alpha seat execution
5. bounded child spawn
6. visible child work
7. parent-seat proof acceptance
8. publish bundle
9. sealed closeout

## Non-negotiable V2 rules

- Strike Team Alpha only.
- Parent seat remains the authority face.
- Spawned subagents are execution limbs, not new roster authorities.
- Every child unit must have visible lineage, status, and proof linkage.
- Job state may not advance past `dispatched` unless at least one child result is accepted by a parent seat.
- Publish never implies runtime live.
- No hidden state transitions.

## Canonical baseball-card update

V2 must standardize around one seat-card contract and extend it, not invent a new card family.

Canonical card slots:

1. identity
2. status
3. mission/task summary
4. metrics
5. chips
6. actions
7. spawn summary rail

Required `spawn summary rail` fields:

- active child count
- child status rollup
- latest child receipt/proof timestamp
- blocked child indicator
- expandable lineage/provenance panel

Scene rule:

- mission rooms, roster walls, and studio views may vary by `sceneVariant`
- they may not fork into different baseball-card grammars

## Surface requirements

### Mission rooms

Show spawned subagents as child work units under a parent seat card.

- parent seat
- live child count
- current child statuses
- last proof/receipt timestamp
- accepted child proof state
- closeout state

### Roster walls

Show swarm posture at a glance without promoting children into peer seats.

- child activity stripe or summary row on the parent card
- `2 active children`
- `1 blocked child`
- `awaiting parent acceptance`

### Golden Run / management boards

Do not mark swarm execution as healthy unless operators can see:

- parent seat
- active child work
- proof flow
- state transition to the next lifecycle step

## V2 run shape

### Phase 0 - Preflight

- Alpha roster locked
- delegation contract admitted
- allowed spawner set explicit
- max depth and max children explicit
- proof receipt schema admitted

### Phase 1 - Parent seat dispatch

- one Alpha seat receives admitted implementation work
- seat reaches `acknowledged`
- seat reaches `in_progress`

### Phase 2 - Child spawn

- parent seat spawns one bounded child unit
- child lineage attaches to the parent seat and current job
- child appears live in mission room and roster wall telemetry

### Phase 3 - Child execution

- child does bounded scoped work
- child emits proof/receipt
- child completion state becomes visible under the parent seat

### Phase 4 - Parent acceptance

- parent seat accepts or rejects the child proof
- accepted proof advances parent seat posture
- rejected proof remains visible and blocks progression

### Phase 5 - Workforce progression

- accepted parent proof advances the job beyond `dispatched`
- at least one seat must show `acknowledged` -> `in_progress` -> `completed`
- implementation job must no longer stall at dispatch

### Phase 6 - Publish and seal

- publish bundle filed
- rollout note explicit
- closeout packet filed
- job archived and sealed

## Acceptance test

Swarm Unlock V2 passes only if this exact sequence is visible and true:

1. authorized Alpha seat enters `in_progress`
2. that seat spawns one bounded child unit
3. the child appears live on the parent seat card
4. the child finishes bounded work and emits a receipt
5. the parent seat accepts the child proof
6. the workforce job advances beyond `dispatched`
7. publish bundle is filed
8. the run seals cleanly

## Immediate fail conditions

- child work happens but is not visible on mission surfaces
- child proof exists but cannot be traced to a parent seat
- job remains `dispatched` after accepted child proof
- any surface implies subagents are independent seats
- any surface claims `in progress` without visible live work
