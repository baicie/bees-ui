import { warning } from '@bees-ui/sc-util';
import { onCleanup } from 'solid-js';

const useCleanupRegister = () => {
  const effectCleanups: (() => void)[] = [];
  let cleanupFlag = false;

  function register(fn: () => void) {
    if (cleanupFlag) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          false,
          '[Ant Design CSS-in-JS] You are registering a cleanup function after unmount, which will not have any effect.',
        );
      }
      return;
    }
    effectCleanups.push(fn);
  }

  onCleanup(() => {
    cleanupFlag = true;
    if (effectCleanups.length) {
      effectCleanups.forEach((fn) => fn());
    }
  });

  return register;
};

// const useRun = () => (fn: () => void) => {
//   fn();
// };

const useEffectCleanupRegister = useCleanupRegister;

export default useEffectCleanupRegister;
