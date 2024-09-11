import type { JSX } from 'solid-js';

import type { SizeType } from '../base';
import type { CSSProperties } from '../index';
import type { ButtonHTMLType, ButtonShape, ButtonType } from './types';

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: JSX.Element;
  iconPosition?: 'start' | 'end';
  shape?: ButtonShape;
  size?: SizeType;
  disabled?: boolean;
  loading?: boolean | { delay?: number };
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  ghost?: boolean;
  danger?: boolean;
  block?: boolean;
  [key: `data-${string}`]: string;
  classNames?: { icon: string };
  styles?: { icon: JSX.CSSProperties };
  style?: JSX.CSSProperties;
}

type MergedHTMLAttributes = Omit<
  JSX.HTMLAttributes<HTMLElement> &
    JSX.ButtonHTMLAttributes<HTMLElement> &
    JSX.AnchorHTMLAttributes<HTMLElement>,
  'type' | 'style' | 'children'
>;

export interface ButtonProps extends BaseButtonProps, MergedHTMLAttributes {
  href?: string;
  htmlType?: ButtonHTMLType;
  autoInsertSpace?: boolean;
}

export interface ButtonGroupProps {
  size?: SizeType;
  style?: CSSProperties;
  className?: string;
  prefixCls?: string;
  children?: JSX.Element;
}
