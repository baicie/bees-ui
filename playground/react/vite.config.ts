import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig, mergeConfig } from 'vite';

import { common } from '../common';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
const config = defineConfig({
  plugins: [react()],
  resolve:{
    alias:{
      'react-dom': path.resolve(__dirname, 'node_modules/preact/compat'), 
      react: path.resolve(__dirname, 'node_modules/preact/compat'),
    }
  }
});

export default mergeConfig(config, common);
