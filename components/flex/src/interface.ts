import type { AnyObject, CustomComponent, SizeType } from '@bees-ui/core';
import type { JSX } from 'solid-js';

export interface FlexProps<P = AnyObject> extends JSX.HTMLAttributes<HTMLElement> {
  prefixCls?: string;
  rootClassName?: string;
  vertical?: boolean;
  wrap?: boolean | JSX.CSSProperties['flex-wrap'];
  justify?: JSX.CSSProperties['justify-content'];
  align?: JSX.CSSProperties['align-items'];
  flex?: JSX.CSSProperties['flex'];
  gap?: JSX.CSSProperties['gap'] | SizeType;
  children: JSX.Element | JSX.Element[];
  component?: CustomComponent<P>;
  className?: string;
  style?: any;
}
