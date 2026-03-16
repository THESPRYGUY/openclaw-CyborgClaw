---
summary: "M14 artifact contract package for approval boundary receipts and closeout proof"
read_when:
  - Verifying M14 artifact contract deliverables
  - Inspecting clean and known-bad approval-boundary bundles
  - Auditing the M14 proof bundle against shipped seam commits
title: "Artifact Contract"
---

# Artifact contract

Last updated: 2026-03-16

Mission M14 adds a thin artifact package that documents and proves boundary
truth already implemented in published M14 seams.

## Contract surfaces

### Artifact profile

- Schema: `schemas/artifact-profile.schema.json`
- Artifact kind: `artifact.profile`
- Purpose: lock one profile record for published seam SHAs, boundary symbols,
  and closeout receipts.

### Approval checkpoint

- Schema: `schemas/approval-checkpoint.schema.json`
- Artifact kind: `approval.checkpoint`
- Purpose: lock approve, deny, and expire checkpoint outcomes tied to artifact
  receipts.

## Bundle paths

- Clean bundle:
  - `examples/approval-boundary-bundle/minimal-clean/artifact-profile.json`
  - `examples/approval-boundary-bundle/minimal-clean/approval-checkpoint.json`
- Known-bad bundle:
  - `examples/approval-boundary-bundle/known-bad/artifact-profile.json`
  - `examples/approval-boundary-bundle/known-bad/approval-checkpoint.json`

## Proof boundary

- Proof test: `test/m14-approval-boundary-proof.test.ts`
- Proof scope:
  - clean bundle validates against both schemas
  - known-bad bundle fails deterministically
  - published M14 seam symbols and SHAs are anchored in one package

## Related M14 docs

- [Approval Await Gateway](/architecture/approval-await-gateway)
- [MCP Tool Boundary](/architecture/mcp-tool-boundary)
- [Approval Trace Model](/architecture/approval-trace-model)
