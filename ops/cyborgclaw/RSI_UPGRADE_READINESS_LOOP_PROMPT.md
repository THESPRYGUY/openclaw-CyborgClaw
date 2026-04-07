# RSI Upgrade Readiness Loop Prompt

Use this prompt when the goal is to move CyborgClaw toward **upgrade-ready
state** for a bounded OpenClaw release such as `2026.4.5`.

This prompt is designed for a **long-form, slow and steady remediation loop**
run by:

- mission lead / operator synthesis
- real `codex`
- real `voltaris-v2`

The loop continues until the three-way closeout vote reaches consensus on the
current state of readiness.

## Prompt

```text
You are running RSI Loop v1 for OpenClaw upgrade readiness.

Participants:
- mission lead
- real codex
- real voltaris-v2

Primary goal:
Move CyborgClaw toward upgrade-ready state for OpenClaw <TARGET_VERSION> without
performing the live upgrade unless and until all three participants reach a
clear consensus.

Current blocked-upgrade context:
- Mission 014 ended in unanimous NO-GO
- Known blockers:
  1. uneven memory estate
  2. missing transcripts in the main session store
  3. voltaris exec-policy mismatch

Operating rules:
1. This is an upgrade-readiness loop, not an upgrade-execution loop.
2. Work one bounded blocker seam at a time.
3. Do not widen into general cleanup, new features, or cosmetic work.
4. Do not mutate runtime, upgrade OpenClaw, or promote readiness claims without proof.
5. Prefer explicit receipts, health checks, and operator-visible truth over intuition.
6. If a blocker cannot be safely fixed, contain it or document an explicit waiver path.
7. End every loop with a three-way closeout vote:
   - mission lead
   - real codex
   - real voltaris-v2
8. After each loop, recommend exactly one next blocker only.

Critical memory scope:
- Treat these as critical-path memory surfaces:
  - Codex continuity
  - Voltaris V2 continuity
  - Memory HQ / shared memory compatibility
- Treat legacy or minimal agent memory as secondary unless it can be shown to:
  - block startup
  - poison operator truth
  - break replay-safe promotion
  - create upgrade-lane risk

Required loop steps:
1. Restate the single blocker being worked.
2. Verify current evidence and baseline relevant to that blocker.
3. Classify the blocker:
   - fix now
   - contain now
   - waive explicitly
   - defer with rationale
4. Make the smallest safe remediation or containment change.
5. Re-run the relevant checks.
6. Report the new state with residual risk.
7. Conduct the three-way vote.
8. Name exactly one next blocker.

Required output format:

1. BLOCKER
- <single blocker under test>

2. BASELINE
- <facts observed before remediation>

3. ACTION
- <smallest safe change or containment applied>

4. PROOF
- <checks run and what they showed>

5. MEMORY_SCOPE
- <whether this touched Codex / Voltaris V2 / Memory HQ or only lower-priority legacy memory>

6. RESIDUAL_RISK
- <what still remains uneven or unproven>

7. THREE_WAY_VOTE
- mission lead: <GO / NO-GO / HOLD>
- codex: <GO / NO-GO / HOLD>
- voltaris-v2: <GO / NO-GO / HOLD>

8. NEXT_BLOCKER
- <exactly one next blocker>

Stop condition:
- Stop the current loop after the vote.
- Do not start the next blocker until the vote is recorded.

Special upgrade rule:
- Even if a blocker is cleared, do not perform the OpenClaw upgrade unless the
  three-way vote is explicitly unanimous GO for the live update.
```

## Mission-lead note

Use this prompt as the reusable chassis.

Inject the dynamic details per loop:

- target version
- exact blocker
- exact checks
- exact waiver conditions
- exact rollback note if a change is made

## Memory HQ interpretation

For the current CyborgClaw phase, the operator interpretation is sound:

- yes, the important memory concern is mostly **compatibility with the shared
  memory surfaces we actually rely on operationally**
- especially:
  - `codex`
  - `voltaris-v2`
  - Memory HQ / builtin memory search behavior

It is **not** necessary to make every legacy or early minimal agent memory
perfect before calling the system upgrade-ready.

What _is_ necessary is ensuring those lower-priority memory paths do not:

- crash startup
- corrupt global memory behavior
- create false operator truth
- interfere with critical-path continuity or dreaming-era promotion behavior

So the right rule is:

- critical-path memory must be healthy
- non-critical memory must at least fail safely
