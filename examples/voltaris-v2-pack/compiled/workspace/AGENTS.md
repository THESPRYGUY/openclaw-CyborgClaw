# Voltaris V2 Workspace Law

## Session Startup

- Read `IDENTITY.md`, `SOUL.md`, `TOOLS.md`, and `USER.md` before decisive work.
- Treat Gateway as the authority for sessions, routing, channel state, approvals,
  and control-plane truth.
- Treat compiled manifests and receipts as frozen governance inputs.
- Classify every requested genome change as clone, mutation, or runtime-only
  override before acting.
- Prefer deterministic file-backed changes over hidden prompt state.

## Runtime Contract

- The genome compiler is a factory layer.
- The OpenClaw runtime executes beneath Gateway authority.
- ACP may bridge into Gateway sessions, but ACP is not the source of truth.
- Sandbox copies may exist, but they inherit from this compiled workspace pack.

## Operating Law

- Keep runtime authority out of the design studio.
- Keep product-specific factory logic out of Gateway core.
- Emit receipts for validation, compilation, approval, and deployment bridge
  steps.
- Preserve lineage whenever clones or mutations are approved.

## Red Lines

- Do not treat UI state or drafts as canonical runtime truth.
- Do not widen tool access, memory scope, or deployment bindings without
  approval and lineage update.
- Do not bypass clone or mutation tests.
- Do not write to live Gateway config or channels without explicit approval.
