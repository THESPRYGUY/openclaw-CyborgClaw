# AGENT_WORKFORCE_OPERATIONALIZATION_STRATEGY

## Strategy title

`Agent Workforce Operationalization Strategy — Strike Team Alpha`

## Strategy objective

Turn the current Workforce Alpha design and cockpit into a governed execution system where:

1. work enters through an existing intake seam
2. Voltaris converts it into a structured internal work card
3. President-A receives and owns the delegated job
4. Strike Team Alpha is locked and dispatched to execute through ACP-backed runtime sessions
5. the cockpit reports back a truthful execution story instead of a mostly projected one

## Status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `READY FOR EXECUTIVE REVIEW`

## Executive summary

The platform already has most of the pieces needed for workforce operationalization, but they are not yet connected into one governed job-delegation pipeline.

What already exists:

- a live Workforce Alpha cockpit with team locking, President-A auto-assembly, seat-level model policy, execution feed, and inspector surfaces
- a Sprytly intake path from To-Do to Hivemind PRD to Dev Pack to Dev Queue
- ACP-backed child-session spawning, resumption, steering, and thread binding in `openclaw`
- bounded A2A session-to-session follow-up and announce flows
- M13 internal registry and internal run artifacts for durable session and run truth

What does not exist yet:

- a first-class `Job / Project / Deliverables Card` that bridges intake and workforce dispatch
- workforce-native delegation semantics on ACP sessions
- a durable delegation receipt from Voltaris to President-A to strike-team seats
- a clean operator surface that answers: `what job is this team executing right now, who owns it, and what state is it in?`

The recommended direction is not to invent a whole new control plane. The recommended direction is to connect the existing intake, workforce, ACP, A2A, and M13 seams into one minimal job-ingestion-and-delegation pipeline.

Phase 1 should be treated as one single vertical slice only:

`staged work item -> Job Card -> President-A ownership -> locked Alpha team -> ACP session -> cockpit readback`

## VERIFIED CURRENT STATE

### 1. Existing intake and planning flow already exists in Sprytly

Sprytly already has a staged work-intake path:

- `To-Do`
- `Send to HiveMind`
- `Create Dev Pack`
- operator signoff
- `Send to Dev Queue`

This is not hypothetical. The sibling product already exposes real staged endpoints and UI actions for:

- `POST /api/dev-staging/send-hivemind-prd`
- `POST /api/dev-staging/build-pack-for-todo`
- `POST /api/dev-staging/signoff`
- `POST /api/dev-staging/send-dev-queue`

That means the upstream side of the job pipeline already exists in working form.

### 2. Hivemind already provides a bounded collaborative clarification layer

Sprytly already supports project-scoped Hivemind sessions with:

- objective
- constraints
- role-based audience
- agent rosters
- salon scenes
- prompt comments
- summon
- iterative salon
- freeze/export
- retention/compaction

This gives us a real place for requirement clarification, PRD generation, and collaborative shaping before execution starts.

### 3. Workforce Alpha already exists as an operator-facing dispatch surface

The sibling Workforce Alpha page already ships:

- `Command Canopy`
- `Live Ops Strip`
- `Chain of Command Tree`
- `Execution Feed`
- `Evidence + Governance Rail`
- `Inspector Drawer`

It also already supports live operational controls:

- Voltaris model mutation
- President-A team editing and locking
- President-A auto-team assembly from a mission brief
- seat-level recommended model policy or manual pinning

The next move is not “build the workforce UI.” The next move is “connect real work to the existing workforce UI.”

### 4. ACP already provides the runtime execution seam

`openclaw` already has ACP-backed session spawning and control with:

- `sessions_spawn` using `runtime: "acp"`
- persistent or one-shot session modes
- resume by `resumeSessionId`
- thread binding on supported channels
- runtime steering, model, permission, timeout, and cwd controls

This is already strong enough to serve as the execution runtime for workforce seats.

### 5. A2A already provides bounded inter-agent follow-up, not a full delegation contract

`openclaw` already supports bounded session-to-session follow-up through the A2A flow in `sessions_send`, including announce and reply context.

This is useful for:

- escalation
- targeted follow-up
- request/response between already-running agents

It is not yet a full workforce delegation contract with typed job ownership, acceptance, or completion receipts.

### 6. M13 already provides durable runtime artifacts

Mission 013 already proved durable internal contracts for:

- internal agent registry entries
- internal run envelopes

Those artifacts are the strongest existing durable seams for:

- session identity
- runtime state
- run status
- error/completion truth

They should be reused, not bypassed.

## TARGET OPERATING MODEL

### End-to-end workflow

1. **Incoming requirement**
   - source is `Ideas Incubator` or `To-Do` intake
   - if requirements are still ambiguous, route through Hivemind first

2. **Clarification / shaping**
   - Voltaris or a staging flow opens a Hivemind session when needed
   - Hivemind produces a frozen/exported clarification artifact or PRD-grade input

3. **Internal work-card creation**
   - Voltaris converts the accepted requirement into a governed internal work package:
     - `Project Card`
     - `Job Card`
     - `Deliverables Card`

4. **Delegation to team lead**
   - Voltaris assigns the `Job Card` to President-A
   - President-A becomes the execution owner for the team-level lane

5. **Team assembly / lock**
   - President-A assembles or confirms the correct Strike Team Alpha lineup
   - team lock and seat policy become part of the job’s execution context

6. **Dispatch to execution runtime**
   - ACP sessions are spawned or resumed for the assigned agents
   - the job context is injected into the lead session and then into seat sessions as bounded instructions

7. **Controlled inter-agent coordination**
   - A2A is used for follow-up, escalation, clarification, and bounded handoff
   - A2A is not treated as an ungoverned mesh

8. **Monitoring and proof**
   - runtime state and job progress flow back into Workforce Alpha
   - the cockpit reflects:
     - current job
     - owner
     - active runs
     - blocked / degraded / awaiting approval states
     - evidence and trust posture

## Proposed internal work-card model

Only the `Job Card` is required for the first bounded implementation lane.

The `Project Card` and `Deliverables Card` definitions below are included as forward-compatible scaffolding for later phases so the first lane can stay tightly scoped.

### Project Card

Purpose:

- durable umbrella for a real workstream

Minimum fields:

- `projectId`
- `title`
- `whyThisExists`
- `sponsor`
- `operatorOwner`
- `priority`
- `currentState`
- `latestFrozenBriefRef`
- `activeJobIds`
- `deliverableIds`
- `decisionNotes`

### Job Card

Purpose:

- executable unit of work delegated from Voltaris to a team lead

Minimum fields:

- `jobId`
- `projectId`
- `title`
- `objective`
- `requirementsSummary`
- `acceptanceSummary`
- `priority`
- `dueAt`
- `status`
- `stagingState`
- `delegatedBy`
- `delegatedTo`
- `assignedTeamId`
- `assignedPresidentId`
- `sourceTodoId`
- `sourceHivemindSessionId`
- `sourceExportPath`
- `devPackPath`
- `evidenceRefs`

### Deliverables Card

Purpose:

- track the output contract the team is trying to satisfy

Minimum fields:

- `deliverableId`
- `projectId`
- `jobId`
- `title`
- `type`
- `currentVersion`
- `scope`
- `acceptanceCriteria`
- `status`
- `changeNote`
- `artifactRefs`
- `queueBinding`

## How ACP and A2A should be used

### ACP layer

Use ACP as the runtime execution layer for workforce seats.

Recommended responsibilities:

- spawn or resume President-A execution sessions
- spawn or resume strike-team seat sessions
- carry runtime options such as model, permissions, cwd, timeout, and session mode
- provide durable session keys and run ids

ACP should be the runtime where work happens, not the canonical planning source.

### A2A layer

Use A2A as a controlled coordination layer between already-authorized sessions.

Recommended responsibilities:

- bounded follow-up
- clarification requests
- escalation from seat to President-A
- escalation from President-A to Voltaris
- announce/back-brief steps

A2A should not be treated as the canonical job registry or a durable queue.

## Existing assets and learnings to reuse

### From Sprytly intake and planning

- DEV staging already enforces practical gates:
  - owner
  - due date
  - detail
  - PRD-ready
  - dev-pack-ready
  - operator signoff
- Hivemind already supports:
  - objective
  - constraints
  - role-scoped audiences
  - agent rosters
  - salon scenes
  - freeze/export

These should be reused as upstream job-shaping seams, not rebuilt.

### From Workforce Alpha

- President-A auto-team assembly already provides a useful seat-selection and model-policy seam.
- Voltaris and President-A tiles already expose the command layer needed for dispatch.

These should be reused as the command/dispatch surface.

### From M13 internal contracts

- use internal registry and internal run artifacts as the durable runtime truth
- do not invent a separate “workforce bus” unless current artifact contracts prove insufficient

## Key design constraints

- Do not invent runtime truth where only projected/local seams exist.
- Do not replace the existing Sprytly intake/staging path unless it becomes a blocker.
- Do not treat A2A as a full task queue or durable control plane.
- Do not expand beyond Alpha in the first operationalization slice.
- Do not widen scope into memory upgrades for this sprint.

## Open risks

### Immediate design risks

- workforce-native delegation semantics do not yet exist on ACP sessions
- the current execution feed is still lower-signal than the operator needs
- there is no first-class durable link yet between:
  - staged work item
  - delegated job
  - ACP run/session
  - cockpit execution row

### Accepted long-term risks

- active team selection and runtime ownership still rely on some local seams
- governor and broader org-contract truth remain outside this first operationalization slice
- broader workforce expansion beyond Alpha remains deferred by design

## Development strategy

### Phase 1 — Job dispatch MVP

Goal:

- connect staged work to Workforce Alpha dispatch using the smallest truthful set of new seams

Deliver:

- minimal `Job Card`
- explicit delegation from Voltaris to President-A
- job-linked team lock
- ACP session spawn/resume from the job context
- execution/feed linkage back to the job

### Phase 2 — Execution signal hardening

Goal:

- improve actor, outcome, and state truth in the cockpit

Deliver:

- better execution normalization
- job-aware live-ops rollups
- narrower projected caveats

### Phase 3 — Bounded escalation and receipts

Goal:

- formalize handoff and escalation between seats, President-A, and Voltaris

Deliver:

- bounded A2A delegation receipts
- approval and escalation visibility
- clearer completion/proof story

## Proposed first bounded implementation lane

### Lane title

`Strike Team Alpha Job Dispatch MVP`

### Objective

Create the first minimal, truthful job-ingestion-and-delegation pipeline by connecting a staged work item to:

- a governed `Job Card`
- a delegated President-A owner
- a locked Strike Team Alpha lineup
- ACP-backed execution sessions
- a job-aware execution story in the cockpit

### In scope

- define and persist the minimal `Job Card`
- bind one staged work item to one `Job Card`
- allow Voltaris to delegate the job to President-A
- bind the current President-A team lock to that job
- spawn or resume ACP execution sessions from the job context
- surface job ownership and execution identity in the cockpit and inspector

### Out of scope

- broader org expansion beyond Alpha
- full workforce-native queueing system
- full governance/approval automation
- replacing Hivemind, DEV staging, or the existing dev queue
- major cockpit redesign

### Acceptance criteria

- a staged work item can be promoted into a first-class `Job Card`
- the `Job Card` records provenance to the source To-Do / Hivemind / Dev Pack artifacts
- Voltaris can delegate that job to President-A
- President-A can lock or reuse a team against that job
- ACP sessions can be spawned or resumed from that delegated job context
- the cockpit and inspector show:
  - `jobId`
  - current owner
  - active session/run linkage
  - execution state tied to that job
- the operator can answer:
  - what job is active
  - who owns it
  - which team is locked to it
  - what state it is in now

### Why this lane should be first

Because it establishes the minimal vertical slice that turns strategy into actual delegated work without prematurely widening the org model. It also creates the truthful backbone that later execution-signal hardening and escalation receipts can build on.

## TO VERIFY / UNCONFIRMED

- whether the current Sprytly data model should host the first durable `Job Card`, or whether a narrower binding seam should exist beside current project/todo/deliverable records
- whether President-A should own a persistent ACP session per job, per team, or per seat cluster
- whether some delegation state belongs in `openclaw` runtime metadata rather than in Sprytly planning state

## Executive review question

Should this strategy be ratified with `Strike Team Alpha Job Dispatch MVP` as the first bounded implementation lane for Agent Workforce operationalization?

## What good looks like

The next mission does not start with a blank workforce redesign. It starts by connecting an already-existing intake path, an already-existing command surface, and an already-existing execution runtime into one truthful Alpha job-dispatch pipeline.
