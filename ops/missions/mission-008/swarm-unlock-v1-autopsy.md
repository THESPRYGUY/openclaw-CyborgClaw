# Swarm Unlock V1 - Mission Autopsy

## Verdict

Swarm Unlock V1 was a successful canary and a failed live-fire implementation run.

- Canary rail: succeeded
- Runtime spawn proof: succeeded
- Implementation execution rail: failed
- Published and sealed implementation run: not achieved

## What succeeded

### 1. The idea runway worked

The job moved through:

1. idea shaping
2. stress/value review
3. PRD admission
4. canary delegation to Strike Team Alpha
5. seat execution
6. proof acceptance
7. archive and seal

This proved the governance rail and the Golden Run process rail.

### 2. Bounded subagent spawning proved live

Mission 008 produced real proof that:

- `president-a` could spawn one bounded child unit
- the child returned a real result
- cross-agent out-of-contract spawn was denied
- stop rails for depth/fanout were proven

This proved the runtime capability exists.

## What failed

### 1. The implementation job did not advance

The Alpha implementation job reached:

- PRD admitted
- dev pack admitted
- President-A fan-out to 3 seats

Then it stalled at:

- `dispatched`

It did not reach:

- seat acknowledgements
- seat starts
- seat completions
- proof backbriefs
- publish
- archive
- seal

### 2. Telemetry hid the real gap

Operators could see governance progress and bounded runtime proof, but not a trustworthy live path from:

- parent seat dispatch
- to child spawn
- to child work
- to parent proof acceptance
- to workforce job advancement

That made it look like “agents are working” without enough visible evidence.

## Root cause

Spawned work was not treated as a first-class child of a parent seat inside the workforce state machine.

Because of that:

- runtime proof could succeed
- while the workforce job still failed to move

So the platform currently supports:

- `spawn worked`

but not yet:

- `spawned work advanced the job`

## Operator truth failures

### 1. Parent-child lineage was weakly surfaced

Mission surfaces did not make it obvious:

- who spawned what
- which child belonged to which seat
- whether the child was still active
- where the child receipt/proof lived

### 2. Seat cards lacked a spawn rail

The canonical baseball-card face did not yet show:

- active child count
- child status rollup
- last child receipt
- blocked child state

### 3. Job state was over-trusted

The system could say:

- `in progress`

without requiring visible live child work and accepted proof on the parent card.

## Architecture lessons

### 1. Proof rail and execution rail must converge

V1 allowed:

- separate runtime proof success
- separate workforce execution stall

V2 must make the proof path and execution path meet at the parent seat.

### 2. Subagents must stay execution limbs

Subagents must not become:

- peer roster seats
- hidden background work
- independent authorities

They must remain:

- bounded child work units attached to a parent seat and current mission

### 3. Visible acceptance is the real gate

The important event is not “child spawned.”

The important event is:

- parent seat accepted child proof
- and the job advanced because of it

## V2 design consequences

1. Parent seat cards need a fixed `spawnSummary` rail.
2. Mission rooms need live parent -> child lineage and receipt state.
3. Roster walls need compact child activity posture on the parent card.
4. Workforce progression must require accepted child proof before leaving `dispatched`.
5. Publish and seal must depend on execution-rail completion, not proof side-success alone.

## V2 success condition

Swarm Unlock V2 is only successful if one job can move:

1. idea
2. shaping
3. staging
4. parent seat dispatch
5. bounded child spawn
6. visible child execution
7. parent proof acceptance
8. workforce advancement beyond `dispatched`
9. publish
10. sealed closeout
