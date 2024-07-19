import path from 'path';
import { fileURLToPath } from 'url';
import preact from '@preact/preset-vite';
import react from '@vitejs/plugin-react';
import { defineConfig, mergeConfig } from 'vite';

import { common } from '../common';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
const config = defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/preact/compat'),
      'react-dom': path.resolve(__dirname, 'node_modules/preact/compat'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/preact/jsx-runtime'),
    },
  },
});

export default mergeConfig(config, common);
