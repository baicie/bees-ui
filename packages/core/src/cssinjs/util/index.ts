import Theme from '@cssinjs/theme/theme';

// Create a cache for memo concat
type NestWeakMap<T> = WeakMap<object, NestWeakMap<T> | T>;
const resultCache: NestWeakMap<object> = new WeakMap();
const RESULT_VALUE = {};

export function memoResult<T extends object, R>(callback: () => R, deps: T[]): R {
  let current: WeakMap<any, any> = resultCache;
  for (let i = 0; i < deps.length; i += 1) {
    const dep = deps[i];
    if (!current.has(dep)) {
      current.set(dep, new WeakMap());
    }
    current = current.get(dep)!;
  }

  if (!current.has(RESULT_VALUE)) {
    current.set(RESULT_VALUE, callback());
  }

  return current.get(RESULT_VALUE);
}

// Create a cache here to avoid always loop generate
const flattenTokenCache = new WeakMap<any, string>();

/**
 * Flatten token to string, this will auto cache the result when token not change
 */
export function flattenToken(token: any) {
  let str = flattenTokenCache.get(token) || '';

  if (!str) {
    Object.keys(token).forEach((key) => {
      const value = token[key];
      str += key;
      if (value instanceof Theme) {
        str += value.id;
      } else if (value && typeof value === 'object') {
        str += flattenToken(value);
      } else {
        str += value;
      }
    });

    // Put in cache
    flattenTokenCache.set(token, str);
  }
  return str;
}
