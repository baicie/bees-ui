import solidPlugin from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    coverage: {
      reporter: ['lcov', 'text'],
      include: ['src/index.ts'],
      exclude: ['src/types.ts'],
    },
    watch: false,
    globals: true,
    clearMocks: true,
    include: ['src/__tests__/*.tsx'],
  },
});
