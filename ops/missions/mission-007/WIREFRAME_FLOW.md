# Mission 007 — Golden Run Wireframe Flow

This is a low-fidelity operator wireframe for the full Mission 007 canary path.

It is meant to answer:

- where the run starts
- what room owns each stage
- where STUD gates the mission
- where proofs, receipts, and closeout must land
- where each recursive improvement loop inspects the machine

## 1. Full-flow wireframe

```text
+--------------------------------------------------------------------------------------+
|                               MISSION 007 GOLDEN RUN                                 |
+--------------------------------------------------------------------------------------+

  [1] IDEA DROP
      Room: /ideas-incubator
      Truth: captured idea, owner, shaping posture, next move
      Output: idea record + lifecycle receipt
           |
           v
  [2] SHAPING / SALON
      Room: /ideas-incubator + /flow
      Truth: shaping discussion vs planning truth
      Output: validated idea + shaping evidence
           |
           v
  [3] PRD + DEV STAGING
      Room: /development
      Truth: draft -> in_hivemind -> prd_ready -> dev_pack_ready -> queued
      Output: PRD artifact, dev pack, queue receipt, execution authorization
           |
           v
  [4] AGENT SEAT FORGE
      Room: /agent-studio
      Truth: one bounded specialist seat
      Output: seat draft -> validate -> compile -> publish bundle
           |
           v
  [5] STRIKE TEAM HANGAR
      Room: /strike-team-studio
      Truth: commander, core seats, bench seats, team blockers, coverage gaps
      Output: published team bundle
           |
           v
  [6] STUD PREFLIGHT
      Room: /workforce/alpha
      Gate: PASS / WARN / BLOCK
      Checks: roster, kinship, comms, capability, paperwork path
      Output: boot receipt
           |
           v
  [7] LIVE MISSION EXECUTION
      Room: /workforce/alpha
      Truth: live vs stale seats, current task, dispatch posture, review state
      Output: dispatch ledger, seat activity, mission evidence
           |
           v
  [8] PROOF / REVIEW / RECEIPTS
      Room: /truth + workforce mission docs rail
      Truth: evidence intake, proof review, live receipts, closeout readiness
      Output: proof bundle, review decisions, artifact intake receipts
           |
           v
  [9] DEVELOPMENT PUBLISHING
      Room: /build + release-adjacent truth rails
      Truth: needs_review / approved / final / archived
      Output: development publish receipts
           |
           v
  [10] CLOSEOUT
       Room: /workforce/alpha + mission paperwork rails
       Truth: mission report, contribution summaries, proof index, archive posture
       Output: final closeout packet
```

## 2. Recursive improvement overlay

```text
                             +----------------------+
                             |  LOOP N PRE-FLIGHT   |
                             |  PASS / WARN / BLOCK |
                             +----------+-----------+
                                        |
                                        v
                             +----------------------+
                             |   LIVE TEST TARGET   |
                             |  one bounded seam    |
                             +----------+-----------+
                                        |
                                        v
                             +----------------------+
                             |  EVIDENCE CAPTURE    |
                             | what happened vs     |
                             | what should happen   |
                             +----------+-----------+
                                        |
                                        v
                             +----------------------+
                             | SMALLEST SAFE FIX    |
                             | no broad refactors   |
                             +----------+-----------+
                                        |
                                        v
                             +----------------------+
                             |      RETEST          |
                             | exact scenario +     |
                             | direct regression    |
                             +----------+-----------+
                                        |
                                        v
                             +----------------------+
                             |   RSI REFLECTION     |
                             | default / remove /   |
                             | elevate to doctrine  |
                             +----------+-----------+
                                        |
                                        v
                             +----------------------+
                             |     PAPERWORK        |
                             | receipt + residual   |
                             | risk + handoff       |
                             +----------------------+
```

## 3. The 10 loops mapped onto the flow

```text
Loop 1   -> Idea drop truth
Loop 2   -> Shaping / salon truth
Loop 3   -> PRD + DEV staging truth
Loop 4   -> Agent seat forge truth
Loop 5   -> Strike-team hangar truth
Loop 6   -> STUD boot truth
Loop 7   -> Live mission execution truth
Loop 8   -> Proof / paperwork / receipts truth
Loop 9   -> Development publishing + closeout truth
Loop 10  -> Full end-to-end golden run
```

## 4. Operator-first screen wireframe

```text
+--------------------------------------------------------------------------------------+
| GOLDEN RUN HEADER                                                                    |
| Full-flow golden run | Current phase | Hero object | Next action | Publish != live  |
+--------------------------------------------------------------------------------------+

+----------------------------------+  +-----------------------------------------------+
| LEFT: STAGE SPINE                |  | RIGHT: HERO OBJECT                            |
|                                  |  |                                               |
|  Idea drop                       |  |  Object title                                 |
|  Shaping / salon                 |  |  Current stage                                |
|  DEV staging                     |  |  What changed                                 |
|  Agent seat forge                |  |  What blocks it                               |
|  Strike-team hangar              |  |  One next action                              |
|  STUD preflight                  |  |                                               |
|  Mission execution               |  |  Primary CTA                                  |
|  Proof / receipts                |  |  Secondary CTA                                |
|  Development publishing          |  |                                               |
|  Closeout                        |  |  Links to owning room                         |
+----------------------------------+  +-----------------------------------------------+

+--------------------------------------------------------------------------------------+
| LOWER RAIL                                                                          |
| Receipts live? | Ledger live? | Closeout pending? | Runtime accepted? | Effective? |
+--------------------------------------------------------------------------------------+
```

## 5. PASS / WARN / BLOCK interpretation

```text
PASS
- stage truth is complete enough to move forward
- receipts exist where required
- next action is explicit

WARN
- the operator may continue only with explicit awareness
- truth is partial, stale, or degraded but not unsafe
- receipts or readiness are incomplete but not blocking

BLOCK
- do not advance
- stage truth is false, missing, or unsafe
- runtime / publish boundary is unclear
- required receipt path is missing
```

## 6. MVP read of the diagram

If this wireframe is healthy, one operator should be able to say:

1. "I know exactly what stage the run is in."
2. "I know which room owns the next move."
3. "I know whether this is draft, published, runtime-accepted, or effective."
4. "I know where the receipts are."
5. "I know whether STUD says go, warn, or block."

If the operator cannot say all five quickly, the golden run is not yet MVP-clean.
