# MULTI_TEAM_COCKPIT_KINSHIP_REVIEW_BRIEF

## Mission title

`Promote the team-aware loop to a multi-team cockpit and Kinship policy registry, and enhance President review with rationale and history`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Promote the admitted Workforce Salon loop from a bounded Alpha-era orchestration seam into a first-class multi-team cockpit that:

1. serves team-specific cockpit views and APIs without requiring fake Alpha ownership
2. binds Salon governance to a dynamic, team-scoped Kinship policy registry
3. captures richer President review rationale and immutable review history for Salon back-briefs
4. preserves compatibility through the existing Alpha alias while making the new team-aware path the source of truth

## Scope delivered

### 1. Workforce cockpit APIs are now first-class multi-team surfaces

The Workforce cockpit routes now admit both:

- the compatibility alias under `/api/mission-control/workforce/alpha/*`
- the promoted team-aware form under `/api/mission-control/workforce/:teamKey/*`

The delivered promotion covers:

- cockpit payload and snapshot reads
- stream subscriptions
- Job Card creation, delegation, fan-out, Salon launch, and status transitions
- proof review and Salon back-brief review
- team assembly and team locking
- execution, inspector, model, and Kinship policy endpoints

Generic `:teamKey` routes now validate that the accessed Job Card and president context belong to the selected cockpit team.

### 2. The Kinship registry is now team-scoped instead of Alpha-anchored

Workforce Kinship policy no longer depends on the old `workforce-alpha-default` or `workforce_alpha` anchoring.

The delivered registry behavior includes:

- `workforce_team:<teamId>` scope normalization
- `workforce-team-<teamId>-default` policy-set naming
- dynamic team bindings in `teamRegistry.bindings`
- team-scoped policy summaries in `mission-control.workforce.kinship-policy.v2`
- team-aware transport policy shaping in the dispatch bridge and inspector payloads

Policy patching now preserves the current scoped team binding when no explicit policy set is requested, preventing accidental fallback to a generated default set during live updates.

### 3. President review now captures rationale and immutable history

Salon back-brief review is no longer just a bounded decision toggle.

The delivered review enrichment includes:

- review comment capture
- contextual review tags
- explicit review action items
- append-only `reviewHistory` on each back-brief
- Job Card runtime mirrors for latest review comment, tags, action items, and latest history entry
- review-board counts derived from the full back-brief history set

This provides durable executive readback for acknowledgment, proceed, revise, and escalate decisions.

### 4. The cockpit UI is team-aware and exposes richer review readback

The workforce cockpit UI now:

- resolves its team context from `/mission-control/workforce/:teamKey`
- offers team switching while keeping the Alpha alias available
- shows dynamic team and president labels across the command canopy, roster, and Job Card surfaces
- exposes rationale, tags, and action items when reviewing a Salon back-brief
- renders recent back-brief review history for operator and executive auditability

### 5. Targeted proof now covers multi-team routing and scoped policy mutation

The admitted proof lane now demonstrates:

1. a President can submit rationale-rich review decisions for a Salon back-brief
2. those decisions persist into runtime state and history payloads
3. a non-Alpha team route can create, delegate, and run the same cockpit path truthfully
4. Kinship policy mutation remains scoped to the selected team policy set

## Implemented interfaces

### OpenClaw mission packet surface

- `ops/missions/agent-workforce/MULTI_TEAM_COCKPIT_KINSHIP_REVIEW_BRIEF.md`
- `ops/missions/agent-workforce/MULTI_TEAM_COCKPIT_KINSHIP_REVIEW_SOURCE_MAP.md`

### Dashboard backend surfaces

- `server/src/index.js`
- `server/src/workforceJobDispatch.js`
- `server/src/workforceKinshipPolicy.js`
- `server/src/workforceSalonMemoryLoop.js`

### Dashboard frontend surfaces

- `web/src/pages/MissionControlWorkforceAlphaPage.jsx`
- `web/src/ui/App.jsx`

### Dashboard validation surfaces

- `scripts/tests/hivemind_salon_version_next_api.test.mjs`
- `scripts/tests/workforce_job_dispatch_api.test.mjs`
- `scripts/tests/workforce_kinship_policy.test.mjs`

## Acceptance criteria for this lane

This lane is accepted when:

1. the workforce cockpit is reachable through a team-aware route that truthfully reflects the selected team context
2. team-aware cockpit routes reject mismatched Job Card or president access outside the selected team
3. Kinship policy summaries and patching are resolved through team-scoped policy bindings
4. President review persists rationale, tags, action items, and immutable history on Salon back-briefs
5. targeted tests prove multi-team routing, scoped policy mutation, and review-history persistence

## Validation proof

Implementation proof is expected against:

- targeted Workforce Salon API coverage for rationale-rich review and generic team routes
- targeted Kinship policy coverage for scoped team patching
- dashboard regression coverage for live stream and execution read models
- sibling Sprytly lint and build validation
- clean post-push working-tree verification in both repos

## Risks carried forward

### Immediate blockers

None.

### Accepted follow-on risks

- the cockpit page component and some internal variable names still carry Alpha-era names even though the runtime route and payload model are now multi-team
- Kinship policy is team-scoped, but it is still a workforce-local registry rather than a broader multi-workspace governance fabric
- review history is append-only and durable, but it is still a bounded audit trail rather than a threaded approval workflow with reassignment and signed rationale checkpoints
- the multi-team cockpit remains a shared operational surface; deeper per-team workspace separation is still a follow-on lane

## Recommended next lane

`Initiate a mission for a full multi-workspace mission registry and richer executive review flows such as threaded rationale, reassignment, and approval audit checkpoints.`
