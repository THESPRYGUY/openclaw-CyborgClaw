---
summary: "M15 deterministic public task and context ID projection law"
read_when:
  - Auditing public task ID and context ID derivation
  - Verifying no raw internal ID leaks on public edge payloads
  - Aligning task projection behavior across send stream and task methods
title: "Public Task Projection"
---

# public task projection

Last updated: 2026-03-16

M15 public edge exposes projected identifiers only.

Raw internal `runId` and `sessionKey` are never published on public payloads or
SSE events.

## Deterministic projected ID law

The authoritative projection functions are in
`src/gateway/public-a2a-edge-http.ts`:

- `derivePublicTaskId(runId)`
- `derivePublicContextId(sessionKey)`
- `projectPublicTask(...)`

Derivation algorithm:

- compute SHA-256 over `namespace + ":" + internalId`
- take the first 24 lowercase hex chars
- add fixed prefixes:
  - public `taskId = "task_" + digest24`
  - public `contextId = "ctx_" + digest24`

Current namespaces:

- task namespace: `openclaw:m15:task:v1`
- context namespace: `openclaw:m15:context:v1`

## Public task shape

Canonical projected task shape:

- `kind = public-a2a-task`
- `schemaVersion = 1`
- `taskId`
- `contextId`
- `status` in `in_progress | completed | failed`
- optional `output.text`

Contract source of truth:

- schema: `schemas/public-a2a-task.schema.json`
- clean example: `examples/public-a2a-edge-bundle/minimal-clean/task.json`
- known-bad example: `examples/public-a2a-edge-bundle/known-bad/task.json`

## Retrieval and resubscribe consistency

`message/send`, `message/stream`, `tasks/get`, and `tasks/resubscribe` all read
or emit this same projected shape.

The public edge does not expose a reverse mapping API for raw internal IDs in
M15.

## Related docs

- [Public A2A Agent Card](/architecture/public-a2a-agent-card)
- [A2A Edge Endpoints](/architecture/a2a-edge-endpoints)
- [Public Edge Sanitization](/architecture/public-edge-sanitization)
