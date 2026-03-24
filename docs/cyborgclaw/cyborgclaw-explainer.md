# What Is CyborgClaw?

CyborgClaw is a governed operating system for agent work.

Its job is to take an idea, turn it into a bounded piece of work, route that work through the right team, and keep enough evidence around that an operator can see what happened and trust the result.

## The six planes

### Control plane

This is where work is directed. It holds the mission flow, job cards, routing, approvals, and the people or agents allowed to make decisions.

### Execution plane

This is where the work actually happens. Agents or team seats take a bounded assignment, do the task, and report progress, blockers, and completion back to the control plane.

### Change plane

This is how changes are made safely. CyborgClaw prefers branch-first work, explicit review, and controlled promotion instead of hidden direct edits.

### Evidence plane

This is the proof layer. It stores artifacts, receipts, review results, run traces, and other records that show what was done and why it should be trusted.

### Configuration plane

This is where the system's rules live. Models, routes, permissions, policies, allowlists, and workflow defaults are configured here instead of being left to guesswork.

### Provenance plane

This tracks identity and history. It answers who acted, in which role, through which session or route, at what time, and against which artifact or decision.

## How the system behaves

In plain terms, CyborgClaw tries to replace magic with governed execution:

- ideas become structured work
- work is assigned to a real owner
- execution stays bounded
- reviews happen explicitly
- receipts and artifacts remain visible

## SSOT principles

The core CyborgClaw operating principles are:

- Governance over magic: important actions should happen through visible rules and approved paths.
- Evidence-first: the system should prefer receipts, proofs, and traceable state over assumption.
- Branch-first safety: changes should be made in isolated work and promoted deliberately, not pushed straight into the most sensitive path.

## Why this matters for operators

For an operator, the goal is simple: you should be able to look at a job and answer five questions quickly.

1. What is being asked?
2. Who owns it right now?
3. What changed?
4. What proves it?
5. What happens next?

If CyborgClaw is working correctly, those answers are visible without guesswork.
