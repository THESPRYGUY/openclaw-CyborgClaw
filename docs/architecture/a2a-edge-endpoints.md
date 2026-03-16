---
summary: "M15 implemented public A2A endpoint inventory with auth and bounded behavior"
read_when:
  - Verifying currently shipped public A2A endpoints
  - Checking auth posture per endpoint
  - Confirming thin-slice HTTP SSE and JSON-RPC behavior
title: "A2A Edge Endpoints"
---

# a2a edge endpoints

Last updated: 2026-03-16

This document lists the exact M15 public edge surfaces currently implemented on
`src/gateway/public-a2a-edge-http.ts` and registered from
`src/gateway/server-http.ts` stage `public-a2a-edge`.

## Implemented endpoint inventory

- `GET /.well-known/agent-card.json`
  - auth: public unauthenticated
  - behavior: returns the public agent card JSON
- `HEAD /.well-known/agent-card.json`
  - auth: public unauthenticated
  - behavior: card headers only
- `POST /message/send`
  - auth: bearer required
  - behavior: synchronous JSON response with projected public task
- `POST /message/stream`
  - auth: bearer required
  - behavior: `text/event-stream` with projected IDs only
- `POST /tasks/get`
  - auth: bearer required
  - behavior: JSON-RPC method `tasks/get` returns projected public task
- `POST /tasks/resubscribe`
  - auth: bearer required
  - behavior: JSON-RPC method `tasks/resubscribe` returns
    `text/event-stream` for the existing projected task

## Thin-slice protocol behavior

### message send

- request body expects `message` plus optional `model` and `user`
- success returns `200` with `{ task: <public projected task> }`
- task projection includes only public-safe fields

### message stream

- request body expects `message` plus optional `model` and `user`
- success returns `200` and `content-type: text/event-stream`
- current minimal event set:
  - `task.started`
  - `message.delta`
  - `task.completed` or `task.failed`
  - terminal `[DONE]`

### tasks get

- request body must be JSON-RPC 2.0 with method `tasks/get`
- `params.taskId` is required
- success returns `200` JSON-RPC result with projected `task`

### tasks resubscribe

- request body must be JSON-RPC 2.0 with method `tasks/resubscribe`
- `params.taskId` is required
- success returns `200` and `content-type: text/event-stream`
- event payloads carry only projected public IDs

## Bounded error behavior currently proven

- unauthenticated calls to:
  - `/message/send`
  - `/message/stream`
  - `/tasks/get`
  - `/tasks/resubscribe`
    return `401`
- unknown projected `taskId` for `tasks/get` returns:
  - HTTP `404`
  - JSON-RPC error code `-32004`
  - error message `task not found`
- unknown projected `taskId` for `tasks/resubscribe` returns:
  - HTTP `404`
  - JSON-RPC error code `-32004`
  - error message `task not found`

## Proof anchors

- focused gateway tests: `src/gateway/public-a2a-edge-http.test.ts`
- mission proof: `test/m15-public-a2a-edge-proof.test.ts`

## Related docs

- [Public A2A Agent Card](/architecture/public-a2a-agent-card)
- [Public Task Projection](/architecture/public-task-projection)
- [Public Edge Sanitization](/architecture/public-edge-sanitization)
