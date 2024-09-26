/* eslint-disable no-console */
import path from 'node:path';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import type {
  InputPluginOption,
  OutputOptions,
  Plugin,
  RollupBuild,
  RollupOptions,
  RollupOutput,
  RollupWatchOptions,
  WatcherOptions,
} from 'rollup';
import { rollup, watch as rollupWatch } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import visualizer from 'rollup-plugin-visualizer';

import { rootPath } from '@bees-ui/internal-path';
import deps from './deps';
import alias from './plugins/alias';
import { cleanOutputPlugin } from './plugins/clean-output';
// import { dynamicPathReplace } from './plugins/dynamicPathReplace';
import type { Module } from './utils';
import {
  DEFAULT,
  generateExternal,
  resolveBuildConfig,
  resolveInput,
  resolveTsConfig,
  target,
} from './utils';

export interface Options {
  /**
   * @description
   */
  input?: string;
  sourcemap?: boolean;
  dts?: boolean;
  ant?: boolean;
  dtsDir?: string;
  tsconfig?: string;
  watch?: boolean;
  minify?: boolean;
  full?: boolean;
  name?: string;
  visualizer?: boolean;
  root?: string;
  'ignore-error'?: boolean;
}

let cache: RollupOptions['cache'];

async function writeBundles(
  bundle: RollupBuild,
  options: OutputOptions[],
  extra: RollupOutput[] = [],
) {
  return Promise.all([...options.map((option) => bundle.write(option)), ...extra]);
}

export async function resolveConfig(
  root: string,
  options: Options = {},
  plugin: Plugin[] = [],
  module: Module,
): Promise<RollupOptions> {
  const {
    input = DEFAULT,
    sourcemap = false,
    watch = false,
    minify = false,
    full = false,
    tsconfig = resolveTsConfig(root, rootPath),
  } = options;
  const inputPath = resolveInput(root, input);

  const outputPath = path.resolve(root, module === 'esm' ? 'es' : 'lib');

  const watchOptions: WatcherOptions = {
    clearScreen: true,
  };
  const plugins = [
    cleanOutputPlugin(outputPath),
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
        {
          find: /^@ant-design\/icons\/([A-Za-z][A-Za-z0-9]*)$/,
          replacement: `@bees-ui/icons/${module === 'cjs' ? 'lib' : 'es'}/icons/$1`,
        },
        ...deps,
      ],
      module,
    }),
    postcss({
      modules: true,
    }),
    json(),
    babel({
      babelHelpers: 'runtime',
      presets: ['@babel/preset-react', '@babel/preset-typescript'],
      exclude: 'node_modules/**',
      plugins: ['@babel/plugin-transform-runtime'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs(),
    esbuild({
      sourceMap: sourcemap,
      minify,
      target,
      tsconfig: path.resolve(rootPath, 'tsconfig.json'),
      treeShaking: false,
      loaders: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.ts': 'ts',
        '.tsx': 'tsx',
      },
    }),
    options.visualizer ? visualizer({ open: true }) : null,
    options.dts && !options.ant
      ? typescript({
        tsconfig,
        compilerOptions: {
          declaration: true,
          outDir: outputPath,
          module: 'esnext'
        },
        emitDeclarationOnly: true,
        include: inputPath,
      })
      : null,
    ...plugin,
  ] as unknown as InputPluginOption[];
  const external = full ? [] : await generateExternal(root);

  return {
    input: inputPath,
    plugins,
    external,
    treeshake: false,
    watch: watch ? watchOptions : false,
    cache,
  };
}

export async function build(root: string, options: Options = {}) {
  await Promise.all(
    resolveBuildConfig(root).map(async ([module, config]) => {
      const bundleConfig = await resolveConfig(root, options, [], module as Module);
      const bundle = await rollup(bundleConfig);
      cache = bundle.cache;
      return writeBundles(bundle, [
        {
          format: config.format,
          dir: config.output.path,
          exports: module === 'cjs' ? 'named' : undefined,
          sourcemap: options.sourcemap,
          preserveModules: true,
          preserveModulesRoot: path.resolve(root, options.input || DEFAULT),
        },
      ]);
    }),
  );
}

export async function watchFuc(root: string, options: Options = {}) {
  const bundles = resolveBuildConfig(root).map(async ([module, config]) => {
    const _config = await resolveConfig(root, options, [], module as Module);
    return {
      ..._config,
      output: {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        sourcemap: options.sourcemap,
        preserveModules: true,
        preserveModulesRoot: path.resolve(root, options.input || DEFAULT),
      },
    } as RollupWatchOptions;
  });
  const resolvedBundles = await Promise.all(bundles);
  const watcher = rollupWatch(resolvedBundles);

  watcher.on('event', (event) => {
    if (event.code === 'START') {
      console.log('Rollup build started...');
    } else if (event.code === 'END') {
      console.log('Rollup build completed.');
    } else if (event.code === 'ERROR') {
      console.error('Error during Rollup build:', event.error);
      process.exit(1); // 根据情况决定是否退出
    } else if (event.code === 'BUNDLE_END') {
      console.log(`Bundle completed in ${event.duration}ms`);
    } else if (event.code === 'BUNDLE_START') {
      console.log(`Bundling ${event.input}...`);
    }
  });
}
