#!/usr/bin/env bash
# Append prompt-history entry when a major agent task completes.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v python3 >/dev/null 2>&1; then
  exit 0
fi

python3 scripts/append-prompt-history.py
