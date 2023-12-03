import { showWaveEffect } from './use-effect-wave';

export default function useWave(
  node: HTMLElement | null,
  className: string,
  wave: {
    disabled?: boolean;
  },
): VoidFunction {
  function showWave() {
    if (wave?.disabled || !node) {
      return;
    }

    showWaveEffect(node, className);
  }

  return showWave;
}
