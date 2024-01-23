import { OutputOptions, RollupBuild, rollup, watch as rollupWatch } from 'rollup';
import { resolveConfig } from './build';
import { resolveBuildConfig } from './ustils';

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

export async function dts(root: string, options: Options = {}) {
  const config = await resolveConfig(root, options)

  const bundle = await rollup(config)

  bundle.write({
    dir: options.dtsDir,
  })
}

export async function dtsWatch(root: string, options: Options = {}) {
  const _config = await resolveConfig(root, options)

  const watcher = rollupWatch(
    resolveBuildConfig(root).map(([module, config]) => {
      return {
        ..._config,
        output: {
          format: config.format,
          dir: config.output.path,
          exports: module === 'cjs' ? 'named' : undefined,
          sourcemap: options.sourcemap,
        }
      }
    })
  )

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

