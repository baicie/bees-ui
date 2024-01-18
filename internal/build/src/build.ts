import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { InputPluginOption, OutputOptions, RollupBuild, WatcherOptions, rollup } from 'rollup';
import solidPlugin from 'vite-plugin-solid';
import { DEFAULT, generateExternal, resolveBuildConfig, resolveInput, target } from './ustils';
import esbuild from 'rollup-plugin-esbuild';
export interface Options {
  /**
   * @description
   */
  input?: string;
  sourceMap?: boolean;
  dts?: boolean;
  dtsDir?: string;
  tsconfig?: string;
  watch?: boolean;
  minify?: boolean;
  full?: boolean;
}

export async function build(root: string, options: Options = {}) {
  const {
    input = DEFAULT,
    sourceMap = false,
    watch = false,
    minify = false,
    full = false,
  } = options;
  const inputPath = resolveInput(root, input)
  const watchOptions: WatcherOptions = {
    clearScreen: true,
    exclude: 'node_modules/**',
    include: 'src/**',
  }
  const plugins = [
    nodeResolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
    commonjs(),
    solidPlugin(),
    esbuild({
      sourceMap,
      target,
      minify,
    }),
  ] as unknown as InputPluginOption[];

  const bundle = await rollup({
    input: inputPath,
    plugins,
    treeshake: true,
    external: full ? [] : await generateExternal(root),
    watch: watch ? watchOptions : false,
  })

  await writeBundles(bundle, resolveBuildConfig(root).map(([module, config]): OutputOptions => {
    return {
      format: config.format,
      dir: config.output.path,
      exports: module === 'cjs' ? 'named' : undefined,
      sourcemap: sourceMap,
    }
  }))
}

async function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map(option => bundle.write(option)))
}
