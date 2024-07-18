import { createEffect, createSignal } from 'solid-js';

export default function useEvent<T extends Function>(callback: T): T {
  const [fn, setFn] = createSignal<T>(callback);

  // Update the callback whenever it changes
  createEffect(() => {
    setFn(() => callback);
  });

  const memoFn = ((...args: any[]) => fn()?.(...args)) as unknown as T;

  return memoFn;
}
