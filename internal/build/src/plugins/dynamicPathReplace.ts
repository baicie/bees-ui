import type { Plugin } from 'rollup';

import { Module } from '../utils';

export function dynamicPathReplace(module: Module): Plugin {
  return {
    name: 'dynamic-path-replace',
    resolveId(source) {
      const isCjs = module === 'cjs';
      const libDir = isCjs ? 'lib' : 'es';

      // 自动匹配和替换路径
      const match = source.match(/^(.*\/lib\/)(.*)$/);
      if (match) {
        const newPath = `${match[1].replace('/lib/', `/${libDir}/`)}${match[2]}`;
        return {
          id: newPath,
          external: 'relative',
        };
      }
      return null;
    },
  };
}
