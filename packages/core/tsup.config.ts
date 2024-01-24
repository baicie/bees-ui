import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/locale/index.ts',
    'src/util/index.ts',
    'src/theme/index.ts',
    'src/style/index.ts',
  ],
  dts: true,
  sourcemap: true,
  clean: true,
  format: ['cjs', 'esm'],
  target: 'es2018',
})
