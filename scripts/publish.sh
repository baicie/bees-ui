#!/bin/sh

set -e

pnpm i --frozen-lockfile

pnpm update-version

pnpm build

pnpm publish-script

echo "✅ Publish completed"
