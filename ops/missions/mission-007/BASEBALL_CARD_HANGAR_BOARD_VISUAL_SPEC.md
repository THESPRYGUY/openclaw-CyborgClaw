# Mission 007 — Baseball Card and Hangar Board Visual Spec

Status: draft visual target  
Mission anchor: `ops/missions/mission-007/spec.md`  
Depends on:

- `ops/cyborgclaw/CANONICAL_AGENT_TILE_SPEC.md`
- `ops/cyborgclaw/CANONICAL_AGENT_TILE_TOKENS.md`
- `ops/cyborgclaw/CANONICAL_AGENT_TILE_SCHEMA.md`
- `ops/missions/mission-007/WIREFRAME_FLOW.md`

Intent: define the polished visual target for the CyborgClaw operator experience so the system feels like one premium baseball-card and hangar-board family instead of several adjacent dashboard styles.

---

## 1. Design thesis

The operator should feel like they are working inside:

- a premium sci-fi garage
- a first-person shooter loadout hangar
- a mission-control board where every object is equipped, constrained, and committed

This should not feel like:

- a generic admin dashboard
- a form-heavy schema editor
- a metrics wall with decorative neon
- multiple unrelated card systems fighting for attention

The visual system has two primary objects only:

1. the **canonical agent baseball card**
2. the **hangar board**

Everything else is secondary framing around those two objects.

---

## 2. Non-negotiable visual rules

1. There is still only one canonical agent baseball card.
2. Agent Design Studio composes one hero baseball card under the spotlight.
3. Strike Team Design Studio composes many canonical baseball cards onto one hangar board.
4. The hangar board does not invent a second seat-card family.
5. Status truth must be stronger than decoration.
6. Publish must never look the same as runtime-effective.
7. One screen should always have one hero object, one main decision, and one next action.

---

## 3. Overall style direction

### Atmosphere

- dark-shell control plane
- cinematic but restrained
- premium, not playful
- industrial sci-fi, not cyberpunk clutter

### Material language

- matte command-deck shell
- inset chambers and rails
- framed apertures
- subtle glows and edge lights
- mechanical docking language

### Color behavior

Base shell should stay dark and stable.

Use accent color only for:

- readiness
- warning
- blocked
- live
- selection

Accent should never become wallpaper.

### Motion behavior

Motion should be minimal and purposeful:

- card lift on hover
- aperture glow when selected
- subtle slot confirmation when assigning a seat
- calm stage-rail pulse when the next action is waiting

No ambient motion spam.

---

## 4. Canonical baseball card usage

The agent baseball card is already defined in the canonical specs.

This document does **not** replace that standard.

It defines how the canonical card should be used in the product.

### Card role in Agent Design Studio

In Agent Design Studio, the card is:

- the hero object
- the main identity object
- the thing being designed, tuned, validated, and published

The operator should feel like:

- “I am shaping this one specialist seat.”

### Card role in Strike Team Design Studio

In Strike Team Design Studio, the card is:

- a seat token
- a formation unit
- a governed specialist object

The operator should feel like:

- “I am composing these specialist cards into a team.”

### Card role in Workforce / Mission floors

In workforce and mission rooms, the card is:

- the live or projected mission seat
- the readable truth object
- the basis for quick posture decisions

The operator should feel like:

- “I can trust what this seat card is telling me.”

---

## 5. Agent Design Studio visual spec

### Primary metaphor

`Specialist garage bay`

The page should feel like one tuned machine in one bay, not a wall of inspectors.

### Page structure

```text
+---------------------------------------------------------------------------------------------------+
| AGENT DESIGN STUDIO                                                                               |
| Seat spotlight | Draft / Published / Runtime accepted | One next action                           |
+---------------------------------------------------------------------------------------------------+

+----------------------------------------------+  +------------------------------------------------+
| HERO GARAGE BAY                              |  | RIGHT RAIL                                     |
|                                              |  |                                                |
|  [CANONICAL BASEBALL CARD]                   |  |  Seat readiness                                |
|                                              |  |  Publish state                                 |
|  Role / specialty                            |  |  Runtime boundary                              |
|  Non-goals                                   |  |  One next action                               |
|  Overlay budget                              |  |                                                |
|                                              |  |  Secondary drawers                             |
|  Primary action rail                         |  |  - Technical details                           |
|  - Design seat                               |  |  - RSI                                         |
|  - Validate seat                             |  |  - Medic                                       |
|  - Publish seat                              |  |  - Advanced JSON                               |
+----------------------------------------------+  +------------------------------------------------+
```

### Hero hierarchy

Priority order:

1. baseball card
2. specialty
3. readiness
4. next action
5. non-goals and overlay budget
6. technical detail

### Garage bay controls

Primary visible controls:

- choose role / specialty
- choose brain
- choose doctrine pack
- choose bounded overlays
- validate seat
- publish seat

Secondary controls:

- raw compile output
- raw validate output
- full model policy
- detailed RSI / Medic internals

### Main visual behavior

- one spotlight bay with strong frame
- card centered or slightly left-of-center
- right rail calm and narrow
- readiness should read as “pit board” not “compliance spreadsheet”

### What should be visually demoted

- long chip rows
- verbose lifecycle pill clutter
- raw artifact lists
- deep doctrine detail
- low-level JSON or compiler seams

---

## 6. Strike Team Design Studio visual spec

### Primary metaphor

`Formation hangar`

The page should feel like a squad loadout room with docking slots, not a second seat editor.

### Page structure

```text
+---------------------------------------------------------------------------------------------------+
| STRIKE TEAM DESIGN STUDIO                                                                         |
| Team spotlight | Commander | Team blockers | Publish team                                         |
+---------------------------------------------------------------------------------------------------+

+---------------------------------------------------------------------------------------------------+
| TOP HANGAR BAR                                                                                    |
| Team name | Genome root | Coverage gaps | Team blockers | Next action                             |
+---------------------------------------------------------------------------------------------------+

+------------------------------+  +-------------------------------------------------+  +-----------+
| COMMANDER DOCK               |  | CORE FORMATION                                  |  | BENCH     |
|                              |  |                                                 |  | HANGAR    |
|  [Commander card]            |  |  [Card] [Card] [Card]                          |  | [Card]    |
|                              |  |  [Card] [Empty slot] [Empty slot]              |  | [Card]    |
|  Team constitution summary   |  |                                                 |  | [Card]    |
+------------------------------+  +-------------------------------------------------+  +-----------+

+---------------------------------------------------------------------------------------------------+
| SEAT INSPECTOR DRAWER                                                                            |
| Seat definition — read-only here                                                                  |
| Team assignment — editable here                                                                   |
| Open in Agent Design Studio                                                                       |
+---------------------------------------------------------------------------------------------------+
```

### Formation board rules

The board must visually separate:

- commander
- core seats
- bench seats
- empty slots
- blocked slots

### Card usage on the board

All seat cards on the board remain canonical baseball cards.

The board can use a smaller or denser display mode, but it must preserve:

- silhouette family
- avatar theater
- rear window
- top rail
- identity block
- footer logic

### Team board hierarchy

Priority order:

1. team objective / next action
2. commander dock
3. core formation
4. blockers / gaps
5. bench hangar
6. inspector detail

### What should never dominate

- overlay internals
- doctrine pack internals
- seat-authoring controls
- artifact metadata
- deep governance prose

### Allowed edit language

Primary team verbs:

- Compose team
- Assign seats
- Review coverage
- Review blockers
- Publish team

Disallowed team-first wording:

- Edit seat deeply
- Rewrite doctrine here
- Tune seat internals here

That work belongs in Agent Design Studio.

---

## 7. Canonical baseball card: polished visual target

### Desktop full card

```text
+----------------------------------------------------------------------------------+
| STUD pod                                        READY                             |
|                                                                          AE lead |
|                                                                                  |
|                        [ framed rear window / dock aperture ]                    |
|                                                                                  |
|                                [ agent avatar ]                                  |
|                                                                                  |
|                          Application Engineering Director                        |
|                               dir-application-eng-01                              |
|                                                                                  |
|       Strike Team Alpha      application engineering lead      openai-codex      |
|                                                                                  |
|  Awaiting president acknowledgement before widening the lane.                    |
|                                                                                  |
|   TOKENS              CONTEXT               COST                                  |
|   91.9k               100%                  $0.28                                 |
+----------------------------------------------------------------------------------+
```

### Visual notes

- The rear window is mandatory.
- The avatar remains dominant over the scenic layer.
- The top rail must feel like a real pod/station label, not decorative garnish.
- Footer metrics must feel docked into the card shell.
- Status should accent the card, not repaint the whole card.

### Card lighting behavior

- ready: cyan or cool blue rim
- active: stronger electric blue
- waiting: violet / soft lavender
- warning / constrained: amber
- blocked: restrained red

Do not flood the full card with these states.

### Copy density rules

- top rail: maximum 2 pills
- affinity strip: maximum 3 chips
- mission sentence: 1 to 2 lines
- footer: 3 compact metrics max on full card

---

## 8. Hangar board: polished visual target

### Board shell

The board itself should feel like:

- an illuminated deck plan
- a tactical docking wall
- a squad layout table inside a hangar

Not:

- a Trello board
- a responsive card grid with random spacing
- a generic Kanban surface

### Board composition language

- empty slots should be explicit docking outlines
- filled slots should feel locked into the board
- commander dock should be visually distinct and more premium than core slots
- core seats should read as the current battle group
- bench seats should read as available reserve specialists

### Slot states

Use slot framing before you use more color:

- empty slot: dashed or recessed dock
- assigned slot: framed and lit
- blocked slot: assigned but hard red edge / hazard indicator
- stale slot: amber or dimmed with “stale” truth
- selected slot: brighter aperture halo, not giant neon flood

### Board background

Approved atmosphere:

- subtle topographic grid
- hangar floor panel seams
- faint fleet-routing lines
- sparse instrument lighting

Avoid:

- heavy texture noise
- giant gradients that flatten the cards
- decorative stars or nebulae behind the whole board

The board is a deck, not a poster.

---

## 9. Screen-by-screen visual targets

### Agents foyer

Goal:

- readable roster wall
- premium canonical cards
- fast trust at a glance

Visual priority:

1. selected team posture
2. roster wall
3. card truth
4. inspector drawer

### Workforce mission floor

Goal:

- live mission truth
- comms and seat posture clarity
- docs and receipts visible but secondary

Visual priority:

1. STUD pod
2. active seat cards
3. mission posture
4. docs rail

### Agent Design Studio

Goal:

- one seat under a spotlight
- one obvious next action
- deep controls hidden until needed

### Strike Team Design Studio

Goal:

- one team as a formation
- commander/core/bench made obvious
- seat definition visible but not editable there

---

## 10. Responsive behavior

### Desktop

- baseball card remains near full canonical ratio
- hangar board uses lateral spread
- right rails and drawers remain secondary

### Laptop

- board compresses spacing before it changes card identity
- command dock remains visually distinct
- inspector becomes narrower, not louder

### Tablet

- hangar board becomes stacked zones:
  - commander
  - core formation
  - bench
- canonical cards may use a compact derivative, but still preserve silhouette family

### Mobile

- Agent Studio: hero seat first, drawers below
- Team Studio: one selected seat at a time with board navigation above
- never collapse into plain list rows while still claiming the canonical card system is present

---

## 11. Visual do / do not list

### Do

- use one premium dark-shell card family
- keep one rear-window scenic language
- make the hangar board feel architectural
- emphasize truth and next action
- keep publish/runtime distinction visible

### Do not

- invent new card shells for individual pages
- flatten cards into generic dashboard rectangles
- use huge chip clouds as the primary information structure
- let the scenic layer overpower the avatar
- let the board become a generic grid
- let team composition look like hidden seat authoring

---

## 12. Acceptance checklist

The spec is being honored if:

1. the same seat looks like the same seat on every major surface
2. Agent Studio feels like one specialist garage bay
3. Strike Team Studio feels like one formation hangar
4. the baseball card remains the canonical seat object
5. the hangar board composes the canonical cards instead of replacing them
6. the operator can identify the hero object and next action in under 3 seconds
7. publish never visually reads as runtime-effective

If any of those fail, the visual system is drifting again.

---

## 13. One-sentence standard

**CyborgClaw should present specialists as premium canonical baseball cards and teams as those same cards composed into a tactical hangar board, with truthful state and one obvious next action always stronger than decoration.**
