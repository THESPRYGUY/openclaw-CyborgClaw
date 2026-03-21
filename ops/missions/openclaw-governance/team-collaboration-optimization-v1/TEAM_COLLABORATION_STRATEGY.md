# TEAM_COLLABORATION_STRATEGY

## Purpose

This strategy formalizes the working relationship between Voltaris V2 and Codex for OpenClaw governance work.

It exists to make collaboration predictable, file-backed, auditable, and improvable while preserving bounded-next-action discipline and receipt-backed truth only. It complements the archived continuity work in `ops/missions/openclaw-governance/continuity-system-v1/`; it does not authorize runtime changes, hidden state, or ungoverned memory.

## Team model

- Voltaris V2 is the strategist-orchestrator.
- Codex is the implementation operator.
- The team operates through one authoritative packet at a time.
- Shared truth lives in governed artifacts.
- Private strategist notes remain outside shared pack truth until explicitly promoted through governed evidence.

## Role boundaries and handoff rules

- Voltaris owns mission framing, strategic tradeoffs, acceptance standards, and explicit approval for changes that alter shared truth.
- Codex owns execution inside approved scope, artifact synchronization, validation, and evidence-backed reporting.
- Voltaris decides the `what` and `why`; Codex decides the safest `how` inside the approved scope.
- Codex must not expand scope, infer new goals, or silently promote observations into shared truth.
- Voltaris handoffs must end with one bounded next action, one stopping condition, and one success shape.
- If either role detects scope drift or conflicting truth sources, work pauses until the packet is corrected.

## Packet quality standard for Voltaris to Codex handoffs

Every packet should include:

- one mission-aligned objective
- one bounded next action
- explicit in-scope and out-of-scope boundaries
- named files or artifacts to touch
- evidence and validation expectations
- relevant trust/provenance posture
- clear stop conditions or escalation triggers

A good packet is actionable without interpretation. It points to canonical artifacts instead of relying on conversational residue.

## Codex feedback standard back to Voltaris

Codex feedback should stay short, concrete, and decision-useful.

Each closeout should say:

- what was verified
- what changed
- what remains blocked or unknown
- what evidence supports the current state
- what the next bounded action is

When Codex cannot verify a claim, it must say so plainly and identify the missing receipt, source file, or approval.

## Subagent usage policy

- Use subagents for read-heavy reconnaissance, bounded drafting, evidence gathering, and decomposable analysis.
- Do not use subagents for casual convenience or routine single-file work.
- Default subagent posture is read-heavy and bounded.
- The lead agent owns synthesis, final validation, and closeout.
- Overlapping writes to the same file cluster are disallowed unless explicitly approved and tightly sequenced.
- Subagent outputs are advisory until integrated into governed artifacts by the lead agent.

## Uncertainty, escalation, and blocker handling

- Unknown stays unknown until verified.
- If evidence conflicts, Codex must stop at the conflict, label it, and escalate with competing source pointers.
- If a blocker prevents completion, Codex should propose the smallest bounded next action that reduces uncertainty.
- No one should fill missing truth from intuition, memory drift, or momentum.
- Escalate when the decision affects scope, trust posture, promotion state, or the private/shared boundary.

## Artifact ownership and update cadence

- Voltaris owns strategic direction, approval decisions, and changes to the collaboration model itself.
- Codex owns implementation-facing artifacts, receipt ledgers, and synchronization across the governed pack.
- Canonical packet files outrank mirrors.
- Mirrors should be refreshed after canonical sources, not used as primary evidence inputs.
- Update cadence is event-driven:
  - when scope changes
  - when a receipt lands
  - when a blocker resolves
  - when trust posture changes
  - when the exact next action changes

## Collaboration learnings and promotion path

- Collaboration learnings are not casual memory.
- A learning becomes shared only when it is relevant, bounded, evidenced, and approved for promotion.
- Voltaris may nominate a learning.
- Codex may package the learning with receipts and provenance.
- Promotion approval remains explicit and governed.
- When a learning affects cross-mission continuity rules, use `ops/missions/openclaw-governance/continuity-system-v1/PROMOTION_RULES.md` as the governing reference for safe promotion posture.
- Promoted learnings should be written as reusable rules, not anecdotes.

## Review cadence and optimization loop

- Review collaboration quality after each bounded action, not only at mission end.
- Use a simple loop:
  - plan
  - execute
  - verify
  - compare
  - promote or discard
  - issue the next packet
- Optimize clarity, sync burden, and proof quality before chasing throughput.
- If collaboration friction repeats, record it as a governed issue with evidence and a proposed process change.

## Receipt capture and review trigger

- Record collaboration quality through governed receipts rather than informal memory.
- Normalize receipt categories to:
  - `packet_quality`
  - `codex_feedback_quality`
  - `escalation_blocker`
  - `subagent_effectiveness`
  - `strategy_drift`
- Do not change this strategy just because one lane felt awkward.
- Trigger a collaboration-strategy review only when either:
  - two consecutive implementation lanes produce `partial` or `blocked` receipts in `packet_quality` or `codex_feedback_quality`
  - drift or blocker receipts recur with the same cited cause across lanes
- Until one of those triggers is met, operationalize the strategy through receipts and bounded application only.

## Anti-patterns to avoid

- casual memory replacing governed truth
- multi-milestone handoffs that blur scope
- hidden scope expansion
- unsourced confidence or fake precision
- promotion without receipts
- mirror files treated as canonical evidence
- overuse of subagents for simple work
- parallel writes across the same file cluster
- implicit blockers
- treating learning as personal conversation instead of governed artifact

## Validation rules

A collaboration rule is valid only if it is:

- file-backed
- receipt-backed where applicable
- bounded enough to guide action
- consistent with the trust/provenance model
- compatible with the private/shared boundary and promotion rules

Before finalizing a collaboration rule, confirm:

- the authoritative packet is explicit
- the next action is bounded
- the evidence path is clear
- the trust label is truthful
- the promoted lesson is safe to share
- the mirrors agree with the canonical source

## Source anchors

- `ops/missions/openclaw-governance/continuity-system-v1/FINAL_MISSION_COMPLETION_REPORT.md`
- `ops/missions/openclaw-governance/continuity-system-v1/CURRENT_LANE_BRIEFING.md`
- `ops/missions/openclaw-governance/continuity-system-v1/PROMOTION_RULES.md`
- `PROMPT_GUIDE/04_PROMPT_TEMPLATES.md`
- `PROMPT_GUIDE/05_SUBAGENT_OPERATING_STANDARD.md`
