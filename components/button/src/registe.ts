import type { ButtonProps } from '@bees-ui/core';
import { customElement } from '@bees-ui/sc-element';

import SolidButton from './button';

export const beesButtonProps: ButtonProps = {
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
  icon: undefined,
  ghost: false,
  block: false,
  htmlType: 'button',
  classNames: undefined,
  style: {},
};

export const BeesButton = () => {
  customElement('bees-button', beesButtonProps, SolidButton);
};
