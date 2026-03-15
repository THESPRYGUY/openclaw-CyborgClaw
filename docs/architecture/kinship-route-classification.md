---
summary: "Frozen M12 kinship classes, legal route rules, deterministic rejects, and President mediation boundaries"
read_when:
  - Defining or reviewing M12 route-law decisions
  - Classifying delegation between Presidents and team agents
  - Deciding whether cross-lane work is direct, mediated, or rejected
title: "Kinship Route Classification"
---

# Kinship route classification

Last updated: 2026-03-15

Mission M12 freezes the legal route classes that sit on top of the frozen M11
lineage, runtime, and policy manifests.

M12 consumes M11 truth. It does not redefine lineage identity, runtime truth,
policy truth, or Design Studio admission semantics.

## Inputs M12 is allowed to trust

M12 route-law decisions may consume:

- the frozen M11 lineage record
- the frozen M11 runtime manifest
- the frozen M11 policy manifest
- route facts added by M12 for:
  - actor role (`president` or `team-agent`)
  - requester President id
  - target President id
  - shared-President flag

M12 must preserve the M11 namespaces needed later by M13:

- `trace.traceNamespace`
- `trace.receiptNamespace`
- `trace.routeLawNamespace`
- `trace.approvalNamespace`

## Canonical classes

M12 freezes five route classes:

- `child`: a President delegates downward to a team agent inside that same
  President lane.
- `sibling`: one team agent delegates sideways to another team agent under the
  same President.
- `escalation`: a team agent routes upward to its own President.
- `cousin`: one team agent routes to another team agent under a different
  President.
- `illegal`: the route facts are incomplete, unsupported, or violate the
  legal-path rules below.

## Legal path rules

The canonical classification model is deterministic:

- `child`
  - requester role = `president`
  - target role = `team-agent`
  - requester President id = target President id
  - `sharedPresident = true`
- `sibling`
  - requester role = `team-agent`
  - target role = `team-agent`
  - requester President id = target President id
  - `sharedPresident = true`
- `escalation`
  - requester role = `team-agent`
  - target role = `president`
  - requester President id = target President id
  - `sharedPresident = true`
- `cousin`
  - requester role = `team-agent`
  - target role = `team-agent`
  - requester President id != target President id
  - `sharedPresident = false`
- `illegal`
  - any missing route fact
  - any unsupported role pairing
  - any contradictory President facts
  - any claimed class that does not match the derived class

## What requires President mediation

Only `cousin` routes require President mediation in M12.

A `cousin` route is legal only when all of the following are true:

- a route decision binds back to valid M11 manifests for requester and target
- the route decision preserves trace, receipt, route-law, and approval
  namespaces
- an approved cousin ticket exists
- the cousin ticket contains explicit artifact-return obligations

## What gets rejected outright

Reject a route outright when any of the following are true:

- a route decision does not bind back to the requester or target M11 manifests
- the claimed class does not match the derived class
- cross-President peer control is attempted without mediation
- a required cousin ticket is missing
- a cousin ticket is present but does not bind to the route decision or parties
- artifact-return obligations are missing for cross-lane work
- route facts are incomplete, contradictory, or unsupported

Direct cross-President child-to-child or team-agent control is rejected by
default unless it is converted into a mediated `cousin` route with a valid
cousin ticket.

## Output artifact

The canonical M12 decision artifact is `schemas/route-decision.schema.json`.

It records:

- the bound requester and target identities from M11
- the derived or claimed kinship class
- whether the route is legal
- whether President mediation is required
- deterministic reject reasons when the route is not legal
- correlation fields for future traces, receipts, approvals, and orchestration

## Example bundles

- Legal mediated cousin route: `examples/route-law-bundle/clean/`
- Deterministic reject: `examples/route-law-bundle/known-bad-direct-cross-president/`

## Out of scope

M12 does not define:

- M13 bus, run, or session execution
- M14 MCP or tool-boundary refactors
- M15 public edge publication
- new lineage or admission semantics outside the frozen M11 contract

## Related docs

- [Cousin Ticket Law](/architecture/cousin-ticket-law)
- [Design Studio Output Contracts](/architecture/design-studio-output-contracts)
- [Lineage Admission Rules](/architecture/lineage-admission-rules)
