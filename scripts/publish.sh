#!/bin/sh

set -e

pnpm i --frozen-lockfile --ignore-scripts

pnpm run stub

pnpm update-version

pnpm build

pnpm publish-script

echo "✅ Publish completed"
