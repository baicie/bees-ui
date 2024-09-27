import { rimraf } from 'rimraf';
import type { Plugin } from 'rollup';

import { Options } from '../build';

export function cleanOutputPlugin(outputPath: string, options: Options): Plugin {
  const plugin: Plugin = {
    name: 'clean-output',
    buildStart() {
      rimraf(
        outputPath,
        options.ant
          ? {
              filter: (path) => path.endsWith('.js'),
            }
          : undefined,
      );
    },
  };
  return plugin;
}
