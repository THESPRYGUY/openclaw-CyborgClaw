# M07 Invalid Patch Validation Receipt

## Replay Method

- Replay command:
  - `BASH_ENV=/tmp/m7_replay_env.sh bash ops/scripts/task_runner.sh > ops/missions/mission-007/runs/20260312_172432Z_invalid-patch-replay/task_runner_replay.log 2>&1 || true`
- Intentional invalid patch input:
  - `openclaw-safe` was stubbed to return an assistant patch with a non-existent path (`diff --git a/does/not/exist b/does/not/exist`), so `git apply --recount --check` fails naturally in `review_patch.sh`.
- Real path exercised:
  - `ops/scripts/task_runner.sh` -> `ops/scripts/generate_patch.sh` -> `ops/scripts/review_patch.sh`
- Guardrail note:
  - `git status --porcelain=v1` was wrapped in-process during this replay to bypass `task_runner` precheck rejection caused by expected in-flight mission edits to `review_patch.sh` and `task_runner.sh`.

## Proof Points

- Readable invalid patch token observed:
  - `[review_patch] INVALID PATCH`
- Structured invalid patch emission observed:
  - `class=INVALID_PATCH_APPLY_CHECK`
  - `hint=regenerate patch against current HEAD and fix hunk/file-path mismatch using apply-check stderr`
  - `evidence_ref=apply_check_stderr`
  - `retryable=yes`
  - `escalation=needs_human`
- Retry bound observed in runner-structured line:
  - `attempt=1 max_retries=2`
  - `attempt=2 max_retries=2`
  - `attempt=3 max_retries=2`
  - Interpretation: two retries after initial attempt, then terminal escalation.
- Terminal structured class observed:
  - `class=NEEDS_HUMAN ... retryable=no ... max_retries=2 ... escalation=human_operator`
- Terminal task status observed:
  - `ops/tasks/task-777.json` became `"status": "needs_human"` during replay.

## Durable Artifacts

- Raw replay log:
  - `ops/missions/mission-007/runs/20260312_172432Z_invalid-patch-replay/task_runner_replay.log`
- Key excerpt log:
  - `ops/missions/mission-007/runs/20260312_172432Z_invalid-patch-replay/key_excerpts.log`
- Final task status snapshot:
  - `ops/missions/mission-007/runs/20260312_172432Z_invalid-patch-replay/task-777.final.json`

## Scratch / Cleanup

- Scratch used by runner:
  - `/tmp/cyborgclaw-runner/*`
- Cleanup performed:
  - removed `/tmp/m7_replay_env.sh`
  - removed `ops/tasks/task-777.json`
  - restored `ops/tasks/task-015.json` to HEAD state after incidental replay mutation
