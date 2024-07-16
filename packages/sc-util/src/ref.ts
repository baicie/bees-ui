import type { JSXElement, Ref } from 'solid-js';

import useMemo from './hooks/useMemo';

export function fillRef<T>(ref: Ref<T>, node: T) {
  if (typeof ref === 'function') {
    // @ts-ignore
    ref(node);
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    (ref as any).current = node;
  }
}

/**
 * Merge refs into one ref function to support ref passing.
 */
export function composeRef<T>(...refs: Ref<T>[]): Ref<T> {
  const refList = refs.filter((ref) => ref);
  if (refList.length <= 1) {
    return refList[0];
  }

  return (node: T) => {
    refs.forEach((ref) => {
      fillRef(ref, node);
    });
  };
}

export function useComposeRef<T>(...refs: Ref<T>[]): Ref<T> {
  return useMemo(
    () => composeRef(...refs),
    refs,
    (prev, next) => prev.length !== next.length || prev.every((ref, i) => ref !== next[i]),
  );
}

export function supportRef(nodeOrComponent: any): boolean {
  const type = nodeOrComponent.type;

  // Function component node
  if (typeof type === 'function' && !type.prototype?.render) {
    return false;
  }

  // Class component
  if (typeof nodeOrComponent === 'function' && !nodeOrComponent.prototype?.render) {
    return false;
  }

  return true;
}

export function supportNodeRef(node: JSXElement): boolean {
  // if (!isValidElement(node)) {
  //   return false;
  // }

  // if (isFragment(node)) {
  //   return false;
  // }

  return supportRef(node);
}
