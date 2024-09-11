import type { BaseButtonProps, ButtonType } from '@bees-ui/props';
import type { JSX } from 'solid-js';

import type { LegacyButtonType } from './button';

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
