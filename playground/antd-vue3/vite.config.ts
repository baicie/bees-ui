import { defineConfig, mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { common } from '../common';

// https://vitejs.dev/config/
const config = defineConfig({
  plugins: [vue()],
})


export default mergeConfig(config, common);
