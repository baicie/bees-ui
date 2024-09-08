import react from '@vitejs/plugin-react';
import { defineConfig, mergeConfig } from 'vite';

import { common } from '../common';

// https://vitejs.dev/config/
const config = defineConfig({
  plugins: [react()],
});

export default mergeConfig(config, common);
