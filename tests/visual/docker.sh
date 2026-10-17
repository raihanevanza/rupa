#!/bin/sh
# Runs the visual tests inside the same Linux image as CI, so baselines match pixel for pixel.
# Usage: sh tests/visual/docker.sh [--update-snapshots]
set -e
cd "$(dirname "$0")/../.."
VERSION=$(node -p "require('@playwright/test/package.json').version")
[ -f apps/docs/storybook-static/index.json ] || npm run build:docs
docker run --rm --ipc=host -e CI=1 \
  -v "$PWD":/work -w /work \
  "mcr.microsoft.com/playwright:v$VERSION-noble" \
  npx playwright test -c tests/visual "$@"
