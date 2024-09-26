import path from 'node:path'
import fs from 'node:fs'
import { antdPath } from '@bees-ui/internal-path'

export function resolve(moduleName: string) {
  const resolvedPath = new URL(moduleName, import.meta.url).pathname
  return resolvedPath
}

export function getProjectPath(...filePath: string[]) {
  return path.resolve(antdPath, ...filePath)
}

export async function isThereHaveBrowserslistConfig() {
  try {
    const packageJson = await import(getProjectPath('package.json'))
    if (packageJson.browserslist) {
      return true
    }
  } catch (_e) {
    //
  }
  if (fs.existsSync(getProjectPath('.browserslistrc'))) {
    return true
  }
  if (fs.existsSync(getProjectPath('browserslist'))) {
    return true
  }
  // parent项目的配置支持，需要再补充
  // ROWSERSLIST ROWSERSLIST_ENV 变量的形式，需要再补充。
  return false
}
