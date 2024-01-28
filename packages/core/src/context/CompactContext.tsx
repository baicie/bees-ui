import classNames from 'clsx';
import type { Component, JSX, JSXElement } from 'solid-js';
import { createContext, createMemo, useContext } from 'solid-js';

import type { DirectionType } from './ConfigContext';
import type { SizeType } from './SizeContext';

export interface SpaceCompactItemContextType {
  compactSize?: SizeType;
  compactDirection?: 'horizontal' | 'vertical';
  isFirstItem?: boolean;
  isLastItem?: boolean;
}

export const SpaceCompactItemContext = createContext<SpaceCompactItemContextType | null>(null);

export const useCompactItemContext = (prefixCls: string, direction: DirectionType) => {
  const compactItemContext = useContext(SpaceCompactItemContext);

  const compactItemClassnames = createMemo<string>(() => {
    if (!compactItemContext) {
      return '';
    }
    const { compactDirection, isFirstItem, isLastItem } = compactItemContext;
    const separator = compactDirection === 'vertical' ? '-vertical-' : '-';

    return classNames(`${prefixCls}-compact${separator}item`, {
      [`${prefixCls}-compact${separator}first-item`]: isFirstItem,
      [`${prefixCls}-compact${separator}last-item`]: isLastItem,
      [`${prefixCls}-compact${separator}item-rtl`]: direction === 'rtl',
    });
  });

  return {
    compactSize: compactItemContext?.compactSize,
    compactDirection: compactItemContext?.compactDirection,
    compactItemClassnames,
  };
};

export const NoCompactStyle: Component<{
  children?: JSXElement;
}> = (props) => {
  return (
    <SpaceCompactItemContext.Provider value={null}>
      {' '}
      {props.children}{' '}
    </SpaceCompactItemContext.Provider>
  );
};

export interface SpaceCompactProps extends JSX.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  size?: SizeType;
  direction?: 'horizontal' | 'vertical';
  block?: boolean;
  rootClassName?: string;
}
