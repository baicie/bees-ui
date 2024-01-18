import { ButtonShape, ButtonType } from "./buttonHelpers";
import type { SizeType } from '@baicie/config-provider';

export type LegacyButtonType = ButtonType | 'danger';
export interface BaseButtonProps {
  type?: ButtonType;
  icon?: React.ReactNode;
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
  children?: React.ReactNode;
  [key: `data-${string}`]: string;
  classNames?: { icon: string };
  styles?: { icon: React.CSSProperties };
}


export const button = (props: BaseButtonProps,) => {
  console.log('props', props);
  return (
    <button>Click me</button>
  )
}
