import StyleContext, { useStyleContext } from '../style-context';
import type { KeyType } from '../cache';
import useHMR from './use-HMR';
import { Accessor, createEffect, createSignal } from 'solid-js';

export default function useClientCache<CacheType>(
  prefix: string,
  keyPath: Accessor<KeyType[]>,
  cacheFn: () => CacheType,
  onCacheRemove?: (cache: CacheType, fromHMR: boolean) => void,
): Accessor<CacheType | undefined> {
  const styleContext = useStyleContext();
  const [fullPathStr, setFullPathStr] = createSignal('');
  const [res, setRes] = createSignal<CacheType>();
  createEffect(() => {
    setFullPathStr([prefix, ...keyPath()].join('%'))
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

  createEffect(() => {
    if (fullPathStr) clearCache(fullPathStr());
    // Create cache
    styleContext.cache.update(fullPathStr(), (prevCache) => {
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
    setRes(styleContext.cache.get(fullPathStr())![1])
  });

  return res;
}
