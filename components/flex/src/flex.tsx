import { isPresetSize } from '@bees-ui/_util';
import { omit } from '@bees-ui/sc-util';
import clsx from 'clsx';
import { splitProps, useContext } from 'solid-js';
import type { JSX } from 'solid-js';

import { ConfigContext } from '../../context';
import type { FlexProps } from './interface';
import useStyle from './style';
import createFlexClassNames from './utils';

const Flex = (props: FlexProps, options: any) => {
  const [local, others] = splitProps(props, [
    'prefixCls',
    'rootClassName',
    'className',
    'style',
    'flex',
    'gap',
    'children',
    'vertical',
    'component',
  ]);

  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    style,
    flex,
    gap,
    children,
    vertical = false,
    component: Component = 'div',
  } = local;
  console.log('vertical', vertical);

  const { flex: ctxFlex, direction: ctxDirection, getPrefixCls } = useContext(ConfigContext);

  const prefixCls = getPrefixCls('flex', customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedVertical = vertical ?? ctxFlex?.vertical;

  const mergedCls = clsx(
    className,
    rootClassName,
    ctxFlex?.className,
    prefixCls,
    hashId,
    cssVarCls,
    createFlexClassNames(prefixCls, local),
    {
      [`${prefixCls}-rtl`]: ctxDirection === 'rtl',
      [`${prefixCls}-gap-${gap}`]: isPresetSize(gap),
      [`${prefixCls}-vertical`]: mergedVertical,
    },
  );

  const mergedStyle: JSX.CSSProperties = { ...ctxFlex?.style, ...style };

  if (flex) {
    mergedStyle.flex = flex;
  }

  if (gap && !isPresetSize(gap)) {
    mergedStyle.gap = gap;
  }

  return wrapCSSVar(
    <div class={mergedCls} style={mergedStyle} {...omit(others, ['justify', 'wrap', 'align'])}>
      {options.slots.default}
    </div>,
  );
};

export default Flex;
