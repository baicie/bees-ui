import { canUseDom } from '@bees-ui/sc-util';
import { createEffect } from 'solid-js';

const useIsomorphicLayoutEffect = (fn: () => any) => {
  if (canUseDom()) {
    createEffect(() => {
      const cleanup = fn();
      return () => {
        if (cleanup) cleanup();
      };
    });
  } else {
    // No-op in non-DOM environments
    // You can implement a no-op effect if needed
  }
};

export default useIsomorphicLayoutEffect;
