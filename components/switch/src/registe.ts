import type { SwitchProps } from '@bees-ui/core';
import { customElement } from '@bees-ui/sc-element';

import SolidSwitch from './switch';

export const beesSwitchProps: SwitchProps = {
  prefixCls: undefined,
  size: undefined,
  className: undefined,
  rootClassName: undefined,
  checked: undefined,
  defaultChecked: undefined,
  value: undefined,
  defaultValue: undefined,
  onChange: undefined,
  onClick: undefined,
  checkedChildren: undefined,
  unCheckedChildren: undefined,
  disabled: undefined,
  loading: undefined,
  autoFocus: undefined,
  style: {},
  title: undefined,
  tabIndex: undefined,
  id: undefined,
};

export const BeesSwitch = () => {
  customElement('bees-switch', beesSwitchProps, SolidSwitch);
};
