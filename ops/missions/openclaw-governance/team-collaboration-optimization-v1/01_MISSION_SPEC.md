# 01_MISSION_SPEC

## Purpose

Freeze the mission truth, scope, success bar, and proof requirements for the live collaboration-strategy application stream.

## Mission identity

- Mission ID: `openclaw-governance/team-collaboration-optimization-v1`
- Mission name: `Team Collaboration Optimization V1`
- Pack version: `dev-pack-v1`
- Mission type: `PLANNING`
- Traffic light at open: `YELLOW`

## Mission intent

- Why this mission exists: `The archived continuity mission clarified what the team should preserve; this mission clarifies how Voltaris V2 and Codex should work together to preserve it well.`
- Key task: `Apply and govern a collaboration strategy that defines role boundaries, packet quality, feedback rules, escalation paths, subagent policy, and artifact responsibilities for the Voltaris V2 and Codex partnership, while capturing evidence about how well it works in practice.`
- Desired end state: `The governance area contains a reusable, actionable team strategy artifact, a normalized collaboration receipt ledger, and a truthful review trigger that future governance lanes can use as the governed working standard for strategist/operator collaboration.`

## Who owns what

- Sponsor / mission owner: `Voltaris V2`
- Primary operator: `Codex`
- Reviewer / approver: `spryguy`
- Downstream consumer: `Voltaris V2, Codex, and future governance operators`

## Verified current state

- VERIFIED: `The archived continuity mission exists at ops/missions/openclaw-governance/continuity-system-v1/ and provides a governance baseline for packet authority, trust/provenance, and promotion rules.`
- VERIFIED: `This new mission pack now exists at ops/missions/openclaw-governance/team-collaboration-optimization-v1/.`
- VERIFIED: `TEAM_COLLABORATION_STRATEGY.md is now the active working standard for this mission's governance lanes.`
- VERIFIED: `RECEIPTS_INDEX.md now contains a normalized collaboration receipt schema, six initial receipts, and an explicit evidence-based review trigger.`
- LIKELY: `A stronger explicit team strategy will reduce packet ambiguity, unnecessary rework, and subagent misuse across future governance lanes.`
- UNKNOWN: `Which collaboration rules will prove most valuable once the strategy has been applied across more implementation lanes.`
- TO VERIFY: `Whether future follow-on lanes should refine this strategy through measured workflow receipts rather than one-off preference changes.`

## Scope box

### In scope

- Applying `TEAM_COLLABORATION_STRATEGY.md` as the active governed strategy artifact for the Voltaris V2 and Codex partnership
- Recording receipt-backed evidence about packet quality, Codex feedback quality, escalation handling, subagent effectiveness, and strategy drift
- Defining when collaboration strategy refinement is warranted and when it must remain deferred
- Grounding the new strategy in archived continuity artifacts without reopening runtime or service scope

### Out of scope

- Product/runtime code changes in `src/`, `apps/`, `extensions/`, or `ui/`
- Runtime behavior changes, hidden memory mechanisms, or service-backed collaboration tooling
- Replacing the archived continuity system or reopening service-abstraction planning

## Mission law

### MUST

1. `Keep this mission artifact-only, file-backed, and governed by one bounded next action at a time.`
2. `Treat collaboration learnings as promotable only when they are receipt-backed, bounded, and safe to share.`
3. `Do not refine the team strategy substantively until the explicit review trigger is met.`

### MUST NOT

1. `Do not change runtime behavior, product code, or private-memory boundaries from this mission.`
2. `Do not let conversational residue outrank the governed strategy artifact or archived continuity baseline.`

## Required deliverables

- `TEAM_COLLABORATION_STRATEGY.md` as the active baseline artifact
- `RECEIPTS_INDEX.md` with normalized collaboration receipts and explicit review trigger
- Updated mission truth, handoff, receipts, and session-state artifacts for this implementation lane
- Archived continuity summary and briefing acknowledgments for the new sibling governance mission

## Required proof package

- startup receipt
- validation receipt
- branch / SHA proof
- handoff artifacts

## Acceptance tests

- `mission.yaml`, `HANDOFF.md`, `RECEIPTS_INDEX.md`, and `SESSION_MAP.json` agree on mission identity, active strategy-application posture, and one exact next review lane`
- `TEAM_COLLABORATION_STRATEGY.md` defines actionable rules for role boundaries, packet quality, feedback, escalation, subagents, artifact ownership, review cadence, and explicit strategy-review triggers`
- `RECEIPTS_INDEX.md` records enough normalized evidence to justify keeping substantive strategy refinements deferred until the trigger is met`

## Stop / abort conditions

- `The archived continuity pack or its dependency artifacts are unavailable or contradictory`
- `The requested collaboration rules would require runtime behavior changes rather than governed planning artifacts`

## Current bounded next action

`Start Team Collaboration Optimization application review and refinement planning when either: (1) two consecutive implementation lanes produce partial or blocked receipts in packet_quality or codex_feedback_quality, or (2) drift or blocker receipts recur with the same cited cause across lanes; at that point, analyze RECEIPTS_INDEX.md and propose bounded artifact-only updates to TEAM_COLLABORATION_STRATEGY.md.`

## What good looks like

`A future governance lane can open this pack cold, understand exactly how Voltaris V2 and Codex should collaborate, inspect the receipt history, and refine the strategy only when the governed evidence says refinement is necessary.`
