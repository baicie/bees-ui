import fs from 'node:fs';
import path from 'node:path';
import { findWorkspacePackages } from '@pnpm/find-workspace-packages';
import type { ModuleFormat } from 'rollup';

export const DEFAULT = [
  'src/index.ts',
  'src/index.tsx',
  'index.ts',
  'index.tsx',
  'index.js',
  'src/index.js',
];

const ignore = ['react', 'react-dom', 'classnames'];
export async function generateExternal(root: string) {
  const packages = await findWorkspacePackages(root);
  const { manifest } = packages[0];
  const deps = [
    ...Object.keys(manifest.dependencies ?? []),
    ...Object.keys(manifest.peerDependencies ?? []),
  ]
    .filter((item) => !item.startsWith('@types/'))
    .filter((item) => !ignore.includes(item));
  return [/@ant-design\/icons\//, 'preact/compat', ...deps];
}

export const target = 'es2018';

export const modules = ['esm', 'cjs'] as const;
export type Module = (typeof modules)[number];
export interface BuildInfo {
  module: 'ESNext' | 'CommonJS' | 'UMD';
  format: ModuleFormat;
  ext: 'mjs' | 'cjs' | 'js';
  output: {
    name: string;
    path: string;
  };
  bundle: {
    path: string;
  };
}

export function resolveBuildConfig(root: string) {
  const buildConfig: Record<Module, BuildInfo> = {
    esm: {
      module: 'ESNext',
      format: 'esm',
      ext: 'mjs',
      output: {
        name: 'es',
        path: path.resolve(root, 'dist/es'),
      },
      bundle: {
        path: `/es`,
      },
    },
    cjs: {
      module: 'CommonJS',
      format: 'cjs',
      ext: 'js',
      output: {
        name: 'lib',
        path: path.resolve(root, 'dist/lib'),
      },
      bundle: {
        path: `/lib`,
      },
    },
  };

  return Object.entries(buildConfig);
}

export function resolveInput(root: string, input: string | string[]): string[] {
  const inputPath = Array.isArray(input) ? input : [input];
  const resultPath: string[] = [];
  inputPath.forEach((_path) => {
    const _temp = path.resolve(root, _path);
    if (fs.existsSync(_temp)) {
      resultPath.push(_temp);
    }
  });
  return resultPath;
}

export function resolveTsConfig(root: string, rootPath: string, tsconfig = 'tsconfig.json') {
  let tsconfigPath = path.resolve(root, tsconfig);
  if (!fs.existsSync(tsconfigPath)) {
    tsconfigPath = path.resolve(rootPath, tsconfig);
  }
  return tsconfigPath;
}

export const isWindows = typeof process !== 'undefined' && process.platform === 'win32';
const windowsSlashRE = /\\/g;
export function slash(p: string): string {
  return p.replace(windowsSlashRE, '/');
}

export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id);
}
