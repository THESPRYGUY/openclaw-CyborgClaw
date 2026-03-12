# M09 Prompt Improvement Log

## PROMPT IMPROVEMENT ENTRY

- sprint_id:
- task:
- prompt pattern used:
- result quality: STRONG / MIXED / WEAK
- what helped:
- what hurt:
- change to carry forward:
- confidence: HIGH / MEDIUM / LOW
- evidence:
- unknowns:

---

## PROMPTING LESSONS CAPTURED FOR NEXT MISSION

### Worked

-

### Failed / Caused Drag

-

### Change to Carry Forward

-

## PROMPT IMPROVEMENT ENTRY

- sprint_id: M09_SPRINT_001
- task: core subject evidence discovery
- prompt pattern used: read-only bounded audit with explicit subject list and no-manifest/no-hash constraints
- result quality: STRONG
- what helped: strict subject IDs and scope constraints prevented drift; path-first repo search surfaced mission artifacts quickly
- what hurt: missing canonical M05 artifact files forced reliance on indirect continuity references
- change to carry forward: require each subject to declare one primary candidate artifact path and one backup receipt path before manifest drafting
- confidence: MEDIUM
- evidence: ops/missions/mission-004/baseline_evidence.md; ops/missions/mission-006/closeout/20260312_152757Z/M06_provenance_coverage_audit.md; ops/missions/mission-007/runs/20260312_172432Z_invalid-patch-replay/M07_invalid_patch_validation_receipt.md; ops/missions/mission-008/runs/20260312_192948Z_mission-8-alpha-closeout/M08_closeout_receipt.md
- unknowns: canonical M05 execution-isolation artifact location in repo remains unproven

---

## PROMPTING LESSONS CAPTURED FOR NEXT MISSION

### Worked

- Explicit subject list + bounded no-manifest/no-hash rules kept discovery focused and auditable.
- Repo-path-first evidence collection produced direct candidate artifacts without speculative gaps.

### Failed / Caused Drag

- Subject sets that depend on non-local or renamed legacy artifacts (M05) create ambiguity without an explicit path map.

### Change to Carry Forward

- Add an early path-availability gate per required subject (primary + fallback path) before any certification packaging step.

## PROMPT IMPROVEMENT ENTRY

- sprint_id: M09_SPRINT_001
- task: core subject evidence discovery
- prompt pattern used: read-only bounded audit with explicit subject list and no-manifest/no-hash constraints
- result quality: STRONG
- what helped: strict subject IDs and scope constraints prevented drift; path-first repo search surfaced mission artifacts quickly
- what hurt: missing canonical M05 artifact files forced reliance on indirect continuity references
- change to carry forward: require each subject to declare one primary candidate artifact path and one backup receipt path before manifest drafting
- confidence: MEDIUM
- evidence: ops/missions/mission-004/baseline_evidence.md; ops/missions/mission-006/closeout/20260312_152757Z/M06_provenance_coverage_audit.md; ops/missions/mission-007/runs/20260312_172432Z_invalid-patch-replay/M07_invalid_patch_validation_receipt.md; ops/missions/mission-008/runs/20260312_192948Z_mission-8-alpha-closeout/M08_closeout_receipt.md
- unknowns: canonical M05 execution-isolation artifact location in repo remains unproven

---

## PROMPTING LESSONS CAPTURED FOR NEXT MISSION

### Worked

- Explicit subject list + bounded no-manifest/no-hash rules kept discovery focused and auditable.
- Repo-path-first evidence collection produced direct candidate artifacts without speculative gaps.

### Failed / Caused Drag

- Subject sets that depend on non-local or renamed legacy artifacts (M05) create ambiguity without an explicit path map.

### Change to Carry Forward

- Add an early path-availability gate per required subject (primary + fallback path) before any certification packaging step.

## PROMPT IMPROVEMENT ENTRY

- sprint_id: M09_SPRINT_002
- task: core subject candidate freeze
- prompt pattern used: bounded evidence-selection pass with explicit fail-loud handling for missing direct proof
- result quality: MIXED
- what helped: enforcing one primary + one backup per subject removed ambiguity and kept scope tight
- what hurt: M05 lacked direct local artifacts, forcing a missing classification despite continuity references
- change to carry forward: add an early direct-artifact availability check per subject before freeze selection
- confidence: MEDIUM
- evidence: ops/missions/mission-004/baseline_evidence.md; ops/missions/mission-006/closeout/20260312_152757Z/M06_provenance_coverage_audit.md; ops/missions/mission-007/runs/20260312_172432Z_invalid-patch-replay/M07_invalid_patch_validation_receipt.md; ops/ledger/gate_20260312_191823Z_191936-1605313.json; ops/ledger/gate_20260312_192316Z_192435-1612301.json; ops/missions/mission-006/closeout/20260312_152757Z/artifact_index.md
- unknowns: whether canonical M05 execution-isolation artifacts exist outside current local evidence scope

## PROMPT IMPROVEMENT ENTRY

- sprint_id: M09_SPRINT_003
- task: core manifest drafting
- prompt pattern used: bounded manifest-drafting pass with frozen evidence inputs and explicit no-rediscovery constraints
- result quality: STRONG
- what helped: fixed input set and explicit field schema made drafting deterministic and prevented subject drift
- what hurt: missing direct M05 proof forced placeholder handling that must remain explicit
- change to carry forward: require each manifest task to include frozen input rows and allowed status vocabulary up front
- confidence: HIGH
- evidence: ops/missions/mission-009/runs/20260312_201420Z/M09_core_subject_manifest.md
- unknowns: whether direct local M05 execution-isolation artifact can be sourced in-scope later

## PROMPT IMPROVEMENT ENTRY

- sprint_id: M09_SPRINT_004
- task: core manifest verification
- prompt pattern used: bounded verification pass with frozen expectations and live hash/path consistency checks
- result quality: STRONG
- what helped: explicit per-subject check list (row/path/hash/status) made verification deterministic and low-noise
- what hurt: repeated shell heredoc chaining is error-prone when combined with post-write checks
- change to carry forward: separate write and verification commands into distinct steps to avoid shell chaining failures
- confidence: HIGH
- evidence: ops/missions/mission-009/runs/20260312_201420Z/M09_core_subject_manifest.md; live sha256sum and path-existence receipts from this sprint
- unknowns: none within this bounded verification pass

## PROMPT IMPROVEMENT ENTRY

- sprint_id: M09_SPRINT_005
- task: evidence bundle index and verification note drafting
- prompt pattern used: bounded packaging-prep pass driven strictly from verified manifest with no-status-change constraints
- result quality: STRONG
- what helped: explicit section constraints plus fixed source-of-truth manifest prevented accidental rediscovery and status drift
- what hurt: none material in this sprint
- change to carry forward: require each packaging-prep prompt to include mandatory section headers and forbidden actions list
- confidence: HIGH
- evidence: ops/missions/mission-009/runs/20260312_201420Z/M09_evidence_bundle_index.md; ops/missions/mission-009/runs/20260312_201420Z/M09_verification_note.md
- unknowns: none within this bounded packaging-prep pass

## PROMPT IMPROVEMENT ENTRY

- sprint_id: M09_SPRINT_006
- task: unresolved-items register, verdict draft, and prompt adaptation receipt drafting
- prompt pattern used: bounded pre-verdict closeout pass driven only by existing verified mission artifacts
- result quality: STRONG
- what helped: fixed section requirements and explicit no-rediscovery constraints kept drafting aligned to existing artifacts only
- what hurt: legacy duplicate entries in the prompt log from earlier retries increase review noise
- change to carry forward: add an explicit sprint_id uniqueness check before appending any new prompt entry
- confidence: HIGH
- evidence: ops/missions/mission-009/runs/20260312_201420Z/M09_unresolved_items_register.md; ops/missions/mission-009/runs/20260312_201420Z/M09_verdict_draft.md; ops/missions/mission-009/runs/20260312_201420Z/M09_prompt_adaptation_receipt.md
- unknowns: none within this bounded pre-verdict drafting pass

## PROMPT IMPROVEMENT ENTRY

- sprint_id: M09_SPRINT_007
- task: final closeout receipt and manager report assembly
- prompt pattern used: bounded final assembly pass using completed M09 artifacts only and explicit no-rediscovery constraints
- result quality: STRONG
- what helped: fixed section checklist and explicit produced-artifact list requirement prevented omissions
- what hurt: none material in this sprint
- change to carry forward: require explicit required-path checklist in every final assembly prompt
- confidence: HIGH
- evidence: ops/missions/mission-009/runs/20260312_201420Z/M09_closeout_receipt.md; ops/missions/mission-009/runs/20260312_201420Z/M09_final_manager_closeout_report.md
- unknowns: whether M05 direct acceptable proof will be provided after manager review

## PROMPT IMPROVEMENT ENTRY

- sprint_id: M09_SPRINT_008
- task: final cross-file consistency verification
- prompt pattern used: bounded final verification pass across completed mission artifacts with explicit no-status-change constraints
- result quality: STRONG
- what helped: explicit consistency checklist (counts, missing subject, verdict rationale, upgrade condition) prevented interpretation drift
- what hurt: none material in this sprint
- change to carry forward: require a fixed cross-file consistency matrix before any final packaging commit
- confidence: HIGH
- evidence: ops/missions/mission-009/runs/20260312_201420Z/M09_core_subject_manifest.md; ops/missions/mission-009/runs/20260312_201420Z/M09_evidence_bundle_index.md; ops/missions/mission-009/runs/20260312_201420Z/M09_verification_note.md; ops/missions/mission-009/runs/20260312_201420Z/M09_unresolved_items_register.md; ops/missions/mission-009/runs/20260312_201420Z/M09_verdict_draft.md; ops/missions/mission-009/runs/20260312_201420Z/M09_prompt_adaptation_receipt.md; ops/missions/mission-009/runs/20260312_201420Z/M09_closeout_receipt.md; ops/missions/mission-009/runs/20260312_201420Z/M09_final_manager_closeout_report.md
- unknowns: none within this bounded cross-file verification pass
