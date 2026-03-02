#!/usr/bin/env bash
set -euo pipefail

src="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/cyborg-run"
dst="$HOME/bin/cyborg-run"

mkdir -p "$HOME/bin"
cp -av "$src" "$dst"
chmod +x "$dst"

echo "OK: installed $dst"
"$dst" health
