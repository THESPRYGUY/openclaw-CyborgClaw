---
summary: "M14 MCP per-session setup boundary and proof anchors for ACP translator session gates"
read_when:
  - Auditing per-session MCP setup rejection behavior
  - Checking ACP translator session setup guardrails
  - Tracing proof anchors for M14 MCP seam
title: "MCP Tool Boundary"
---

# MCP tool boundary

Last updated: 2026-03-16

M14 keeps MCP support narrow at the ACP translator boundary and rejects
unsupported per-session MCP server setup requests.

## Authoritative seam symbols

- `src/acp/translator.ts`
  - `initialize` advertises `mcpCapabilities`
  - `newSession` calls `assertSupportedSessionSetup`
  - `loadSession` calls `assertSupportedSessionSetup`
  - `assertSupportedSessionSetup` enforces per-session setup rejection

## Behavioral boundary

- ACP bridge mode does not accept per-session MCP server declarations.
- Session setup must use gateway or agent-level MCP configuration.
- Behavior remains scoped to setup validation and does not alter approval,
  await, or route-law paths.

## Focused proof

- `src/acp/translator.session-rate-limit.test.ts`

## Related M14 docs

- [Artifact Contract](/architecture/artifact-contract)
- [Approval Await Gateway](/architecture/approval-await-gateway)
- [Approval Trace Model](/architecture/approval-trace-model)
