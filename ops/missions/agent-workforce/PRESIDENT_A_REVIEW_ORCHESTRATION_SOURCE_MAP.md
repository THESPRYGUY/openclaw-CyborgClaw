# PRESIDENT_A_REVIEW_ORCHESTRATION_SOURCE_MAP

## Purpose

Record the exact source artifacts used to implement President review controls for Salon back-briefs and broaden the closed-loop Salon orchestration path beyond the original Alpha-only assumptions.

## Governing mission inputs

### `ops/missions/agent-workforce/JOB_CARD_SALON_MEMORY_LOOP_BRIEF.md`

Used for:

- the already admitted `Job Card -> Salon -> Memory HQ -> synthesis back-brief` loop
- the identified follow-on gap for explicit President review controls
- the existing runtime-state shape for imported Salon memory and back-briefs

### `ops/missions/agent-workforce/HIVEMIND_SALON_UPGRADE_BRIEF.md`

Used for:

- the Version Next contract expectations
- the accepted Salon launch seam from Job Cards
- the requirement that Salon remains bounded decision support instead of a parallel task registry

### `ops/missions/agent-workforce/ACP_NATIVE_TRANSPORT_BRIEF.md`

Used for:

- the requirement that execution ownership remains on the assigned president ACP seam
- the route-law and receipt framing for Kinship-governed transport

### `ops/missions/agent-workforce/STRIKE_TEAM_ALPHA_JOB_DISPATCH_MVP_BRIEF.md`

Used for:

- the accepted Job Card delegation and runtime-state boundary
- the locked-team snapshot model that now needed to generalize beyond Alpha defaults

## Existing runtime code used as source truth

### `server/src/index.js`

Used for:

- Job Card status and summary assembly
- lifecycle event classification
- President session bridge synchronization
- the existing Salon launch and review entry points

### `server/src/workforceJobDispatch.js`

Used for:

- durable Job Card state transitions
- team snapshot and delegation truth
- ACP namespace generation

### `server/src/workforceSalonMemoryLoop.js`

Used for:

- the imported Memory HQ record shape
- synthesized President back-brief structure
- the current back-brief ownership and audience model

### `server/src/hivemindSalonVersionNext.js`

Used for:

- team-integration contract fields
- prompt-context wording
- persisted run-summary contract data

### `web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Used for:

- current cockpit surfaces for Job Card delegation and Salon integration
- the operator control seam where explicit review needed to become actionable

## New implementation surfaces

### `server/src/index.js`

Adds:

- the explicit Salon back-brief review route
- durable review-state persistence into Job Card runtime state
- lifecycle emission for `workforce.job_card.salon_backbrief_reviewed`
- `salonReviewBoard` summary construction
- enriched `salonIntegration` review mirrors
- generalized team and president identity resolution

### `server/src/workforceJobDispatch.js`

Adds:

- reusable president and team label helpers
- dynamic default team ids and team names per assigned president
- team-scoped ACP namespace shaping instead of Alpha-only namespace text

### `server/src/workforceSalonMemoryLoop.js`

Adds:

- explicit pending-review defaults on generated back-briefs
- dynamic president and team context in Memory HQ import records
- assigned-president audience labels instead of fixed President-A strings

### `server/src/hivemindSalonVersionNext.js`

Adds:

- dynamic team-integration context for non-Alpha lanes
- assigned-president wording in Version Next prompts and delivery rules

### `web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Adds:

- explicit Salon back-brief review controls
- dynamic team and president display labels
- review-board count surfaces and latest review readback
- review mutation wiring for the active Job Card

### `scripts/tests/hivemind_salon_version_next_api.test.mjs`

Adds or extends:

- proof that a president can acknowledge a Salon back-brief
- proof that review state persists on the returned Job Card payload
- proof that a President-B delegation path gets the right team name, audience label, and route-law namespace

### `scripts/tests/workforce_job_dispatch.test.mjs`

Adjusts:

- dispatch wording expectations so the proof language matches the new generic president-review copy

## Source-grounded conclusions

This lane is grounded in four admitted truths:

1. the synthesized Salon back-brief is already durable runtime truth on the Job Card
2. the assigned president remains the execution owner, so review must attach to that president seam
3. team identity already exists in the locked-team snapshot and assigned-president fields
4. the Alpha-specific wording and namespace assumptions were the main blockers to broader orchestration reuse

The mission therefore did not require a new workflow engine. It required turning implicit review into a first-class control and replacing Alpha-only assumptions with delegated team truth across the existing loop.
