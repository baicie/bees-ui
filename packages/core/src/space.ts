import { Space } from '@bees-ui/antd';
import type { SpaceProps } from '@bees-ui/antd';
import register from '@bees-ui/register';

export type { SpaceProps }

export const beesSpaceProps: SpaceProps = {
  prefixCls: undefined,
  className: undefined,
  rootClassName: undefined,
  style: {},
  align: undefined,
  direction: 'horizontal',
  size: 'small',
  split: undefined,
  wrap: false,
  classNames: undefined,
  styles: undefined,
}

export default function registerSpace() {
  register('bees-space', Space, beesSpaceProps);
}
