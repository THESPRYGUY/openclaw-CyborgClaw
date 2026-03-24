# JOB_CARD_SALON_MEMORY_LOOP_SOURCE_MAP

## Purpose

Record the exact source artifacts used to implement the closed-loop Job Card -> Salon -> Memory HQ -> synthesis back-brief path.

## Governing mission inputs

### `ops/missions/agent-workforce/HIVEMIND_SALON_UPGRADE_BRIEF.md`

Used for:

- the existing Job Card -> Salon launch seam
- the Version Next contract shape
- the prior identified follow-on gap for durable Memory HQ import and synthesis closeout

### `ops/missions/agent-workforce/ACP_NATIVE_TRANSPORT_BRIEF.md`

Used for:

- the insistence that President-A remains the durable execution owner
- the vocabulary for Kinship-governed ACP transport and admitted execution truth

### `ops/missions/agent-workforce/A2A_COLLAB_PROOF_BRIEF.md`

Used for:

- the existing back-brief / review vocabulary
- the expectation that bounded collaboration rolls back into the parent Job Card truth

### `ops/missions/agent-workforce/STRIKE_TEAM_ALPHA_JOB_DISPATCH_MVP_BRIEF.md`

Used for:

- the already accepted Job Card storage boundary in the sibling Sprytly SQLite database
- the President-A delegation model and locked-team snapshot

## Existing runtime code used as source truth

### `../sprytly-internal-dashboard/server/src/hivemindSalonVersionNext.js`

Used for:

- Version Next contract structure
- prompt-context generation
- run-summary persistence
- Job Card runtime-state salon append behavior

### `../sprytly-internal-dashboard/server/src/index.js`

Used for:

- Salon launch orchestration
- freeze/export lifecycle
- Job Card payload builders
- session bridge synchronization
- Memory HQ search entry points
- activity stream classification

### `../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`

Used for:

- the accepted runtime-state model for durable Job Cards
- existing structured proof / back-brief patterns
- session-bridge assumptions for President-A and seat agents

### `../sprytly-internal-dashboard/server/src/memoryVaultSearch.js`

Used for:

- the live runtime search model
- the fact that `memory/cards`, `memory/cues`, `memory/entities`, and `memory/artifacts` are already queryable workspace memory

## New implementation surfaces

### `../sprytly-internal-dashboard/server/src/workforceSalonMemoryLoop.js`

Adds:

- the closed-loop import contract
- transcript summarization
- Memory HQ card / artifact writing
- ingestion-log and memory-state updates
- President-A back-brief generation

### `../sprytly-internal-dashboard/server/src/index.js`

Adds:

- richer Job Card Salon route inputs
- automatic Memory HQ import after successful Workforce Salon runs
- automatic President-A back-brief generation
- new lifecycle receipts for imported memory and generated back-briefs
- payload and session-bridge exposure for the closed-loop state

### `../sprytly-internal-dashboard/server/src/hivemindSalonVersionNext.js`

Adds:

- expected output resolution
- decision intent carry-through
- memory query carry-through
- run-summary preservation of Memory HQ import and President-A back-brief data

### `../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`

Adds:

- initial runtime-state slots for salon runs, imports, and back-briefs

### `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

Adds:

- visible closed-loop readback in the existing Salon integration section

### `../sprytly-internal-dashboard/scripts/tests/hivemind_salon_version_next_api.test.mjs`

Adds or extends:

- end-to-end proof that the Job Card Salon route completes the Memory HQ import and President-A back-brief loop

## Source-grounded conclusions

This lane is source-grounded in four already-admitted truths:

1. Job Cards are durably stored in the sibling Sprytly database
2. Workforce Salon runs already freeze and export into durable session artifacts
3. Memory HQ already indexes the live `memory/` workspace
4. President-A already consumes admitted runtime truth through Job Card payloads and session-bridge context

The closed-loop mission therefore did not need a new database or a new memory product surface. It needed to connect the already-admitted seams truthfully and durably.
