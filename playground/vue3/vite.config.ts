import path from 'path';
import { fileURLToPath } from 'url';
import preact from '@preact/preset-vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), preact(), visualizer({ open: true }) as any],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/preact/compat'),
      'react-dom': path.resolve(__dirname, 'node_modules/preact/compat'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/preact/jsx-runtime'),
    },
  },
});
