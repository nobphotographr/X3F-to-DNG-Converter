#!/usr/bin/env zsh
set -euo pipefail

PROJECT_ROOT="${0:A:h:h}"
LOCAL_CARGO_HOME="$PROJECT_ROOT/.tools/cargo"
LOCAL_RUSTUP_HOME="$PROJECT_ROOT/.tools/rustup"
export PATH="$LOCAL_CARGO_HOME/bin:$PATH"

if command -v wasm-pack >/dev/null 2>&1; then
  WASM_PACK_BIN="$(command -v wasm-pack)"
elif [[ -x "$LOCAL_CARGO_HOME/bin/wasm-pack" ]]; then
  WASM_PACK_BIN="$LOCAL_CARGO_HOME/bin/wasm-pack"
else
  print -u2 "wasm-pack is not installed."
  exit 1
fi

mkdir -p "$PROJECT_ROOT/public/wasm"

CARGO_HOME="$LOCAL_CARGO_HOME" \
RUSTUP_HOME="$LOCAL_RUSTUP_HOME" \
"$WASM_PACK_BIN" build "$PROJECT_ROOT/engine-wasm" \
  --target web \
  --release \
  --out-dir "$PROJECT_ROOT/public/wasm"
