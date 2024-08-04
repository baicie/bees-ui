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
import visualizer from 'rollup-plugin-visualizer';

import { rootPath } from '../path';

async function resolveInput(root: string, input: string): Promise<string> {
  const inputPath = path.resolve(root, input);
  return inputPath;
}

async function resolveConfig(root: string, options: Options = {}): Promise<RollupOptions> {
  const {
    input = DEFAULT,
    sourcemap = false,
    watch = false,
    minify = false,
    full = false,
  } = options;
  const inputPath = await resolveInput(root, input);
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
    options.visualizer ? visualizer({ open: true }) : null,
  ] as unknown as InputPluginOption[];
  //   const external = full ? [] : await generateExternal(root);
  console.log('External dependencies:', external);

  return {
    input: inputPath,
    plugins,
    treeshake: true,
    external: [],
    watch: watch ? watchOptions : false,
  };
}

const componentsPath = path.resolve(rootPath, 'components');

const bundle = async () => {};

export default bundle;
