import { emptyDirSync } from 'fs-extra';
import type { Plugin } from 'rollup';

export function cleanOutputPlugin(outputPath: string): Plugin {
  const plugin: Plugin = {
    name: 'clean-output',
    buildStart() {
      emptyDirSync(outputPath);
    },
  };
  return plugin;
}
