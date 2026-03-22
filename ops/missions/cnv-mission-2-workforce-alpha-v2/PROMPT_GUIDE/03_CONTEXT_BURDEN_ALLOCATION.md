# 03 — Context Burden Allocation

This file defines where instructions belong.

## AGENTS.md

Use for:

- persistent operating rules
- repo-local conventions
- coding style norms
- hard safety / governance rules
- stable workflow expectations

Do not use for:

- transient branch state
- task-specific instructions that will change next turn
- long research notes that bloat context

## MISSION_PACK.md

Use for:

- mission objective
- scope / non-goals
- target files or subsystems
- acceptance criteria
- validation commands
- mission-specific risks

Do not use for:

- universal prompt doctrine
- generic Codex rules that belong in this pack

## HANDOFF.md

Use for:

- current branch and SHA
- work completed
- work in progress
- blockers
- next recommended step
- receipts / artifact pointers

Do not use for:

- full mission design doctrine
- repeated persistent instructions

## Run prompts

Use for:

- one milestone
- exact task framing for the current step
- expected output shape
- whether mutation is allowed
- specific validation requirement for this step

Do not use for:

- dumping every rule in the system
- restating AGENTS and mission docs in full

## Closeout blocks

Use for:

- what changed
- what was validated
- what remains unknown
- one next action

## Compactness rule

If a rule is being repeated in many prompts, move it up one layer.
If a file is storing short-lived task state, move it down one layer.
