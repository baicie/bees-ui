import { warning, toArray } from '@bees-ui/sc-util';
import { Collection } from './Collection';
import SingleObserver from './SingleObserver';
import type { JSXElement, Ref } from 'solid-js';

const INTERNAL_PREFIX_KEY = 'rc-observer-key';

import { _rs } from './utils/observerUtil';
export {
  /** @private Test only for mock trigger resize event */
  _rs,
};

export interface SizeInfo {
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
}

export type OnResize = (size: SizeInfo, element: HTMLElement) => void;

export interface ResizeObserverProps {
  /** Pass to ResizeObserver.Collection with additional data */
  data?: any;
  children: JSXElement | ((ref: Ref<any>) => JSXElement);
  disabled?: boolean;
  /** Trigger if element resized. Will always trigger when first time render. */
  onResize?: OnResize;
  ref?: Ref<HTMLElement> & {
    getDom: () => HTMLElement | null;
  };
  key?: string;
}

function ResizeObserver(props: ResizeObserverProps) {
  const { children } = props;
  const childNodes = typeof children === 'function' ? [children] : toArray(children);

  if (process.env.NODE_ENV !== 'production') {
    if (childNodes.length > 1) {
      warning(
        false,
        'Find more than one child node with `children` in ResizeObserver. Please use ResizeObserver.Collection instead.',
      );
    } else if (childNodes.length === 0) {
      warning(false, '`children` of ResizeObserver is empty. Nothing is in observe.');
    }
  }

  return childNodes.map((child, index) => {
    const key = `${INTERNAL_PREFIX_KEY}-${index}`;
    return (
      // @ts-ignore
      <SingleObserver {...props} key={key} ref={index === 0 ? props.ref : undefined}>
        {child}
      </SingleObserver>
    );
  }) as any as JSXElement;
}

if (process.env.NODE_ENV !== 'production') {
  ResizeObserver.displayName = 'ResizeObserver';
}

ResizeObserver.Collection = Collection;

export default ResizeObserver;
