import { Ref, ComputedRef } from '@vue/reactivity';
import { showWaveEffect } from './use-effect-wave';

export default function useWave(
  node: HTMLElement | null,
  className: Ref<string>,
  wave: ComputedRef<{ disabled?: boolean }>,
): VoidFunction {
  function showWave() {
    if ((wave && wave.value && wave?.value?.disabled) || !node) {
      return;
    }
    showWaveEffect(node, className.value);
  }

  return showWave;
}
