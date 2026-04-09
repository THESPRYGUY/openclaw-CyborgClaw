# Mission 018 Phase 1 Implementation Checklist

Goal: land the bounded shell-convergence slice for `/live-dev-feed` without
claiming new mission truth that the backend does not yet provide.

## Contract guardrails

- [ ] keep Mission 018 explicitly blocked behind Mission 017 semantic closeout
- [ ] treat Mission Control as a router / foyer, not a second lifecycle authority
- [ ] do not relabel the current body as `in-flight jobs only`
- [ ] keep raw evidence inventory as the supporting rail for this first slice

## Dashboard shell work

- [ ] rename the `/live-dev-feed` hero to `Mission Control`
- [ ] add a Mission Control hero shell using the Agent Control foyer visual grammar
- [ ] preserve the current page route as `/live-dev-feed`
- [ ] keep the existing evidence card below the new hero shell

## Launcher work

- [ ] extract a shared launcher renderer component from the current foyer tile grid
- [ ] keep launcher layout and tile styling on the existing shared class family
- [ ] add a Mission Control-specific launcher data builder
- [ ] make launcher `current` state derive from the route, not page-local constants
- [ ] make `disabled` explicit instead of using empty routes

## Phase 1 launcher buttons

- [ ] button 1: `Live Mission Feed`
- [ ] button 2: `Mission Staging`
- [ ] button 3: `Mission Prep`
- [ ] button 4: `Reserved 04`
- [ ] button 5: `Reserved 05`
- [ ] button 6: `Reserved 06`

## Button semantics

- [ ] `Live Mission Feed` remains the current route in Phase 1
- [ ] `Mission Staging` links to the nearest admitted staging surface
- [ ] `Mission Prep` links to the nearest admitted Flow / Golden Run prep surface
- [ ] `Reserved 04-06` render as visible placeholders with standby posture
- [ ] no placeholder should imply a live backing model

## Copy and posture

- [ ] hero copy explains that Mission Control routes the operator across mission views
- [ ] hero copy keeps publish and runtime authority separate
- [ ] launcher detail copy stays operational and blunt
- [ ] any unsupported or not-yet-truthful route uses `standby` or `reserved`, not fake `live`

## Styling and responsiveness

- [ ] give Live Dev Feed its own shell modifier instead of inheriting the exact foyer override
- [ ] preserve the current 3 / 2 / 1 tile responsiveness pattern
- [ ] verify the new shell works on desktop, tablet, and narrow mobile

## Verification

- [ ] add or update focused tests for the shared launcher renderer / module builder
- [ ] keep existing surface-audit expectations passing
- [ ] run the relevant Sprytly UI tests
- [ ] run the web build in the dashboard repo
- [ ] manually verify `/live-dev-feed` renders Mission Control hero + launcher + existing evidence rail

## Explicit non-goals for Phase 1

- [ ] do not redesign adjacent boards
- [ ] do not rewrite Golden Run semantics
- [ ] do not yet replace the evidence inventory with a true in-flight mission feed
- [ ] do not admit real backing contracts for Reserved 04-06
