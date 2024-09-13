import type { FlexProps } from '@bees-ui/core';
import { customElement } from '@bees-ui/sc-element';

import SolidFlex from './flex';

export const beesFlexProps: FlexProps = {
  prefixCls: undefined,
  rootClassName: undefined,
  vertical: false,
  wrap: false,
  justify: 'flex-start',
  align: 'stretch',
  flex: '0 1 auto',
  gap: 0,
  component: 'div',
  className: undefined,
  style: {},
};

export const BeesFlex = () => {
  customElement('bees-flex', beesFlexProps, SolidFlex);
};
