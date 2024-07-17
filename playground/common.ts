import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';

export const common = defineConfig({
  plugins: [
    visualizer({
      open: true,
    }) as unknown as PluginOption,
  ],
});
