import { findWorkspacePackages } from '@pnpm/find-workspace-packages';
import path from 'node:path';
import { ModuleFormat } from "rollup";

export const DEFAULT = 'src/index.ts'

export async function generateExternal(root: string) {
  const packages = await findWorkspacePackages(root);
  const manifest = packages[0].manifest;
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
    buildConfig
  )
}
