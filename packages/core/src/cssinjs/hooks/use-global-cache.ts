import StyleContext, { useStyleContext } from '../style-context';
import type { KeyType } from '../cache';
import useHMR from './use-HMR';
import { shallowRef, effect, ShallowRef, Ref } from '@vue/reactivity';

export default function useClientCache<CacheType>(
  prefix: string,
  keyPath: Ref<KeyType[]>,
  cacheFn: () => CacheType,
  onCacheRemove?: (cache: CacheType, fromHMR: boolean) => void,
): ShallowRef<CacheType | undefined> {
  const styleContext = useStyleContext(StyleContext);
  const fullPathStr = shallowRef('');
  const res = shallowRef<CacheType>();
  effect(() => {
    fullPathStr.value = [prefix, ...keyPath.value].join('%');
  });
  const HMRUpdate = useHMR();
  const clearCache = (pathStr: string) => {
    styleContext.cache.update(pathStr, (prevCache) => {
      const [times = 0, cache] = prevCache || [];
      const nextCount = times - 1;
      if (nextCount === 0) {
        onCacheRemove?.(cache, false);
        return null;
      }

      return [times - 1, cache];
    });
  };

  effect(() => {
    if (fullPathStr) clearCache(fullPathStr.value);
    // Create cache
    styleContext.cache.update(fullPathStr.value, (prevCache) => {
      const [times = 0, cache] = prevCache || [];

      // HMR should always ignore cache since developer may change it
      let tmpCache = cache;
      if (process.env.NODE_ENV !== 'production' && cache && HMRUpdate) {
        onCacheRemove?.(tmpCache, HMRUpdate);
        tmpCache = null;
      }
      const mergedCache = tmpCache || cacheFn();

      return [times + 1, mergedCache];
    });
    res.value = styleContext.cache.get(fullPathStr.value)![1];
  });

  return res;
}
