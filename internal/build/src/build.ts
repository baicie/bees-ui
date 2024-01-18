import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import path from 'node:path';
import { InputPluginOption, OutputOptions, RollupBuild, rollup } from 'rollup';
import solidPlugin from 'vite-plugin-solid';
import { DEFAULT, generateExternal, resolveBuildConfig, target } from './ustils';
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
}

export async function build(root: string, options: Options = {}) {
  const {
    input = DEFAULT,
    sourceMap = false,
  } = options;
  const inputPath = path.resolve(root, input)
  const plugins = [
    nodeResolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
    commonjs(),
    solidPlugin(),
    esbuild({
      sourceMap,
      target,
      minify: true,
    }),
  ] as unknown as InputPluginOption[];

  const bundle = await rollup({
    input: inputPath,
    plugins,
    treeshake: true,
    external: await generateExternal(root),
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
