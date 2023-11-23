import { Plugin } from 'vue';
import { applyPolyfills, defineCustomElements } from '@ikunorg/core/loader';

export const ComponentLibrary: Plugin = {
  async install() {
    applyPolyfills().then(() => {
      defineCustomElements();
    });
  },
};
