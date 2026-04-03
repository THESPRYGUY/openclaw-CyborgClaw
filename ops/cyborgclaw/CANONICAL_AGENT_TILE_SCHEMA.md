# CYBORGCLAW Canonical Agent Tile Schema

Status: draft data-contract companion
Depends on:

- `ops/cyborgclaw/CANONICAL_AGENT_TILE_SPEC.md`
- `ops/cyborgclaw/CANONICAL_AGENT_TILE_TOKENS.md`

Intent: define the canonical content contract for the CYBORGCLAW agent baseball card so design drift cannot re-enter through ad hoc field selection or screen-specific card payloads.

## Purpose

The canonical CYBORGCLAW agent tile must not drift at either:

- the visual layer
- the content layer

This schema defines the stable field model for the canonical card. Surfaces may omit approved optional fields at smaller densities, but they should not invent incompatible card structures.

## Core rule

Every CYBORGCLAW agent tile should be renderable from one canonical card payload.

Page-level variants may choose a compact display mode, but they should still map to the same underlying semantic shape.

## Canonical semantic zones

The canonical tile payload is organized into these zones:

1. identity
2. stationing
3. status
4. mission context
5. scenic window
6. affinity chips
7. footer content
8. actions
9. provenance

## Required top-level fields

```yaml
id: string
version: string
identity: object
stationing: object
status: object
mission: object
windowScene: object
footer: object
```

## Optional top-level fields

```yaml
affinityChips: array
actions: array
provenance: object
presentationHints: object
```

## Canonical payload

```yaml
id: string
version: string
identity:
  displayName: string
  seatId: string
  agentId: string
  avatar:
    imageRef: string
    alt: string
stationing:
  podLabel: string
  unitLabel: string?
  teamLabel: string?
status:
  code: string
  label: string
  tone: string
  detail: string?
mission:
  sentence: string
  roleLabel: string?
  laneLabel: string?
  assignmentLabel: string?
windowScene:
  family: string
  imageRef: string?
  tint: string?
  treatment: string?
  alt: string?
affinityChips:
  - kind: string
    label: string
    tone: string?
footer:
  mode: string
  metrics:
    - key: string
      label: string
      value: string
  summary: string?
actions:
  - id: string
    label: string
    emphasis: string
provenance:
  sourceSurface: string?
  backingEntityId: string?
  updatedAt: string?
presentationHints:
  density: string?
  emphasis: string?
```

## Field definitions

### `id`

Stable unique tile payload id.

Rules:

- string
- globally unique within the active surface payload
- should remain stable across refreshes for the same agent seat when possible

Example:

- `tile-alpha-architecture-01`

### `version`

Schema version for the canonical tile contract.

Initial value:

- `cc-agent-tile/v1`

### `identity`

Core agent identity. This is the highest-priority block.

#### `identity.displayName`

Human-visible primary name.

Examples:

- `Architecture Director`
- `DevEx and QA Director`

#### `identity.seatId`

Canonical seat identifier.

Examples:

- `seat-02`
- `alpha-arch`

#### `identity.agentId`

Backing runtime or record identifier.

Examples:

- `dir-architecture-01`
- `agent-codex-ops-03`

#### `identity.avatar`

Avatar payload.

Fields:

- `imageRef`: image asset or generated portrait reference
- `alt`: accessible text for the avatar

Rules:

- avatar is required for the canonical full card
- compact list derivatives may hide the image visually, but the semantic payload should still carry it

## `stationing`

Defines where the agent is situated organizationally.

### `stationing.podLabel`

Short top-rail pod label.

Examples:

- `STUD pod`
- `BORF pod`
- `Alpha pod`

### `stationing.unitLabel`

Optional operating unit label.

Examples:

- `Architecture`
- `Application Engineering`

### `stationing.teamLabel`

Optional team label.

Examples:

- `Strike Team Alpha`
- `CYBORGCLAW`

## `status`

Defines operational state.

### `status.code`

Stable machine-oriented code.

Recommended enum set:

- `ready`
- `active`
- `waiting`
- `queued`
- `attention`
- `blocked`
- `offline`
- `unknown`

### `status.label`

Human-visible state chip text.

Examples:

- `Ready`
- `Live`
- `Awaiting handoff`
- `Blocked`

### `status.tone`

Visual token family used for accenting.

Recommended enum set:

- `info`
- `active`
- `success`
- `warning`
- `danger`
- `muted`

### `status.detail`

Optional expanded state detail.

Examples:

- `Awaiting President-A acknowledgment`
- `Active on dispatch ledger follow-through`

## `mission`

Defines what the agent is doing or meant to do.

### `mission.sentence`

Canonical short mission sentence.

Rules:

- required
- one or two lines at standard card density
- should communicate live role, assignment, or blocking state
- should be written in operator-facing language

Examples:

- `Reviewing architecture constraints for the active mission lane.`
- `Awaiting operator acknowledgment before widening scope.`
- `Live on dispatch with QA validation follow-through.`

### `mission.roleLabel`

Short role label.

Examples:

- `architecture lead`
- `devex and qa lead`

### `mission.laneLabel`

Optional route or lane context.

Examples:

- `implementation lane`
- `review lane`
- `publish lane`

### `mission.assignmentLabel`

Optional mission / assignment short title.

Examples:

- `Dispatch review`
- `Mission floor standardization`

## `windowScene`

Mandatory canonical rear-window payload.

### `windowScene.family`

Approved scene family.

Recommended enum set:

- `orbital-bridge`
- `hangar-aperture`
- `planetary-horizon`
- `deep-space-fleet`

### `windowScene.imageRef`

Optional explicit asset reference.

Use when a concrete image or illustration is selected.

### `windowScene.tint`

Optional accent tint token.

Examples:

- `blue`
- `cyan`
- `violet`
- `amber`

### `windowScene.treatment`

Optional rendering treatment descriptor.

Examples:

- `dimmed-depth`
- `bridge-glass`
- `nebula-soft`

### `windowScene.alt`

Accessibility description for the rear scene.

Example:

- `Orbital bridge window showing distant ships over a blue planetary horizon.`

## `affinityChips`

Optional semantic chips shown below identity.

Rules:

- max 3 in standard density
- use to expose stable context, not transient noise

Recommended chip kinds:

- `specialization`
- `runtime`
- `route`
- `mission-class`
- `trust-level`

Example:

```yaml
affinityChips:
  - kind: specialization
    label: Architecture
    tone: info
  - kind: runtime
    label: Codex
    tone: muted
  - kind: route
    label: Review lane
    tone: active
```

## `footer`

Defines the lower card zone.

### `footer.mode`

Recommended enum set:

- `metrics`
- `actions`
- `hybrid`

### `footer.metrics`

Optional compact metrics set.

Rules:

- 0 to 3 metrics in standard density
- should remain compact and scannable

Examples:

- readiness
- queue
- last active
- threads
- missions

### `footer.summary`

Optional short footer summary when metrics are not enough.

Examples:

- `2 open review threads`
- `No blockers admitted`

## `actions`

Optional footer action objects.

Rules:

- 0 to 3 actions in standard density
- use constrained emphasis values
- avoid action sprawl on the canonical card

Recommended action emphasis values:

- `primary`
- `secondary`
- `quiet`

Example:

```yaml
actions:
  - id: inspect
    label: Inspect
    emphasis: primary
  - id: dispatch
    label: Dispatch
    emphasis: secondary
```

## `provenance`

Optional backing context for debugging and data integrity.

### Fields

- `sourceSurface`
- `backingEntityId`
- `updatedAt`

Use this for traceability, not as a user-facing design element.

## `presentationHints`

Optional rendering hints for approved variants.

### Recommended fields

- `density`: `full` | `compact`
- `emphasis`: `normal` | `featured`

Rules:

- hints may influence rendering density
- hints must not mutate the canonical semantic structure

## Required minimum viable card

A canonical card is valid only if it has:

- `identity.displayName`
- `identity.seatId`
- `identity.agentId`
- `identity.avatar.imageRef`
- `stationing.podLabel`
- `status.code`
- `status.label`
- `mission.sentence`
- `windowScene.family`
- `footer.mode`

If these are absent, the surface is not rendering the canonical CYBORGCLAW card.

## Forbidden schema drift

The following are not allowed without explicit approval:

- replacing `mission.sentence` with arbitrary large markdown blobs
- removing `windowScene` from some cards but not others
- putting status only in page chrome instead of card payload
- inventing screen-specific top-level objects that bypass the canonical model
- using a different card payload shape for another mission floor while claiming it is the same canonical card family

## Example full payload

```yaml
id: tile-alpha-architecture-01
version: cc-agent-tile/v1
identity:
  displayName: Architecture Director
  seatId: alpha-arch
  agentId: dir-architecture-01
  avatar:
    imageRef: assets/agents/dir-architecture-01.png
    alt: Architecture Director avatar
stationing:
  podLabel: STUD pod
  unitLabel: Architecture
  teamLabel: Strike Team Alpha
status:
  code: waiting
  label: Awaiting acknowledgment
  tone: warning
  detail: Awaiting President-A acknowledgment
mission:
  sentence: Awaiting operator acknowledgment before widening architectural scope.
  roleLabel: architecture lead
  laneLabel: review lane
  assignmentLabel: Mission floor standardization
windowScene:
  family: orbital-bridge
  imageRef: assets/scenes/orbital-bridge-02.png
  tint: blue
  treatment: bridge-glass
  alt: Orbital bridge viewport with distant ships near a planetary horizon.
affinityChips:
  - kind: specialization
    label: Architecture
    tone: info
  - kind: runtime
    label: Codex
    tone: muted
footer:
  mode: metrics
  metrics:
    - key: queue
      label: Queue
      value: "2"
    - key: threads
      label: Threads
      value: "1"
  summary: 2 pending review items
actions:
  - id: inspect
    label: Inspect
    emphasis: primary
  - id: dispatch
    label: Dispatch
    emphasis: secondary
provenance:
  sourceSurface: mission-floor
  backingEntityId: dir-architecture-01
  updatedAt: 2026-04-03T04:26:00Z
presentationHints:
  density: full
  emphasis: normal
```

## One-sentence schema rule

**Every CYBORGCLAW agent card should be renderable from one canonical payload that always includes identity, status, mission, footer, and a mandatory rear space-window scene definition.**
