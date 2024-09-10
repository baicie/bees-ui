import path from 'node:path';
import { testPath } from '@bees-ui/path';
import solidPlugin from 'vite-plugin-solid';
import { defineConfig, defineWorkspace } from 'vitest/config';

export const vitestCommonConfig = defineConfig({
  test: {
    include: ['**/tests/**/*.test.{js,jsx,ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    testTimeout: 20000,
    isolate: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: path.resolve(testPath, 'setup.ts'),
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
  plugins: [solidPlugin()],
});

export default defineWorkspace(['packages/*']);
