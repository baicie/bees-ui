import { effect, reactive } from '@vue/reactivity';
import { inject, provide } from './store';

function createContext<T extends Record<string, any>>(defaultValue?: T) {
  const contextKey = Symbol('contextKey');
  const useProvide = (props: T, newProps?: T) => {
    const mergedProps = reactive<T>({} as T);
    provide(contextKey, mergedProps);
    effect(() => {
      Object.assign(mergedProps, props, newProps || {});
    });
    return mergedProps;
  };
  const useInject = () => {
    return inject(contextKey, defaultValue as T) || ({} as T);
  };
  return {
    useProvide,
    useInject,
  };
}

export default createContext;
