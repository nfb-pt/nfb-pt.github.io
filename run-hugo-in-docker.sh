#!/usr/bin/env bash
set -euo pipefail
NFB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
docker run --rm -it --name nfb-hugo -p 1313:1313 \
  -v "$NFB_DIR:/src" -v nfb-node-modules:/src/node_modules \
  -w /src node:22-bookworm bash ./run-hugo.sh
