import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import {
  InputPluginOption,
  OutputOptions,
  RollupBuild,
  RollupOptions,
  WatcherOptions,
  rollup,
  watch as rollupWatch,
} from "rollup";
import esbuild from "rollup-plugin-esbuild";
import svelte from "rollup-plugin-svelte";
import {
  DEFAULT,
  generateExternal,
  resolveBuildConfig,
  resolveInput,
  target,
} from "./ustils";
import { sveltePreprocess } from "svelte-preprocess";
import visualizer from "rollup-plugin-visualizer";

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
  alizer?: boolean;
}

export async function resolveConfig(
  root: string,
  options: Options = {},
): Promise<RollupOptions> {
  const {
    input = DEFAULT,
    sourcemap = false,
    watch = false,
    minify = false,
    full = false,
    alizer = false,
  } = options;
  const inputPath = resolveInput(root, input);
  const watchOptions: WatcherOptions = {
    clearScreen: true,
  };
  const plugins = [
    svelte({
      preprocess: sveltePreprocess({}),
      compilerOptions: {
        customElement: true,
        generate: "dom",
      },
    }),
    nodeResolve({
      browser: true,
      exportConditions: ["svelte"],
      extensions: [".mjs", ".js", ".json", ".ts", "tsx", ".svelte"],
    }),
    commonjs(),
    esbuild({
      sourceMap: sourcemap,
      target,
      minify,
    }),
    alizer
      ? visualizer({
          open: true,
        })
      : null,
  ] as unknown as InputPluginOption[];

  return {
    input: inputPath,
    plugins,
    treeshake: true,
    external: full ? [] : await generateExternal(root),
    watch: watch ? watchOptions : false,
  };
}

export async function build(root: string, options: Options = {}) {
  const config = await resolveConfig(root, options);

  const bundle = await rollup(config);

  await writeBundles(
    bundle,
    resolveBuildConfig(root).map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === "cjs" ? "named" : undefined,
        sourcemap: options.sourcemap,
      };
    }),
  );
}

export async function watch(root: string, options: Options = {}) {
  const _config = await resolveConfig(root, options);

  const watcher = rollupWatch(
    resolveBuildConfig(root).map(([module, config]) => {
      return {
        ..._config,
        output: {
          format: config.format,
          dir: config.output.path,
          exports: module === "cjs" ? "named" : undefined,
          sourcemap: options.sourcemap,
        },
      };
    }),
  );

  watcher.on("event", (event) => {
    // 事件处理逻辑
    if (event.code === "START") {
      console.log("Rollup build started...");
    } else if (event.code === "END") {
      console.log("Rollup build completed.");
    } else if (event.code === "ERROR") {
      console.error("Error during Rollup build:", event.error);
    }
  });
}

async function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)));
}
