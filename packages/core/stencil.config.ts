import { Config } from '@stencil/core';
import { stencilCachePath ,stencilDocsPath,stencilWWWPath} from '../../scripts/paths';
import { sass } from '@stencil/sass';
import {vueOutputTarget} from '@stencil/vue-output-target';

export const config: Config = {
  autoprefixCss: true,
  sourceMap: false,
  namespace: 'baccie',
  cacheDir:stencilCachePath,
  plugins: [
    sass(),
  ],
  buildEs5: 'prod',
  outputTargets: [
    {
      type: 'docs-vscode',
      file: 'dist/html.html-data.json',
    },
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
      includeGlobalScripts: false
    },
    {
      type: 'docs-readme',
      dir: stencilDocsPath
      // file: '../docs/core.json'
    },
    {
      type: 'dist-hydrate-script'
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      dir:stencilWWWPath
    },
    vueOutputTarget({
      componentCorePackage: '@ikunorg/core',
      includeImportCustomElements: true,
      includePolyfills: false,
      includeDefineCustomElements: false,
      proxiesFile: '../vue/src/components.ts',
    })
  ],
  testing: {
    browserHeadless: "new",
  },
  enableCache: true,
  transformAliasedImportPaths: true,
};
