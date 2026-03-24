# HIVEMIND_SALON_UPGRADE_BRIEF

## Mission title

`Reinvigorate and upgrade Hivemind Salon architecture for agent team integration`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Bring the existing Hivemind Salon back to a truthful working state, then land a Version Next foundation that integrates:

1. Kinship-governed ACP transport concepts instead of ad hoc salon-only transport language
2. bounded A2A collaboration as the coordination seam between President-A and admitted team seats
3. Memory HQ recall as a first-class input to salon sessions
4. a minimal Job Card to Salon execution interface for active agent teams
5. operator-visible session contracts and evidence that survive freeze/export

## Scope delivered

### 1. Hivemind Salon is operational again in default environments

The brittle live-only default is removed from the core summon surfaces.

The upgraded Salon now:

- accepts `auto` mode for summon and salon routes
- degrades `auto` to template mode when live agents are disabled
- keeps explicit `live` requests fail-closed when live runtime is disabled
- uses fallback agent roster coverage when the legacy org-roster file is missing
- stops pretending a salon run completed when summon produced partial or failed output

This restores a working baseline without hiding when the system fell back.

### 2. Version Next session contracts now exist

Salon sessions now carry a first-class Version Next contract:

- contract id: `hivemind-salon.version-next.v1`
- source binding for ideas or Workforce Job Cards
- requested mode versus effective mode
- selected salon scene and scene contract
- Kinship transport summary aligned to ACP terminology
- bounded A2A collaboration guidance
- Memory HQ query and admitted hit summary
- deliverable/export expectations

The contract is stored on the session row, injected into prompts, and preserved into freeze/export output.

### 3. Memory HQ is now part of the salon execution path

Version Next salon runs now query Memory HQ before summon and pass a concise recall pack into the prompt contract.

This makes the Salon:

- retrieve nearby architecture / governance / execution memory before discussion
- expose hit count and top memory source in the run summary
- preserve that recall metadata for operator review and later evidence use

### 4. Workforce Alpha now has a bounded Job Card to Salon seam

Active Workforce Job Cards can now trigger a bounded salon run.

The implemented slice adds:

- `POST /api/mission-control/workforce/alpha/job-cards/:jobId/salon`
- President-A / operator launch validation
- custom roster launch using President-A plus the locked seat roster
- session linkage back to `source_workforce_job_id`
- runtime-state writeback of salon summaries onto the Job Card
- lifecycle receipts for `workforce.job_card.salon_requested` and `workforce.job_card.salon_completed`

This is the first concrete bridge from durable Job Card execution into bounded collective reasoning.

### 5. Ideas Incubator now uses the Version Next execution path

The incubator salon route now launches through the shared Version Next helper instead of an old hardcoded prompt path.

That means idea salons now:

- use Memory HQ recall
- use current salon scenes
- preserve richer run summaries
- mark success only after summon plus freeze/export complete
- stop depending on stale NEO-specific prompt assumptions

### 6. Operator surfaces can now expose Version Next truth

The Version Next upgrade also adds enough state for UI/operator surfaces to show:

- the active salon contract on a session
- requested versus effective mode
- latest Workforce salon summary
- memory hit counts and session/export linkage

This keeps the salon explainable to operators instead of remaining a hidden background action.

## Implemented interfaces

### OpenClaw mission packet surface

- `ops/missions/agent-workforce/HIVEMIND_SALON_UPGRADE_BRIEF.md`
- `ops/missions/agent-workforce/HIVEMIND_SALON_UPGRADE_SOURCE_MAP.md`

### Dashboard backend surfaces

- `../sprytly-internal-dashboard/server/src/hivemindSalonVersionNext.js`
- `../sprytly-internal-dashboard/server/src/index.js`
- `../sprytly-internal-dashboard/server/src/db.js`

### Dashboard frontend surfaces

- `../sprytly-internal-dashboard/web/src/pages/ProjectGroupthink.jsx`
- `../sprytly-internal-dashboard/web/src/pages/IdeasIncubatorPage.jsx`
- `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

### Dashboard validation surfaces

- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch_api.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/hivemind_salon_version_next_api.test.mjs`

## Acceptance criteria for this lane

This lane is accepted when:

1. Hivemind Salon can run in a truthful working mode even when live agents are disabled
2. salon sessions store a durable Version Next contract with Memory HQ and Kinship transport context
3. Ideas Incubator salon runs use the shared Version Next execution path
4. active Workforce Job Cards can trigger a bounded salon run and write the summary back into runtime state
5. operator-facing payloads can expose the latest salon integration state
6. test coverage proves fallback roster behavior, idea-salon completion, and Job Card salon linkage

## Validation proof

Implementation proof is expected against:

- sibling Sprytly targeted API coverage for:
  - fallback Hivemind agent catalog coverage
  - idea salon Version Next execution
  - Job Card salon launch and runtime-state writeback
- sibling Sprytly build/lint validation
- freeze/export proof for Version Next sessions

## Risks carried forward

### Immediate blockers

None.

### Accepted follow-on risks

- public A2A remains a thin text-task edge; the richer ACP receipt model is still mirrored into Salon contracts rather than natively transported through public A2A
- Version Next reuses Kinship transport concepts, but OpenClaw still does not expose full route-law bundle admission on every spawn/init path
- the incubator synthesizer / PRD canonicalization flow still carries older domain-specific assumptions beyond the upgraded salon execution path
- Memory HQ recall is now in the loop, but durable import of salon exports into Memory HQ remains a follow-on lane
- the current Job Card seam is bounded to President-A plus the locked team snapshot; broader cross-team salon orchestration remains future work

## Recommended next lane

`Implement durable Memory HQ import for frozen salon exports and a first-class Job Card stress-test workflow from President-A delegation through synthesis closeout.`
