import path from 'node:path';
import { build } from 'tsup';

import type { Options } from './build';
import { rootPath } from './path';
import { DEFAULT, normalizePath, resolveInput, target } from './ustils';

export async function dts(root: string, options: Options = {}) {
  const {
    input = DEFAULT,
    watch = false,
    tsconfig = path.resolve(rootPath, 'tsconfig.json'),
  } = options;
  const outputPath = path.resolve(root, 'dist/types');
  const inputPath = resolveInput(root, input);

  await build({
    entry: [normalizePath(inputPath)],
    dts: {
      only: true,
    },
    outDir: outputPath,
    tsconfig,
    target,
    watch,
  });
}
