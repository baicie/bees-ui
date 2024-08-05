import fs from 'node:fs';
import path from 'node:path';
import { findWorkspacePackages } from '@pnpm/find-workspace-packages';
import { globSync } from 'fast-glob';
import type { ModuleFormat } from 'rollup';

import { Options } from './build';
import { componentsPath } from './path';

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
  return [/@ant-design\/icons\//, ...deps];
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

export function resolveInput(
  root: string,
  input: string | string[],
  options: Options = {},
): string | string[] {
  if (options.root) {
    return globSync(`${componentsPath}/**/*.{ts,tsx,js,jsx}`, {
      onlyFiles: true,
      cwd: root,
      absolute: true,
      ignore: [`${componentsPath}/**/{demo,__tests__,design}/*.{ts,tsx,js,jsx}`, 'demo'],
    });
  }
  const inputPath = Array.isArray(input) ? input : [input];
  let resultPath = '';
  inputPath.forEach((_path) => {
    const _temp = path.resolve(root, _path);
    if (fs.existsSync(_temp)) {
      resultPath = _temp;
    }
  });
  return [resultPath];
}

export const isWindows = typeof process !== 'undefined' && process.platform === 'win32';
const windowsSlashRE = /\\/g;
export function slash(p: string): string {
  return p.replace(windowsSlashRE, '/');
}

export function normalizePath(id: string | string[]): string[] {
  let ids = id;
  if (!Array.isArray(id)) {
    ids = [id];
  }
  return (ids as string[]).map((item) => path.posix.normalize(isWindows ? slash(item) : item));
}
