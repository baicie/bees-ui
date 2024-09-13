import type { JSX } from 'solid-js';

import type { AnyObject, CustomComponent } from '../../_util/type';
import type { SizeType } from '../base';

export interface FlexProps<P = AnyObject>
  extends Omit<JSX.HTMLAttributes<HTMLElement>, 'children'> {
  prefixCls?: string;
  rootClassName?: string;
  vertical?: boolean;
  wrap?: boolean | JSX.CSSProperties['flex-wrap'];
  justify?: JSX.CSSProperties['justify-content'];
  align?: JSX.CSSProperties['align-items'];
  flex?: JSX.CSSProperties['flex'];
  gap?: JSX.CSSProperties['gap'] | SizeType;
  component?: CustomComponent<P>;
  className?: string;
  style?: JSX.CSSProperties;
}
