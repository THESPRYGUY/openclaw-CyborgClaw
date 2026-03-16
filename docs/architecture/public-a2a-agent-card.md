---
summary: "M15 public discovery card contract for the OpenClaw public A2A edge"
read_when:
  - Verifying the public edge discovery surface
  - Confirming public versus authenticated A2A endpoint posture
  - Auditing public agent card schema and examples
title: "Public A2A Agent Card"
---

# public a2a agent card

Last updated: 2026-03-16

Mission M15 publishes one minimal public discovery card for the OpenClaw A2A
edge.

The card is intentionally thin. It advertises only the currently implemented
public edge interfaces and auth posture.

## Purpose

The public agent card exists to:

- publish one unauthenticated discovery surface at
  `/.well-known/agent-card.json`
- tell clients which methods are currently supported on this public edge slice
- declare endpoint paths and auth posture without exposing internal contracts

## Public and authenticated surfaces

Current M15 posture is:

- public unauthenticated:
  - `GET /.well-known/agent-card.json`
  - `HEAD /.well-known/agent-card.json`
- bearer required:
  - `POST /message/send`
  - `POST /message/stream`
  - `POST /tasks/get`
  - `POST /tasks/resubscribe`

M15 does not add `agent/authenticatedExtendedCard` in this tranche.

## Advertised interfaces endpoints and security schemes

The card advertises:

- `supportedInterfaces`
  - `message/send`
  - `message/stream`
  - `tasks/get`
  - `tasks/resubscribe`
- `endpoints`
  - `agentCard: /.well-known/agent-card.json`
  - `messageSend: /message/send`
  - `messageStream: /message/stream`
  - `tasksGet: /tasks/get`
  - `tasksResubscribe: /tasks/resubscribe`
- `securitySchemes`
  - `agentCard: none`
  - `messageSend: bearer`
  - `messageStream: bearer`
  - `tasksGet: bearer`
  - `tasksResubscribe: bearer`

## Minimum supported fields

The required minimal card fields are:

- `kind = public-agent-card`
- `schemaVersion = 1`
- `name`
- `description`
- `supportedInterfaces`
- `endpoints`
- `securitySchemes`

Contract source of truth for this card:

- schema: `schemas/public-agent-card.schema.json`
- clean example: `examples/public-a2a-edge-bundle/minimal-clean/agent-card.json`
- known-bad example:
  `examples/public-a2a-edge-bundle/known-bad/agent-card.json`

## Related docs

- [A2A Edge Endpoints](/architecture/a2a-edge-endpoints)
- [Public Task Projection](/architecture/public-task-projection)
- [Public Edge Sanitization](/architecture/public-edge-sanitization)
