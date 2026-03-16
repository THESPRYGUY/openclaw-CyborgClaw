---
summary: "M14 approval mapping and await lookup boundaries mapped to implemented ACP seams"
read_when:
  - Auditing approval policy key canonicalization
  - Auditing await lookup behavior for missing runId events
  - Tracing proof tests for approval and await seams
title: "Approval Await Gateway"
---

# Approval await gateway

Last updated: 2026-03-16

This document maps M14 approval and await boundaries to the exact symbols and
proof tests already shipped on `cyborg/v2026.2.26-pr`.

## Approval mapping boundary

Authoritative key canonicalization path:

- `src/acp/control-plane/runtime-options.ts`
  - `ACP_APPROVAL_POLICY_CONFIG_KEY`
  - `buildRuntimeConfigOptionPairs`
  - `inferRuntimeOptionPatchFromConfigOption`
- `src/auto-reply/reply/commands-acp/runtime-options.ts`
  - `handleAcpPermissionsAction`

Behavior locked in M14 seam commit:

- command path consumes one canonical runtime key source
- emitted runtime key remains `approval_policy`
- reverse alias mapping support remains intact

Focused proof:

- `src/auto-reply/reply/commands-acp.test.ts`
  - `updates ACP permissions via /acp permissions using the canonical approval key`

## Await lookup boundary

Authoritative lookup and routing path:

- `src/acp/translator.ts`
  - `findPendingBySessionKey`
  - `handleChatEvent`
  - `handleAgentEvent`

Behavior locked in M14 seam commit:

- with `runId`, lookup requires exact pending match
- with missing `runId`, lookup resolves only if one matching pending prompt
  exists
- with missing `runId` and shared `sessionKey` ambiguity, event is dropped
  instead of guessed

Focused proof:

- `src/acp/translator.cancel-scoping.test.ts`
  - `drops chat events without runId when multiple pending prompts share a session key`

## Related M14 docs

- [Artifact Contract](/architecture/artifact-contract)
- [MCP Tool Boundary](/architecture/mcp-tool-boundary)
- [Approval Trace Model](/architecture/approval-trace-model)
