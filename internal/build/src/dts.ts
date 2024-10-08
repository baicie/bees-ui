import path from 'node:path'
import { build } from 'tsup'

import type { Options } from './build'
import { rootPath } from '@bees-ui/internal-path'
import { DEFAULT, normalizePath, resolveInput, resolveTsConfig, target } from './utils'

export async function dts(root: string, options: Options = {}) {
  const { input = DEFAULT, watch = false, tsconfig = resolveTsConfig(root, rootPath) } = options
  const outputPath = path.resolve(root, 'types')
  const inputPath = resolveInput(root, input)

  await build({
    entry: inputPath.map(normalizePath),
    dts: {
      only: true,
    },
    outDir: outputPath,
    tsconfig,
    target,
    watch,
    clean: true,
  })
}
