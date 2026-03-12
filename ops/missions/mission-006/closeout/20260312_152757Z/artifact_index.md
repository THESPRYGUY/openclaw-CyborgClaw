# artifact_index

## VERIFIED CURRENT STATE

- mission_id: `mission-006`
- closeout_utc: `20260312_152757Z`
- canonical_rule_used: fallback `ops/missions/mission-006/closeout/YYYYMMDD_HHMMSSZ/` (no mission-006 canonical path found in local mission files)
- repo_root: `/home/spryguy/openclaw-workspace/repos/openclaw`
- current_branch: `feat/golden-branch-loop-preflight`
- head_sha: `5ea00a6831a3f91d70c24bff41c001fdf9b94556`
- signoff_status: `PROPOSED_CLOSEOUT_ONLY`

### full artifact list + purpose

- `M06_closeout_receipt.md`: formal mission receipt with verdict, scope, chain boundary, and changed files.
- `M06_closeout_summary.txt`: concise manager summary.
- `M06_handover_addendum.md`: continuity guardrails and future-path notes.
- `M06_provenance_field_map.md`: nine-field classification map for audited chain.
- `M06_provenance_coverage_audit.md`: frozen coverage evidence summary.
- `M06_receipt_rule_decision.md`: accepted audited-chain receipt policy.
- `M06_contract_parity_patch_receipt.md`: parity patch scope and result.
- `mission_manager_report.md`: manager-facing handoff report.
- `artifact_index.md`: index and mapping authority.
- `mission_log_snapshot.md`: concise timeline.

### prior mission dependency artifacts referenced

- `M05_closeout_receipt.md` equivalent mapping reference.
- `M05_closeout_summary.txt` equivalent mapping reference.
- `M05_handover_addendum.md` continuity reference.
- `M05_workspace_boundary_validation.md` continuity reference.
- `M03_closeout_receipt.md` continuity reference.
- `M03_handover_addendum.md` continuity reference.
- `M04_closeout_receipt.md` continuity reference.
- `M04_closeout_summary.txt` continuity reference.
- `M04_handover_addendum.md` continuity reference.

### filename equivalence mappings used

- `M05_closeout_receipt.md` -> `M05_scratch_vs_repo_cleanliness_receipt.md`
- `M05_closeout_summary.txt` -> `Mission_5_Report_for_Mission_Manager.md`

### manager-required to mission-specific mapping

- `mission_manager_report.md` -> manager-facing aggregation of mission-specific artifacts.
- `artifact_index.md` -> authoritative mapping/index for all mission-specific and manager-required files.
- `mission_log_snapshot.md` -> compact chronology sourced from mission execution evidence.

## TARGET / INTENDED STATE

- Single canonical closeout pack path and complete retrievable index.

## UNKNOWN / TO VERIFY

- Separate approval action not yet executed.

## RISKS / BLOCKERS

- Existing repo tree has unrelated mission-006 code changes still unstaged outside closeout path.

## EXACT NEXT ACTION

- Update `closeout_utc` to actual directory timestamp and compute checksums for final manager retrieval proof.
