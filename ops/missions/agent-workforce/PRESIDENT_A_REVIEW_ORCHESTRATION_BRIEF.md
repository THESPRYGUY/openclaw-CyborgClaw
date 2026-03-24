# PRESIDENT_A_REVIEW_ORCHESTRATION_BRIEF

## Mission title

`Implement President-A review controls for Salon back-briefs and expand to broader cross-team orchestration`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Strengthen the closed-loop Workforce Salon lane so that:

1. the assigned president can explicitly review and acknowledge a Salon back-brief
2. that review state becomes durable Job Card truth and lifecycle evidence
3. the same Salon -> Memory HQ -> synthesis loop can operate for teams beyond the original Strike Team Alpha default
4. operators can see the review state and the active team context in the workforce cockpit

## Scope delivered

### 1. President review is now an explicit admitted control, not an implicit readback

The Workforce Job Card API now exposes a dedicated Salon back-brief review mutation:

- `PATCH /api/mission-control/workforce/alpha/job-cards/:jobId/salon-backbriefs/:briefId/review`

This route validates the acting reviewer, records the review decision, and emits a durable lifecycle receipt.

The admitted review decisions are:

- `acknowledge`
- `proceed`
- `revise`
- `escalate`

### 2. Review state now persists on the Job Card and the back-brief itself

President review now updates durable Job Card runtime truth instead of living only in operator interpretation.

The delivered persistence includes:

- per-back-brief `reviewStatus`
- per-back-brief `reviewDecision`
- per-back-brief `reviewDetail`
- per-back-brief `reviewedAt`
- per-back-brief `reviewerNodeId`
- Job Card mirrors such as `latestPresidentBackbriefReviewStatus`, `latestPresidentBackbriefReviewDecision`, and `latestPresidentBackbriefReviewedAt`

When review requests revision or escalation, the Job Card status is truthfully moved into a blocked state for follow-on action.

### 3. A review board is now exposed in the active Salon integration payload

The Job Card summary now carries a dedicated `salonReviewBoard` plus enriched `salonIntegration` mirrors.

This gives the cockpit a durable aggregate view of:

- pending review count
- acknowledged count
- proceed count
- revise count
- escalate count
- latest review decision and latest review timestamp

### 4. Cross-team orchestration now uses dynamic president and team context

The closed-loop Salon path no longer assumes every admitted run belongs to `President-A` and `Strike Team Alpha`.

The delivered generalization includes:

- dynamic president labels derived from the delegated president id
- dynamic default team ids and team names derived from the active president
- dynamic route-law and receipt namespaces for ACP transport
- dynamic Memory HQ import context and back-brief audience labeling
- dynamic cockpit copy for the assigned president and active team

This means the existing closed loop can now run truthfully for alternate locked teams such as a `President-B` lane without faking Alpha ownership.

### 5. The cockpit now exposes explicit review controls and dynamic team readback

The workforce cockpit now surfaces:

- the latest Salon back-brief recommendation
- the latest review status and decision
- review-board rollup counts
- explicit review actions for the active back-brief
- dynamic team and president labels throughout the command strip and Salon integration card

### 6. The orchestration proof now includes non-Alpha execution

Targeted API proof now demonstrates:

1. a president can review and acknowledge a generated Salon back-brief
2. that review persists into the Job Card runtime state and lifecycle signal
3. a non-Alpha president/team can launch the same loop with correct team naming and ACP namespace shaping

## Implemented interfaces

### OpenClaw mission packet surface

- `ops/missions/agent-workforce/PRESIDENT_A_REVIEW_ORCHESTRATION_BRIEF.md`
- `ops/missions/agent-workforce/PRESIDENT_A_REVIEW_ORCHESTRATION_SOURCE_MAP.md`

### Dashboard backend surfaces

- `server/src/index.js`
- `server/src/workforceJobDispatch.js`
- `server/src/workforceSalonMemoryLoop.js`
- `server/src/hivemindSalonVersionNext.js`

### Dashboard frontend surfaces

- `web/src/pages/MissionControlWorkforceAlphaPage.jsx`

### Dashboard validation surfaces

- `scripts/tests/hivemind_salon_version_next_api.test.mjs`
- `scripts/tests/workforce_job_dispatch.test.mjs`

## Acceptance criteria for this lane

This lane is accepted when:

1. the assigned president can explicitly review a Salon back-brief through a durable API action
2. review decisions persist into the Job Card runtime state and the latest Salon back-brief mirrors
3. review outcomes surface in the cockpit through a visible review-board summary
4. the closed-loop orchestration path uses the delegated president and team context rather than hardcoded Alpha ownership
5. targeted tests prove both the review mutation and at least one non-Alpha cross-team path

## Validation proof

Implementation proof is expected against:

- targeted Workforce Salon API coverage for review actions and cross-team runs
- dashboard unit and integration regression coverage
- sibling Sprytly lint and build validation
- clean post-push working-tree verification in both repos

## Risks carried forward

### Immediate blockers

None.

### Accepted follow-on risks

- the cockpit and API still live under the existing `/mission-control/workforce/alpha` route prefix even though the underlying orchestration state is now team-aware
- cross-team orchestration is generalized around delegated presidents and locked teams, not yet a full multi-workspace mission registry
- President review is explicit and durable, but it is still a bounded acknowledgment layer rather than a full approval workflow with threaded commentary and reassignment
- broader executive rollups across multiple teams are still a follow-on lane

## Recommended next lane

`Refine the generalized orchestration pattern into a first-class multi-team cockpit surface and add richer President review workflows such as threaded rationale, reassignment, and approval audit history.`
