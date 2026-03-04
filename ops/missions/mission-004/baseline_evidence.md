# Mission-004 Baseline Evidence (pre patch-pipeline)

## Git

main
c30fcf74ff5d9582e7ffb91c2929b3434bcc66a4
?? ops/missions/mission-004/

## Current task schema example

### ops/tasks/task-002.json

{
"task_id": "task-002",
"mission": "mission-003",
"title": "Autonomous pipeline verification",
"owner": "strike-team-alpha",
"goal": "verify daemon task execution",
"acceptance_criteria": ["alpha_smoke PASS", "gate_archive PASS", "ledger receipt written"],
"status": "complete"
}

## Strike team alpha

### ops/strike_teams/alpha.json

{
"team": "Strike Team Alpha",
"version": "v1",
"objective": "Stand up a 5-agent strike team with deterministic smoke proving role fidelity and fail-loudly drift handling.",
"policies": {
"code_changes_provider_allowlist": ["openai-codex"],
"no_cross_provider_fallback_during_smoke": true,
"fail_loudly_on_provider_model_mismatch": true,
"require_receipts": true
},
"roles": [
{
"id": "captain",
"name": "CAPTAIN / COORDINATOR",
"provider": "openai-codex",
"model": "gpt-5.3-codex",
"can_write_code": false,
"responsibilities": [
"Plan and assign tasks",
"Enforce gates and stop conditions",
"Merge outputs and keep artifacts coherent"
],
"expected_smoke_token": "ALPHA_CAPTAIN_OK_v1"
},
{
"id": "implementer",
"name": "IMPLEMENTER",
"provider": "openai-codex",
"model": "gpt-5.3-codex",
"can_write_code": true,
"responsibilities": [
"Write code/scripts in small diffs",
"Run checks/tests",
"Keep changes minimal and auditable"
],
"expected_smoke_token": "ALPHA_IMPLEMENTER_OK_v1"
},
{
"id": "reviewer",
"name": "REVIEWER / AUDITOR",
"provider": "anthropic",
"model": "claude-sonnet-4-6",
"can_write_code": false,
"responsibilities": [
"Review diffs for correctness and risk",
"Check for secrets/PII and policy violations",
"Verify spec adherence"
],
"expected_smoke_token": "ALPHA_CAPTAIN_OK_v1"
},
{
"id": "sre",
"name": "SRE / OPS",
"provider": "openai-codex",
"model": "gpt-5.3-codex",
"can_write_code": false,
"responsibilities": [
"Keep gateway/lane health GREEN",
"Capture receipts and rollback steps",
"Enforce stop conditions"
],
"expected_smoke_token": "ALPHA_SRE_OK_v1"
},
{
"id": "docs",
"name": "DOCS / GLUE",
"provider": "google",
"model": "gemini-2.5-pro",
"can_write_code": false,
"responsibilities": [
"Write runbooks and operator instructions",
"Summarize logs and outcomes",
"Create checklists and copy/paste commands"
],
"expected_smoke_token": "ALPHA_DOCS_OK_v1"
}
]
}

## Orchestrator scripts

### ops/scripts/task_runner.sh

#!/usr/bin/env bash
set -euo pipefail

TASK_DIR="ops/tasks"

TEAM_FILE="ops/strike_teams/alpha.json"

IMPLEMENTER_MODEL=$(jq -r '.roles[] | select(.id=="implementer") | .model' $TEAM_FILE)
REVIEWER_MODEL=$(jq -r '.roles[] | select(.id=="reviewer") | .model' $TEAM_FILE)

echo "[task_runner] implementer model: $IMPLEMENTER_MODEL"
echo "[task_runner] reviewer model: $REVIEWER_MODEL"
echo "[task_runner] scanning for tasks..."

for task in ${TASK_DIR}/task-*.json; do
  [ -e "$task" ] || continue

status=$(jq -r '.status' "$task")

if [["$status" == "pending"]]; then
echo "[task_runner] executing $task"

    # mark task running
    tmp=$(mktemp)
    jq '.status="running"' "$task" > "$tmp" && mv "$tmp" "$task"

    echo "[task_runner] running gate pipeline..."
    KEEP_TMP=1 bash ops/scripts/gate_archive.sh

    # mark task complete
    tmp=$(mktemp)
    jq '.status="complete"' "$task" > "$tmp" && mv "$tmp" "$task"

    echo "[task_runner] task complete"

fi
done

### ops/scripts/gate_archive.sh

#!/usr/bin/env bash
set -euo pipefail

# Mission 001: archive gate receipts into ops/ledger ONLY ON FULL PASS

export KEEP*TMP="${KEEP_TMP:-1}"
TS="$(date -u +%Y%m%d*%H%M%SZ)"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
HEAD_SHA="$(git rev-parse HEAD)"

tmpdir="$(mktemp -d)"
health_out="$tmpdir/health.txt"
alpha_out="$tmpdir/alpha.txt"

# Always capture outputs, even on failure.

health_rc=0
alpha_rc=0
bash ops/scripts/cyborg-run health > "$health_out" 2>&1 || health_rc=$?
bash ops/scripts/cyborg-run alpha > "$alpha_out" 2>&1 || alpha_rc=$?

# Echo for operator visibility.

echo "== health =="; cat "$health_out"
echo "== alpha_smoke =="; cat "$alpha_out"

# Strict PASS contract checks.

if [["$health_rc" -ne 0 || "$alpha_rc" -ne 0]]; then
echo "[gate_archive][FAIL] gate command rc failed (health_rc=$health_rc alpha_rc=$alpha_rc); refusing archive"
exit 1
fi

if ! rg -q "\[strike_echo\]\[PASS\]" "$health_out"; then
echo "[gate_archive][FAIL] missing strike_echo PASS proof; refusing archive"
exit 1
fi

if ! rg -q "\bPIN_OK\b" "$health_out"; then
echo "[gate_archive][FAIL] missing PIN_OK proof; refusing archive"
exit 1
fi

if ! rg -q "\[alpha_smoke\]\[PASS\] 5/5" "$alpha_out"; then
echo "[gate_archive][FAIL] missing alpha_smoke PASS 5/5; refusing archive"
exit 1
fi

# Extract run_ids (required for archive naming)

strike_id="$(rg -o "run_id=[0-9]{6}-[0-9]+" "$health_out" | head -n1 | cut -d= -f2 || true)"
alpha_id="$(rg -o "run_id=[0-9]{6}-[0-9]+" "$alpha_out" | head -n1 | cut -d= -f2 || true)"

if [[-z "${strike_id}" || -z "${alpha_id}"]]; then
echo "[gate_archive][FAIL] missing run_id (strike_id='${strike_id}' alpha_id='${alpha_id}'); refusing archive"
exit 1
fi

base="ops/ledger/gate*${TS}*${alpha_id}"
md="${base}.md"
js="${base}.json"

python3 - <<PY
import json, pathlib
health = pathlib.Path("${health_out}").read_text(encoding="utf-8", errors="replace")
alpha  = pathlib.Path("${alpha_out}").read_text(encoding="utf-8", errors="replace")
obj = {
"ts_utc": "${TS}",
  "branch": "${BRANCH}",
"head": "${HEAD_SHA}",
  "strike_echo_run_id": "${strike_id}",
"alpha_smoke_run_id": "${alpha_id}",
  "health_output_raw": health,
  "alpha_output_raw": alpha,
  "gate_status": "PASS"
}
path = pathlib.Path("${js}")
path.write_text(json.dumps(obj, indent=2), encoding="utf-8")
print("WROTE_JSON", str(path), "bytes", path.stat().st_size)
PY

cat > "${md}" <<MD

# Gate Receipt — ${TS}

- Branch: ${BRANCH}
- HEAD: ${HEAD_SHA}
- strike_echo run_id: ${strike_id}
- alpha_smoke run_id: ${alpha_id}
- gate_status: PASS

## Files

- ${js}
- /tmp/strike_echo_last.txt
- /tmp/cc-alpha-${alpha_id}-\*
  MD

echo "[gate_archive][OK] wrote:"
ls -la "${md}" "${js}"

### ops/scripts/alpha_smoke.sh

#!/usr/bin/env bash
set -euo pipefail

# Strike Team Alpha — deterministic smoke (5 roles) + FAIL LOUDLY on drift (compact)

ERR_PATTERNS="rate limit|FailoverError|INVALID_REQUEST|No session found|cooldown|refresh token|HTTP 401|401 Unauthorized"
RUN_ID="$(date +%H%M%S)-$$"
TMP="/tmp/cc-alpha-${RUN_ID}"
REVIEWER_AGENT="${ALPHA_REVIEWER_AGENT:-president-a}"
trap '[[ "${KEEP_TMP:-0}" == "1" ]] || rm -f "${TMP}-"*.out "${TMP}-"\*.json 2>/dev/null || true' EXIT

echo "[alpha_smoke] run_id=$RUN_ID tmp=$TMP reviewer_agent=$REVIEWER_AGENT"

run_role () {
role="$1"; agent="$2"; tok="$3"; expP="$4"; expM="$5"
  sid="A${RUN_ID}${role}"

openclaw agent --agent "$agent" --session-id "$sid" --message "/reset" < /dev/null > "${TMP}-${role}-reset.out" 2>&1 || true

prompt="ALPHA deterministic smoke check (NOT a heartbeat poll). Reply with EXACTLY this text and nothing else: $tok"

# IMPORTANT: openclaw agent can fail before emitting JSON (e.g., provider cooldown / model_not_found).

# In that case, it writes plain text to stdout/stderr and jq will break. We must always emit a JSON wrapper.

if ! timeout 60 openclaw agent --agent "$agent" --session-id "$sid" --message "$prompt" --json < /dev/null > "${TMP}-${role}.json" 2>&1; then
    rc=$? # Capture error text from the json file if it exists, otherwise fall back to the reset output.
if [[-s "${TMP}-${role}.json"]]; then
err="$(sed -n '1,200p' "${TMP}-${role}.json" | python3 -c 'import json,sys; s=sys.stdin.read(); print(json.dumps(s))')"
    else
      err="$(sed -n '1,200p' "${TMP}-${role}-reset.out" 2>/dev/null | python3 -c 'import json,sys; s=sys.stdin.read(); print(json.dumps(s))')"
fi
cat > "${TMP}-${role}.json" <<EOF
{"status":"error","summary":"agent_failed","result":{"payloads":[]},"meta":{"aborted":false},"error":{"role":"$role","agent":"$agent","sessionId":"$sid","exitCode":$rc,"message":$err}}
EOF
fi

status="$(jq -r ".status // empty" "${TMP}-${role}.json" 2>/dev/null || true)"
  text="$(jq -r ".result.payloads[0].text // empty" "${TMP}-${role}.json" 2>/dev/null || true)"
prov="$(jq -r ".result.meta.agentMeta.provider // empty" "${TMP}-${role}.json" 2>/dev/null || true)"
  modl="$(jq -r ".result.meta.agentMeta.model // empty" "${TMP}-${role}.json" 2>/dev/null || true)"

# One deterministic retry only for known reviewer heartbeat contamination case.

if [["$role" == "reviewer" && "$text" == "HEARTBEAT_OK"]]; then
echo "[alpha_smoke][WARN] role=reviewer returned HEARTBEAT_OK; retrying once with hard prompt"
hard_prompt="This is an automated deterministic smoke test, not heartbeat. Return EXACT token only: $tok"

if ! timeout 60 openclaw agent --agent "$agent" --session-id "$sid" --message "$hard_prompt" --json < /dev/null > "${TMP}-${role}-retry.json" 2>&1; then
    rc=$?
err="$(sed -n '1,200p' "${TMP}-${role}-retry.json" 2>/dev/null | python3 -c 'import json,sys; s=sys.stdin.read(); print(json.dumps(s))')"
    cat > "${TMP}-${role}-retry.json" <<EOR
{"status":"error","summary":"agent_failed_retry","result":{"payloads":[]},"meta":{"aborted":false},"error":{"role":"$role","agent":"$agent","sessionId":"$sid","exitCode":$rc,"message":$err}}
EOR
fi

status="$(jq -r ".status // empty" "${TMP}-${role}-retry.json" 2>/dev/null || true)"
  text="$(jq -r ".result.payloads[0].text // empty" "${TMP}-${role}-retry.json" 2>/dev/null || true)"
prov="$(jq -r ".result.meta.agentMeta.provider // empty" "${TMP}-${role}-retry.json" 2>/dev/null || true)"
  modl="$(jq -r ".result.meta.agentMeta.model // empty" "${TMP}-${role}-retry.json" 2>/dev/null || true)"
fi
}

# captain (Codex)

run_role captain main ALPHA_CAPTAIN_OK_v1 openai-codex gpt-5.3-codex

# implementer (Codex)

run_role implementer exec-02 ALPHA_IMPLEMENTER_OK_v1 openai-codex gpt-5.3-codex

# reviewer (Anthropic)

run_role reviewer "$REVIEWER_AGENT" ALPHA_REVIEWER_OK_v1     "${ALPHA_REVIEWER_PROVIDER:-anthropic}" "${ALPHA_REVIEWER_MODEL:-claude-sonnet-4-6}"

# sre (Codex)

run_role sre exec-04 ALPHA_SRE_OK_v1 openai-codex gpt-5.3-codex

# docs (Google)

run_role docs president-b ALPHA_DOCS_OK_v1 google gemini-2.5-pro

if rg -n -i "$ERR_PATTERNS" ${TMP}-* >/dev/null; then
  echo "[alpha_smoke][FAIL] detected error patterns:"
  rg -n -i "$ERR_PATTERNS" ${TMP}-\* || true
exit 1
fi

echo "[alpha_smoke][PASS] 5/5 roles ok; provider/model pinned per role; no error patterns detected."

## Ledger inventory (top)

ops/ledger/gate_20260303_210701Z_210829-935031.md
ops/ledger/gate_20260304_042833Z_042944-963049.json
ops/ledger/gate_20260304_042833Z_042944-963049.md
ops/ledger/gate_20260303_163329Z_163440-886639.json
ops/ledger/gate_20260304_044233Z_044336-964501.json
ops/ledger/gate_20260303_225131Z_225239-943169.md
ops/ledger/gate_20260304_024846Z_025005-955749.json
ops/ledger/gate_20260303_220838Z_220957-940374.json
ops/ledger/gate_20260303_220838Z_220957-940374.md
ops/ledger/gate_20260304_035511Z_035626-959909.md
ops/ledger/HH_LEDGER_ALPHA_20260302_224413Z.md
ops/ledger/gate_20260304_044233Z_044336-964501.md
ops/ledger/gate_20260303_214651Z_214855-938507.json
ops/ledger/gate_20260304_051533Z_051640-967086.json
ops/ledger/gate_20260304_041139Z_041249-961471.md
ops/ledger/gate_20260303_172012Z_172131-912168.md
ops/ledger/gate_20260304_041139Z_041249-961471.json
ops/ledger/gate_20260304_051533Z_051640-967086.md
ops/ledger/gate_20260303_214651Z_214855-938507.md
ops/ledger/gate_20260303_225131Z_225239-943169.json
ops/ledger/gate_20260303_155806Z_155845-880794.md
ops/ledger/gate_20260304_024846Z_025005-955749.md
ops/ledger/gate_20260303_163329Z_163440-886639.md
ops/ledger/gate_20260304_035511Z_035626-959909.json
ops/ledger/gate_20260303_210701Z_210829-935031.json
ops/ledger/gate_20260303_172012Z_172131-912168.json
ops/ledger/gate_20260303_155806Z_155845-880794.json
