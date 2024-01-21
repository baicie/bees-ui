import classNames from 'classnames';

import { warning } from '@baicie/util';
import { ConfigContext } from '@baicie/config-provider';
import type { SizeType } from '@baicie/config-provider';
import { useToken } from '@baicie/theme';
import { JSX } from 'solid-js/jsx-runtime';
import { JSXElement, Component, createContext, useContext } from 'solid-js';

export interface ButtonGroupProps {
  size?: SizeType;
  style?: JSX.CSSProperties;
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
    // const warning = devUseWarning('Button.Group');

    warning(!size || ['large', 'small', 'middle'].includes(size), 'Invalid prop `size`.');
  }

  const classes = classNames(
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
      <div {...others} class={classes} />
    </GroupSizeContext.Provider>
  );
};

export default ButtonGroup;
