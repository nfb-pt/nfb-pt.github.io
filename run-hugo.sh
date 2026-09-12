#!/usr/bin/env bash
set -euo pipefail
npm ci
npm run start -- --bind 0.0.0.0
