import { warning } from '@baicie/sc-util';

const fullClone = {
  ...React,
};
const { useInsertionEffect } = fullClone;

// DO NOT register functions in useEffect cleanup function, or functions that registered will never be called.
const useCleanupRegister = (deps?: React.DependencyList) => {
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

  React.useEffect(() => {
    // Compatible with strict mode
    cleanupFlag = false;
    return () => {
      cleanupFlag = true;
      if (effectCleanups.length) {
        effectCleanups.forEach((fn) => fn());
      }
    };
  }, deps);

  return register;
};

const useRun = () => function (fn: () => void) {
  fn();
};

// Only enable register in React 18
const useEffectCleanupRegister =
  typeof useInsertionEffect !== 'undefined' ? useCleanupRegister : useRun;

export default useEffectCleanupRegister;
