# CyborgClaw RSI Loop v1 - Tonight Runbook

Status: in_progress
Date: 2026-04-06
Mission spine:

- `ops/missions/mission-012/spec.md`
- `ops/missions/mission-012/handover.md`
- `ops/cyborgclaw/RSI_GOLDEN_FLOW_DEVELOPMENT_STRATEGY.md`

## Operating rule

At the close of each successful debug or hardening run:

1. Codex gives a short verdict and one bounded next-seam recommendation.
2. Voltaris V2 gives a short governance verdict and one bounded next-seam recommendation.
3. Mission lead gives the continuity verdict and one bounded next-seam recommendation.
4. If all three align, the next packet is admitted.
5. If they do not align, the disagreement is named and the next packet is narrowed before any further advance.

## Tonight counter

- successful loops completed tonight: `6`
- active loop: `7`
- diminishing-returns stop rule:
  - stop if the next seam is no longer clearly bounded
  - stop if proof cost exceeds likely operator-truth gain
  - stop if the next loop would mostly be cosmetic churn

## Loop 1 packet

Name:

- `canonical-agent-card-truth-alignment-primary-surfaces`

Intent:

- make one canonical agent baseball-card truth contract behave consistently on the primary active surfaces tonight

Current visible pain:

- context telemetry semantics are reading inconsistently across active surfaces
- strike team barracks is behind the primary agent surfaces
- the canonical card shell exists, but its operator-facing truth is still drifting

Votes:

- real `codex`
  - vote: `canonical-agent-card-truth-alignment`
  - why: smallest operator-facing truth seam likely to seal tonight
- real `voltaris-v2`
  - vote: `childWork rail canonical contract`
  - why: highest-trust next seam after Mission 009
- mission lead synthesis
  - choose the shared parent-card truth seam first
  - queue `childWork` immediately behind it as Loop 2 candidate if runway remains healthy

In scope:

- primary parent-card surfaces only:
  - Agents roster wall
  - Strike Team mission room
  - Strike Team Barracks
- shared status and context metric semantics on those surfaces
- one canonical interpretation of context runway:
  - saturation
  - headroom
  - posture

Out of scope:

- full `childWork` rail admission
- full Barracks redesign
- modal/picker card convergence
- HiveMind breakout-room card convergence
- broad telemetry-pack redesign beyond the primary card truth seam

Seal condition:

- the same canonical parent-card fields and meanings render consistently on the three primary active surfaces
- context metrics no longer read like contradictions
- no surface uses a stale archived job/card truth where a live job truth exists
- closeout includes the three-way verdict plus next-seam vote

## Candidate queue after Loop 1

1. `childWork-rail-canonical-contract`
2. `card-status-grammar-standardization`
3. `picker-and-modal-card-convergence`

## Loop 1 closeout

Result:

- `sealed`

Three-way verdict:

- real `codex`
  - verdict: `seal`
  - next: `child-subagent-rail-parent-card-admission`
  - risk: stale client assets after blocked restart could still hide live drift until hard refresh
- real `voltaris-v2`
  - verdict: `seal`
  - next: `childWork rail canonical contract`
  - risk: browser-refresh-dependent verification still leaves a small residual risk until restart/auth is resolved
- mission lead
  - verdict: `seal`
  - next: `childWork-rail-canonical-contract`
  - risk: primary surfaces are aligned, but forked card surfaces still exist outside the bounded seam

Loop 1 proof:

- `node --test scripts/tests/agent_os_surface_contract.test.mjs` = `PASS`
- `npm run build` = `PASS`
- live route checks:
  - `/agents` = `200`
  - `/workforce/alpha` = `200`
  - `/strike-team-barracks` = `200`

## Loop 2 re-check

New evidence after Loop 1:

- one primary surface could still present `100% saturation` while another showed `0% headroom` for effectively the same seat runway
- barracks fallback telemetry was fabricating severity from `null` vs `0` handling
- status and posture wording still drifted enough to weaken operator trust

Three-way re-check:

- real `codex`
  - verdict: `narrow-first`
  - next: `context-truth-null-vs-zero-hardening`
  - risk: the workforce mission-room family may still preserve hidden grammar drift after the fallback bug is sealed
- real `voltaris-v2`
  - verdict: `narrow-first`
  - next: `context-truth null-vs-zero hardening`
  - risk: the workforce mission-room fork may still preserve a parallel card dialect
- mission lead
  - verdict: `narrow-first`
  - next: `context-truth-null-vs-zero-hardening`
  - risk: broader card-surface convergence still remains queued behind this fix

## Loop 2 packet

Name:

- `context-truth-null-vs-zero-hardening`

Intent:

- make the canonical card treat unknown context as unknown, remove fabricated severity on fallback seats, and standardize the primary context wording on the active card species

In scope:

- null-vs-zero handling on the shared context metric contract
- barracks fallback telemetry correctness
- primary-surface context wording alignment on:
  - Agents roster wall
  - Strike Team mission room
  - Strike Team Barracks
- record the full card-instance audit so the remaining standardization path is explicit

Out of scope:

- `childWork` rail admission
- full convergence of every picker/modal/breakout card tonight
- broad telemetry-pack redesign outside the admitted context truth seam

Seal condition:

- unknown context remains unknown instead of fabricating `0%` headroom or `100%` saturation
- primary surfaces share one coherent context wording model
- the next rollout queue is updated from the full card-instance audit

## Loop 2 closeout

Result:

- `sealed`

Three-way verdict:

- real `codex`
  - verdict: `seal`
  - next: `workforce-mission-room-card-species-alignment`
  - risk: the workforce mission-room family is still the largest surviving card fork and may still carry divergent status grammar or telemetry semantics
- real `voltaris-v2`
  - verdict: `seal`
  - next: `workforce-mission-room card contract convergence`
  - risk: the workforce mission-room family still holds the largest remaining card-species drift and can keep confusing operators until converged
- mission lead
  - verdict: `seal`
  - next: `workforce-mission-room-card-species-alignment`
  - risk: this next seam is materially larger than the first two loops and may hit diminishing returns if it widens past the mission-room family

Loop 2 proof:

- `node --test scripts/tests/agent_os_surface_contract.test.mjs` = `PASS`
- `npm run build` = `PASS`
- live route checks:
  - `/agents` = `200`
  - `/workforce/alpha` = `200`
  - `/strike-team-barracks` = `200`

## Loop 3 packet

Name:

- `workforce-mission-room-card-species-alignment`

Intent:

- converge the largest remaining mission-room card fork onto the canonical card species without widening into every modal and breakout surface tonight

In scope:

- mission-room-local card families only
- identify the first bounded migration target(s) inside the workforce mission-room family
- preserve the current canonical roster wall, mission bay, and barracks card contract while reducing active mission-room drift

Out of scope:

- full picker/modal convergence outside the mission-room family
- `childWork` rail admission
- Barracks redesign beyond the already-sealed context truth fixes

Seal condition:

- at least one active mission-room forked card family is pulled under the canonical card species or a shared sanctioned variant
- mission-room card semantics move closer to the canonical contract without introducing a second UI language
- the next queue after Loop 3 remains bounded and evidence-based

## Loop 3 closeout

Result:

- `sealed`

Three-way verdict:

- real `codex`
  - verdict: `seal`
  - next: `child-subagent-rail-parent-card-admission`
  - risk: child/subagent admission could still expose an unstabilized hierarchy or density edge case when the canonical card is asked to represent parent-child relations rather than single-seat state
- real `voltaris-v2`
  - verdict: `seal`
  - next: `childWork rail canonical admission`
  - risk: child/subagent visibility is still not yet first-class on the parent card, so swarm execution truth can remain harder to read than the now-aligned base card system
- mission lead
  - verdict: `seal`
  - next: `child-subagent-rail-parent-card-admission`
  - risk: we have one card species with sanctioned variants on the primary active surfaces now, but parent-child swarm truth is still missing from the card itself

Loop 3 proof:

- `node --test scripts/tests/agent_os_surface_contract.test.mjs` = `PASS`
- `npm run build` = `PASS`
- live route checks after dashboard restart:
  - `/agents` = `200`
  - `/workforce/alpha` = `200`
  - `/strike-team-barracks` = `200`

What changed:

- canonical card now has sanctioned `variant` and `activityMode` props instead of loose page-only styling
- shared context grammar now defaults to `Runway` with paired headroom/in-use truth
- mission room live seats now use the canonical view-model plus `variant="missionBay"`
- barracks cards now use the canonical view-model plus `variant="barracks"`
- studio `AgentOsSeatTile` callsites now explicitly declare `variant="studio"`
- in-window metric-view sync is now shared across card instances instead of tile-local drift

Audit note:

- full card-instance audit confirms the next bounded convergence order after childWork is:
  1. `LockedTeamSeatCard`
  2. `TeamSeatSelectionCard`
  3. selected-seat snapshots in workforce and breakout roster modals

## Loop 4 packet

Name:

- `canonical-card-metric-sync-and-compact-selector-admission`

Intent:

- harden canonical card truth across tabs/windows, keep Barracks metrics readable under real berth constraints, and pull the selected-seat mini-card strips under the same card species instead of keeping custom selector dialects

In scope:

- cross-tab/window metric-view synchronization for canonical card telemetry
- responsive metric wrapping so Barracks berth cards do not silently hide the context tile
- selected-seat strips only:
  - `WorkforceTeamRosterModal`
  - `BreakoutRoomAgentRosterModal`
- compact canonical card variant for selected-seat snapshots

Out of scope:

- full catalog-picker convergence
- locked mission-room seat card convergence
- child/subagent rail admission
- new telemetry semantics beyond the shared metric/readability seam

Seal condition:

- canonical metric views stay aligned more reliably across open tabs/windows
- Barracks berth cards can show the canonical metric pack without silently dropping context
- both selected-seat strips use the canonical card species instead of custom mini-card markup
- proof bar passes and live routes recover after restart

## Loop 4 closeout

Result:

- `sealed`

Three-way verdict:

- real `codex`
  - verdict: `seal`
  - next: `child-subagent-rail-parent-card-admission`
  - risk: parent-child rail admission may still force unresolved density and status-priority decisions once a canonical card must represent nested subordinate state instead of a single seat
- real `voltaris-v2`
  - verdict: `seal`
  - next: `childWork rail canonical admission`
  - risk: parent-card child visibility is still missing, so swarm/subagent work can remain operator-invisible even though the base card system is now much more aligned
- mission lead
  - verdict: `seal`
  - next: `child-subagent-rail-parent-card-admission`
  - risk: the next seam now depends on real lineage truth from OpenClaw runtime and must not be faked from parent-seat status alone

Loop 4 proof:

- `node --test scripts/tests/agent_os_surface_contract.test.mjs` = `PASS`
- `npm run build` = `PASS`
- live route checks after dashboard restart:
  - `/agents` = `200`
  - `/workforce/alpha` = `200`
  - `/strike-team-barracks` = `200`

What changed:

- canonical metric-view sync is now hardened across tabs/windows instead of only within one in-memory page context
- Barracks berth cards now wrap canonical metrics responsively so the context tile is not silently dropped from the operator read
- `WorkforceTeamRosterModal` selected-seat strips now use `AgentOsSeatTile` with a compact canonical variant
- `BreakoutRoomAgentRosterModal` selected-seat strips now use `AgentOsSeatTile` with a compact canonical variant

## Loop 5 packet

Name:

- `canonical-context-pairing-and-full-card-contract-convergence`

Intent:

- finish the admitted baseball-card species convergence for all current `AgentOsSeatTile` surfaces, and make the context runway card express one paired truth instead of reading like contradictory numbers on different pages

In scope:

- shared context-card semantics:
  - paired `headroom` / `in use` truth
  - clearer runway wording on every canonical metric card
- shared card-contract adoption on remaining `AgentOsSeatTile` surfaces:
  - `WorkforceTeamRosterModal`
  - `BreakoutRoomAgentRosterModal`
  - `AgentStudioPage`
  - mission-room locked team seats
  - mission-room draft team seats
- Barracks metric-grid hardening so all three canonical metric tiles stay visible in the berth cards

Out of scope:

- child/subagent rail admission
- breakout-room occupant card migration
- command-node / commander / orchestrator card migration
- label grammar cleanup beyond what the shared card contract now implies

Seal condition:

- all current `AgentOsSeatTile` callsites use one shared copy/metric contract instead of local card dialects
- context cards now show paired runway truth so `100% saturation` and `0% headroom` read as one state, not conflicting states
- mission room, foyer, and Barracks continue to serve live after restart

## Loop 5 closeout

Result:

- `sealed`

Three-way verdict:

- real `codex`
  - verdict: `seal`
  - next: `child-subagent-rail-parent-card-admission`
  - risk: parent-child lineage is still missing from the now-stabilized card shell, so spawned work can still be invisible even when the card species is aligned
- real `voltaris-v2`
  - verdict: `seal`
  - next: `childWork rail canonical admission`
  - risk: status language is now calmer, but the system still does not show bounded child work on the parent card where operators now expect to see it
- mission lead
  - verdict: `seal`
  - next: `child-subagent-rail-parent-card-admission`
  - risk: command-only card species still exist, but the seat-card family is now aligned enough that the next highest-trust gain is child-work truth, not more visual churn

Loop 5 proof:

- `node --test scripts/tests/agent_os_surface_contract.test.mjs` = `PASS`
- `npm run build` = `PASS`
- live route checks after dashboard restart:
  - `/agents` = `200`
  - `/workforce/alpha` = `200`
  - `/strike-team-barracks` = `200`

What changed:

- context cards now show paired runway truth, so the operator can see `headroom` and `in use` as one bounded state instead of separate competing reads
- the shared card copy contract now governs:
  - compact selected-seat cards in workforce and breakout selectors
  - studio composition seats
  - mission-room locked team seats
  - mission-room draft team seats
- Barracks berth cards now reserve room for the full three-metric canonical pack

## Loop 6 packet

Name:

- `child-work-rail-and-runtime-runway-source-alignment`

Intent:

- fix the last big “same card, different truth” seam by making the roster wall use the same stronger seat-runtime runway evidence as the mission room, and admit a bounded child-work rail on the canonical parent card so spawned work has a truthful home when it is live

In scope:

- align `/api/agents` roster context truth with the stronger mission-room seat seam
- add canonical `childWork` support to the shared seat-card contract
- render the bounded child-work affordance + hover bubble on the canonical card
- carry that same card species into:
  - Agents roster wall
  - Strike Team mission room
  - Strike Team Barracks
- run a full sidecar audit of remaining card-instance drift and record the strict convergence order

Out of scope:

- faking child-work visibility when no active child run exists
- full command-card / BORF / breakout occupant convergence
- broad label-grammar rewrite beyond logging the next bounded cleanup seam

Seal condition:

- the same seat can no longer read as saturated on one primary surface and empty on another
- the canonical seat card can accept bounded `childWork` truth without inventing a second card species
- the remaining card-fork list is explicit and ordered
- proof bar passes and the three live Agent surfaces recover after restart

## Loop 6 closeout

Result:

- `sealed`

Three-way verdict:

- codex lane
  - verdict: `seal`
  - next: `live-child-work-proof-on-parent-card`
  - risk: the child-work rail is now admitted, but tonight’s current mission still has no active child run to render, so the next highest-trust move is a real parent-child proof rather than more card chrome
- voltaris lane
  - verdict: `seal`
  - next: `status-grammar-unification-after-child-proof`
  - risk: the cards are much closer now, but wording like `active`, `in progress`, and `on station` can still drift operator confidence until the live child-work path is proven and the grammar is unified
- mission lead
  - verdict: `seal`
  - next: `live-child-work-proof-on-parent-card`
  - risk: command and breakout card families still remain, but the highest-value next seam is proving the newly admitted child-work rail with real runtime lineage instead of widening the visual sweep again tonight

Loop 6 proof:

- `node --test scripts/tests/agent_os_surface_contract.test.mjs` = `PASS`
- `npm run build` = `PASS`
- live route checks after dashboard restart:
  - `/agents` = `200`
  - `/workforce/alpha` = `200`
  - `/strike-team-barracks` = `200`

What changed:

- `/api/agents` roster cards now inherit stronger mission-seat runway truth instead of weaker inspector fallback context, removing the `100% vs 0%` contradiction
- the canonical seat card now has a bounded `childWork` rail and hover bubble for parent-attached child work
- the shared metric-view state was version-bumped so stale tab-local context labels stop leaking across surfaces
- the full card-instance audit is now explicit; the remaining strict convergence order is:
  1. `LockedTeamSeatCard`
  2. `TeamSeatSelectionCard`
  3. `WorkforceTeamRosterModal` selected-seat strip
  4. `BreakoutRoomAgentRosterModal` selected-seat strip
  5. `AgentStudioPage` composition seats
  6. `WorkforceTeamRosterModal` catalog cards
  7. `BreakoutRoomAgentRosterModal` catalog cards
  8. `LeadOrchestratorTile`
  9. `CommanderTile`
  10. `CommandNodeCard`
  11. `HiveMindBreakOutRoomPage` participant cards
  12. `HiveMindBreakOutRoomPage` BORF pod
  13. `AgentStudioPage` seat spotlight hero
