import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external:['vue','@baicie/ui-core'],
  format:['cjs','esm']
})
