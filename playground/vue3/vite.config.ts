import path from 'path';
import { fileURLToPath } from 'url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // react: 'preact/compat',
      // 'react-dom': 'preact/compat',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('.pnpm') && id.includes('node_modules')) {
            return id.split('.pnpm/')[1].split('node_modules/')[1].split('/')[0].toString();
          } else if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
});
