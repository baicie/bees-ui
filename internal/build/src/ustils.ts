// eslint-disable-next-line import/no-extraneous-dependencies
import { findWorkspacePackages } from '@pnpm/find-workspace-packages';
import path from 'node:path';
import type { ModuleFormat } from "rollup";
import fs from 'node:fs';

export const DEFAULT = ['src/index.ts', 'src/index.tsx']

export async function generateExternal(root: string) {
  const packages = await findWorkspacePackages(root);
  const { manifest } = packages[0];
  return Object.keys(manifest.dependencies ?? []).concat(['esbuild'])
}

export const target = 'es2018'

export const modules = ['esm', 'cjs'] as const
export type Module = typeof modules[number]
export interface BuildInfo {
  module: 'ESNext' | 'CommonJS'
  format: ModuleFormat
  ext: 'mjs' | 'cjs' | 'js'
  output: {
    name: string
    path: string
  }
  bundle: {
    path: string
  }
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
  }

  return Object.entries(
    buildConfig,
  )
}

export function resolveInput(root: string, input: string | string[]) {
  const inputPath = Array.isArray(input) ? input : [input]
  let resultPath = ''
  inputPath.forEach((_path) => {
    const _temp = path.resolve(root, _path)
    if (fs.existsSync(_temp)) {
      resultPath = _temp
    }
  })
  return resultPath
}
