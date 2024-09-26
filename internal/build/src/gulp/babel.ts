import type { Module } from '../utils'
import { getProjectPath, isThereHaveBrowserslistConfig, resolve } from './utils'

async function getBabelCommonConfig(modules: Module) {
  const plugins = [
    [
      resolve('@babel/plugin-transform-typescript'),
      {
        isTSX: true,
      },
    ],
    [
      resolve('@babel/plugin-transform-runtime'),
      {
        useESModules: modules === 'esm',
        version:
          (await import(getProjectPath('package.json'))).dependencies['@babel/runtime'] ||
          '^7.10.4',
      },
    ],
    resolve('@babel/plugin-transform-spread'),
    resolve('@babel/plugin-proposal-class-properties'),
    resolve('@babel/plugin-transform-classes'),
    resolve('babel-plugin-transform-dev-warning'),
  ]
  return {
    presets: [
      resolve('@babel/preset-react'),
      [
        resolve('@babel/preset-env'),
        {
          modules,
          targets: (await isThereHaveBrowserslistConfig())
            ? undefined
            : {
                browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 11'],
              },
        },
      ],
    ],
    plugins,
  }
}

export default getBabelCommonConfig
