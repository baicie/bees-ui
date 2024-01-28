import type { Accessor } from 'solid-js';
import { createMemo, useContext } from 'solid-js';
import type { SizeType } from '@bees-ui/core';
import { SizeContext } from '@bees-ui/core';

const useSize = <T>(customSize?: T | ((ctxSize: SizeType) => T)): Accessor<T | SizeType> => {
  const size = useContext<SizeType>(SizeContext);
  const mergedSize = createMemo(() => {
    if (!customSize) {
      return size as T;
    }
    if (typeof customSize === 'string') {
      return customSize ?? size;
    }
    if (customSize instanceof Function) {
      return customSize(size);
    }
    return size as T;
  });
  return mergedSize;
};

export default useSize;
