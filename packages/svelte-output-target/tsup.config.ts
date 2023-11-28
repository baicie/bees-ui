import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "@ikunorg/core"],
  format: ["cjs", "esm"],
  dts: true,
});
