#!/usr/bin/env bash
set -euo pipefail

PATCH_FILE="$1"
REVIEWER_FEEDBACK_FILE="${REVIEWER_FEEDBACK_FILE:-reviewer_feedback.txt}"

echo "[review_patch] reviewing patch: $PATCH_FILE"

# Validate patch format and attempt to repair hunk counts
APPLY_CHECK_ERR="$(mktemp /tmp/review_patch_apply_check.XXXXXX.err)"
if ! git apply --recount --check "$PATCH_FILE" 2>"$APPLY_CHECK_ERR"; then
  echo "[review_patch] INVALID PATCH"
  echo "[review_patch][structured] class=INVALID_PATCH_APPLY_CHECK|hint=regenerate patch against current HEAD and fix hunk/file-path mismatch using apply-check stderr|evidence_ref=apply_check_stderr|retryable=yes|escalation=needs_human"
  echo "[review_patch] apply_check_stderr_begin"
  sed -n '1,40p' "$APPLY_CHECK_ERR"
  echo "[review_patch] apply_check_stderr_end"
  rm -f "$APPLY_CHECK_ERR"
  exit 1
fi
rm -f "$APPLY_CHECK_ERR"

echo "[review_patch] patch format OK"

# Reject patches without hunks
if ! grep -q '^@@' "$PATCH_FILE"; then
  echo "[review_patch] EMPTY PATCH — rejecting"
  exit 1
fi

# Reject empty patches (no hunks)
if ! grep -q '^@@' "$PATCH_FILE"; then
  echo "[review_patch] EMPTY PATCH — rejecting"
  exit 1
fi

# Ask reviewer agent to evaluate the patch
REVIEW=$(openclaw-safe agent \
  --agent dir-architecture-01 \
  --timeout 120 \
  --thinking off \
  --message "Review the following git patch for correctness and relevance.

Reply in ONE of these formats:

APPROVE

or

REJECT: <brief explanation of what is wrong>

Patch:
$(cat "$PATCH_FILE")" \
  --json | jq -r '.result.payloads[0].text')

echo "[review_patch] reviewer response: $REVIEW"

if [[ "$REVIEW" == APPROVE* ]]; then
  echo "[review_patch] reviewer approved patch"
  exit 0
fi

echo "[review_patch] reviewer rejected patch"

echo "$REVIEW" > "$REVIEWER_FEEDBACK_FILE"

exit 1
