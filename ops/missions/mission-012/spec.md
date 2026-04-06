# Mission 012 - Agent RSI Entrypoint Engine Golden Run

Goal:
Use the next Golden Run itself to build the first governed RSI model/engine that CyborgClaw will use for future Golden Run missions.

## Mission objective

Turn the existing `Agent RSI` placeholder into a real operator entrypoint for:

1. observing real mission failures and drift seams
2. scoring candidate improvements
3. drafting one bounded Golden Run improvement packet at a time
4. tracking proof, publish, and closeout truth
5. seeding the next improvement run from evidence

This mission is successful only if CyborgClaw can prove that the RSI engine itself can move through the Golden Flow without becoming a hidden runtime authority.

## Why now

Recent runs proved:

- Mission 009: bounded subagent work can complete and seal inside a real job
- Mission 010: a design-system improvement packet can complete end to end
- Mission 011: the next live hardening seam is already clear

The next step is to stop treating improvement strategy as ad hoc operator memory.

Mission 012 should turn it into a governed operating engine.

## Real collaborator convergence

Real `codex` position:

- build the first real RSI mission loop starting from the existing Agent RSI placeholder
- make it the canonical entrypoint for future Golden Run improvement missions
- no hidden publish, no hidden activation, no second-authority behavior

Real `voltaris-v2` position:

- turn the placeholder into a usable product entrypoint for Golden Run-driven self-improvement
- define the minimum engine that can observe runs, draft improvements, and gate promotion by evidence
- outputs must be concrete enough to implement next without inventing major missing pieces

## Source truth

- RSI synthesis layer:
  - `ops/cyborgclaw/RSI_GOLDEN_FLOW_DEVELOPMENT_STRATEGY.md`
- default RSI doctrine:
  - `ops/missions/mission-005/spec.md`
- 10-loop hardening doctrine:
  - `ops/missions/mission-006/spec.md`
- Golden Flow wireframe:
  - `ops/missions/mission-007/WIREFRAME_FLOW.md`
- Swarm Unlock live-fire proof:
  - `ops/missions/mission-009/swarm-unlock-v2-autopsy.md`
- Mission 010 post-run autopsy:
  - `ops/missions/mission-010/post-run-autopsy.md`
- current next hardening candidate:
  - `ops/missions/mission-011/spec.md`

## North star

Mission 012 is not about building a magical self-improving agent.

Mission 012 is about building a truthful development engine that:

- inspects the real machine
- drafts the next bounded improvement
- proves the change in a Golden Run
- writes the autopsy
- seeds the next run from evidence

## Non-negotiable rules

- Publish plane and runtime plane stay separate.
- Idle mode may inspect and draft, but it may not mutate runtime or auto-publish.
- One bounded improvement packet at a time.
- Every candidate must carry:
  - objective
  - scope
  - exclusions
  - eval plan
  - success bar
  - rollback note
- Every completed run must emit:
  - proof
  - autopsy
  - next-loop recommendation
- Mission 011 becomes the first seeded candidate, not an orphaned side mission.

## Required deliverables

1. Agent RSI entrypoint contract

Define the minimum user flow and state model for the existing Agent RSI foyer tile:

- standby
- ready
- review pending
- active Golden Run
- sealed / next candidate ready

2. RSI engine contract

Define the minimum engine components:

- signal harvester
- candidate scorer
- packet generator
- Golden Run registry
- proof gate
- autopsy/output rail

3. Golden Flow mapping

Make explicit how the RSI engine travels through:

1. idea drop
2. shaping
3. DEV staging
4. seat/team ownership
5. preflight
6. live execution
7. proof
8. publish
9. closeout

10. Idle mode policy

Define exactly what idle mode may and may not do.

5. Seeded candidate set

Admit at least one real queued next-run candidate derived from evidence.

Required first seed:

- Mission 011 canonical card rollout hardening

6. Publish-ready closeout

File the Mission 012 closeout with:

- engine spec
- operator flow
- seeded candidate queue
- acceptance bar
- residual risks

## Golden Run shape

### Phase 1 - Entrypoint definition

- define Agent RSI as the operator doorway into the improvement engine
- no implementation fiction
- no hidden background runtime claims

### Phase 2 - Engine contract

- define the minimum RSI engine objects and transitions
- keep them governed, evidence-backed, and bounded

### Phase 3 - Golden Flow binding

- bind the engine to the existing Golden Flow
- prove it uses the same run ladder rather than inventing a second lifecycle

### Phase 4 - Idle-mode boundary

- define allowed idle behaviors
- define forbidden idle behaviors
- make uncertainty a visible stop condition

### Phase 5 - Seeded next-run queue

- admit Mission 011 as the first queued proving candidate
- define how future candidates are scored and promoted

### Phase 6 - Closeout

- prove the engine is concrete enough to run the next mission
- file the autopsy and next-action packet

## Acceptance criteria

1. A real operator can point to Agent RSI as the product entrypoint for the improvement engine.
2. The engine has a bounded, implementation-real contract:
   - observe
   - score
   - diagnose
   - draft
   - run
   - autopsy
   - ground
3. Mission 011 is explicitly visible as the first seeded next-run candidate.
4. The strategy keeps publish/runtime separation hard and visible.
5. Idle mode is bounded to inspect/draft/queue behavior only.
6. The packet is concrete enough to implement next without inventing major missing pieces.

## Fail-fast blockers

1. Agent RSI becomes a second runtime authority.
2. Idle mode is allowed to auto-publish or mutate runtime.
3. Mission 012 duplicates earlier RSI doctrine instead of synthesizing it.
4. The engine does not produce a concrete seeded next-run queue.
5. The entrypoint remains a label with no operator-usable contract.
