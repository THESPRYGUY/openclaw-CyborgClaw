# M06 Provenance Field Map (Audited Chain Only)

## VERIFIED CURRENT STATE

- Chain: `ops/scripts/cyborg-run` -> `scripts/strike_echo.sh` / `ops/scripts/alpha_smoke.sh` -> `ops/scripts/gate_archive.sh` -> audited ledger receipt pair.

| canonical field     | classification              | audited-chain note                                                         |
| ------------------- | --------------------------- | -------------------------------------------------------------------------- |
| `job_id`            | source-limited unknown/null | not truthfully available in current chain runtime outputs                  |
| `run_id`            | truthfully sourced          | available from run execution and propagated to receipts                    |
| `agent_uuid`        | source-limited unknown/null | not emitted by current chain runtime metadata                              |
| `agent_fingerprint` | source-limited unknown/null | not emitted by current chain runtime metadata                              |
| `agent_profile_id`  | truthfully sourced          | available from role/agent context in alpha path                            |
| `node_id`           | truthfully sourced          | available from node invoke response (`nodeId`) and normalized              |
| `provider_id`       | multi-step/per-role         | truthful at role/substep level, not one single scalar for mixed-role alpha |
| `model_id`          | multi-step/per-role         | truthful at role/substep level, not one single scalar for mixed-role alpha |
| `timestamp`         | truthfully sourced          | generated/serialized in canonical form                                     |

## TARGET / INTENDED STATE

- Maintain truthful mapping without fabricated fields.

## UNKNOWN / TO VERIFY

- Whether alternate runtime paths can produce truthful `job_id`/`agent_uuid`/`agent_fingerprint`.

## RISKS / BLOCKERS

- Forcing single provider/model scalar would lose truthful multi-role context.

## EXACT NEXT ACTION

- Use this map as the acceptance baseline for audited-chain provenance completeness.
