---
summary: "M15 public-edge sanitization rules and non-leak guarantees"
read_when:
  - Auditing public payload and event safety boundaries
  - Confirming raw internal IDs never cross the public edge
  - Verifying M15 stays inside M12 M13 and M14 contract boundaries
title: "Public Edge Sanitization"
---

# public edge sanitization

Last updated: 2026-03-16

Mission M15 introduces a bounded public edge projection layer.

The layer sanitizes internal run and session state into public-safe task
surfaces.

## Non-leak guarantees

Current M15 guarantees:

- raw internal `runId` is never emitted in public responses
- raw internal `sessionKey` is never emitted in public responses
- public task identity always uses deterministic projected `taskId` and
  `contextId`
- SSE payloads and events carry only projected IDs

## Public payload and event sanitization rules

Sanitization is applied by the public edge seam in
`src/gateway/public-a2a-edge-http.ts`.

Allowed public task fields are limited to:

- `kind`
- `schemaVersion`
- `taskId`
- `contextId`
- `status`
- optional `output.text`

The public edge does not include internal-only fields such as:

- internal run identifiers
- internal session keys
- internal registry state envelopes
- internal approval or artifact wiring details

## Boundary preservation for prior missions

M15 sanitization preserves earlier mission contracts:

- preserves M12 route-law and cousin-ticket truth by not exposing or mutating
  route-law internals
- preserves M13 bus registry run and session contracts by projecting only a
  minimal public task view
- preserves M14 approval artifact await and MCP boundaries by keeping those
  contracts internal to existing seams

## Proof anchors

- gateway behavioral proof: `src/gateway/public-a2a-edge-http.test.ts`
- schema and artifact proof: `test/m15-public-a2a-edge-proof.test.ts`

## Related docs

- [Public A2A Agent Card](/architecture/public-a2a-agent-card)
- [A2A Edge Endpoints](/architecture/a2a-edge-endpoints)
- [Public Task Projection](/architecture/public-task-projection)
