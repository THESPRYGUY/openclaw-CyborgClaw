# Mission Control / Live Dev Feed Strategy Brief

Date: 2026-04-08
Status: Pre-admission strategy brief
Mission anchor: Mission 018
Dependency gate: Mission 017 must close before this work is admitted as execution work.

## Why this brief exists

The operator wants the current Live Dev Feed surface to adopt the same top-panel
grammar as the Agent Control foyer, but with a new mission-first identity:
`Mission Control`.

This brief anchors that idea in the current CyborgClaw mission doctrine without
pretending the underlying data model is already finished.

As of 2026-04-08:

- `mission-017` is still open with status `ACTIVE_ITEM_5_PROVEN_PENDING_CLOSEOUT`
- `mission-018` remains `QUEUED_BEHIND_MISSION_017`

That means this document is a convergence and sequencing brief, not permission to
ship misleading surface claims early.

Mission Control is a foyer and router. It is not a new semantic owner of mission
lifecycle truth.

## Product objective

Turn the top of `/live-dev-feed` into a mission-routing foyer that:

- looks and feels like the existing Agent Control foyer header panel
- is renamed to `Mission Control`
- presents six bounded mission buttons in one canonical launcher strip
- keeps one shared truth contract with adjacent mission surfaces
- gives the operator one clear first read:
  - what is in flight now
  - what is staged and waiting for dispatch
  - what is still moving through Golden Run / Flow preparation
- does not overclaim data truth that the current backend does not yet provide

## Hero strip contract

Above the six-button launcher, Mission Control should carry one compact shared
hero strip that answers:

- hero mission
- current phase
- next action
- truth posture
- publish is not live

This keeps the page aligned to the Golden Run spine instead of turning the new
header into decoration-only chrome.

## Converged positions

### Codex position

- Reuse the foyer grammar by sharing the launcher contract and renderer, not by
  copying the entire Agents page.
- Keep `AgentOsPageShell` as the shared hero shell.
- Extract one canonical launcher model and one canonical launcher renderer.
- Give Live Dev Feed its own shell modifier class instead of inheriting the
  exact `agentControlFoyerShell` layout rules.
- Do not let Live Dev Feed loading state drive unrelated launcher tiles such as
  `Agent RSI`.

### Voltaris position

- `Mission Control` should be a mission-lifecycle router, not just a prettier
  evidence inventory header.
- `Mission Control` must not become a second lifecycle authority.
- The first three buttons must map to distinct operator questions:
  - What is actively in flight?
  - What is ready for dispatch but not yet assigned?
  - What is still moving through Golden Run / Flow preparation?
- If the data is not yet truthful, the surface must say `standby` or
  `placeholder` rather than fake readiness.
- Evidence can remain on the page, but it becomes supporting rail truth, not the
  whole identity of the page.
- Buttons 4-6 should be visibly reserved until real operator demand and real
  backing contracts exist.

## Operator follow-up notes (2026-04-08)

After the first shell pass, the operator added three explicit next-step notes:

- `Mission Control` now needs to surface beside `Agents` in the top nav.
- `Mission Staging` should stop feeling like a popup detour and instead switch
  the Mission Control page into a staging-only mission read.
- `Mission Prep` can keep handing off to `/flow`, but `/flow` should be
  refit toward the Mission Control base layout grammar in Phase 2 truth work.

Codex and Voltaris converge on the same interpretation:

- `Live Mission Feed` and `Mission Staging` are modes inside one Mission
  Control foyer.
- `Mission Prep` is the current deeper-work handoff until `/flow` converges.
- nav, launcher, and page chrome should reinforce that split instead of
  making staging feel like a side-room or popup.

## Proposed Mission Control launcher

The launcher should contain six buttons in this exact order.

### 1. Live Mission Feed

- Role: current page / current module
- Intent: show in-flight jobs only
- Initial posture: active
- Truth requirement:
  - only missions with live runtime ownership or active workforce execution
  - no draft, queue-only, or prep-only work
- Current gap:
  - the existing `/live-dev-feed` body is backed by `/api/evidence/index`
  - that is an evidence inventory, not an in-flight mission feed

### 2. Mission Staging

- Role: queued `GO` missions waiting on strike-team assignment and dispatch
- Initial posture: live link if routed to an existing staging surface, otherwise
  `standby`
- Closest current source:
  - DEV staging queue and execution-authorization seams
- Truth boundary:
  - mission is fully cleared for execution admission
  - mission does not yet have an active workforce job card in flight

### 3. Mission Prep

- Role: missions actively moving through Golden Run / Flow preparation
- Initial posture: live link to an adjacent prep surface or `standby` until the
  contract is explicit
- Closest current source:
  - Flow / Golden Run / Agent RSI prep semantics
- Truth boundary:
  - prep work is active
  - runtime dispatch has not begun

### 4. Mission Dispatch

- Role: future model placeholder
- Initial posture: standby
- Recommended initial label in UI: `Reserved 04`
- Intended future scope:
  - president delegation
  - seat fan-out
  - dispatch ledger and mission transport truth

### 5. Mission Proof

- Role: future model placeholder
- Initial posture: standby
- Recommended initial label in UI: `Reserved 05`
- Intended future scope:
  - proof back-briefs
  - executive review
  - governance and receipt convergence

### 6. Mission Archive

- Role: future model placeholder
- Initial posture: standby
- Recommended initial label in UI: `Reserved 06`
- Intended future scope:
  - sealed runs
  - autopsies
  - historical mission grounding and replay

## Canonical launcher data contract

The six-button launcher should normalize into one shared record shape:

```js
{
  (key, label, to, statusLabel, tone, detail, disabled, current);
}
```

Rules:

- `disabled` must be explicit; do not use empty routes as a proxy.
- `current` must derive from the current path, not from page-local assumptions.
- one canonical ordered launcher array should exist for Mission Control surfaces
- dynamic tiles are allowed, but they must resolve into the same final shape
- shell navigation and launcher tiles should stay separate contracts
- the launcher is a set of filtered mission views, not the lifecycle itself

## Truth model for the first three buttons

### Live Mission Feed truth

Include only work that is genuinely in flight:

- delegated
- acknowledged
- in progress
- awaiting review
- blocked, if the mission remains live and owned

Exclude:

- draft work
- queue-only staging work
- prep-only Golden Run candidates
- sealed or archived work

### Mission Staging truth

Include only work that is:

- admitted or cleared in staging
- explicitly `GO` or execution-authorized
- waiting for strike-team promotion or dispatch

Exclude:

- prep work that has not reached staging
- already promoted job cards in flight
- closed or archived missions

### Mission Prep truth

Include only work that is:

- actively moving through Golden Run / Flow preparation
- being shaped, scored, packeted, reviewed, or preflighted
- not yet in runtime dispatch

Exclude:

- pure backlog noise
- staging work already cleared for dispatch
- live in-flight missions

## Supporting state chips

Every mission row or tile shown through these views should also carry:

- provenance:
  - `live`
  - `derived`
  - `stale`
- gate posture:
  - `pass`
  - `held`
  - `block`

`held` must stay distinct from generic warning posture. A lawful dependency hold
is not the same thing as degraded or stale truth.

## Existing surface mapping

This is the safest initial mapping for mission scoping.

- `Live Mission Feed`
  - keep `/live-dev-feed` as the current route for now
  - but treat the current body as temporary because it is still evidence-backed
- `Mission Staging`
  - use `/live-dev-feed?view=staging` as the same-surface Mission Control mode
  - pull truth from the DEV staging queue instead of reopening the Development
    popup path
- `Mission Prep`
  - nearest current seams are Flow, Golden Run, and Agent RSI prep semantics
  - keep `/flow` as the current handoff until that page converges on the
    Mission Control shell grammar
- `Mission Dispatch`
  - future seam centered on workforce mission dispatch
- `Mission Proof`
  - future seam centered on governance / proof review
- `Mission Archive`
  - future seam centered on sealed closeout and historical grounding

## Recommended phased plan

### Phase 0 - Strategy anchor only

- File this brief
- Keep Mission 018 queued behind Mission 017 closeout
- Do not claim new truth semantics yet

### Phase 1 - Shell convergence

- Rename the Live Dev Feed hero to `Mission Control`
- Install the six-button launcher using the Agent Control foyer grammar
- Extract a shared launcher builder and shared launcher renderer
- Add the shared hero strip with mission, phase, next action, truth posture, and
  publish-not-live copy
- Keep the page body functionally unchanged for the moment
- Launch the first three real buttons and three visibly reserved slots

Success bar:

- launcher is visually converged
- no page-local tile drift
- no false mission semantics

### Phase 2 - Honest Live Mission Feed

- Promote `Mission Control` into the primary top nav beside `Agents`
- Replace the current top-level mission claim with a real in-flight mission feed
- Demote raw evidence inventory to a supporting rail below the live mission read
- Bind the current tile to actual in-flight job truth
- Wire the current tile to the room that owns the next move instead of trapping
  the operator in one page

Success bar:

- button 1 is no longer just renamed evidence inventory
- in-flight jobs only means exactly that

### Phase 3 - Honest Mission Staging

- Keep button 2 inside the same Mission Control frame rather than routing into
  a Development popup
- Bind button 2 to GO-cleared staging work waiting on team assignment
- Ensure this excludes already-live job cards

Success bar:

- operator can see which missions are dispatch-ready but still unassigned

### Phase 4 - Honest Mission Prep

- Bind button 3 to Golden Run / Flow preparation truth
- Refactor `/flow` toward the Mission Control base layout without flattening
  Flow-specific semantics into generic shell chrome
- Keep this blocked behind Mission 017 SSOT closeout if it depends on Golden Run
  status semantics remaining trustworthy

Success bar:

- operator can distinguish prep work from staging and live runtime work

### Phase 5 - Admit future models

- Reserved 04
- Reserved 05
- Reserved 06

Only admit these when their contracts are explicit enough to avoid placeholder
drift.

## Primary risks

- The current `/live-dev-feed` route is still an evidence feed, not a mission
  feed.
- Copy-pasting launcher data from the Agents page would create drift.
- Reusing the exact foyer shell modifier would import layout assumptions tuned to
  `Agent Control foyer`.
- If the page loading state drives launcher status, unrelated tiles may flicker
  into false `Refreshing` states.
- Renaming the hero before the data is honest could create operator trust debt.
- Mission 018 work must not widen into a broad redesign before Mission 017
  closes.

## Stop conditions

Stop and re-scope if any of the following become true:

- the work starts depending on Golden Run truth that Mission 017 has not sealed
- the page starts claiming `in-flight only` without a real in-flight contract
- the launcher drifts into a second copy of shell navigation
- the slice widens from surface convergence into a new mission-control platform

## Acceptance bar for the first admitted slice

- `Mission Control` replaces the current hero title on `/live-dev-feed`
- the six-button launcher renders in canonical order
- button states are honest:
  - live where backed by admitted truth
  - standby where still placeholder
- the current page remains usable on desktop and mobile
- the launcher contract is shared rather than duplicated
- Mission 018 remains explicitly framed as convergence work, not a freeform
  redesign campaign
