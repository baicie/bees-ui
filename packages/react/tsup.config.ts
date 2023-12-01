import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "@bees-ui/core"],
  format: ["cjs", "esm"],
  dts: true,
});
