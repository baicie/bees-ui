import type { ButtonType, ButtonShape, ButtonHTMLType } from './buttonHelpers';
import * as Svelte from 'svelte/elements';

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export interface BaseButtonProps {
  type?: ButtonType;
  shape?: ButtonShape;
  size?: SizeType;
  disable?: boolean;
  loading?: boolean | { delay?: number };
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  ghost?: boolean;
  danger?: boolean;
  block?: boolean;
  [key: `data-${string}`]: string;
  classNames?: { icon: string };
  // styles?: { icon: Svelte. };
}

type MergedHTMLAttributes = Omit<
  Svelte.HTMLAttributes<HTMLElement> &
  Svelte.HTMLButtonAttributes &
  Svelte.HTMLAnchorAttributes,
  'type'
>;

export interface ButtonProps extends BaseButtonProps, MergedHTMLAttributes {
  href?: string;
  htmlType?: ButtonHTMLType;
}
