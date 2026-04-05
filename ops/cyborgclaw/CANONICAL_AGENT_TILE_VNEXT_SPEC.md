# CYBORGCLAW Canonical Agent Baseball Card VNext

Status: proposed VNext update  
Depends on:

- `ops/cyborgclaw/CANONICAL_AGENT_TILE_SPEC.md`
- `ops/cyborgclaw/CANONICAL_AGENT_TILE_SCHEMA.md`
- `ops/cyborgclaw/CANONICAL_AGENT_TILE_TOKENS.md`
- `ops/missions/mission-007/BASEBALL_CARD_HANGAR_BOARD_VISUAL_SPEC.md`
- `ops/missions/mission-009/swarm-unlock-v2-autopsy.md`

Intent: evolve the shared CYBORGCLAW agent baseball card into a more premium, more legible, more alive operator artifact while keeping one canonical species across roster walls, mission rooms, barracks, studios, and agent surfaces.

## 1. VNext thesis

The card should now feel like:

- one premium authority artifact
- one clearly governed identity object
- one tactical control-plane unit that can reveal bounded child work without surrendering authority

The card should not become:

- a second dashboard language for one page
- a mission-room-only card dialect
- a subagent roster masquerading as peer authority cards
- a toy animation shell with inflated telemetry

## 2. Core VNext rule

There is still only one canonical card species.

Every surface may tune:

- density
- telemetry pack
- hover depth
- grouping context
- action emphasis

But every surface must preserve the same:

- silhouette family
- identity hierarchy
- status semantics
- provenance/freshness semantics
- parent authority face
- bounded child-work semantics

## 3. Canonical contract VNext

The canonical card contract remains schema-first and adds one new semantic zone:

1. identity
2. stationing
3. status
4. mission context
5. scenic window
6. affinity chips
7. footer content
8. actions
9. provenance
10. child work attachment

### New required semantic rule

Child work is attached to the parent card.

- child work is never rendered as a new sovereign card family
- child work does not replace or outrank parent status
- child work may affect parent posture, but never parent identity

### New optional top-level payload

```yaml
childWork:
  count:
    active: number
    total: number
  posture:
    code: string
    label: string
    tone: string
  latestSignal:
    kind: string
    label: string
    timestamp: string?
  latestProof:
    label: string?
    timestamp: string?
    status: string?
  currentTask: string?
  freshness:
    code: string
    label: string
  lineage:
    parentAgentId: string
    childSessionIds: array
  blocked: boolean
```

### New canonical behavior

- if `childWork.count.active === 0`, the card may show no child affordance
- if child work exists, the card shows a bounded child affordance
- if child work is blocked, the affordance must reflect blocked posture without repainting the parent as blocked unless parent authority is actually blocked

## 4. Premium visual update

VNext should upgrade the card in five ways:

1. stronger identity silhouette  
   Keep the current premium dark-shell baseball-card family, but give the frame, inset chamber, and footer dock more deliberate structure so the card reads less like a styled rectangle and more like a field instrument.

2. more disciplined top rail  
   The pod/station label, status chip, and freshness/provenance cues should form one command strip instead of scattered pills.

3. more legible body hierarchy  
   The eye should always read:

- who this is
- what authority it holds
- what it is doing
- how fresh the truth is

4. tighter metric docking  
   Metrics should feel attached to the lower shell, not like small dashboard cards nested inside the card.

5. attached child-work signal  
   The child-work affordance should feel like a docked module on the parent card, not a decorative badge.

## 5. Shared vs variable matrix

| Surface                              | Shared identity/status/provenance grammar        | Variable telemetry pack                                                                                                      | Primary operator question                                         |
| ------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Agent foyer / roster wall            | Must stay canonical                              | Team membership, current task, constrained/runway posture, compact child activity summary                                    | Who is active and where should STUD look next?                    |
| Mission room                         | Must stay canonical                              | Seat-task status, latest proof, active child count, last child receipt, closeout posture                                     | Is this seat truly executing governed mission work right now?     |
| Strike Team Barracks                 | Must stay canonical                              | Team berth context, mission label, compact metrics, low-noise child summary                                                  | Which teams are available, in flight, or quiet?                   |
| Strike Team Studio composition board | Must stay canonical                              | Read-only specialty, readiness, assignment posture, compact child capability marker only if relevant                         | Which seats compose this team, and are they publish/runtime safe? |
| Agent Design Studio hero card        | Must stay canonical species, but in hero density | Specialty, eval gates, overlays, publish/runtime boundary, no live child telemetry unless modeling child capability contract | What exactly am I shaping and validating?                         |
| Agent inspector / agent page detail  | Must stay canonical                              | Expanded provenance, recent outputs, tool inventory, child lineage panel                                                     | What is this agent really doing and why should I trust it?        |
| Manual roster selection modals       | Must stay canonical species in select mode       | Selection status, fit summary, recommended model, minimal child indicator if applicable                                      | Which seat should I admit here without drift?                     |

### Shared invariants across all rows

- same silhouette family
- same authority face
- same status tones
- same freshness/provenance meaning
- same child-work semantics

### Variable knobs allowed by surface

- telemetry order
- metric count
- hover depth
- action buttons
- density
- scenic scene variant

## 6. Subagent interaction pattern

### Visual affordance

Use a small attached robot/alien module on the parent card.

Rules:

- sits on the parent card edge or lower telemetry rail
- visible only when child work exists or has just closed out
- inherits the parent card shell language
- never looks like a separate seat card

### Affordance posture states

- `quiet`: child rail hidden
- `active`: mini robot/alien lit, subtle pulse
- `waiting`: dim lit, no pulse
- `blocked`: warm/red warning accent
- `done`: calm success glow for a short retention window

### Hover bubble content

The hover bubble must show bounded child-work truth only:

- current child task
- freshness/posture
- latest proof or progress signal
- child count
- parent-child lineage label

It must not imply:

- independent authority
- separate mission ownership
- publish authority
- runtime sovereignty

### Recommended hover bubble layout

```text
+----------------------------------------------------+
| Spawned from Application Engineering Director      |
| 1 active child • live • last proof 38s ago        |
|                                                    |
| Current task                                       |
| Validate bounded spawn receipt and return note     |
|                                                    |
| Latest signal                                      |
| Child completed • awaiting parent acceptance       |
+----------------------------------------------------+
```

### Click behavior

Hover is the default.

Click may open an inspector drawer with:

- child session ids
- latest receipt/proof
- bounded scope summary
- failure/timeout reason if blocked

The click path should still open as a parent-owned child-work panel, not a new peer agent page.

## 7. Component architecture recommendation

Current dashboard truth:

- `web/src/pages/agentOs/AgentOsComponents.jsx` already provides the main shared seat-card species through `AgentOsSeatTile`
- roster wall and barracks reuse that base
- mission room also uses it, but with partially wired local variants
- strike-team studio composition reuses it, while studio hero/editor cards still use a local garage-bay grammar
- roster-selection modals use a separate selector-card fork

### Recommended evolution path

#### A. Introduce a canonical view-model adapter

Every surface should map its local payload into one shared card view model before rendering.

Recommended shared card model:

```yaml
AgentCardVNext:
  identity: ...
  stationing: ...
  status: ...
  mission: ...
  windowScene: ...
  affinityChips: ...
  footer: ...
  provenance: ...
  childWork: ...
  presentationHints:
    variant: string
    density: string
    telemetryPack: string
    interactionMode: string
```

#### B. Evolve `AgentOsSeatTile` into the canonical base renderer

Recommended path:

- keep `AgentOsSeatTile` as the main base
- add explicit `variant` support:
  - `foyer`
  - `mission`
  - `barracks`
  - `studio-composition`
  - `select`
- add a `telemetryPack` prop instead of open-ended one-off card forks
- add a `childWork` prop for the attached child rail / hover bubble

#### C. Separate shared card from breakout-room naming

The current card species is still coupled to breakout-room class names and avatar utilities.

VNext should gradually extract:

- card shell primitives
- avatar theater
- telemetry dock
- child-work affordance

into neutral agent-card primitives without doing a full markup rewrite first.

#### D. Keep the studio hero card related but not identical

The Agent Design Studio hero card can remain a higher-density workbench presentation, but it should still read as the same card species by sharing:

- shell
- top rail
- avatar theater
- identity block
- footer dock

It should not become a second visual language.

#### E. Fold the modal selector fork back into the shared species

The two roster-selection modal cards should become:

- canonical card in `select` mode
- not a separate selector dialect

## 8. Rollout guardrails

1. update spec first  
   Extend the canonical spec/schema/tokens before changing surface code.

2. no card dialects  
   No new mission-room-only, barracks-only, or studio-only card payload shape.

3. no status drift  
   `live`, `derived`, `stale`, `blocked`, and readiness states must keep the same semantic meaning on every surface.

4. no child sovereignty  
   Subagents remain child work under a parent card and may never appear as peer authority cards by default.

5. no fake freshness  
   If child freshness is inferred or stale, say so on the hover bubble and rail.

6. no telemetry inflation  
   Mission surfaces may not claim swarm work is happening unless active child work or accepted child proof is visible on the parent card.

7. migrate by wrappers, not rewrites  
   Wrap or adapt local surfaces into the shared card before chasing cosmetic polish.

## 9. Short upgrade plan

### Phase 1 - Contract update

- add `childWork` to the canonical schema
- extend tokens/spec with attached child rail behavior
- define approved telemetry packs

### Phase 2 - Shared renderer upgrade

- evolve `AgentOsSeatTile` into the VNext base renderer
- add `variant`, `telemetryPack`, and `childWork`
- normalize role/division/status inputs before they reach the renderer

### Phase 3 - Shared surface convergence

- roster wall
- mission room
- barracks
- strike-team composition board

These should all render the same base card with different telemetry packs.

### Phase 4 - Fork cleanup

- migrate roster-selection modal cards into `select` mode
- bridge mission-room local variant CSS through the explicit `variant` prop
- reduce breakout-room naming leakage

### Phase 5 - Studio alignment

- make the studio hero card unmistakably the same species
- preserve hero density without inventing a second card family

## 10. Acceptance bar

VNext is good enough only if:

- one reusable canonical card model still governs all surfaces
- each major surface gets a clearly justified telemetry pack without semantic drift
- subagents are visible, useful, and bounded under the parent card
- operator truth improves:
  - identity clearer
  - provenance clearer
  - activity clearer
  - child-work visibility clearer
- the result feels materially more premium and alive without creating a second UI language for agent state

## 11. Collaboration note

This VNext proposal was grounded by:

- the current canonical spec stack in `ops/cyborgclaw`
- real `codex` architecture/governance review
- real `voltaris-v2` operator-UX review
- dashboard implementation audit confirming that `AgentOsSeatTile` is already the strongest shared seam while mission room, studio, and selector cards still contain local forks or incomplete variants
