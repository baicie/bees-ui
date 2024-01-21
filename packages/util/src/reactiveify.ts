import { Ref, isRef } from '@vue/reactivity';

type WatchSource<T> = Ref<T> | (() => T);
type WatchEffect = (getter?: any, options?: any) => void;
type WatchStopHandle = () => void;

export function watch<T>(
  source: WatchSource<T>,
  effect: WatchEffect,
  options?: { immediate?: boolean },
): WatchStopHandle {
  let getter: () => T;
  let cleanup: any;

  if (isRef(source)) {
    getter = () => (source as Ref<T>).value;
    cleanup = effect(getter, { lazy: true, scheduler: () => effect() });
  } else {
    getter = source as () => T;
    cleanup = effect(getter, { lazy: true, scheduler: () => effect() });
  }

  if (options?.immediate) {
    effect();
  }

  return cleanup;
}
