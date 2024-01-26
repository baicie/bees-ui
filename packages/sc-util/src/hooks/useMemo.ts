import { createMemo, onCleanup } from 'solid-js';

interface Cache<Value, Condition> {
  condition?: Condition;
  value?: Value;
}

export default function useMemo<Value, Condition = any[]>(
  getValue: () => Value,
  condition: Condition,
  shouldUpdate: (prev: Condition, next: Condition) => boolean,
) {
  const cacheRef: Cache<Value, Condition> = { value: undefined, condition: undefined };

  const result = createMemo(() => {
    if (!('value' in cacheRef) || shouldUpdate(cacheRef.condition!, condition)) {
      cacheRef.value = getValue();
      cacheRef.condition = condition;
    }
    return cacheRef.value;
  });

  // Optionally, you can clean up the cache when the component is unmounted
  onCleanup(() => {
    cacheRef.value = undefined;
    cacheRef.condition = undefined;
  });

  return result;
}
