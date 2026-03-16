---
summary: "M14 approval trace model tying approval checkpoints to route-law envelope carry-forward"
read_when:
  - Auditing approval checkpoint receipt fields
  - Mapping route-law envelope carry-forward persistence in ACP manager
  - Verifying trace namespace continuity across M14 artifacts
title: "Approval Trace Model"
---

# Approval trace model

Last updated: 2026-03-16

M14 trace modeling is thin and receipt-oriented: approval checkpoints and
artifact profiles carry namespace and correlation data without redefining frozen
M12 or M13 contracts.

## Route-law envelope carry-forward anchor

- Contract type: `SessionAcpRouteLawEnvelope`
  - `src/config/sessions/types.ts`
- Persistence carry-forward helper:
  - `src/acp/control-plane/manager.core.ts`
  - `preserveRouteLawEnvelope`

The helper centralizes route-law envelope preservation across manager metadata
write paths, preventing drift while keeping envelope shape unchanged.

## Approval checkpoint trace contract

- Schema: `schemas/approval-checkpoint.schema.json`
- Required trace fields:
  - `traceNamespace`
  - `receiptNamespace`
  - `routeLawNamespace`
  - `approvalNamespace`
  - `correlationId`

Checkpoint outcomes are explicit and finite:

- `approve`
- `deny`
- `expire`

## Proof anchor

- `test/m14-approval-boundary-proof.test.ts`

## Related M14 docs

- [Artifact Contract](/architecture/artifact-contract)
- [Approval Await Gateway](/architecture/approval-await-gateway)
- [MCP Tool Boundary](/architecture/mcp-tool-boundary)
