#!/bin/sh

set -e

pnpm i --frozen-lockfile --ignore-scripts

pnpm update-version

pnpm build

cd packages/core
pnpm publish --access public --no-git-checks
cd -

cd packages/react
pnpm publish --access public --no-git-checks
cd -

cd packages/vue
pnpm publish --access public --no-git-checks
cd -

echo "✅ Publish completed"
