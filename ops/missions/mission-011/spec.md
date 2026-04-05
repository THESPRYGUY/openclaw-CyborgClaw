# Mission 011 - Canonical Agent Card Rollout Hardening

Goal:
Carry the proven Canonical Agent Baseball Card VNext packet out of design-only proof and into the live shared renderer seams across the dashboard surfaces that still drift, while preserving one canonical card contract and bounded child-work semantics.

## Mission objective

Deliver the first rollout-hardening mission after Mission 010 that proves:

1. one shared card renderer seam can govern the major CYBORGCLAW agent surfaces
2. bounded child-work visibility can attach to the parent card without semantic drift
3. mission rooms, barracks, roster walls, studios, and selectors still read as one card species at first glance
4. operator truth improves because identity, provenance, activity, and child-work posture are clearer on the surfaces people actually use

This mission is successful only if the rollout moves through:

1. shared seam hardening
2. child-work rail admission
3. mission-room adoption
4. roster-wall and barracks adoption
5. studio and selector/inspector convergence
6. regression contract expansion
7. operator review
8. publish-ready closeout

## Source truth

- Mission 010 VNext deliverable: `ops/cyborgclaw/CANONICAL_AGENT_TILE_VNEXT_SPEC.md`
- Mission 010 autopsy: `ops/missions/mission-010/post-run-autopsy.md`
- Mission 010 receipt bundle: `ops/missions/mission-010/runs/20260405_213039Z/receipt_bundle.md`
- Canonical schema: `ops/cyborgclaw/CANONICAL_AGENT_TILE_SCHEMA.md`
- Canonical tokens: `ops/cyborgclaw/CANONICAL_AGENT_TILE_TOKENS.md`
- Mission 007 visual anchor: `ops/missions/mission-007/BASEBALL_CARD_HANGAR_BOARD_VISUAL_SPEC.md`

## Dashboard seam findings to honor

The next mission should target the real dashboard seam, not invent a new one.

Shared card seam:

- `web/src/pages/agentOs/AgentOsComponents.jsx` `AgentOsSeatTile`
- `web/src/pages/agentOs/agentOsUtils.js`
- `web/src/pages/BreakoutRoomAgentAvatar.jsx`
- `web/src/pages/breakoutRoomUtils.js`
- `web/src/ui/styles.css`

High-value drift surfaces:

- `web/src/pages/MissionControlWorkforceAlphaPage.jsx`
- `web/src/pages/AgentsPage.jsx`
- `web/src/pages/StrikeTeamBarracksPage.jsx`
- `web/src/pages/AgentStudioPage.jsx`
- `web/src/pages/HiveMindBreakOutRoomPage.jsx`
- `web/src/pages/WorkforceTeamRosterModal.jsx`
- `web/src/pages/workforce/WorkforceInspectorDrawer.jsx`
- `web/src/pages/BreakoutRoomAgentRosterModal.jsx`
- `web/src/pages/agentStudio/AgentStudioDesign101.jsx`

## North star

Mission 011 is not about a cosmetic restyle.

Mission 011 is about making the VNext card _real_ across the operator surfaces:

- one shared authority face
- one shared status grammar
- one shared provenance grammar
- one bounded child-work rail

## Non-negotiable rules

- Preserve one canonical card contract.
- No page-local card species.
- Parent agent remains the authority face.
- Child units stay attached and bounded under the parent card.
- No telemetry inflation, fake freshness, or status-grammar drift.
- Selector and inspector experiences may tune density, but not semantics.
- Child-work rails may summarize active work, freshness, and latest proof only.
- Child-work UI must never imply independent authority or peer-seat sovereignty.

## Required deliverables

1. shared card rollout plan tied to the real dashboard seams
2. child-work rail contract wired to the parent card
3. surface adoption across mission room, roster wall, barracks, studio, and at least one selector/inspector seam
4. regression/contract coverage expansion
5. publish-ready closeout packet with before/after operator-truth summary

## Rollout order

Mission 011 should be executed in bounded slices, not as a broad one-shot sweep.

### Slice 1 - Shared seam hardening

Owner:

- `web/src/pages/agentOs/AgentOsComponents.jsx`
- `web/src/pages/agentOs/agentOsUtils.js`
- `web/src/pages/BreakoutRoomAgentAvatar.jsx`
- `web/src/pages/breakoutRoomUtils.js`
- `web/src/ui/styles.css`

Goal:

- strengthen `AgentOsSeatTile` as the single shared authority face
- admit the bounded `childWork` rail under the parent card
- keep status, freshness, and provenance semantics centralized

### Slice 2 - Mission room truth

Owner:

- `web/src/pages/MissionControlWorkforceAlphaPage.jsx`
- `web/src/pages/WorkforceTeamRosterModal.jsx`
- `web/src/pages/workforce/WorkforceInspectorDrawer.jsx`

Goal:

- make mission-room parent cards expose child-work truth without new card species
- ensure modal/inspector density changes do not alter semantics

### Slice 3 - Roster wall and barracks convergence

Owner:

- `web/src/pages/AgentsPage.jsx`
- `web/src/pages/StrikeTeamBarracksPage.jsx`
- `web/src/pages/BreakoutRoomAgentRosterModal.jsx`
- `web/src/pages/WorkforceTeamRosterModal.jsx`

Goal:

- make the Alpha roster wall and barracks use the same parent-card species at first glance
- keep child-work visible as an attachment rail, not a new sovereign card

Priority note:

- `web/src/pages/WorkforceTeamRosterModal.jsx` and `web/src/pages/BreakoutRoomAgentRosterModal.jsx` are the highest-value pre-launch drift seams because they still rebuild roster cards with a separate badge/class grammar.

### Slice 4 - Studio adoption

Owner:

- `web/src/pages/AgentStudioPage.jsx`
- `web/src/pages/agentStudio/AgentStudioDesign101.jsx`
- `web/src/pages/agentStudio/agentStudioPresentationModel.js`
- `web/src/pages/agentStudio/agentStudioDraftModel.js`

Goal:

- bring at least one major studio authoring surface back under the same shared card contract
- preserve design-time/runtime separation while keeping card identity consistent

Priority note:

- `web/src/pages/HiveMindBreakOutRoomPage.jsx` is the highest-risk live drift surface because it manually rebuilds the occupant card around `BreakoutRoomAgentAvatar` instead of using the canonical tile seam.

### Slice 5 - Contract coverage and operator proof

Owner:

- `scripts/tests/agent_os_surface_contract.test.mjs`
- `scripts/tests/agent_studio_garage_contract.test.mjs`
- any focused mission-room / barracks / selector coverage admitted during the rollout

Goal:

- lock semantic parity in tests
- prove child-work visibility does not drift by surface
- produce a publish-ready proof bundle

Minimum new coverage:

- one source-level adoption test asserting:
  - `web/src/pages/HiveMindBreakOutRoomPage.jsx`
  - `web/src/pages/WorkforceTeamRosterModal.jsx`
  - `web/src/pages/BreakoutRoomAgentRosterModal.jsx`
    use `AgentOsSeatTile` instead of rebuilding seat cards directly
- one table-driven status/provenance contract around:
  - `web/src/pages/agentOs/agentOsUtils.js`
- one adapter contract proving foyer roster, mission-room seat, breakout occupant, and studio blueprint all normalize into the same card model without collapsing published/runtime/effective provenance

## Seat fanout

### President-A

Owner of:

- sequencing
- admission of rollout slices
- proof acceptance
- publish recommendation

### dir-application-eng-01

Owner of:

- shared renderer evolution in the live dashboard repo
- `AgentOsSeatTile` hardening
- child-work rail wiring

### dir-architecture-01

Owner of:

- contract boundary integrity
- anti-drift rules across live surfaces
- parent/child authority guardrails

### dir-devex-qa-01

Owner of:

- regression coverage
- surface parity checks
- stale/freshness honesty checks

### voltaris-v2

Owner of:

- operator readability
- premium card presence without semantic inflation
- hover/child-work clarity

### codex

Owner of:

- implementation realism
- seam discipline
- rollout closure and proof sanity

## Acceptance criteria

1. `AgentOsSeatTile` is confirmed as the single shared renderer seam for the rollout.
2. A canonical `childWork`/spawn summary rail is admitted on the parent card.
3. Mission room, roster wall, and barracks all render the same card species with shared status/provenance semantics.
4. At least one studio seam and one selector/inspector seam are brought back under the same contract.
5. Regression tests explicitly cover the shared seam and at least one child-work visibility path.
6. The resulting packet is publish-ready and operator-reviewed.

## Fail-fast blockers

1. A local surface requires a new card species to land.
2. Child-work data requires fake freshness or inferred authority.
3. Selector or inspector paths keep a separate status grammar.
4. The rollout cannot point to concrete shared-seam ownership in code.
5. The implementation creates another special-case renderer instead of shrinking drift.
