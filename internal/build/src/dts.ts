import type { Options } from "./build";
import { build } from 'tsup';
import path from 'node:path';
import { DEFAULT, resolveInput, target } from "./ustils";

export async function dts(root: string, options: Options = {}) {
  const {
    input = DEFAULT,
    watch = false,
    tsconfig = path.resolve(root, '..', '..', 'tsconfig.json'),
  } = options;
  const outputPath = path.resolve(root, 'dist/types');
  const inputPath = resolveInput(root, input)

  await build({
    entry: [inputPath],
    dts: {
      only: true,
    },
    outDir: outputPath,
    tsconfig,
    target,
    watch,
  });
}
