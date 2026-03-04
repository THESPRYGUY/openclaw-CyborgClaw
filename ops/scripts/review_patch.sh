#!/usr/bin/env bash
set -euo pipefail

PATCH_FILE="$1"

echo "[review_patch] reviewing patch: $PATCH_FILE"

# attempt to repair hunk counts
git apply --recount --check "$PATCH_FILE" 2>/dev/null || {
  echo "[review_patch] INVALID PATCH"
  exit 1
}

echo "[review_patch] patch format OK"

openclaw-safe agent \
  --agent dir-architecture-01 \
  --timeout 120 \
  --thinking off \
  --message "Review the following git patch for correctness and relevance. Reply only APPROVE or REJECT.

$(cat "$PATCH_FILE")"

echo "[review_patch] review complete"
