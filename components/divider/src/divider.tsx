import type { DividerProps } from '@bees-ui/core';
import { ConfigContext, devUseWarning } from '@bees-ui/core';
import type { ComponentOptions } from '@bees-ui/sc-element';
import classNames from 'clsx';
import { createMemo, Show, splitProps, useContext, type JSX } from 'solid-js';

import useStyle from './style';

export const SolidDivider = (props: DividerProps, options: ComponentOptions) => {
  const { getPrefixCls, direction, divider } = useContext(ConfigContext);
  const [local, restProps] = splitProps(props, [
    'prefixCls',
    'type',
    'orientation',
    'orientationMargin',
    'className',
    'rootClassName',
    'dashed',
    'variant',
    'plain',
    'style',
  ]);

  const prefixCls = getPrefixCls('divider', local.prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const hasChildren = !!options.slots.default;
  const hasCustomMarginLeft = local.orientation === 'left' && local.orientationMargin != null;
  const hasCustomMarginRight = local.orientation === 'right' && local.orientationMargin != null;

  const classString = classNames(
    prefixCls,
    divider?.className,
    hashId,
    cssVarCls,
    `${prefixCls}-${local.type}`,
    {
      [`${prefixCls}-with-text`]: hasChildren,
      [`${prefixCls}-with-text-${local.orientation}`]: hasChildren,
      [`${prefixCls}-dashed`]: !!local.dashed,
      [`${prefixCls}-${local.variant}`]: local.variant !== 'solid',
      [`${prefixCls}-plain`]: !!local.plain,
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-no-default-orientation-margin-left`]: hasCustomMarginLeft,
      [`${prefixCls}-no-default-orientation-margin-right`]: hasCustomMarginRight,
    },
    local.className,
    local.rootClassName,
  );

  const memoizedOrientationMargin = createMemo<string | number>(() => {
    if (typeof local.orientationMargin === 'number') {
      return local.orientationMargin;
    }
    if (/^\d+$/.test(local.orientationMargin!)) {
      return Number(local.orientationMargin);
    }
    return local.orientationMargin!;
  });

  const innerStyle: JSX.CSSProperties = {
    ...(hasCustomMarginLeft && { marginLeft: memoizedOrientationMargin() }),
    ...(hasCustomMarginRight && { marginRight: memoizedOrientationMargin() }),
  };

  // Warning children not work in vertical mode
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Divider');
    warning(
      !options.slots.default || local.type !== 'vertical',
      'usage',
      '`children` not working in `vertical` mode.',
    );
  }

  return wrapCSSVar(
    <div
      class={classString}
      style={{ ...divider?.style, ...local.style }}
      role="separator"
      {...restProps}
    >
      <Show when={options.slots.default && local.type === 'vertical'}>
        <span class={`${prefixCls}-inner-text`} style={innerStyle}>
          {options.slots.default}
        </span>
      </Show>
    </div>,
  );
};
