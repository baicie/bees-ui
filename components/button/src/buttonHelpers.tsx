import { JSX } from 'solid-js';

import type { BaseButtonProps, LegacyButtonType } from './button';

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
export const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);

export function convertLegacyProps(
  type?: LegacyButtonType,
): Pick<BaseButtonProps, 'danger' | 'type'> {
  if (type === 'danger') {
    return { danger: true };
  }
  return { type };
}

export function isString(str: any): str is string {
  return typeof str === 'string';
}

export function isUnBorderedButtonType(type?: ButtonType) {
  return type === 'text' || type === 'link';
}

export function isFragment(child: JSX.Element) {
  return child && typeof child === 'object';
}

const ButtonTypes = ['default', 'primary', 'dashed', 'link', 'text'] as const;
export type ButtonType = (typeof ButtonTypes)[number];

const ButtonShapes = ['default', 'circle', 'round'] as const;
export type ButtonShape = (typeof ButtonShapes)[number];

const ButtonHTMLTypes = ['submit', 'button', 'reset'] as const;
export type ButtonHTMLType = (typeof ButtonHTMLTypes)[number];
