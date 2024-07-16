import { findDOMNode } from '@bees-ui/sc-util';
import {
  createEffect,
  createSignal,
  onMount,
  useContext,
  type JSXElement,
  type Ref,
} from 'solid-js';

import type { ResizeObserverProps } from '..';
import { CollectionContext } from '../Collection';
import { observe, unobserve } from '../utils/observerUtil';
import DomWrapper from './DomWrapper';

export interface SingleObserverProps extends ResizeObserverProps {
  children: JSXElement | ((ref: Ref<Element>) => JSXElement);
}

function SingleObserver(props: SingleObserverProps): JSXElement {
  const { children, disabled } = props;
  const [elementRef] = createSignal<Element>();

  const onCollectionResize = useContext(CollectionContext);

  // =========================== Children ===========================
  const isRenderProps = typeof children === 'function';
  const mergedChildren = isRenderProps ? children(elementRef) : children;

  // ============================= Size =============================
  const [sizeRef, setSizeRef] = createSignal({
    width: -1,
    height: -1,
    offsetWidth: -1,
    offsetHeight: -1,
  });

  // ============================= Ref ==============================
  const getDom = () =>
    findDOMNode<HTMLElement>(elementRef()) ||
    // Support `nativeElement` format
    (elementRef() && typeof elementRef() === 'object'
      ? findDOMNode<HTMLElement>((elementRef() as any)?.nativeElement)
      : null);

  props.ref!.getDom = getDom;

  // =========================== Observe ============================
  const [propsRef, setPropRef] = createSignal<SingleObserverProps>(props);
  setPropRef(props);

  // Handler
  const onInternalResize = (target: Element) => {
    const { onResize, data } = propsRef();

    const { width, height } = target.getBoundingClientRect();
    const { offsetWidth, offsetHeight } = target as HTMLElement;

    /**
     * Resize observer trigger when content size changed.
     * In most case we just care about element size,
     * let's use `boundary` instead of `contentRect` here to avoid shaking.
     */
    const fixedWidth = Math.floor(width);
    const fixedHeight = Math.floor(height);

    if (
      sizeRef().width !== fixedWidth ||
      sizeRef().height !== fixedHeight ||
      sizeRef().offsetWidth !== offsetWidth ||
      sizeRef().offsetHeight !== offsetHeight
    ) {
      const size = { width: fixedWidth, height: fixedHeight, offsetWidth, offsetHeight };
      setSizeRef(size);

      // IE is strange, right?
      const mergedOffsetWidth = offsetWidth === Math.round(width) ? width : offsetWidth;
      const mergedOffsetHeight = offsetHeight === Math.round(height) ? height : offsetHeight;

      const sizeInfo = {
        ...size,
        offsetWidth: mergedOffsetWidth,
        offsetHeight: mergedOffsetHeight,
      };

      // Let collection know what happened
      onCollectionResize?.(sizeInfo, target as HTMLElement, data);

      if (onResize) {
        // defer the callback but not defer to next frame
        Promise.resolve().then(() => {
          // @ts-ignore
          onResize(sizeInfo, target);
        });
      }
    }
  };

  // Dynamic observe
  createEffect(() => {
    const currentElement: HTMLElement = getDom();

    if (currentElement && !disabled) {
      observe(currentElement, onInternalResize);
    }

    return () => unobserve(currentElement, onInternalResize);
  });

  onMount(() => {});

  // ============================ Render ============================
  // @ts-ignore
  return (
    // @ts-ignore
    <DomWrapper ref={props.ref}>{mergedChildren}</DomWrapper>
  );
}

export default SingleObserver;
