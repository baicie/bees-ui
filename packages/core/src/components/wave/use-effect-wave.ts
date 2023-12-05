import { WaveEffect } from './wave-effect';

export function showWaveEffect(node: HTMLElement, className: string) {
  const holder = document.createElement('bees-wave');
  holder.style.position = 'absolute';
  holder.style.left = `0px`;
  holder.style.top = `0px`;
  node.parentNode?.appendChild(holder);

  const wave = document.createElement('bees-wave-effect') as unknown as WaveEffect;
  wave.target = node;
  wave.myClassName = className;

  holder.appendChild(wave as unknown as Node);
}
