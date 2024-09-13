import type { CSSProperties } from '../base';

export interface DividerProps {
  prefixCls?: string;
  type?: 'horizontal' | 'vertical';
  orientation?: 'left' | 'right' | 'center';
  orientationMargin?: string | number;
  className?: string;
  rootClassName?: string;
  dashed?: boolean;
  variant?: 'dashed' | 'dotted' | 'solid';
  style?: CSSProperties;
  plain?: boolean;
}
