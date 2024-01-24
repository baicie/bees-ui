/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="svelte" />
import { HTMLButtonAttributes } from 'svelte/elements';

declare module 'svelte/elements' {
  export interface SvelteHTMLElements {
    'custom-button': HTMLButtonAttributes;
  }

  // allows for more granular control over what element to add the typings to
  export interface HTMLButtonAttributes {
    veryexperimentalattribute?: string;
  }
}

export { }; // ensure this is not an ambient module, else types will be overridden instead of augmented
