import { JSX, JSXElement, useContext } from "solid-js";
import { ButtonHTMLType, ButtonShape, ButtonType } from "./buttonHelpers";
import type { SizeType } from '@baicie/config-provider';
import { ConfigContext } from '@baicie/config-provider';

export type LegacyButtonType = ButtonType | 'danger';

type MergedHTMLAttributes = Omit<
  JSX.IntrinsicElements['div'] &
  JSX.IntrinsicElements['button'] &
  JSX.IntrinsicElements['a'],
  'type'
>;
export interface BaseButtonProps {
  type?: ButtonType;
  icon?: JSXElement;
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
  children?: JSXElement;
  [key: `data-${string}`]: string;
  classNames?: { icon: string };
  styles?: { icon: React.CSSProperties };
  htmlType?: ButtonHTMLType;
}

export interface ButtonProps extends BaseButtonProps {
  href?: string;
  htmlType?: ButtonHTMLType;
}

export const button = (props: BaseButtonProps,) => {
  const {
    loading = false,
    prefixCls: customizePrefixCls,
    type = 'default',
    danger,
    shape = 'default',
    size: customizeSize,
    styles,
    disabled: customDisabled,
    className,
    rootClassName,
    children,
    icon,
    ghost = false,
    block = false,
    // React does not recognize the `htmlType` prop on a DOM element. Here we pick it out of `rest`.
    htmlType = 'button',
    classNames: customClassNames,
    // style: customStyle = {},
    ...rest
  } = props;

  const { getPrefixCls, autoInsertSpaceInButton, direction, button } = useContext(ConfigContext);
  return (
    <button>Click me</button>
  )
}
