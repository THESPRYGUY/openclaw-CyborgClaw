# Mission 005 — RSI Default Canary

Goal:
Prove that CyborgClaw can run RSI by default as a governed improvement loop for Strike Team Alpha without creating runtime drift or second-authority behavior.

## Primary target

- Team: `Strike Team Alpha`
- Primary seat under refinement: `dir-devex-qa-01` — `DIR DevEx & QA Reliability`
- Secondary observation seat: `dir-application-eng-01` — `DIR Application Engineering`

## Why this seat goes first

`DIR DevEx & QA Reliability` is the safest and fastest proving ground for RSI because it can improve proof quality, failure triage, regression detection, and publish-gate confidence without silently widening product or runtime authority.

This keeps the first canary focused on:

- eval quality
- proof quality
- specialist boundary sharpness
- team publish confidence

## Mission objective

Run a controlled canary where RSI is on by default for the target seat and team bundle, then prove that RSI can:

1. detect a real improvement opportunity
2. propose bounded draft changes
3. improve seat or team quality through eval-first recommendations
4. preserve publish/runtime separation

## RSI default operating model under test

RSI must operate in the following sequence:

1. Observe
2. Detect
3. Recommend
4. Validate
5. Promote

### Step 1 — Observe

RSI inspects the latest published seat and team artifacts.

Inputs:

- published seat blueprint for `dir-devex-qa-01`
- latest published Strike Team Alpha team bundle
- current seat proof gates
- current team promotion blockers

### Step 2 — Detect

RSI looks for:

- specialization drift
- weak non-goals
- missing or weak eval coverage
- weak failure-triage posture
- weak publish-gate posture
- team-level coverage gaps exposed by the target seat

### Step 3 — Recommend

RSI must produce draft-only recommendations:

- one seat-level refinement draft for `dir-devex-qa-01`
- one team-level recommendation affecting the current Strike Team Alpha bundle

Allowed recommendation shapes:

- sharper specialty language
- tighter non-goals
- stronger eval or adversarial checks
- better proof/publish requirements
- clearer team handoff or collaboration edges

Forbidden recommendation shapes:

- direct runtime mutation
- silent model/tool widening
- silent bench-to-core promotion
- seat authority growth beyond declared specialty

### Step 4 — Validate

Every RSI recommendation must pass eval-first review before publish.

Required validation outputs:

- draft diff summary
- eval readiness check
- proof-gate delta
- explicit operator review note

### Step 5 — Promote

Promotion is allowed only through explicit operator-controlled Studio publish/adopt flow.

RSI must never:

- publish directly to runtime
- mark changes live
- bypass STUD, Studio, or downstream runtime acceptance

## Deliverables

### Deliverable 001 — Seat refinement draft

Create one bounded improvement draft for `dir-devex-qa-01`.

The draft must improve at least two of:

- failure triage clarity
- regression detection posture
- eval coverage
- proof/publish gate quality
- non-goal clarity

### Deliverable 002 — Team recommendation draft

Create one Strike Team Alpha recommendation derived from the seat review.

Examples:

- sharper assignment of proof responsibility
- clearer core-to-bench boundary around diagnostics or reliability work
- tighter handoff from application engineering into reliability review

### Deliverable 003 — Receipts bundle

Capture:

- seat draft summary
- team recommendation summary
- eval/proof review note
- publish outcome
- STUD consumption readiness note

## Success criteria

1. RSI produces one useful seat refinement draft for `dir-devex-qa-01`.
2. RSI produces one useful team-level recommendation for Strike Team Alpha.
3. Operator can review both changes clearly in the studios.
4. At least one publishable artifact set improves without any runtime-authority confusion.
5. No seat silently expands beyond its specialist boundary.
6. STUD can read the updated published bundle as a governed input rather than ad hoc config.

## Stop conditions

Stop the canary immediately if any of the following occur:

- RSI attempts live or implied runtime mutation
- seat specialty widens without explicit operator acknowledgment
- proof/eval gates are missing or weakened
- team recommendation blurs seat authoring with team composition
- publish and runtime state become visually ambiguous

## Operator checklist

1. Confirm latest seat and team artifacts are published and visible.
2. Open Agent Design Studio on `dir-devex-qa-01`.
3. Open Strike Team Design Studio on the latest Strike Team Alpha bundle.
4. Run RSI review for the target seat.
5. Review the seat draft and the team recommendation draft.
6. Validate both drafts.
7. Publish only if guardrails remain intact.
8. Run STUD preflight against the updated team bundle.
9. Record receipts and close out the canary.

## Mission-ready definition

Mission 005 is ready to launch when:

- the target seat is identifiable and stable
- latest published team bundle is available
- RSI is constrained to draft-only output
- publish/runtime separation is visually and behaviorally intact
- operator has a clear rollback path
