import { createEffect, onCleanup, createSignal } from "solid-js";

const useLayoutEffect = (
  callback: (mount: boolean) => void | VoidFunction,
  deps?: any[],
) => {
  const [firstMount, setFirstMount] = createSignal(true);

  createEffect(() => {
    return callback(firstMount());
  }, deps);

  createEffect(() => {
    setFirstMount(false);
    onCleanup(() => {
      setFirstMount(true);
    });
  },);
};

export const useLayoutUpdateEffect = (
  callback: () => void,
  deps?: any[],
) => {
  useLayoutEffect(firstMount => {
    if (!firstMount) {
      return callback();
    }
  }, deps);
};

export default useLayoutEffect;
