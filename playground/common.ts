import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';

export const common = defineConfig({
  plugins: [
    visualizer({
      open: false,
    }) as unknown as PluginOption,
  ],
});
