import { VNode } from '@stencil/core';

export type StencilVode = VNode;
export type CssClassMap = { [className: string]: boolean | string };

export interface StencilCSS {
  [key: string]: string | undefined;
}
