# CYBORGCLAW Canonical Agent Tile Spec

Status: draft standard
Owner: Voltaris V2
Intent: prevent agent tile design drift and establish one canonical CYBORGCLAW agent baseball card across all surfaces.

## Purpose

CYBORGCLAW must use one canonical agent tile design across the system.

This tile is the canonical **agent baseball card**. Variants may change data density or interactivity for a given surface, but they must not drift from the shared visual grammar, layout identity, or thematic frame.

## Core rule

There is exactly **one canonical CYBORGCLAW agent tile design**.

All future roster walls, mission floors, seat galleries, agent directories, and control-plane agent cards should inherit from this spec instead of inventing local tile styles.

## Design intent

The canonical card should feel like:

- a governed mission-control baseball card
- a premium sci-fi operator badge
- a stable identity object that can scale from one card to many
- part of one coherent CYBORGCLAW visual language

It should not feel like:

- a random dashboard widget
- a generic SaaS profile card
- a local one-off design experiment
- a drifting seat-specific mockup

## Canonical structure

Each canonical agent tile should contain these layers, in this rough order:

1. **Outer frame**
   - rounded rectangular card
   - restrained premium border
   - subtle glow or edge light
   - supports state accenting without changing the base card identity

2. **Header badges row**
   - station or pod label
   - readiness / status chip
   - optional mission-role chip when needed

3. **Avatar theater**
   - centered agent avatar / robot portrait zone
   - avatar remains the focal object
   - stage lighting should support readability, not overwhelm it

4. **Rear window layer**
   - every card includes a visible "window" behind the avatar
   - the window depicts cool space / spaceship backdrops
   - this is not the full card background; it is a framed scenic layer behind the agent
   - the window must feel like the agent is stationed in a futuristic room, ship, dock, or orbital vantage point

5. **Identity block**
   - display name
   - agent id / seat id secondary line
   - optional team or unit label

6. **Tag / affinity strip**
   - mission affiliation
   - specialization
   - model / runtime family when appropriate
   - route or lane tags when appropriate

7. **Mission status copy**
   - one concise sentence of current assignment, state, or blocking note

8. **Metrics or actions zone**
   - either action buttons or compact metrics
   - surface-specific, but still visually consistent with the canonical frame

## Rear window standard

The new rear window is mandatory.

### Window rules

- The window sits behind the avatar, visually integrated into the avatar theater.
- It is framed or implied as an architectural opening, viewport, hangar slit, or command-deck window.
- It should read as a **scene behind the agent**, not as a wallpaper pasted across the entire card.
- It should support a sci-fi control-room mood.
- It must not reduce avatar legibility.
- It must not dominate the card more than the agent itself.

### Approved backdrop themes

Use one of these backdrop families:

- starfields with distant ships
- spaceship corridor or bridge windows
- orbital dock or station exterior views
- nebula-lit ship hull silhouettes
- planetary horizon with passing craft
- deep-space mission traffic or fleet silhouettes

### Avoid

- noisy photoreal clutter
- comedic chaos
- bright scenes that wash out the avatar
- highly detailed imagery that fights text readability
- anything that turns the card into a poster instead of a control artifact

## Standardization rules

To avoid design drift:

- keep one shared silhouette for the card
- keep one shared avatar-theater layout
- keep one shared rear-window treatment language
- keep one shared badge language
- keep one shared type hierarchy
- keep one shared spacing rhythm
- keep one shared action / metrics footer language

Allowed variation:

- seat labels
- status chips
- metric values
- mission sentence
- backdrop scene variant within the approved rear-window family
- accent colors for state, as long as the base card identity remains canonical

Not allowed without explicit approval:

- changing the overall card silhouette
- moving the avatar theater to a different structural position
- replacing the rear window with unrelated decorative motifs
- introducing a second competing card style for another mission floor
- flattening the card into a generic table cell or profile rectangle while still calling it the canonical CYBORGCLAW tile

## Visual hierarchy

Priority order:

1. agent identity
2. agent state
3. mission context
4. action / metrics
5. scenic atmosphere

The scenic rear window is important, but it is fourth-order support for identity and mood. The card must still work when viewed quickly in a dense roster.

## Accessibility and readability

- all text must preserve strong contrast
- scenic layers should be darkened, blurred, masked, or gradient-treated as needed
- the avatar and name must remain readable at dense dashboard sizes
- badges should remain distinguishable across active, waiting, constrained, blocked, and ready states

## Implementation principle

When implemented in product surfaces, teams should build:

- one shared canonical tile component
- one shared token set for spacing, border, glow, chips, and theater window styling
- one shared backdrop-scene system for the rear window

Mission-floor pages should compose the canonical card, not restyle it from scratch.

## Working interpretation for current mockups

Based on current progress, the preferred direction is:

- keep the strong dark mission-floor shell
- preserve the centered robot avatar staging
- unify the card proportions and footer regions
- add the rear scenic window behind every agent avatar
- make that window space / ship themed across all seats
- evolve existing cards toward one premium canonical baseball-card design instead of letting each screen fork the design language

## Next implementation target

When we move into the product repo, the next task should be:

1. identify all current agent tile variants
2. select one canonical base component
3. refactor other variants to inherit from it
4. add the mandatory rear window scene layer
5. verify no card family remains visually divergent

## One-sentence standard

**CYBORGCLAW agent tiles are canonical sci-fi baseball cards with a standardized avatar theater and a framed rear window showing space or spaceship scenery behind the agent.**
