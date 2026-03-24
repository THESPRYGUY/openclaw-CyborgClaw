# MULTI_TEAM_COCKPIT_KINSHIP_REVIEW_SOURCE_MAP

## Purpose

Record the exact source artifacts used to promote the Workforce Salon loop into a first-class multi-team cockpit, bind it to a dynamic Kinship registry, and enrich President review with rationale and durable history.

## Governing mission inputs

### `ops/missions/agent-workforce/PRESIDENT_A_REVIEW_ORCHESTRATION_BRIEF.md`

Used for:

- the existing explicit President review seam for Salon back-briefs
- the already accepted delegated cross-team route model
- the identified follow-on gaps around Alpha route anchoring and thin review workflow depth

### `ops/missions/agent-workforce/JOB_CARD_SALON_MEMORY_LOOP_BRIEF.md`

Used for:

- the admitted `Job Card -> Salon -> Memory HQ -> synthesis back-brief` loop
- the persisted runtime-state shape for imported Salon memory and generated back-briefs

### `ops/missions/agent-workforce/DYNAMIC_KINSHIP_POLICY_BRIEF.md`

Used for:

- the dynamic Kinship configuration contract
- the requirement that policy state may tighten routing behavior without weakening the baked-in floor
- the expectation that inspector subscriptions reflect dynamic policy truth

### `ops/missions/agent-workforce/ACP_NATIVE_TRANSPORT_BRIEF.md`

Used for:

- the route-law and receipt expectations for admitted ACP-native transport
- the requirement that Kinship policy remains the governance basis for operational routing

## Existing runtime code used as source truth

### `server/src/index.js`

Used for:

- route registration and team-context resolution
- Job Card lifecycle and summary assembly
- Salon back-brief review handling
- stream payload assembly and live receipt emission
- Kinship policy read and patch endpoints

### `server/src/workforceJobDispatch.js`

Used for:

- assigned-president and assigned-team truth
- transport namespace generation
- execution bridge shaping for team-aware dispatch

### `server/src/workforceKinshipPolicy.js`

Used for:

- dynamic policy scope and policy-set modeling
- team registry bindings
- policy summary generation
- scoped policy mutation and persistence

### `server/src/workforceSalonMemoryLoop.js`

Used for:

- President back-brief defaults
- runtime-state review mirrors
- durable back-brief fields that now carry richer review metadata

### `web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Used for:

- the existing workforce command cockpit UI
- Job Card and Salon integration display seams
- the operator control seam for review submission and readback

### `web/src/ui/App.jsx`

Used for:

- application routing
- promotion of the cockpit into a team-aware route surface

## New implementation surfaces

### `server/src/index.js`

Adds:

- generalized route registration for `/api/mission-control/workforce/:teamKey/*` alongside the Alpha alias
- team-aware route validation for Job Card access and president/team mutations
- review comment, tags, action items, and immutable `reviewHistory` persistence
- enriched `salonReviewBoard` and `salonIntegration` mirrors
- team-aware stream subscription payloads, receipts, and live read-model refreshes

### `server/src/workforceJobDispatch.js`

Adds:

- dynamic team and president context in transport policy shaping
- team-scoped policy-set metadata on route-law and receipt payloads
- generalized team assignment helpers instead of Alpha-only defaults

### `server/src/workforceKinshipPolicy.js`

Adds:

- team-scoped policy scope and policy-set builders
- `teamRegistry.bindings` as durable registry truth
- `mission-control.workforce.kinship-policy.v2` summary payloads
- helper hardening so scoped patching preserves the existing team binding when no explicit policy set id is supplied

### `server/src/workforceSalonMemoryLoop.js`

Adds:

- rationale-ready review metadata fields on synthesized President back-briefs

### `web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Adds:

- route-parameter-driven team context
- team switching and dynamic team/president copy
- review rationale, tags, and action-item inputs
- recent review-history rendering for the active back-brief

### `web/src/ui/App.jsx`

Adds:

- `/mission-control/workforce/:teamKey` as the promoted cockpit route

### `scripts/tests/hivemind_salon_version_next_api.test.mjs`

Adds or extends:

- proof that rationale-rich President review persists on the back-brief and Job Card state
- proof that non-Alpha team routes can create, delegate, and run the Salon loop
- proof that returned runtime payloads expose team-aware context

### `scripts/tests/workforce_job_dispatch_api.test.mjs`

Adds or extends:

- proof that live stream payloads stay synchronized under the promoted multi-team cockpit contracts
- proof that policy updates and inspector payloads reference the new team-scoped policy-set ids

### `scripts/tests/workforce_kinship_policy.test.mjs`

Adds or extends:

- proof that dynamic Kinship patching stays scoped to the targeted team policy set and does not leak across teams

## Source-grounded conclusions

This lane is grounded in four admitted truths:

1. the closed-loop Salon path already had durable team and president identity in runtime state
2. the remaining blockers were mostly Alpha-era route anchoring, policy anchoring, and shallow review metadata
3. Kinship policy governance needed to move from a single workforce default to team-scoped registry bindings
4. executive oversight required append-only review history rather than just the latest decision mirror

The mission therefore did not require a new orchestration engine. It required promoting the existing route and payload seams into a team-aware cockpit, making the Kinship registry truly team-scoped, and extending President review into a durable audit trail.
