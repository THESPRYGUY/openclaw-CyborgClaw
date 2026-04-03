# CYBORGCLAW Canonical Agent Tile Tokens

Status: draft implementation companion
Depends on: `ops/cyborgclaw/CANONICAL_AGENT_TILE_SPEC.md`
Intent: convert the canonical CYBORGCLAW agent baseball card standard into implementation-ready visual tokens, structural ratios, and scene rules.

## Purpose

This document defines the implementation grammar for the canonical CYBORGCLAW agent tile.

Use this when building or refactoring any:

- mission floor seat card
- roster card
- agent directory card
- workforce tile
- control-plane agent baseball card

This is the concrete companion to the higher-level canonical spec.

## Canonical card silhouette

### Base aspect

Preferred desktop card ratio:

- width: 320
- height: 452
- aspect: approximately 0.708

Acceptable range when responsive:

- width: 280-360
- height should preserve the overall vertical composition

Do not collapse the canonical card into a wide horizontal card unless a separate approved compact derivative is defined.

### Corner radius

- outer card radius: 26px
- inner panel radius: 22px
- window radius: 18px to 22px depending on frame style
- badge radius: pill / fully rounded
- footer action button radius: 14px to 16px

### Border and frame

- outer border: 1px solid rgba(255,255,255,0.14)
- inner edge highlight: 1px inset rgba(255,255,255,0.07)
- frame glow: soft blue, cyan, violet, or amber depending on state
- shadow stack should feel premium but not glassy-toy

Recommended shadow stack:

- ambient shadow: `0 24px 60px rgba(3, 8, 20, 0.45)`
- local shadow: `0 8px 22px rgba(0, 0, 0, 0.28)`
- rim glow: `0 0 0 1px rgba(140, 180, 255, 0.12), 0 0 24px rgba(88, 140, 255, 0.12)`

## Canonical vertical layout

Use this order and approximate allocation:

1. top badge rail: 10%
2. avatar theater including rear window: 44%
3. identity block: 14%
4. tags / affinity strip: 10%
5. mission sentence: 12%
6. footer metrics / actions: 10%

This can flex slightly, but the avatar theater must remain the dominant zone.

## Color system

### Base card colors

Preferred dark-shell base:

- card shell: `#0b1020`
- panel surface: `#11182b`
- elevated panel: `#18233a`
- border neutral: `rgba(196, 210, 255, 0.18)`
- text primary: `#eef4ff`
- text secondary: `rgba(222, 231, 255, 0.72)`
- text tertiary: `rgba(196, 208, 240, 0.52)`

### Accent families

Approved accent families:

- electric blue
- cyan
- violet
- magenta accents in moderation
- warm amber for warning / queued / attention states
- red only for blocked / critical states

Recommended accent tokens:

- ready: `#69e2ff`
- active: `#5aa2ff`
- waiting: `#a88cff`
- warning: `#ffbf5f`
- blocked: `#ff6b7d`
- success: `#5ee9a1`

## Typography

### Hierarchy

- agent name: 20-22px, semibold to bold
- seat id / agent id line: 11-12px, uppercase or small caps feel
- role / mission sentence: 12-14px
- badges: 10-11px
- footer metrics labels: 10-11px
- footer metrics values: 13-15px

### Character

Typography should feel:

- precise
- premium
- command-deck aligned
- compact but not cramped

Avoid playful rounded consumer-app typography.

## Badge rail

### Structure

Top row should support:

- left: pod / station label
- right: readiness or live-state chip
- optional second-line micro badge if needed

### Badge styling

- pill shape
- subdued fill over bright neon slab
- subtle border
- tight letter spacing
- uppercase or disciplined title case

Recommended badge style:

- fill: `rgba(255,255,255,0.06)`
- border: `1px solid rgba(255,255,255,0.12)`
- text: `rgba(239,245,255,0.88)`
- active badge glow optional and restrained

## Avatar theater

The avatar theater is the core of the card.

### Stage composition

- centered avatar anchor
- avatar occupies roughly 58-68% of theater height
- avatar should overlap the lower edge of the rear window slightly for depth
- soft spotlight or rim light allowed
- avatar must remain the visual focal point

### Theater shell

- use an inset chamber, alcove, or podium feel
- lower theater area can include a subtle deck plate or platform hint
- avoid a flat pasted portrait look

## Rear window standard

The rear window is mandatory in every canonical card.

### Geometry

Preferred shape options:

- rounded rectangle viewport
- slightly arched bridge window
- hex-softened sci-fi inset

Preferred size:

- width: 74-82% of card width
- height: 44-54% of theater height
- centered horizontally
- vertically placed behind the avatar head/shoulder zone

### Window frame

- must feel architectural, not decorative clip art
- thin inner frame or beveled edge encouraged
- optional tiny corner bolts / seam lights if subtle
- frame should imply ship interior, command room, or station shell

### Scenic treatment

Approved scenic ingredients:

- stars
- nebula haze
- planetary limb glow
- distant capital ships
- orbital docks
- bridge glass reflections
- passing spacecraft silhouettes
- lit hull fragments or station ribs

Recommended treatment stack:

- scenic image or painted layer
- darkening gradient overlay
- atmospheric tint overlay aligned to card accent
- mild blur or depth fade behind avatar
- optional parallax-ready separation if later implemented interactively

### Scenic contrast rules

- scenery must always sit behind a darkening treatment
- no pure white starburst directly behind avatar face
- no dense high-frequency detail behind text zones
- window brightness should be strongest near edges or horizon, not behind facial focus points

## Identity block

### Layout

- centered or slightly left-aligned within the card body
- display name is dominant
- second line shows seat id, unit id, or operating role
- optional tertiary line for squad / team / model family if needed

### Spacing

- generous top breathing room after theater
- compact line spacing to preserve card density
- avoid more than 3 lines in the identity block by default

## Tag / affinity strip

Use compact chips or segmented labels for:

- mission class
- specialization
- runtime family
- lane / route

Rules:

- max 3 chips by default
- chips should wrap only on roomy views
- truncate before the card becomes noisy

## Mission sentence

Mission text is a one-line or two-line human-readable state summary.

Examples of acceptable density:

- "Coordinating architecture review for active mission lane."
- "Awaiting operator acknowledgment before widening scope."
- "Live on dispatch with validation and QA follow-through."

Rules:

- max 2 lines in standard density
- prioritize mission state over flavor text
- no long prose paragraphs on the canonical card

## Footer zone

Two approved footer modes:

### Mode A: action footer

- one primary action
- one secondary action
- optional compact tertiary icon button

### Mode B: metrics footer

- 2 or 3 compact metrics
- examples: readiness, queue, last active, open threads, mission count

Footer must maintain the same framing language regardless of mode.

## Backdrop families for the rear window

Define a shared library of approved scenic families.

### Family A: orbital bridge

- visible stars
- ship frame silhouettes
- subtle bridge glass reflections
- command-deck mood

### Family B: hangar or dock aperture

- distant ship silhouettes
- rim-lit dock structure
- industrial sci-fi geometry
- darker and more tactical mood

### Family C: planetary horizon

- planet arc or atmosphere line
- distant traffic lanes
- elegant cinematic calm

### Family D: deep-space fleet traffic

- multiple tiny vessel silhouettes
- nebula haze
- slightly more active mission energy

## Variation rules

Allowed variation per seat:

- avatar art
- seat label
- role label
- mission sentence
- state chip
- accent family
- scenic family selection inside the approved window system

Shared across all seats:

- silhouette
- spacing system
- typography hierarchy
- badge language
- window geometry language
- footer language
- frame treatment

## Do-not-drift checklist

A card is drifting if any of these happen:

- the card stops reading as the same family at first glance
- the avatar theater moves to a different structure
- the rear window disappears or becomes full-wallpaper background
- badge styling becomes screen-specific
- one surface adopts a radically different corner, border, or footer language
- text hierarchy changes enough that names, states, and mission blur together

## Implementation recommendation

When product work begins:

- create one shared canonical card component
- define CSS/custom property tokens for shell, border, glow, badge, theater, and window
- separate scenic backdrop assets from avatar assets
- expose only a constrained set of variations to downstream screens
- do not let page-level CSS override the base geometry freely

## Suggested token groups

Recommended token namespaces:

- `--cc-card-*`
- `--cc-badge-*`
- `--cc-avatar-*`
- `--cc-window-*`
- `--cc-text-*`
- `--cc-footer-*`
- `--cc-state-*`

## One-sentence implementation rule

**Every CYBORGCLAW agent tile must render as the same premium dark-shell baseball card with a dominant avatar theater and a framed rear space-window scene behind the agent.**
