import fs from 'node:fs';
import path from 'node:path';
import { findWorkspacePackages } from '@pnpm/find-workspace-packages';
import type { Project } from '@pnpm/find-workspace-packages';
import type { ModuleFormat } from 'rollup';

export const DEFAULT = ['src/index.ts', 'src/index.tsx'];

type Deps = Project['manifest']['dependencies'];

function hasSolidjs(deps: Deps = {}, peer: Deps = {}) {
  const has =
    Object.keys(deps).some((dep) => dep === 'solid-js') ||
    Object.keys(peer).some((dep) => dep === 'solid-js');
  return has ? ['solid-js/web', 'solid-js/store'] : [];
}

export async function generateExternal(root: string) {
  const packages = await findWorkspacePackages(root);
  const { manifest } = packages[0];
  return [
    ...Object.keys(manifest.dependencies ?? []),
    ...Object.keys(manifest.peerDependencies ?? []),
    ...hasSolidjs(manifest.dependencies, manifest.peerDependencies),
  ];
}

export const target = 'es2018';

export const modules = ['esm', 'cjs'] as const;
export type Module = (typeof modules)[number];
export interface BuildInfo {
  module: 'ESNext' | 'CommonJS';
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

export const isWindows = typeof process !== 'undefined' && process.platform === 'win32';
const windowsSlashRE = /\\/g;
export function slash(p: string): string {
  return p.replace(windowsSlashRE, '/');
}

export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id);
}
