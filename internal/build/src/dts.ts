import { Options } from "./build";
import { build } from 'tsup';
import path from 'node:path';
import { DEFAULT, target } from "./ustils";

export async function dts(root: string, options: Options = {}) {
  const {
    input = DEFAULT,
    sourceMap = true,
    tsconfig = path.resolve(root, 'tsconfig.json')
  } = options;
  const outputPath = path.resolve(root, 'dist/types');
  const inputPath = path.resolve(root, input);

  await build({
    entry: [inputPath],
    dts: {
      only: true,
    },
    outDir: outputPath,
    tsconfig: tsconfig,
  });
}
