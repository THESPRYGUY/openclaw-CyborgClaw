# M06 Contract Parity Patch Receipt

## VERIFIED CURRENT STATE

- Exact files changed for M06 parity work:
  - `src/gateway/protocol/schema/agent.ts`
  - `apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift`
  - `apps/macos/Sources/OpenClawProtocol/GatewayModels.swift`
  - `apps/shared/OpenClawKit/Sources/OpenClawChatUI/ChatModels.swift`
  - `ops/scripts/alpha_smoke.sh`
  - `ops/scripts/cyborg-run`
  - `ops/scripts/gate_archive.sh`
  - `ops/ledger/gate_20260303_172012Z_172131-912168.json`
  - `ops/ledger/gate_20260303_172012Z_172131-912168.md`
- Canonicalization/parity completed in audited chain with explicit source limits.
- Final parity result: `COMPLETE_WITH_LIMITS_IN_AUDITED_CHAIN`.

## TARGET / INTENDED STATE

- Preserve parity behavior and source-limit disclosures.

## UNKNOWN / TO VERIFY

- Full parity in non-audited runtime paths.

## RISKS / BLOCKERS

- Runtime-source limits remain for three fields in this chain.

## EXACT NEXT ACTION

- Use this receipt to anchor future parity extensions beyond audited chain only if re-scoped.
