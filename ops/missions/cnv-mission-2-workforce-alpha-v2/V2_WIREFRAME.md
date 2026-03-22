# V2_WIREFRAME

## Purpose

Hold the detailed Workforce Alpha V2 wireframe for the selected `Command Cockpit` direction.

## Status

- Current state: `POPULATED`
- Populated in this lane: `yes`
- Selected direction: `Command Cockpit`
- Trust note: `This is a target-architecture wireframe. Any field or live state not proven in tracked repo artifacts remains TO VERIFY / UNCONFIRMED.`

## Section framing

Mission Control Workforce Alpha V2 is a desktop-first command cockpit, not an org-chart poster. The page reads top-down as a chain of command with live operational state attached to each layer: `Voltaris V2` at the top, `President-A` directly beneath, then `Strike Team Alpha` agents below that. The visual language stays dark neon, but the priority is legibility, trust, and fast operational scanning.

The page model is fixed around six surfaces: `Command Canopy`, `Live Ops Strip`, `Chain of Command Tree`, `Execution Feed`, `Evidence + Governance Rail`, and `Inspector Drawer`. Any data not confirmed in tracked repo artifacts must be labeled `TO VERIFY / UNCONFIRMED` rather than implied as live truth.

## Desktop layout overview

Use a wide, three-column desktop composition with a strong vertical spine.

- Top: `Command Canopy` centered above everything else.
- Directly under it: a full-width `Live Ops Strip`.
- Main body: left-to-right split into `Chain of Command Tree` as the primary column, `Execution Feed` as the middle activity column, and `Evidence + Governance Rail` as the right-side trust column.
- `Inspector Drawer`: hidden by default, opens from any node, event, or evidence item and overlays or docks to the far right on large screens.

Scanning order:

1. Read top leadership status.
2. Check live fleet health in the strip.
3. Trace command from `Voltaris V2` to `President-A` to agents.
4. Review recent execution changes.
5. Validate evidence and governance.
6. Drill into a selected node via the inspector.

## Section-by-section hierarchy

### 1. Command Canopy

This is the page anchor and must be visually dominant. Put a centered `Voltaris V2` card at the top, with `President-A` directly beneath it and a visible connector line between them. Below `President-A`, show the first row of `Strike Team Alpha` agents, but keep them compact enough that the canopy still reads as command, not a poster.

The canopy reserves visible slots for:

- current mission
- last orchestration event
- active run count
- approvals pending
- stale/downstream issue count

If any of these are not confirmed in repo artifacts, render them as `TO VERIFY / UNCONFIRMED` with a muted trust state.

### 2. Live Ops Strip

This is a slim, high-density status band directly beneath the canopy. It is not a dashboard wall; it is a quick triage strip. Present each metric as a compact tile with clear state coloring and a short label.

Required metrics:

- Active
- Idle-ready
- Awaiting approval
- Blocked
- Stale
- Missing telemetry
- Queue depth
- Last receipt
- Failed gates

### 3. Chain of Command Tree

This is the main structural surface and should remain the clearest reading path on the page. Nodes flow vertically from `Voltaris V2` to `President-A` to `Strike Team Alpha` agents, with indentation and connectors emphasizing reporting relationships.

Each node exposes only the essential operational summary by default. Use progressive disclosure for deeper telemetry so the tree does not become cluttered.

### 4. Execution Feed

Place the feed beside the tree, not below it, so it can be read as a live story of recent activity. Each entry explains:

- what changed
- which node acted
- what artifact or event was produced
- whether it succeeded, stalled, or escalated

This feed is about movement and consequence, not log spam. Recent, high-signal events appear first.

### 5. Evidence + Governance Rail

The right rail is the trust surface. It remains visible while scrolling and prioritizes the provenance of state over the state itself. Surface:

- contract gaps
- manifest/config source
- receipt coverage
- latest gate result
- branch/PR refs if available
- session evidence coverage
- lineage / telemetry trust notes

Anything not confirmed must be clearly labeled `TO VERIFY / UNCONFIRMED` so the page does not overstate confidence.

### 6. Inspector Drawer

The drawer is a deep-detail tool, not a second page. Open it from any node, execution event, or evidence item. It should show the exact source trail behind whatever is selected and answer `why do we believe this?` before `what is it?`

## Card anatomy

Top canopy cards use a consistent hierarchy:

- Primary title
- State badge
- Mission summary
- Trust status
- Metric row
- Small evidence footer

The `Voltaris V2` card is the largest and most prominent. `President-A` is slightly smaller but still clearly second in command. Agent cards are compact and scannable, with enough room for operational state without competing with the leadership cards.

Cards support three visual trust states:

- confirmed
- partial / inferred
- `TO VERIFY / UNCONFIRMED`

Avoid ornamental density. Prefer one strong visual signal per card over multiple competing accents.

## Node anatomy

Each agent node in the command tree includes:

- agent name
- agent_id
- role
- reports_to
- current state
- current job or `no active run`
- started_at / age
- last heartbeat
- last artifact
- model/provider
- token/context usage
- trust badge

Default node view is compact, with the above arranged in a two-line or three-line block depending on screen width. The selected node can expand within the tree or hand off details to the inspector drawer, but it should not explode the layout.

The node hierarchy must always make the chain of command explicit:

- `Voltaris V2` at the top
- `President-A` directly beneath
- `Strike Team Alpha` agents beneath `President-A`

If any node relationship or metric is not confirmed, show it as `TO VERIFY / UNCONFIRMED` rather than guessing.

## Evidence rail and inspector drawer anatomy

The evidence rail keeps proof and governance visible at all times. It shows:

- contract gaps
- manifest/config source
- receipt coverage
- latest gate result
- branch/PR refs if available
- session evidence coverage
- lineage / telemetry trust notes

Each rail item includes a short trust explanation, especially when a metric is derived, partial, stale, or missing. Do not hide uncertainty behind visual polish.

The inspector drawer opens with a header that includes:

- run_id
- job_id
- session key
- workspace

Then show:

- last tool call
- artifact links
- receipt links
- branch/PR
- logs/traces
- related governance flags
- exact trust source for each metric

Where a field is unknown, keep the field present but marked `TO VERIFY / UNCONFIRMED`. The drawer is the canonical place to validate provenance, not a place to invent completion.

## Responsive behavior notes

On desktop, preserve the three-column operating model and keep the canopy and ops strip sticky enough to support continuous scanning. On narrower widths, collapse the right rail into an accordion or tabbed trust panel before reducing the command tree.

The hierarchy should degrade in this order:

1. keep the canopy visible
2. keep the ops strip visible
3. keep the command tree readable
4. fold the execution feed into a narrower stream
5. collapse the evidence rail
6. convert the inspector into an overlay or full-height drawer

Mobile should not try to preserve full tree depth in one view. It should prioritize command order and trust state, then reveal detail on tap.

## Wireframe risks to watch

- Turning the page into a giant org-chart poster instead of a command cockpit
- Overloading the canopy with too many metrics and losing the `Voltaris V2 -> President-A` hierarchy
- Making the live ops strip feel like a generic KPI dashboard instead of a triage band
- Letting the execution feed become log noise
- Hiding uncertainty by implying unconfirmed fields are live truth
- Letting the evidence rail become a sidebar of links without clear trust interpretation
- Making the inspector drawer redundant with the main page instead of a true drill-down surface
- Crowding the layout so the command chain is harder to parse than the telemetry
