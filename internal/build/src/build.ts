/* eslint-disable no-console */
import path from 'node:path';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import type {
  InputPluginOption,
  OutputOptions,
  RollupBuild,
  RollupOptions,
  WatcherOptions,
} from 'rollup';
import { rollup, watch as rollupWatch } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';

import { rootPath } from './path';
import { DEFAULT, generateExternal, resolveBuildConfig, resolveInput, target } from './ustils';

export interface Options {
  /**
   * @description
   */
  input?: string;
  sourcemap?: boolean;
  dts?: boolean;
  dtsDir?: string;
  tsconfig?: string;
  watch?: boolean;
  minify?: boolean;
  full?: boolean;
  name?: string;
}

async function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)));
}

async function resolveConfig(root: string, options: Options = {}): Promise<RollupOptions> {
  const {
    input = DEFAULT,
    sourcemap = false,
    watch = false,
    minify = false,
    full = false,
  } = options;
  const inputPath = resolveInput(root, input);
  const watchOptions: WatcherOptions = {
    clearScreen: true,
  };
  const plugins = [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
        { find: 'classnames', replacement: 'clsx' },
      ],
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
    }),
  ] as unknown as InputPluginOption[];
  const external = full ? [] : await generateExternal(root);
  console.log('External dependencies:', external);

  return {
    input: inputPath,
    plugins,
    treeshake: true,
    external,
    watch: watch ? watchOptions : false,
  };
}

export async function build(root: string, options: Options = {}) {
  const config = await resolveConfig(root, options);

  const bundle = await rollup(config);

  await writeBundles(
    bundle,
    resolveBuildConfig(root).map(
      ([_, _config]): OutputOptions => ({
        format: _config.format,
        dir: _config.output.path,
        exports: 'named',
        sourcemap: options.sourcemap,
      }),
    ),
  );
}

export async function watchFuc(root: string, options: Options = {}) {
  const _config = await resolveConfig(root, options);

  const watcher = rollupWatch(
    resolveBuildConfig(root).map(([module, config]) => ({
      ..._config,
      output: {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        sourcemap: options.sourcemap,
      },
    })),
  );

  watcher.on('event', (event) => {
    // 事件处理逻辑
    if (event.code === 'START') {
      console.log('Rollup build started...');
    } else if (event.code === 'END') {
      console.log('Rollup build completed.');
    } else if (event.code === 'ERROR') {
      console.error('Error during Rollup build:', event.error);
    }
  });
}
