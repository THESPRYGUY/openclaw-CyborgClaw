# Break-Out Room Card Debug Report - 2026-04-07

This note captures the direct consultation used to shape the next bounded
De-Bug Golden Run for the Break-Out Room page in the Sprytly dashboard.

## Codex dev report

Direct report from real `codex`:

1. Intended UI change:
   - move Break-Out Room onto the canonical Agent OS card language
   - elevate chat into a wide landscape console under the cards
   - move inject / pause / summarize / freeze controls above the cards
   - add a restart-room action with a fresh 5 minute window
2. Files/components changed or expected:
   - `../sprytly-internal-dashboard/web/src/pages/HiveMindBreakOutRoomPage.jsx`
   - `../sprytly-internal-dashboard/web/src/pages/agentOs/AgentOsComponents.jsx`
   - `../sprytly-internal-dashboard/web/src/ui/styles.css`
3. Intended render path:
   - BORF through the canonical manager/card path
   - room occupants through canonical `AgentOsSeatTile`
   - not the older custom `breakoutRoomOccupant` stage markup
4. Likely cause of the flicker / revert:
   - initial load shows newer card styling
   - hydrated live-session rendering in `HiveMindBreakOutRoomPage.jsx`
     falls back to old hardcoded facilitator/occupant markup
   - the old stage renderer wins after state/session data arrives
5. Recommended next bounded debug step:
   - replace only the live active-session BORF + occupant render block in
     `HiveMindBreakOutRoomPage.jsx` with canonical card components
   - verify the flicker disappears on hard reload
   - only then continue with the chat/control layout pass

## Voltaris V2 operator report

Direct report from real `voltaris-v2`:

1. Why this bug damages operator trust:
   - if Break-Out Room cards are wrong, operators stop trusting the room as a
     truthful surface for presence, role, and state
   - BORF card truth is part of the operator's mental model, not decoration
2. Correct card behavior:
   - BORF should render as a clearly distinct facilitator/control seat with
     stable semantics
   - participants should render as canonical participant/seat cards with
     correct identity, role, and state
   - operators should be able to see who is BORF, who is present, and what
     each seat is doing at a glance
3. What the De-Bug Golden Run must prove:
   - BORF and participant cards render correctly across the live Break-Out Room
     flow
   - card semantics stay stable through room updates
   - role/state labels stay correct
   - canonical card species does not regress
4. Recommended next step:
   - run one bounded Break-Out Room card-truth Golden Run with explicit
     before/after proof and no adjacent redesign work

## Mission lead synthesis

The root problem is not the URL, branch, or browser cache.

The root problem is a dual-render path:

- one initial path shows the newer shared card presentation
- a second hydrated live-session path swaps BORF and/or occupants back to older
  bespoke Break-Out Room markup

The next packet should be treated as a reliability seam:

- one page
- one render contract
- one proof surface
- one closeout rule
