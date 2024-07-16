import { generate as generateColor } from '@ant-design/colors';
import type { AbstractNode, IconDefinition } from '@ant-design/icons-svg/lib/types';
import { getShadowRoot, updateCSS, warningOnce } from '@bees-ui/sc-util';
import type { JSX, JSXElement, Ref } from 'solid-js';
import { createEffect, useContext } from 'solid-js';
import h from 'solid-js/h';

import IconContext from './components/Context';

function camelCase(input: string) {
  return input.replace(/-(.)/g, (match, g) => g.toUpperCase());
}

export function warning(valid: boolean, message: string) {
  warningOnce(valid, `[qwq] ${message}`);
}

export function isIconDefinition(target: any): target is IconDefinition {
  return (
    typeof target === 'object' &&
    typeof target.name === 'string' &&
    typeof target.theme === 'string' &&
    (typeof target.icon === 'object' || typeof target.icon === 'function')
  );
}

export function normalizeAttrs(attrs: Attrs = {}): Attrs {
  return Object.keys(attrs).reduce((acc: Attrs, key) => {
    const val = attrs[key];
    switch (key) {
      case 'class':
        acc.className = val;
        delete acc.class;
        break;
      default:
        delete acc[key];
        acc[camelCase(key)] = val;
    }
    return acc;
  }, {});
}

export type Attrs = Record<string, string>;
interface RootProps {
  onClick: any;
  style: JSX.CSSProperties;
  ref: Ref<any>;
  [props: string]: string | number | JSXElement | JSX.CSSProperties | Ref<any>;
}

export function generate(node: AbstractNode, key: string, rootProps?: RootProps | false): any {
  if (!rootProps) {
    // solid-js/h
    return h(
      node.tag,
      { key, ...normalizeAttrs(node.attrs) },
      (node.children || []).map((child, index) => generate(child, `${key}-${node.tag}-${index}`)),
    );
  }

  return h(
    node.tag,
    {
      key,
      ...normalizeAttrs(node.attrs),
      ...rootProps,
    },
    (node.children || []).map((child, index) => generate(child, `${key}-${node.tag}-${index}`)),
  );
}

export function getSecondaryColor(primaryColor: string): string {
  // choose the second color
  return generateColor(primaryColor)[0];
}

export function normalizeTwoToneColors(
  twoToneColor: string | [string, string] | undefined,
): string[] {
  if (!twoToneColor) {
    return [];
  }

  return Array.isArray(twoToneColor) ? twoToneColor : [twoToneColor];
}

// These props make sure that the SVG behaviours like general text.
// Reference: https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4
export const svgBaseProps = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  'aria-hidden': 'true',
  focusable: 'false',
};

export const iconStyles = `
.anticon {
  display: inline-block;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.anticon > * {
  line-height: 1;
}

.anticon svg {
  display: inline-block;
}

.anticon::before {
  display: none;
}

.anticon .anticon-icon {
  display: block;
}

.anticon[tabindex] {
  cursor: pointer;
}

.anticon-spin::before,
.anticon-spin {
  display: inline-block;
  -webkit-animation: loadingCircle 1s infinite linear;
  animation: loadingCircle 1s infinite linear;
}

@-webkit-keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
`;

export const useInsertStyles = (eleRef?: Ref<HTMLElement>) => {
  const { csp, prefixCls } = useContext(IconContext);
  let mergedStyleStr = iconStyles;

  if (prefixCls) {
    mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls);
  }

  createEffect(() => {
    const ele = eleRef;
    const shadowRoot = getShadowRoot(ele as any);

    updateCSS(mergedStyleStr, '@ant-design-icons', {
      prepend: true,
      csp,
      attachTo: shadowRoot,
    });
  });
};
