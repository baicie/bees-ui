import type { JSXElement } from 'solid-js';
import { createContext, createSignal, useContext } from 'solid-js';
import type { SizeInfo } from '.';

type onCollectionResize = (size: SizeInfo, element: HTMLElement, data: any) => void;

export const CollectionContext = createContext<onCollectionResize>();

export interface ResizeInfo {
  size: SizeInfo;
  data: any;
  element: HTMLElement;
}

export interface CollectionProps {
  /** Trigger when some children ResizeObserver changed. Collect by frame render level */
  onBatchResize?: (resizeInfo: ResizeInfo[]) => void;
  children?: JSXElement;
}

/**
 * Collect all the resize event from children ResizeObserver
 */
export function Collection(props: CollectionProps) {
  const [resizeIdRef, setResuzeIdRef] = createSignal(0);
  const [resizeInfosRef, setResizeInfosRef] = createSignal<ResizeInfo[]>([]);

  const onCollectionResize = useContext(CollectionContext);

  const onResize = (size: SizeInfo, element: HTMLElement, data: any) => {
    setResuzeIdRef(resizeIdRef() + 1);
    const currentId = resizeIdRef();

    resizeInfosRef().push({
      size,
      element,
      data,
    });

    Promise.resolve().then(() => {
      if (currentId === resizeIdRef()) {
        props.onBatchResize?.(resizeInfosRef());
        setResizeInfosRef([]);
      }
    });

    // Continue bubbling if parent exist
    onCollectionResize?.(size, element, data);
  };
  // @ts-ignore
  return <CollectionContext.Provider value={onResize}>{props.children}</CollectionContext.Provider>;
}
