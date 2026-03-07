#!/usr/bin/env bash
set -euo pipefail

timestamp() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

log() {
  printf '%s [task_runner] %s\n' "$(timestamp)" "$*"
}

CURRENT_STEP=""
CURRENT_TASK=""
trap 'log "ERROR exit=$? step=${CURRENT_STEP:-unknown} task=${CURRENT_TASK:-none}"' ERR

log "runner start pid=$$"

EXPECTED_REPO="/home/spryguy/openclaw-workspace/repos/openclaw"
CURRENT_REPO="$(pwd -P)"
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
PORCELAIN="$(git status --porcelain=v1)"
NON_RUNTIME_DIRTY="$(printf '%s\n' "$PORCELAIN" | rg -v '^(.. )?(ops/tasks/task-[0-9]+\.json|ops/ledger/)' || true)"

if [[ "$CURRENT_REPO" != "$EXPECTED_REPO" ]]; then
  log "PRECHECK FAIL wrong_repo current=$CURRENT_REPO expected=$EXPECTED_REPO"
  exit 10
fi

if [[ -n "$NON_RUNTIME_DIRTY" ]]; then
  log "PRECHECK FAIL dirty_tree"
  printf '%s\n' "$NON_RUNTIME_DIRTY"
  exit 11
fi

if [[ "$CURRENT_BRANCH" == "main" ]]; then
  log "PRECHECK FAIL branch_forbidden current_branch=$CURRENT_BRANCH"
  exit 12
fi

log "PRECHECK OK repo=$CURRENT_REPO branch=$CURRENT_BRANCH clean_tree=yes runtime_state_ignored=ops/tasks,ops/ledger preflight=pass"

SCRATCH_DIR="/tmp/cyborgclaw-runner"
PATCH_FILE="${SCRATCH_DIR}/patch.diff"
REVIEWER_FEEDBACK_FILE="${SCRATCH_DIR}/reviewer_feedback.txt"
export PATCH_FILE
export REVIEWER_FEEDBACK_FILE

mkdir -p "$SCRATCH_DIR"
log "SCRATCH OK dir=$SCRATCH_DIR patch_file=$PATCH_FILE reviewer_feedback_file=$REVIEWER_FEEDBACK_FILE"

TASK_DIR="ops/tasks"

TEAM_FILE="ops/strike_teams/alpha.json"

IMPLEMENTER_MODEL=$(jq -r '.roles[] | select(.id=="implementer") | .model' $TEAM_FILE)
REVIEWER_MODEL=$(jq -r '.roles[] | select(.id=="reviewer") | .model' $TEAM_FILE)
TASK_COUNT=0

log "implementer model: $IMPLEMENTER_MODEL"
log "reviewer model: $REVIEWER_MODEL"
log "scanning for tasks... task_dir=$TASK_DIR"

for task in ${TASK_DIR}/task-*.json; do
  CURRENT_TASK="$task"
  [ -e "$task" ] && TASK_COUNT=$((TASK_COUNT + 1))
  [ -e "$task" ] || continue

  status=$(jq -r '.status' "$task")

  # Recover tasks stuck in "running"
  if [[ "$status" == "running" ]]; then
      log "detected stale running task: $task — resetting to pending"
      tmp=$(mktemp)
      jq '.status="pending"' "$task" > "$tmp" && mv "$tmp" "$task"
      status="pending"
  fi

  if [[ "$status" == "pending" ]]; then
    log "executing $task status=$status"

    # mark task running
    CURRENT_STEP="mark_running"
    tmp=$(mktemp)
    jq '.status="running"' "$task" > "$tmp" && mv "$tmp" "$task"
    CURRENT_STEP=""
    log "marked running $task"

    # Clean slate for a new task (keep intra-task feedback intact)
    rm -f "$REVIEWER_FEEDBACK_FILE" "$PATCH_FILE"

    MAX_ATTEMPTS=3
    attempt=1

while (( attempt <= MAX_ATTEMPTS )); do
  log "patch attempt $attempt..."

  CURRENT_STEP="generate_patch"
  bash ops/scripts/generate_patch.sh "$task"
  CURRENT_STEP=""
  log "generate_patch exit=$?"

if [[ ! -f "$PATCH_FILE" ]]; then
  log "patch generation failed"
  ((attempt++))
  continue
fi

  log "reviewing patch... patch_file=$PATCH_FILE"

  CURRENT_STEP="review_patch"
  if bash ops/scripts/review_patch.sh "$PATCH_FILE"; then
    log "patch approved"
    CURRENT_STEP=""
    break
  fi
  CURRENT_STEP=""

  log "patch rejected (attempt $attempt)"
  rm -f "$PATCH_FILE"

  ((attempt++))
done

if (( attempt > MAX_ATTEMPTS )); then
  log "patch failed after $MAX_ATTEMPTS attempts"

  CURRENT_STEP="mark_failed"
  tmp=$(mktemp)
  jq '.status="failed"' "$task" > "$tmp" && mv "$tmp" "$task"
  CURRENT_STEP=""
  log "marked failed $task"

  continue
fi
    log "applying patch..."
    CURRENT_STEP="apply_patch"
    bash ops/scripts/apply_patch_commit.sh "$PATCH_FILE"
    CURRENT_STEP=""
    log "apply_patch_commit exit=$?"

    rm -f "$PATCH_FILE"
    rm -f "$REVIEWER_FEEDBACK_FILE"

    log "running gate pipeline..."
    CURRENT_STEP="run_gates"
    set +e
    KEEP_TMP=1 bash ops/scripts/gate_archive.sh
    gate_rc=$?
    set -e
    CURRENT_STEP=""
    log "gate_archive rc=$gate_rc"

    if [[ "$gate_rc" -ne 0 ]]; then
      log "gate failed; rolling back last commit"
      CURRENT_STEP="rollback_commit"
      git reset --hard HEAD~1
      CURRENT_STEP=""
      log "rollback complete; marking task failed"

      CURRENT_STEP="mark_failed"
      tmp=$(mktemp)
      jq '.status="failed"' "$task" > "$tmp" && mv "$tmp" "$task"
      CURRENT_STEP=""
      log "marked failed $task"

      continue
    fi

    # mark task complete
    CURRENT_STEP="mark_complete"
    tmp=$(mktemp)
    jq '.status="complete"' "$task" > "$tmp" && mv "$tmp" "$task"
    CURRENT_STEP=""

    log "task complete $task"
  fi
done

if [[ "$TASK_COUNT" -eq 0 ]]; then
  log "no tasks found in $TASK_DIR"
fi

log "runner done pid=$$"
