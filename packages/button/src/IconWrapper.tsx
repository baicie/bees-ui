import type { CSSProperties } from '@baicie/core';
import { clsx } from '@baicie/core';
import type { Component, JSXElement } from 'solid-js';

export type IconWrapperProps = {
  prefixCls: string;
  className?: string;
  style?: CSSProperties;
  children?: JSXElement;
};

const IconWrapper: Component<IconWrapperProps> = (props) => {
  const { className, style, children, prefixCls } = props;

  const iconWrapperCls = clsx(`${prefixCls}-icon`, className);

  return (
    <span class={iconWrapperCls} style={style as any}>
      {children}
    </span>
  );
};

export default IconWrapper;
