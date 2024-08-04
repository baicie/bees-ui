import path from 'node:path';
import { rollup } from 'rollup';
import { dts as dtsPlugin } from 'rollup-plugin-dts';

import { Options, resolveConfig } from './build';
import { componentsPath, rootPath, typesPath } from './path';

export async function dts(root: string, options: Options = {}) {
  const bundleConfig = await resolveConfig(root, options, [
    dtsPlugin({
      tsconfig: path.resolve(rootPath, 'tsconfig.json'),
    }),
  ]);
  const bundle = await rollup(bundleConfig);
  bundle.write({
    dir: typesPath,
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: componentsPath,
    exports: 'named',
  });
}
