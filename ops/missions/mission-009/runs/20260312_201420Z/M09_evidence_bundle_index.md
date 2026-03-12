# M09 Evidence Bundle Index

## Core Subject Index

| subject_id                 | mission_id | status   | primary_artifact_path                                                                                         | source_receipt_path                                                                                       | proves                                                                    | missing_or_unresolved_note                                                     |
| -------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| M04_PREFLIGHT              | M04        | VERIFIED | `ops/missions/mission-004/baseline_evidence.md`                                                               | `ops/missions/mission-004/baseline_snapshot.md`                                                           | Captures M04 baseline and preflight context before later mission changes. | None in this subject row.                                                      |
| M05_EXECUTION_ISOLATION    | M05        | MISSING  | `NONE`                                                                                                        | `ops/missions/mission-006/closeout/20260312_152757Z/artifact_index.md`                                    | Provides continuity reference only for prior M05 mapping.                 | No direct local execution-isolation artifact proven.                           |
| M06_PROVENANCE_AUDIT       | M06        | VERIFIED | `ops/missions/mission-006/closeout/20260312_152757Z/M06_provenance_coverage_audit.md`                         | `ops/missions/mission-006/closeout/20260312_152757Z/M06_closeout_receipt.md`                              | Records audited-chain provenance coverage and explicit source limits.     | None in this subject row.                                                      |
| M07_INVALID_PATCH_TAXONOMY | M07        | VERIFIED | `ops/missions/mission-007/runs/20260312_172432Z_invalid-patch-replay/M07_invalid_patch_validation_receipt.md` | `ops/missions/mission-007/runs/20260312_173656Z_mission-7-invalid-patch-closeout/M07_closeout_receipt.md` | Shows invalid-apply path validation and bounded escalation evidence.      | Dedicated taxonomy-named artifact absent; replay receipt is direct proof lane. |
| M08_RUN_A                  | M08        | VERIFIED | `ops/ledger/gate_20260312_191823Z_191936-1605313.json`                                                        | `ops/missions/mission-008/runs/20260312_192948Z_mission-8-alpha-closeout/M08_closeout_receipt.md`         | Confirms Run A PASS receipt with branch/head/gate fields.                 | None in this subject row.                                                      |
| M08_RUN_B                  | M08        | VERIFIED | `ops/ledger/gate_20260312_192316Z_192435-1612301.json`                                                        | `ops/missions/mission-008/runs/20260312_192948Z_mission-8-alpha-closeout/M08_closeout_receipt.md`         | Confirms Run B PASS receipt with branch/head/gate fields.                 | None in this subject row.                                                      |

## Summary

- Required core subjects total: 6
- VERIFIED count: 5
- MISSING count: 1
- OPTIONAL count: 0
- Current likely envelope state: PARTIAL
