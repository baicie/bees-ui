import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['vue', '@ikunorg/core'],
  format: ['cjs', 'esm'],
  dts: true,
});
