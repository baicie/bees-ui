import { Config } from '@stencil/core';
import { stencilCachePath, stencilWWWPath } from '../../scripts/paths';
import { sass } from '@stencil/sass';
import { vueOutputTarget } from '@ikunorg/vue-output-target';
import { reactOutputTarget } from '@ikunorg/react-output-target';
import { svelteOutputTarget } from '@ikunorg/svelte-output-target';

export const config: Config = {
  autoprefixCss: true,
  sourceMap: false,
  namespace: 'ikun',
  cacheDir: stencilCachePath,
  plugins: [sass()],
  buildEs5: 'prod',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      dir: 'components',
      // copy: [{
      //   src: '../scripts/custom-elements',
      //   dest: 'components',
      //   warn: true
      // }],
      includeGlobalScripts: false,
    },
    {
      type: 'dist-hydrate-script',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      dir: stencilWWWPath,
    },
    vueOutputTarget({
      componentCorePackage: '@ikunorg/core',
      includeImportCustomElements: true,
      includePolyfills: false,
      includeDefineCustomElements: false,
      proxiesFile: '../vue/src/components.ts',
    }),
    reactOutputTarget({
      componentCorePackage: '@ikunorg/core',
      includeImportCustomElements: true,
      includePolyfills: false,
      includeDefineCustomElements: false,
      proxiesFile: '../react/src/components.ts',
    }),
    svelteOutputTarget({
      componentCorePackage: '@ikunorg/core',
      // includeImportCustomElements: true,
      includePolyfills: false,
      includeDefineCustomElements: false,
      proxiesFile: '../svelte/src/components.ts',
    }),
  ],
  testing: {
    browserHeadless: 'new',
  },
  enableCache: true,
  transformAliasedImportPaths: true,
  globalScript: './src/global/ikun-global.ts',
  env: {
    version: require('./package.json').version,
  },
};
