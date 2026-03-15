---
summary: "Frozen M12 cousin-ticket contract for cross-President mediation and artifact-return obligations"
read_when:
  - Defining or reviewing cross-President delegation
  - Validating artifact-return obligations for cousin work
  - Checking whether a mediated route is complete or rejectable
title: "Cousin Ticket Law"
---

# Cousin ticket law

Last updated: 2026-03-15

Mission M12 freezes the cousin-ticket contract used when one team agent asks a
different President lane to perform bounded work.

## When a cousin ticket is required

A cousin ticket is required when the route class is `cousin`:

- requester role = `team-agent`
- target role = `team-agent`
- requester President id != target President id
- `sharedPresident = false`

No other M12 route class requires a cousin ticket by default.

## Canonical ticket contract

The canonical cousin-ticket artifact is
`schemas/cousin-ticket.schema.json`.

The ticket freezes:

- the bound requester and target identities from the M11 manifests
- the route decision id and request ids being mediated
- the requester and target President ids
- the mediation mode and approval receipts
- the required artifact-return contract
- the trace, receipt, route-law, and approval namespaces needed later by M13

## President mediation rules

M12 accepts a cousin ticket only when:

- mediation is explicitly marked as required
- the requester President id and target President id are present
- at least one President approval receipt exists
- the mediation state is recorded

The clean example uses `joint-presidents` because both sides approve the bounded
cross-lane work.

## Artifact-return obligations

Cross-lane work must define what comes back.

M12 freezes the artifact-return contract as:

- a return target that points back to the requester lineage and namespaces
- a required artifact list
- a required receipt list
- a return deadline
- `completionSummaryRequired = true`
- `partialReturnAllowed = false`

The canonical required artifacts are:

- `artifact-manifest`
- `completion-summary`
- `diff-or-output`
- `receipt-pack`
- `validation-proof`

The canonical required receipts are:

- `approval-proof`
- `artifact-manifest`
- `cousin-ticket`
- `route-decision`
- `validation-proof`

## Deterministic reject rules

Reject a cousin route when any of the following are true:

- the ticket is missing
- the ticket binds to a different route decision
- the ticket binds to different requester or target M11 identities
- the mediation state is not approved
- there are no President approval receipts
- the artifact-return contract is missing or incomplete

These rejects are deterministic and should be recorded in the route decision
artifact so the same invalid request fails for the same reasons until the
artifacts change.

## Example bundles

- Legal mediated cousin route: `examples/route-law-bundle/clean/`
- Deterministic reject: `examples/route-law-bundle/known-bad-direct-cross-president/`

## Related docs

- [Kinship Route Classification](/architecture/kinship-route-classification)
- [Design Studio Output Contracts](/architecture/design-studio-output-contracts)
- [Lineage Admission Rules](/architecture/lineage-admission-rules)
