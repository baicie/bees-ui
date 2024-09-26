import path from 'path'
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, mergeConfig } from 'vite'
import { common } from '../common'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
const config = defineConfig({
  plugins: [vue()],
})

export default mergeConfig(config, common)
