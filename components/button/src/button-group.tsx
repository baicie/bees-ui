import type { SizeType } from '@bees-ui/core';
import { clsx, ConfigContext, devUseWarning, useToken } from '@bees-ui/core';
import type { ButtonGroupProps } from '@bees-ui/props';
import { createContext, useContext } from 'solid-js';

export const GroupSizeContext = createContext<SizeType>(undefined);

const ButtonGroup = (props: ButtonGroupProps) => {
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
      <div {...others} class={classes} />
    </GroupSizeContext.Provider>
  );
};

export default ButtonGroup;
