import { Project } from "@pnpm/find-workspace-packages";

export const DEFAULT = 'src/index.ts'

export function generateExternal(manifest:Project['manifest']){
  return Object.keys(manifest.dependencies ?? []).concat(['esbuild'])
}

export const target = 'es2018'
