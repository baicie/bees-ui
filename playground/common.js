import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
export var common = defineConfig({
  plugins: [
    visualizer({
      open: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: function (id) {
          if (id.includes('.pnpm') && id.includes('node_modules')) {
            return id.split('.pnpm/')[1].split('node_modules/')[1].split('/')[0].toString()
          } else if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@bees-ui/antd', '@bees-ui/register', '@bees-ui/core', '@bees-ui/icons'],
  },
})
