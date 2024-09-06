import { customElement } from '@bees-ui/sc-element';

import SolidFlex from './flex';
import { FlexProps } from './interface';

export const beesFlexProps: FlexProps = {
  prefixCls: undefined,
  rootClassName: undefined,
  vertical: false,
  wrap: false,
  justify: 'flex-start',
  align: 'stretch',
  flex: '0 1 auto',
  gap: 0,
  children: undefined,
  component: 'div',
  className: undefined,
  style: {},
};

export const BeesFlex = () => {
  customElement('bees-flex', beesFlexProps, SolidFlex);
};
