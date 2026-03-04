#!/usr/bin/env bash
set -euo pipefail

TASK_FILE="$1"

echo "[generate_patch] task: $TASK_FILE"

goal=$(jq -r '.goal' "$TASK_FILE")

echo "[generate_patch] goal: $goal"

openclaw-safe agent \
  --agent dir-eng-platform-01 \
  --timeout 120 \
  --thinking off \
  --message "You are an autonomous software engineer working inside a git repository.

Generate a valid unified git patch.

Rules:
- Output ONLY a valid unified diff.
- Start with: diff --git
- Use proper @@ hunk format.
- Do NOT include explanations.
- Do NOT include markdown.
- Do NOT include comments outside the diff.
- Do NOT invent unrelated files.
- Only modify files relevant to the task.

Task goal:
$goal
" \
  --json \
| jq -r '.result.payloads[0].text' \
| sed -n '/^diff --git/,$p' > patch.diff

echo "[generate_patch] patch written to patch.diff"
