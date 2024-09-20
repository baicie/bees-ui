/* eslint-disable no-console */
import path from 'node:path';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { emptyDirSync } from 'fs-extra';
import type {
  InputPluginOption,
  OutputOptions,
  Plugin,
  RollupBuild,
  RollupOptions,
  RollupOutput,
  WatcherOptions,
} from 'rollup';
import { rollup, watch as rollupWatch } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import visualizer from 'rollup-plugin-visualizer';
import deps from './deps';
import { componentsPath, rootPath } from './path';
import { DEFAULT, generateExternal, resolveBuildConfig, resolveInput, target } from './ustils';
import babel from '@rollup/plugin-babel';

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
  visualizer?: boolean;
  root?: string;
  'ignore-error'?: boolean;
}

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
): Promise<RollupOptions> {
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
    babel({
      babelHelpers: 'runtime',
      presets: ['@babel/preset-react'],
      exclude: 'node_modules/**',
    }),
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
        // { find: 'classnames', replacement: 'clsx' },
        ...deps
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
      treeShaking: true,
      loaders: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.ts': 'ts',
        '.tsx': 'tsx',
      }
    }),
    options.visualizer ? visualizer({ open: true }) : null,
    ...plugin,
  ] as unknown as InputPluginOption[];
  const external = full ? [] : await generateExternal(root);
  console.log('external', external);

  return {
    input: inputPath,
    plugins,
    treeshake: true,
    external,
    watch: watch ? watchOptions : false,
  };
}

export async function build(root: string, options: Options = {}) {
  const distPath = path.resolve(root, 'dist');
  emptyDirSync(distPath);
  const bundleConfig = await resolveConfig(root, options);
  const bundle = await rollup(bundleConfig);

  await writeBundles(
    bundle,
    resolveBuildConfig(root).map(
      ([_, _config]): OutputOptions => ({
        format: _config.format,
        dir: _config.output.path,
        exports: 'named',
        sourcemap: options.sourcemap,
        preserveModules: true,
        preserveModulesRoot: componentsPath,
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
