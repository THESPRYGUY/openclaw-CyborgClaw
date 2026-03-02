#!/usr/bin/env bash
set -euo pipefail
# Strike Team Alpha — deterministic smoke (5 roles) + FAIL LOUDLY on drift (compact)

ERR_PATTERNS="rate limit|FailoverError|INVALID_REQUEST|No session found|cooldown|refresh token|401"
RUN_ID="$(date +%H%M%S)-$$"
TMP="/tmp/cc-alpha-${RUN_ID}"
trap '[[ "${KEEP_TMP:-0}" == "1" ]] || rm -f "${TMP}-"*.out "${TMP}-"*.json 2>/dev/null || true' EXIT

echo "[alpha_smoke] run_id=$RUN_ID tmp=$TMP"

run_role () {
  role="$1"; agent="$2"; tok="$3"; expP="$4"; expM="$5"
  sid="A${RUN_ID}${role}"

  openclaw agent --agent "$agent" --session-id "$sid" --message "/reset" < /dev/null > "${TMP}-${role}-reset.out" 2>&1
  openclaw agent --agent "$agent" --session-id "$sid" --message "Reply with EXACTLY this text and nothing else: $tok" --json < /dev/null > "${TMP}-${role}.json" 2>&1

  status="$(jq -r ".status // empty" "${TMP}-${role}.json" 2>/dev/null || true)"
  text="$(jq -r ".result.payloads[0].text // empty" "${TMP}-${role}.json" 2>/dev/null || true)"
  prov="$(jq -r ".result.meta.agentMeta.provider // empty" "${TMP}-${role}.json" 2>/dev/null || true)"
  modl="$(jq -r ".result.meta.agentMeta.model // empty" "${TMP}-${role}.json" 2>/dev/null || true)"

  [[ "$status" == "ok" ]] || { echo "[alpha_smoke][FAIL] role=$role status=$status"; exit 1; }
  [[ "$text" == "$tok" ]] || { echo "[alpha_smoke][FAIL] role=$role token mismatch: got='$text' expected='$tok'"; exit 1; }
  [[ "$prov" == "$expP" && "$modl" == "$expM" ]] || { echo "[alpha_smoke][FAIL] role=$role provider/model mismatch: provider='$prov' model='$modl' (expected $expP / $expM)"; exit 1; }
  echo "[alpha_smoke][OK] role=$role pinned=$expP/$expM"
}

# captain (Codex)
run_role captain main         ALPHA_CAPTAIN_OK_v1     openai-codex gpt-5.3-codex
# implementer (Codex)
run_role implementer exec-02  ALPHA_IMPLEMENTER_OK_v1 openai-codex gpt-5.3-codex
# reviewer (Anthropic)
run_role reviewer president-a ALPHA_REVIEWER_OK_v1    anthropic    claude-sonnet-4-6
# sre (Codex)
run_role sre exec-04          ALPHA_SRE_OK_v1         openai-codex gpt-5.3-codex
# docs (Google)
run_role docs president-b     ALPHA_DOCS_OK_v1        google       gemini-2.5-pro

if rg -n -i "$ERR_PATTERNS" ${TMP}-* >/dev/null; then
  echo "[alpha_smoke][FAIL] detected error patterns:"
  rg -n -i "$ERR_PATTERNS" ${TMP}-* || true
  exit 1
fi

echo "[alpha_smoke][PASS] 5/5 roles ok; provider/model pinned per role; no error patterns detected."
