# 01_MISSION_SPEC

## Purpose

Freeze the original kickoff mission truth, scope, success bar, and proof requirements before implementation begins.

## Current-state note

This file preserves the original planning kickoff specification for historical continuity.

For the current authoritative mission state after implementation, closeout, and UI hardening, read:

- `mission.yaml`
- `UI_VALIDATION_REPORT.md`
- `BUILD_PROGRESS_CLOSEOUT.md`
- `REHYDRATION_BRIEF.md`

## Mission identity

- Mission ID: `cnv-mission-2-workforce-alpha-v2`
- Mission name: `Mission 23 - Workforce Alpha V2`
- Pack version: `dev-pack-v1`
- Mission type: `PLANNING (historical kickoff state)`
- Traffic light at open: `YELLOW (historical kickoff state)`

## Mission intent

- Why this mission exists: `Mission Control Workforce Alpha needs a V2 redesign that restores command hierarchy, operational clarity, honest trust states, and governed telemetry without inventing backend truth.`
- Key task: `Initialize the Workforce Alpha V2 mission pack and complete only A) VERIFIED CURRENT STATE by locating any tracked V1 surface evidence and critiquing the current page against the design brief.`
- Desired end state: `The repo contains a coherent mission pack, a charrette artifact with A complete and B-I scaffolded, a wireframe scaffold, and an evidence-backed account of what is proven versus still unconfirmed about the current Workforce Alpha surface.`

## Who owns what

- Sponsor / mission owner: `Voltaris V2`
- Primary operator: `Codex`
- Reviewer / approver: `spryguy`
- Downstream consumer: `Voltaris V2, Codex, and later Workforce Alpha charrette lanes`

## Verified current state

- VERIFIED: `This new mission pack now exists at ops/missions/cnv-mission-2-workforce-alpha-v2/.`
- VERIFIED: `The repo contains generic control-plane artifacts in docs/web/control-ui.md, src/commands/dashboard.ts, and src/gateway/control-ui-contract.ts.`
- VERIFIED: `docs/cyborgclaw/SSOT.md contains a Strike Team Alpha operational note, but not a clearly defined Workforce Alpha V1 page surface.`
- LIKELY: `The current Workforce Alpha V1 surface either lives under a non-obvious name or is not fully represented in tracked repo artifacts.`
- UNKNOWN: `The exact tracked route, component tree, and data contract for the current Workforce Alpha V1 page.`
- TO VERIFY: `Whether any current Workforce Alpha page, route, or data surface is present in tracked repo artifacts beyond the generic control UI and the SSOT reference.`

## Scope box

### In scope

- Initializing the Workforce Alpha V2 mission pack from the shared dev-pack-v1 template source
- Locating tracked V1 page, route, component, and data evidence without inventing missing surfaces
- Completing only A) VERIFIED CURRENT STATE and scaffolding B) through I) in CHARRETTE_OUTPUT.md

### Out of scope

- Product/runtime code changes in `src/`, `apps/`, `extensions/`, or `ui/`
- Completing deeper charrette sections B through I beyond placeholders
- Turning inferred or user-described data fields into claimed repo truth without evidence

## Mission law

### MUST

1. `Keep this lane planning-only, evidence-first, file-backed, and governed by one bounded next action at a time.`
2. `Separate VERIFIED CURRENT STATE, TARGET ARCHITECTURE, and TO VERIFY / UNCONFIRMED in every critique subsection.`

### MUST NOT

1. `Do not mutate product/runtime code or attempt the Workforce Alpha V2 implementation in this lane.`
2. `Do not invent backend fields, runtime states, event streams, or file paths if the tracked repo does not prove them.`

## Required deliverables

- `CHARRETTE_OUTPUT.md` with A) VERIFIED CURRENT STATE complete and B-I scaffolded
- `V2_WIREFRAME.md` as an honest scaffold only
- Updated mission truth, receipts, handoff, and session-state artifacts for this kickoff lane

## Required proof package

- startup receipt
- validation receipt
- branch / SHA proof
- handoff artifacts

## Acceptance tests

- `mission.yaml`, `HANDOFF.md`, `RECEIPTS_INDEX.md`, and `SESSION_MAP.json` agree on mission identity, planning posture, and the next bounded lane`
- `CHARRETTE_OUTPUT.md` section A clearly distinguishes tracked evidence, target architecture, and items that remain TO VERIFY / UNCONFIRMED`

## Stop / abort conditions

- `The shared dev-pack-v1 template source or the critical continuity artifacts are unavailable`
- `The critique would require pretending an untracked or missing Workforce Alpha surface is verified repo truth`

## One bounded next action at kickoff

`Continue Workforce Alpha V2 Charrette - Design Voices by completing B) DESIGN CHARRETTE (Voice Simulation) after the pack is initialized and A) VERIFIED CURRENT STATE is frozen.`

## What good looks like

`A future charrette lane can open this pack cold, see what Workforce Alpha V1 evidence is actually proven in the repo, and continue the redesign from a truthful command-and-telemetry baseline instead of a guessed UI story.`
