/// <reference types="vitest" />
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    include: ['**/__tests__/**/*.test.{js,jsx,ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    environment: 'jsdom', // 使用 jsdom 模拟浏览器环境
    globals: true, // 允许使用 Vitest 提供的全局函数（如 describe、it 等）
    setupFiles: './tests/setup.ts', // 可选，初始化文件
  },
});
