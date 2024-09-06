import { createEffect, createSignal, onCleanup } from 'solid-js';

import type { InputRef } from '../Input';

export default function useRemovePasswordTimeout(
  inputRef: { current?: InputRef },
  triggerOnMount?: boolean,
) {
  const [removePasswordTimeouts, setRemovePasswordTimeouts] = createSignal<
    ReturnType<typeof setTimeout>[]
  >([]);

  const removePasswordTimeout = () => {
    const timer = setTimeout(() => {
      if (
        inputRef.current?.input &&
        inputRef.current.input.getAttribute('type') === 'password' &&
        inputRef.current.input.hasAttribute('value')
      ) {
        inputRef.current.input.removeAttribute('value');
      }
    });
    setRemovePasswordTimeouts((prev) => [...prev, timer]);
  };

  createEffect(() => {
    if (triggerOnMount) {
      removePasswordTimeout();
    }

    onCleanup(() => {
      removePasswordTimeouts().forEach((timer) => {
        if (timer) {
          clearTimeout(timer);
        }
      });
    });
  });

  return removePasswordTimeout;
}
