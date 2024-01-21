import { button } from './button';
import { customElement } from 'solid-element';
import type { ButtonType } from './buttonHelpers';
import type { ButtonProps } from './button';
import type { ComponentToken } from './style'

customElement('solid-button', {
  loading: false,
  prefixCls: undefined,
  type: 'default',
  danger: undefined,
  shape: 'default',
  size: undefined,
  styles: undefined,
  disabled: undefined,
  className: undefined,
  rootClassName: undefined,
  children: undefined,
  icon: undefined,
  ghost: false,
  block: false,
  htmlType: 'button',
  classNames: undefined,
}, button);

export {
  button
}

export type {
  ButtonType,
  ButtonProps,
  ComponentToken
}
