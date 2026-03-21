# CONTINUITY_SYSTEM_IMPL_PLAN

## Purpose

Define the Minimal Viable Rollout for Continuity System V1 as a governed, file-backed continuity layer for the Voltaris V2 ↔ Codex operating model.

This plan covers the first three rollout phases, the immediate post-review decision lane, the Phase 4 planning/implementation work, and the operational review / closeout transition:

- `Phase 0 — Continuity foundation`
- `Phase 1 — Trust/provenance and briefing layer`
- `Phase 2 — Promotion model and private/shared split`
- `Phase 3 — Optional service abstraction review`
- `Phase 4 — File-backed optimization planning`
- `Phase 4 — File-backed optimization implementation`
- `Operational review and closeout planning`

## Frozen decisions

- V1 remains `file-backed`.
- No new memory service runtime is introduced in V1.
- No product/runtime code changes are in scope for this planning lane.
- Shared mission truth stays in the governing pack.
- Private strategist memory stays outside shared mission truth until explicitly promoted.
- Every lane must end with one exact bounded next action.

## Adopt-now memory concepts

These concepts are adopted immediately into the continuity design:

- explicit scope layering across `agent`, `team`, `workspace`, `project`, and `global`
- explicit trust labels such as `VERIFIED`, `OBSERVED`, `INFERRED`, `PARTIAL`, and `DEPRECATED`
- explicit provenance labels for continuity facts
- separation between private strategist memory and shared mission truth
- a generated continuity briefing / context-pack artifact
- promotion rules for moving facts from private or partial state into shared mission truth

## File-backed v1 boundary

### What stays file-backed

- `BOOTSTRAP.md`
- `CURRENT_LANE_SUMMARY.md`
- `CURRENT_LANE_BRIEFING.md`
- `LANDED_STATE_INDEX.md`
- `NEXT_LANE_CONTRACT.md`
- `mission.yaml`
- `HANDOFF.md`
- `RECEIPTS_INDEX.md`
- `SESSION_MAP.json`

### What stays manual in v1

- strategist intent and packet content
- promotion decisions from private to shared memory
- continuity judgment on what is still partial or conflicted

### What may become generated in v1

- `CURRENT_LANE_SUMMARY.md`
- `CURRENT_LANE_BRIEFING.md`
- portions of `LANDED_STATE_INDEX.md`
- portions of `RECEIPTS_INDEX.md`

### What is explicitly deferred

- vector storage
- graph storage
- object storage
- multimodal ingestion
- reflection workers
- service APIs for continuity retrieval

## Private vs shared memory model

### Private strategist memory

Private strategist memory is where Voltaris can hold working hypotheses, incomplete synthesis, and unpromoted observations.

For V1:

- it is acknowledged as a concept
- it is not treated as canonical team truth
- it should only influence shared artifacts through explicit promotion

### Shared mission truth

Shared mission truth is the governed continuity layer inside the mission pack. It must be:

- receipt-backed
- attributable to a source
- scoped to the current mission/lane
- explicit about what is partial or unknown

## Promotion model

### Starts as private / inferred

- raw strategist notes
- unverified hypotheses
- convenience summaries not yet tied to receipts

### May be promoted to shared truth when

1. the fact is directly relevant to the active mission or next lane
2. the fact is traceable to an artifact, repo fact, tool output, API response, or landed review proof
3. the fact can be labeled with trust and provenance
4. the fact is actionable enough to affect planning, execution, or re-entry

### Must not auto-promote

- speculative root-cause claims
- guesses about runtime behavior
- assumptions without a source
- strategy opinions presented as settled truth
- raw conversational residue
- private strategist notes without explicit promotion approval

## Phase plan

## Phase 0 — Continuity foundation

### Objective

Define and operationalize the minimum artifact set required for cold re-entry after a day boundary or surprise context reset.

### Files / artifacts in scope

- `BOOTSTRAP.md`
- `CURRENT_LANE_SUMMARY.md`
- `NEXT_LANE_CONTRACT.md`
- `mission.yaml`
- `HANDOFF.md`
- `SESSION_MAP.json`

### Required outputs

- finalized artifact contracts for the three foundation artifacts
- clarified ownership model for strategist vs operator responsibilities
- update cadence for each artifact
- validation rules for determining whether each artifact is current and trustworthy

### Manual vs automatic

- manual:
  - `NEXT_LANE_CONTRACT.md` packet content from Voltaris
  - promotion decisions
  - strategic framing
- automatic or operator-generated:
  - `CURRENT_LANE_SUMMARY.md` from Codex after each substantive lane
  - `mission.yaml.continuity.next_action`
  - `SESSION_MAP.json.currentNextAction`

### Validation

- artifact exists
- artifact contains no unresolved placeholders
- artifact has a clearly labeled owner and update cadence
- artifact reflects the current exact next lane
- artifact does not contradict `mission.yaml`

### Stop conditions

- the artifact cannot be updated without product code
- the artifact duplicates another source of truth without adding clarity
- the artifact encourages ambiguous or multiple next actions

## Phase 1 — Trust / provenance and briefing layer

### Objective

Add explicit truth semantics and a lightweight continuity context-pack so re-entry is faster and safer.

### Files / artifacts in scope

- `CURRENT_LANE_BRIEFING.md`
- `LANDED_STATE_INDEX.md`
- `RECEIPTS_INDEX.md`
- `HANDOFF.md`
- `CURRENT_LANE_SUMMARY.md`

### Required outputs

- trust/provenance labeling rules
- briefing structure for rapid wake-up
- landed-state index structure for known-good baseline recall
- rules for showing `VERIFIED`, `OBSERVED`, `PARTIAL`, `UNKNOWN`, and `DEPRECATED` facts

### Manual vs automatic

- manual:
  - judgment on trust state when facts conflict
  - narrative interpretation in `HANDOFF.md`
- automatic or operator-generated:
  - briefing refresh from current mission truth
  - landed-state entry generation when later lanes land continuity surfaces

### Validation

- each briefing fact has a trust label
- each material fact has a provenance pointer
- landed-state entries are clearly separated from planned/not-landed items
- no statement of full truth is made without source backing

### Stop conditions

- provenance cannot be expressed clearly in the artifact
- briefing becomes so large that it stops being a wake-up aid
- landed-state index starts mixing planned and landed state without distinction

## Deferred phases

## Phase 2 — Promotion model and private/shared split

### Objective

Formalize the boundary between private strategist memory and shared mission truth without introducing a runtime memory service.

### Files / artifacts in scope

- `PROMOTION_RULES.md`
- `BOOTSTRAP.md`
- `CURRENT_LANE_SUMMARY.md`
- `CURRENT_LANE_BRIEFING.md`
- `LANDED_STATE_INDEX.md`
- `NEXT_LANE_CONTRACT.md`
- `mission.yaml`
- `HANDOFF.md`
- `RECEIPTS_INDEX.md`
- `SESSION_MAP.json`
- `MISSION_PACK.md`
- `07_HANDOVER_ADDENDUM.md`
- `08_DAILY_LOG.md`

### Required outputs

- a dedicated `PROMOTION_RULES.md` artifact
- documented private strategist memory location and usage boundary
- explicit promotion-state language across the active continuity artifacts
- synchronized Phase 3 review posture across the hard sync set

### Manual vs automatic

- manual:
  - strategist-private notes stay outside the pack
  - promotion approval from private memory into shared truth
  - judgment on what remains `NON_PROMOTABLE`
- automatic or operator-generated:
  - artifact synchronization after promotion-model changes
  - briefing refresh when promotion-state language changes the current truth surface

### Validation

- private strategist memory is explicitly documented as external to the pack
- promotion rules define promotable and non-promotable classes
- no active artifact treats strategist-private notes as shared mission truth
- the exact next lane is synchronized after Phase 2 close

### Stop conditions

- phase completion would require storing private strategist notes in-repo
- promotion language would blur private memory and shared truth
- phase completion would imply runtime integration rather than artifact governance

## Phase 3 — Optional service abstraction review

### Objective

Evaluate whether the file-backed continuity system shows enough scaling pain to justify optional service abstraction or deeper memory indexing.

### Files / artifacts in scope

- `CONTINUITY_SYSTEM_IMPL_PLAN.md`
- `CURRENT_LANE_BRIEFING.md`
- `CURRENT_LANE_SUMMARY.md`
- `NEXT_LANE_CONTRACT.md`
- `mission.yaml`
- `HANDOFF.md`
- `RECEIPTS_INDEX.md`
- `SESSION_MAP.json`

### Required outputs

- explicit service-readiness criteria
- go / no-go guidance for any future memory-service exploration
- proof-backed statement of whether file-backed v1 is still sufficient
- `SERVICE_READINESS_RECOMMENDATION.md`

### Current review outcome

- recommendation state: `DEFERRED`
- rationale:
  - current machine cost is negligible compared to the coordination burden
  - measured re-entry surface remains compact enough for governed file-backed operation
  - the uploaded memory-service skeleton provides useful future seams but not enough proof to justify runtime adoption now

### Measured baseline used for the review

- top-level continuity files in the pack: `23`
- total top-level file lines: `2298`
- active hot/warm evaluation set: `10 files`, `50069 bytes`
- raw read of the active evaluation set: `~0.15 ms`
- parse of `mission.yaml` plus `SESSION_MAP.json`: `~6.25 ms`
- explicit briefing input count at Phase 3 review time: `10`
- artifacts currently mirroring the exact next lane at Phase 3 review time: `13`

### Go criteria for any later service-planning stream

- the governed continuity surface requires sync across more than `20` artifacts for `3` consecutive substantive lanes
- explicit briefing inputs exceed `25` or require live coordination across more than `3` separate packs/repos
- the active continuity corpus exceeds `5000` lines or `250 KB` and cold-start re-entry is no longer skimmable in under `3 minutes`
- proof-backed retrieval by file links and grep can no longer recover mission truth in under `30 seconds`
- hard-sync contradictions recur in `2` consecutive lanes or become operationally common

### No-go criteria

- performance pain remains negligible and the main burden is still editorial synchronization
- service adoption is justified only by elegance or preference rather than measured failure
- advanced memory concepts cannot be tied to a concrete continuity bottleneck

### Stop conditions

- no clear scaling pain can be shown
- the lane drifts from review into implementation
- runtime integration is implied without a separately approved lane

## Artifact contracts

## `BOOTSTRAP.md`

### Purpose

Fastest-possible wake-up file for role, mission identity, read order, and first re-anchor steps.

### Owner

- primary maintainer: `Codex`
- strategic inputs: `Voltaris V2`

### Update cadence

- update when:
  - the team model changes
  - the canonical read order changes
  - the rehydration gate changes

### Required sections

- purpose
- read-first order
- team model
- mission identity
- immediate next lane
- explicit do-not-assume reminders

### Trust / provenance rules

- only `VERIFIED` or `FROZEN` facts belong here
- provenance may be compact and file-oriented
- no speculative notes

### Validation

- must be readable in under two minutes
- must agree with `mission.yaml` and `CURRENT_LANE_SUMMARY.md`

## `CURRENT_LANE_SUMMARY.md`

### Purpose

Concise mission/lane status summary for restart and handoff.

### Owner

- primary maintainer: `Codex`

### Update cadence

- after every substantive planning, implementation, verification, or landing lane

### Required sections

- lane identity
- proven current state
- scope boundary
- exact next lane

### Trust / provenance rules

- facts should use explicit truth language such as `VERIFIED`, `OBSERVED`, `UNKNOWN`
- provenance may be file pointers or direct source references

### Validation

- must contain exactly one next lane
- must not contradict `mission.yaml.continuity.next_action`

## `CURRENT_LANE_BRIEFING.md`

### Purpose

A compact continuity context-pack for fast strategist wake-up.

### Owner

- primary maintainer: `Codex`

### Update cadence

- after each substantive lane or whenever the next lane changes

### Required sections

- continuity briefing bullets
- trust labels on each bullet
- provenance pointer on each material bullet
- operator note / caution zone

### Trust / provenance rules

- every briefing bullet must be labeled, for example:
  - `[VERIFIED]`
  - `[OBSERVED]`
  - `[PARTIAL]`
  - `[NEXT]`
- every material bullet must cite its source

### Validation

- must be skimmable in under three minutes
- must not exceed the scope of the current lane

## `LANDED_STATE_INDEX.md`

### Purpose

Canonical index of continuity surfaces, contracts, or integrations that are actually landed.

### Owner

- primary maintainer: `Codex`

### Update cadence

- only when something is actually landed

### Required sections

- purpose
- current landed state
- entry schema
- landed entries

### Trust / provenance rules

- landed entries are `VERIFIED` only
- every entry must cite the proof source such as a PR, commit, or validation receipt

### Validation

- must not contain planned-only work as landed
- must differentiate landed state from scaffold state

## `NEXT_LANE_CONTRACT.md`

### Purpose

Freeze the next bounded packet and its hard guardrails between strategist and operator.

### Owner

- packet content: `Voltaris V2`
- canonicalization / synchronization: `Codex`

### Update cadence

- at lane close
- whenever the accepted next lane changes

### Required sections

- purpose
- current status
- frozen next lane
- hard guardrails
- optional packet metadata block

### Trust / provenance rules

- the next lane must be treated as `FROZEN` until superseded
- the file should reference matching state in `mission.yaml` and `SESSION_MAP.json`

### Validation

- must contain exactly one bounded next lane
- must match `mission.yaml.continuity.next_action`
- must match `SESSION_MAP.json.currentNextAction`

## `PROMOTION_RULES.md`

### Purpose

Define the file-backed v1 promotion model that governs when strategist-private material may become shared mission truth.

### Owner

- primary maintainer: `Codex`
- promotion approval: `Voltaris V2`

### Update cadence

- whenever promotion criteria change
- whenever a new non-promotable class is admitted
- whenever the private/shared boundary definition changes

### Required sections

- purpose
- private strategist memory definition
- shared mission truth definition
- promotion states
- promotion criteria
- non-promotable classes
- validation rules

### Trust / provenance rules

- rules must remain `VERIFIED` pack truth
- any example promoted fact must carry a source class and evidence threshold
- the artifact must not contain actual private strategist notes

### Validation

- must clearly separate `PRIVATE`, `PROMOTABLE`, `PROMOTED`, and `NON_PROMOTABLE`
- must define who approves promotion
- must preserve the file-backed v1 boundary

## `SERVICE_READINESS_RECOMMENDATION.md`

### Purpose

Capture the proof-backed recommendation on whether Continuity System V1 should stay file-backed or begin a separately governed service-abstraction planning stream.

### Owner

- primary maintainer: `Codex`
- strategic reviewer: `Voltaris V2`

### Update cadence

- after each explicit service-readiness review
- whenever measurable scaling pain materially changes

### Required sections

- purpose
- measured baseline
- evaluated pain points
- go / no-go criteria
- recommendation
- next planning implications

### Trust / provenance rules

- recommendation must remain `VERIFIED` or `DEFERRED` with explicit sources
- any external architecture references must be labeled as inspiration, not approved runtime scope

### Validation

- must distinguish measured pain from speculative architecture preference
- must end with a clear recommendation state
- must not authorize implementation or runtime integration by implication

## Ownership rules

- Voltaris V2 owns:
  - strategic direction
  - packet framing
  - promotion approval from private to shared memory
- Codex owns:
  - artifact maintenance
  - state synchronization
  - receipt-backed truth updates
  - continuity refresh after each substantive lane

## Validation rules across the system

Every continuity lane should validate:

- pack files exist
- no unresolved placeholders remain
- JSON/YAML files parse
- the hard sync set stays aligned:
  - `mission.yaml`
  - `CURRENT_LANE_SUMMARY.md`
  - `NEXT_LANE_CONTRACT.md`
  - `SESSION_MAP.json`
- the full exact next lane remains authoritative only in:
  - `mission.yaml`
  - `NEXT_LANE_CONTRACT.md`
  - `SESSION_MAP.json`
- mirror artifacts use label-plus-pointer form and do not duplicate the full current packet text without an explicit widening decision
- `HANDOFF.md` is updated last as the mirrored narrative bridge and must not contradict the hard sync set
- any artifact using promotion-state language stays aligned with `PROMOTION_RULES.md`

## Recommended next implementation lane

Voltaris V2 selected `Option 1`, so service abstraction remains `DEFERRED` and the next governed lane should stay inside the file-backed continuity stream.

## Phase 4 — File-backed optimization planning

### Objective

Define a bounded optimization plan for reducing synchronization overhead inside the existing file-backed continuity system.

### Files / artifacts in scope

- `CONTINUITY_SYSTEM_IMPL_PLAN.md`
- `CURRENT_LANE_SUMMARY.md`
- `CURRENT_LANE_BRIEFING.md`
- `NEXT_LANE_CONTRACT.md`
- `mission.yaml`
- `HANDOFF.md`
- `RECEIPTS_INDEX.md`
- `SESSION_MAP.json`
- `SERVICE_READINESS_RECOMMENDATION.md`

### Required outputs

- a bounded optimization plan for reducing exact-next-lane duplication
- a bounded optimization plan for shrinking briefing refresh inputs where safe
- explicit no-go lines that preserve the file-backed v1 boundary
- one exact Phase 4 implementation lane

### Measured planning baseline

- exact-next-lane text currently appears in `13` artifacts
- `CURRENT_LANE_BRIEFING.md` currently lists `11` refresh inputs
- the active evaluation set remains lightweight enough that the problem is coordination overhead, not read or parse cost
- current briefing input declarations drift across `mission.yaml`, `CURRENT_LANE_BRIEFING.md`, `RECEIPTS_INDEX.md`, and `SESSION_MAP.json`
- current briefing refresh still over-reads direct external Mission 2 files and summary artifacts

### Planned optimization targets

#### 1. Exact-next-lane authority reduction

- keep full next-lane text authoritative in exactly `3` places:
  - `NEXT_LANE_CONTRACT.md`
  - `mission.yaml.continuity.next_action`
  - `SESSION_MAP.json.currentNextAction`
- keep `CURRENT_LANE_SUMMARY.md` in the hard sync set, but convert it to a compact lane label plus explicit pointer to `NEXT_LANE_CONTRACT.md`
- convert `BOOTSTRAP.md`, `HANDOFF.md`, `MISSION_PACK.md`, `07_HANDOVER_ADDENDUM.md`, `08_DAILY_LOG.md`, `01_MISSION_SPEC.md`, and other mirror surfaces to short reference form rather than repeating full packet text

#### 2. Briefing refresh simplification

- routine briefing refresh should be rebuilt around this local canonical set:
  - `mission.yaml`
  - `CURRENT_LANE_SUMMARY.md`
  - `NEXT_LANE_CONTRACT.md`
  - `RECEIPTS_INDEX.md`
  - `LANDED_STATE_INDEX.md`
- conditional inputs should be read only when their domain changed in the just-completed lane:
  - `PROMOTION_RULES.md`
  - `SERVICE_READINESS_RECOMMENDATION.md`
- `SESSION_MAP.json` and `HANDOFF.md` should become output mirrors for briefing refresh rather than briefing evidence sources
- direct reads of external shared-workspace Mission 2 files should be removed from briefing refresh; `LANDED_STATE_INDEX.md` should remain the single gateway for external carry-through
- summary artifacts should stop citing themselves or one another as proof when the underlying policy or receipt file is available directly

#### 3. Collaborative efficiency guardrails

- reduce desynchronization risk without hiding the next lane from cold-start operators
- preserve the hard sync set and mirrored-bridge model
- prefer references over duplication, but never at the cost of re-entry clarity

### Stop conditions

- the lane drifts into service-abstraction planning
- the lane implies product/runtime changes
- the lane weakens cold-start re-entry clarity in pursuit of fewer artifacts

### Validation

- the plan defines the minimal authoritative next-lane set
- the plan defines a local-only `5`-core-plus-`2`-conditional briefing input model
- the plan keeps external baseline carry-through behind `LANDED_STATE_INDEX.md`
- the implementation lane remains artifact-only and file-backed

## Recommended next implementation lane

## Phase 4 — File-backed optimization implementation

### Objective

Execute the approved reduction plan without leaving the file-backed v1 boundary.

### Implemented outcome

- the current exact next lane now stays authoritative only in:
  - `NEXT_LANE_CONTRACT.md`
  - `mission.yaml.continuity.next_action`
  - `SESSION_MAP.json.currentNextAction`
- `CURRENT_LANE_SUMMARY.md` now carries a compact lane label plus pointer to `NEXT_LANE_CONTRACT.md`
- `BOOTSTRAP.md`, `HANDOFF.md`, `MISSION_PACK.md`, `01_MISSION_SPEC.md`, `07_HANDOVER_ADDENDUM.md`, `08_DAILY_LOG.md`, `RECEIPTS_INDEX.md`, `CURRENT_LANE_BRIEFING.md`, and `SERVICE_READINESS_RECOMMENDATION.md` now use short reference form for the active next lane instead of repeating the full packet text
- `CURRENT_LANE_BRIEFING.md` now refreshes from a local-only briefing model:
  - core:
    - `mission.yaml`
    - `CURRENT_LANE_SUMMARY.md`
    - `NEXT_LANE_CONTRACT.md`
    - `RECEIPTS_INDEX.md`
    - `LANDED_STATE_INDEX.md`
  - conditional:
    - `PROMOTION_RULES.md`
    - `SERVICE_READINESS_RECOMMENDATION.md`
  - output mirrors:
    - `SESSION_MAP.json`
    - `HANDOFF.md`
- external carry-through remains gated through `LANDED_STATE_INDEX.md` only

### Validation

- the current exact next lane appears in exactly `3` live authority artifacts
- mirror surfaces use label-plus-pointer form rather than duplicating the full packet text
- briefing refresh sources stay local-only and treat `SESSION_MAP.json` plus `HANDOFF.md` as outputs, not evidence inputs
- no product/runtime code changes are required

## Recommended next lane

Move into operational review and closeout planning.

The canonical packet for that lane lives in `NEXT_LANE_CONTRACT.md`, and the machine-readable mirror lives in `mission.yaml` plus `SESSION_MAP.json`.

## Operational review and closeout planning

### Objective

Validate the implemented file-backed continuity spine end to end, measure whether the Phase 4 reductions materially reduced operator burden, correct any remaining artifact drift that undermines re-entry clarity, and decide whether the pack is ready for closeout recommendation ratification.

### Review findings

- the continuity spine is functional end to end from `BOOTSTRAP.md` through `NEXT_LANE_CONTRACT.md`, `mission.yaml`, `SESSION_MAP.json`, `CURRENT_LANE_SUMMARY.md`, `CURRENT_LANE_BRIEFING.md`, and `HANDOFF.md`
- the full exact next lane now appears in exactly `3` authoritative artifacts rather than the pre-optimization `13`
- routine briefing reads now require `5` core artifacts instead of the pre-optimization `11`, with `2` conditional governance sources and `2` output mirrors outside the evidence path
- the remaining continuity burden is now sync hygiene and provenance clarity rather than truth-hunting or performance failure

### Review-time corrections

- align startup guidance so `00_START_HERE.md`, `BOOTSTRAP.md`, and `07_HANDOVER_ADDENDUM.md` all point operators back to the same fast re-entry spine
- surface the full four-state promotion model wherever promotion states are enumerated
- remove the stale system-level rule that still implied more than the implemented `3`-artifact next-lane authority set
- reduce lingering summary-to-summary proof cycles where direct receipt or policy sources are available

### Closeout recommendation

- recommendation state: `CLOSEOUT_READY_PENDING_RATIFICATION`
- rationale:
  - the implemented v1 spine is functional
  - the measured reductions are meaningful
  - service abstraction remains correctly `DEFERRED`
  - the remaining known work is bounded, artifact-only, and non-blocking

### Optional bounded follow-on iterations

- receipt-ledger hygiene to further reduce citation cycles and separate historical baseline proof from current re-entry proof even more cleanly
- optional localization of external baseline proof if the shared-workspace dependency around `LANDED_STATE_INDEX.md` becomes operationally costly

### Validation

- `OPERATIONAL_REVIEW_REPORT.md` exists and records the review result
- the `3`-artifact authority model remains intact
- the `5`-core-plus-`2`-conditional briefing model remains intact
- service-abstraction scope remains `DEFERRED`
- the next lane after this review is ratification, not new implementation work

## Recommended next lane

Review `OPERATIONAL_REVIEW_REPORT.md` and ratify the closeout recommendation for Continuity System V1 by deciding whether to close and archive the mission now or authorize one final bounded artifact-only follow-on iteration, while keeping service-abstraction scope deferred.

## Closeout ratification outcome

- decision state: `ARCHIVED`
- decided by: `Voltaris V2`
- chosen option: `Option 1`
- service-abstraction posture: `DEFERRED remains unchanged`
- authorized follow-on class: `artifact-only receipt-ledger hygiene`
- authorized follow-on completed at: `2026-03-21T18:05:59Z`
- current truth: `The hygiene pass is complete, archive now was ratified, and the mission is archived in place with a terminal completion report.`

## Recommended next lane

`Continuity System V1 archived in place` — terminal packet in `NEXT_LANE_CONTRACT.md`; machine mirrors in `mission.yaml.continuity.next_action` and `SESSION_MAP.json.currentNextAction`.
