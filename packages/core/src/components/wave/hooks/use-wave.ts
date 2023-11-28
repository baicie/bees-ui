export default function useWave(el, disabled: boolean) {
  function showWave() {
    if (!el || disabled) return;

    // show;
  }

  return showWave;
}

export function showWaveEffect(node: HTMLElement, className: string) {
  console.log(className);

  const holder = document.createElement('div');
  holder.style.position = 'absolute';
  holder.style.left = `0px`;
  holder.style.top = `0px`;
  node?.insertBefore(holder, node?.firstChild);

  // return

  // render(<WaveEffect target={node} className={className} />, holder);
}