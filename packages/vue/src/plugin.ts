import { Plugin } from 'vue';
import { applyPolyfills, defineCustomElements } from '@baicie/ui-core/loader';

export const ComponentLibrary: Plugin = {
  async install() {
    applyPolyfills().then(() => {
      defineCustomElements();
    });
  },
};
