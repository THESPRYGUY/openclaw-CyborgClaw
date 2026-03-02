#!/usr/bin/env bash
set -euo pipefail
# GO/NO-GO Gate: health + alpha (repo portable)
export KEEP_TMP="${KEEP_TMP:-1}"
bash ops/scripts/cyborg-run health
bash ops/scripts/cyborg-run alpha
