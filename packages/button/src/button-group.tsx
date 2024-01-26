import type { CSSProperties } from '@baicie/core';
import { clsx } from '@baicie/core';
import type { SizeType } from '@baicie/core';
import { ConfigContext, devUseWarning, useToken } from '@baicie/core';
import type { Component } from 'solid-js';
import { createContext, useContext, type JSXElement } from 'solid-js';

export interface ButtonGroupProps {
  size?: SizeType;
  style?: CSSProperties;
  className?: string;
  prefixCls?: string;
  children?: JSXElement;
}

export const GroupSizeContext = createContext<SizeType>(undefined);

const ButtonGroup: Component<ButtonGroupProps> = (props) => {
  const { getPrefixCls, direction } = useContext(ConfigContext);

  const { prefixCls: customizePrefixCls, size, className, ...others } = props;
  const prefixCls = getPrefixCls('btn-group', customizePrefixCls);

  const [, , hashId] = useToken();

  let sizeCls = '';

  switch (size) {
    case 'large':
      sizeCls = 'lg';
      break;
    case 'small':
      sizeCls = 'sm';
      break;
    case 'middle':
    default:
    // Do nothing
  }

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Button.Group');

    warning(!size || ['large', 'small', 'middle'].includes(size), 'usage', 'Invalid prop `size`.');
  }

  const classes = clsx(
    prefixCls,
    {
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    className,
    hashId,
  );

  return (
    <GroupSizeContext.Provider value={size}>
      {/* @ts-ignore */}
      <div {...others} class={classes} />
    </GroupSizeContext.Provider>
  );
};

export default ButtonGroup;
