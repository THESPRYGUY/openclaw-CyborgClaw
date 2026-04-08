# M06 Provenance Coverage Audit (Frozen)

## VERIFIED CURRENT STATE

- Audited surfaces:
  - `src/gateway/protocol/schema/agent.ts`
  - `apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift`
  - `apps/macos/Sources/OpenClawProtocol/GatewayModels.swift`
  - `apps/shared/OpenClawKit/Sources/OpenClawChatUI/ChatModels.swift`
  - `ops/scripts/alpha_smoke.sh`
  - `ops/scripts/cyborg-run`
  - `ops/scripts/gate_archive.sh`
  - `ops/ledger/gate_20260303_172012Z_172131-912168.json`
  - `ops/ledger/gate_20260303_172012Z_172131-912168.md`
- Pre-patch summary:
  - Canonical coverage incomplete; heavy alias use.
- Post-patch summary:
  - Canonical keys normalized across audited typed/emitter/receipt chain.
  - Backward-compatible aliases retained where needed.
- Remaining proven source limits:
  - `job_id`, `agent_uuid`, `agent_fingerprint` not truthfully available in this chain.
  - `provider_id` and `model_id` truthful only as multi-step/per-role values.

## TARGET / INTENDED STATE

- Audited-chain closure with explicit source limits and no fabrication.

## UNKNOWN / TO VERIFY

- Non-audited runtime paths are out of scope.

## RISKS / BLOCKERS

- Over-claiming beyond inspected chain boundary.

## EXACT NEXT ACTION

- Keep this audit as frozen evidence for mission-006 acceptance in inspected scope.
