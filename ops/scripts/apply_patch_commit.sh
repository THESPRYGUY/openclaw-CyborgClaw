#!/usr/bin/env bash
set -euo pipefail

PATCH_FILE="$1"

echo "[apply_patch] applying patch: $PATCH_FILE"

git apply --recount "$PATCH_FILE"

echo "[apply_patch] staging changes"
git add -A

commit_msg="[voltaris] autonomous patch applied"

echo "[apply_patch] committing changes"
git commit -m "$commit_msg"

echo "[apply_patch] commit complete"
