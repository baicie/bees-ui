import { WaveEffect } from './wave-effect';

export function showWaveEffect(node: HTMLElement, className: string) {
  console.log('showWaveEffect');

  const holder = document.createElement('div');
  holder.style.position = 'absolute';
  holder.style.left = `0px`;
  holder.style.top = `0px`;
  node?.insertBefore(holder, node?.firstChild);

  const wave = document.createElement('bees-wave-effect') as unknown as WaveEffect;
  wave.target = node;
  wave.myClassName = className;

  holder.appendChild(wave as unknown as Node);
}
