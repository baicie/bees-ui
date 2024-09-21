import type { ModuleFormat, Plugin } from 'rollup';

export function dynamicPathReplace(): Plugin {
  let format: ModuleFormat | undefined;

  return {
    name: 'dynamic-path-replace',
    outputOptions(outputOptions) {
      format = outputOptions.format;
    },
    resolveId(source) {
      const isCjs = format === 'cjs';
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
