import type { DividerProps } from '@bees-ui/core';
import { customElement } from '@bees-ui/sc-element';

import { SolidDivider } from './divider';

export const beesDividerProps: DividerProps = {
  type: 'horizontal',
  orientation: 'center',
  dashed: false,
  variant: 'solid',
  plain: false,
  style: {},
  className: undefined,
  rootClassName: undefined,
  prefixCls: undefined,
  orientationMargin: undefined,
};

export const BeesDivider = () => {
  customElement('bees-divider', beesDividerProps, SolidDivider);
};
