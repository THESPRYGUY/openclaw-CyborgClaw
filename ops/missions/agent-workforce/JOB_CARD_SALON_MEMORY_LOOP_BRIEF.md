# JOB_CARD_SALON_MEMORY_LOOP_BRIEF

## Mission title

`Implement the closed-loop Job Card -> Salon -> Memory HQ -> synthesis back-brief path`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Turn Workforce Salon support into a closed loop that:

1. launches a bounded `stress_test` / `flesh_out` style Salon run from an active Job Card
2. imports the frozen Salon findings into Memory HQ as durable, queryable workspace memory
3. synthesizes a truthful President-A back-brief from the session contract, transcript, and imported memory artifacts
4. feeds that result back into the active Job Card payload and President-A session context

## Scope delivered

### 1. Job Card Salon triggering now carries decision-support intent

The Workforce Salon route now accepts more than a bare template launch.

The closed-loop path adds:

- explicit `decisionIntent`
- operator-provided `expectedOutputs`
- `importToMemoryHq`
- `generateBackbrief`

This means the launch request can declare whether the run is a `stress_test`, `flesh_out`, or another bounded decision-support pass, and what President-A should receive back.

### 2. Frozen Salon findings now import into Memory HQ automatically

Successful Workforce Salon runs now write durable Memory HQ artifacts into the existing live memory corpus instead of stopping at thread export.

The implemented import writes:

- a human-readable memory card under `memory/cards/`
- a structured JSON artifact under `memory/artifacts/`
- an ingestion event into `memory/_state/ingestion-log.ndjson`
- updated counters and latest-import metadata into `memory/_state/memory-state.json`

This keeps the import queryable by the existing Memory HQ runtime search without inventing a second memory system.

### 3. President-A now receives a synthesized Salon back-brief

The closed loop now creates a durable President-A back-brief after the Memory HQ import completes.

The back-brief includes:

- recommendation state such as `proceed`, `revise`, `escalate`, or `review_required`
- evidence quality labeling so template-mode scaffolds do not masquerade as live findings
- key insights
- bounded action items
- the imported Memory HQ card and artifact references

This back-brief is stored on the Job Card runtime state and mirrored into the President-A session bridge.

### 4. Workforce payloads now expose the full closed-loop state

The active Job Card payload now carries:

- `salonRuns`
- `salonMemoryImports`
- `salonBackbriefs`
- latest import / back-brief mirrors
- latest recommendation

The summarized `salonIntegration` block now exposes:

- run count
- import count
- back-brief count
- latest decision recommendation
- latest Memory HQ import
- latest President-A back-brief

### 5. Operator UI now shows the closed-loop readback

The Workforce Alpha page now shows the newly admitted loop state directly in the existing Salon integration section.

Operators can now see:

- how many imports and back-briefs have landed
- the latest recommendation
- the latest Memory HQ card and artifact path
- the Memory HQ query used for the run
- the President-A back-brief summary

### 6. The loop is covered end to end by targeted API proof

The targeted Salon API coverage now proves:

1. the Job Card Salon route returns Memory HQ import and President-A back-brief data
2. runtime state persists the import and back-brief collections
3. Memory HQ search can recall the newly imported Salon memory

## Implemented interfaces

### OpenClaw mission packet surface

- `ops/missions/agent-workforce/JOB_CARD_SALON_MEMORY_LOOP_BRIEF.md`
- `ops/missions/agent-workforce/JOB_CARD_SALON_MEMORY_LOOP_SOURCE_MAP.md`

### Dashboard backend surfaces

- `../sprytly-internal-dashboard/server/src/hivemindSalonVersionNext.js`
- `../sprytly-internal-dashboard/server/src/workforceSalonMemoryLoop.js`
- `../sprytly-internal-dashboard/server/src/index.js`
- `../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`

### Dashboard frontend surfaces

- `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

### Dashboard validation surfaces

- `../sprytly-internal-dashboard/scripts/tests/hivemind_salon_version_next_api.test.mjs`

## Acceptance criteria for this lane

This lane is accepted when:

1. a delegated Job Card can launch a bounded Salon decision-support run with explicit intent and expected outputs
2. a successful Workforce Salon run automatically writes durable Memory HQ artifacts into the live memory corpus
3. the loop generates a President-A back-brief with recommendation, evidence quality, and memory refs
4. Job Card status payloads and President-A session context surface the imported memory and back-brief state
5. targeted tests prove route success, runtime persistence, and Memory HQ recall of the imported Salon record

## Validation proof

Implementation proof is expected against:

- targeted Workforce Salon API coverage
- targeted Memory HQ recall coverage through the imported card / artifact
- sibling Sprytly server lint and build validation
- clean post-run runtime-state and working-tree verification

## Risks carried forward

### Immediate blockers

None.

### Accepted follow-on risks

- template-mode Salon runs still produce bounded scaffolds rather than authoritative live findings; the back-brief labels that evidence quality explicitly, but a live rerun is still preferable before irreversible execution decisions
- the Memory HQ import currently lands as runtime workspace memory, not promoted Tier 1 durable memory
- recommendation synthesis is deterministic and deliberately conservative; richer President-A judgment support may later want a governed summarizer pass
- the current loop is intentionally scoped to the active Job Card and President-A lane, not broader cross-team orchestration

## Recommended next lane

`Refine President-A review mechanics for imported Salon back-briefs and expand the closed-loop pattern beyond Strike Team Alpha into broader cross-team orchestration.`
