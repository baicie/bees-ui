import { createEffect, onCleanup } from 'solid-js';

type UseCompatibleInsertionEffect = (
  renderEffect: () => void,
  effect: (polyfill?: boolean) => void | (() => void),
  deps?: any[],
) => void;

const useCompatibleInsertionEffect: UseCompatibleInsertionEffect = (renderEffect, effect, deps) =>
  createEffect(() => {
    const cleanupEffect = effect();
    renderEffect();

    onCleanup(() => {
      if (cleanupEffect) {
        cleanupEffect();
      }
    });
  }, deps);

export default useCompatibleInsertionEffect;
