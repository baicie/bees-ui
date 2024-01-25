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
import solidPlugin from 'vite-plugin-solid';
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
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    solidPlugin(),
    esbuild({
      sourceMap: sourcemap,
      target,
      minify,
    }),
  ] as unknown as InputPluginOption[];

  return {
    input: inputPath,
    plugins,
    treeshake: true,
    external: full ? ['@baicie/core'] : await generateExternal(root),
    watch: watch ? watchOptions : false,
  };
}

export async function build(root: string, options: Options = {}) {
  const config = await resolveConfig(root, options);

  const bundle = await rollup(config);

  await writeBundles(
    bundle,
    resolveBuildConfig(root).map(
      ([module, _config]): OutputOptions => ({
        format: _config.format,
        dir: _config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
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
