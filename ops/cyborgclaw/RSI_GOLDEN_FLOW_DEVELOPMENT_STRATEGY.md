# CYBORGCLAW RSI Golden Flow Development Strategy

Status: proposed  
Collaborators:

- actual `codex`
- actual `voltaris-v2`
- operator synthesis by Codex CLI

Depends on:

- `ops/missions/mission-005/spec.md`
- `ops/missions/mission-006/spec.md`
- `ops/missions/mission-007/WIREFRAME_FLOW.md`
- `ops/missions/mission-009/swarm-unlock-v2-autopsy.md`
- `ops/missions/mission-010/post-run-autopsy.md`
- `ops/missions/mission-011/spec.md`
- `ops/cyborgclaw/CANONICAL_AGENT_TILE_VNEXT_SPEC.md`
- `ops/stud/STUD_RSI_LOOP_0_MISSION_PACKET_2026-04-05.md`

## 1. Strategy thesis

CyborgClaw should not treat recursive self-improvement as a vague background instinct.

It should treat RSI as a governed development engine that:

- harvests evidence from real Golden Runs
- converts repeated failures into bounded improvement packets
- executes one improvement mission at a time through the same Golden Flow
- closes each run with proofs, autopsy, and a grounded MVP read

The point is not "self-modifying AI."

The point is:

- inspect the real machine
- identify the smallest true bottleneck
- fix it without lying to operators
- prove the fix in the next Golden Run
- get better by doing the work, not by talking about it

This document is a synthesis layer, not a replacement doctrine.

Use:

- `ops/missions/mission-005/spec.md` for the default RSI operating model
- `ops/missions/mission-006/spec.md` for the 10-loop hardening doctrine
- `ops/stud/STUD_RSI_LOOP_0_MISSION_PACKET_2026-04-05.md` for STUD-specific authority and loop boundaries

Use this strategy doc to explain how those doctrines come together inside the Golden Flow to drive CyborgClaw MVP delivery.

## 2. Shared convergence from codex and voltaris-v2

### Real `codex` position

- CyborgClaw should become an operator-governed RSI engine, not just an agent shell.
- Every improvement must remain a governed artifact with explicit proof.
- The engine must optimize for truthful execution gain:
  - better throughput
  - clearer telemetry
  - tighter governance
  - no hidden authority expansion

### Real `voltaris-v2` position

- Golden Runs should become the hard truth surface for quality, regressions, and improvement priority.
- The engine should observe, score, diagnose, draft change, eval, publish, and adopt.
- Idle mode should prepare draft improvements, but never silently mutate runtime or auto-publish.

### Combined conclusion

The RSI engine is valid if it behaves like:

- a disciplined operating system for improvement

and not like:

- a free-roaming self-editing swarm

## 3. The core RSI loop

Every improvement run should follow this loop:

1. **Observe**

- inspect live telemetry, proofs, failures, stale seams, and operator friction

2. **Score**

- rank candidate problems by:
  - operator pain
  - regression risk
  - mission blockage
  - ease of bounded proof

3. **Diagnose**

- classify the failure:
  - execution
  - telemetry
  - UX
  - contract
  - governance
  - performance

4. **Draft**

- produce one bounded improvement packet with:
  - objective
  - mutation scope
  - exclusions
  - eval plan
  - success bar
  - rollback note

5. **Golden Run**

- drive the packet through the Golden Flow as a real mission
- require proofs and closeout

6. **Autopsy**

- compare expected vs observed
- explain what improved, what still failed, and what became the next bottleneck

7. **Ground**

- update backlog and MVP confidence from evidence, not vibes

## 4. Golden Flow mapping

The Golden Flow is the delivery chassis for the RSI engine.

### 1. Idea drop

RSI role:

- capture the next bounded improvement candidate
- link it to real evidence:
  - failing run
  - stale seam
  - operator pain
  - regression signal

Output:

- improvement idea + lifecycle receipt

### 2. Shaping / salon

RSI role:

- stress-test the improvement packet before code exists
- confirm:
  - the seam is real
  - the scope is bounded
  - the acceptance bar is worth the cost

Output:

- validated improvement packet + shaping evidence

### 3. PRD + DEV staging

RSI role:

- turn the improvement into a governed development object
- define:
  - exact files/seams
  - tests
  - evals
  - publish/rollback notes

Output:

- PRD
- dev pack
- queue receipt
- execution authorization

### 4. Agent seat forge

RSI role:

- define which seats need to act
- update seat responsibilities only if necessary and explicitly

Output:

- admitted seat responsibilities
- no hidden seat widening

### 5. Strike team hangar

RSI role:

- compose the smallest team that can solve the improvement
- keep ownership crisp and overlap low

Output:

- one bounded team bundle

### 6. STUD preflight

RSI role:

- verify:
  - safe scope
  - comms
  - receipts
  - rollback path
  - proof path

Output:

- PASS / WARN / BLOCK boot receipt

### 7. Live mission execution

RSI role:

- execute the real change
- inspect, debug, fix, optimize
- keep telemetry and mission-room truth aligned

Output:

- seat activity
- code changes
- evidence
- transport receipts

### 8. Proof / review / receipts

RSI role:

- verify the change actually improved the system
- reject changes that merely moved confusion around

Output:

- accepted or rejected proofs
- review comments
- residual risk notes

### 9. Development publishing

RSI role:

- publish only changes that passed the proof bar
- keep publish separate from runtime live state

Output:

- publish receipt
- review decision
- release note or hold note

### 10. Closeout

RSI role:

- write the autopsy
- update the improvement backlog
- ground the MVP read from evidence
- seed the next loop

Output:

- closeout packet
- next improvement candidate

## 5. Idle-mode policy

This engine **can** run when the system is idle, but only in the right mode.

### Allowed in idle mode

- inspect code and runtime artifacts
- score repeated failures
- cluster stale seams
- draft bounded improvement packets
- queue Golden Run candidates
- prepare evals and rollback notes

### Forbidden in idle mode

- auto-merge code
- auto-publish artifacts
- mutate runtime behavior
- widen seat/team authority
- silently change config
- claim a fix is real without a proving run

### Rule of thumb

Idle mode may think, inspect, and prepare.

It may not decide reality on its own.

## 6. V1 RSI engine shape

The first version of the engine should be deliberately simple.

### Engine parts

1. **Golden Run registry**

- list of current proving runs
- owners
- status
- score history
- closeout result

2. **Signal harvester**

- failures
- stale telemetry
- regression results
- autopsy findings
- operator complaints

3. **Improvement scorer**

- ranks candidate seams by:
  - user pain
  - mission blockage
  - repeat frequency
  - proofability

4. **Packet generator**

- turns top-ranked seams into bounded improvement missions

5. **Proof gate**

- compares expected result vs observed result

6. **Autopsy writer**

- records:
  - what happened
  - what improved
  - what still hurts
  - what becomes next

7. **Grounding updater**

- updates the MVP ticker only from evidence-backed mission outcomes

## 7. First proving sequence

The engine should be built using the same strategy it advocates.

### Mission 011

Purpose:

- prove the canonical agent card can be rolled out across real operator surfaces without drift

Why it matters to RSI:

- this improves the operator truth layer that the RSI engine depends on

### Next RSI engine proving mission

After Mission 011:

- build the Golden Run registry + candidate backlog + autopsy linkage as one bounded improvement mission

That mission should prove:

- repeated failures become queued improvement candidates
- queued candidates can be promoted into bounded Golden Runs
- closeout can automatically seed the next candidate without auto-publishing anything

## 8. Guardrails

The RSI engine must preserve these rules:

- publish plane and runtime plane stay separate
- no hidden autonomy escalation
- no self-widening scope
- no fake freshness
- no implied authority from subagents or child-work
- no operator-facing success claim without visible evidence
- no MVP ticker movement without proof-backed closeout

## 9. Acceptance bar

This strategy is real only if CyborgClaw can do all of the following:

1. detect a real bottleneck from evidence
2. convert it into one bounded improvement packet
3. run that packet through the full Golden Flow
4. accept or reject it from proof
5. write the autopsy
6. seed the next improvement run automatically as a draft
7. update operator grounding from evidence only

## 10. Bottom line

The development strategy to bring CyborgClaw home is:

- run bounded Golden Runs continuously
- use every sealed run as both:
  - a hardening test
  - an improvement loop
- let idle time produce better packets, not silent changes
- let live runs prove the changes
- keep getting better by doing the work on the real machine

That is the RSI engine.
