import { raf } from '@bees-ui/sc-util';
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { render } from 'solid-js/web';
import { Transition } from 'solid-transition-group';

import type { ShowWaveEffect } from './interface';
import { getTargetWaveColor } from './util';

function validateNum(value: number) {
  return Number.isNaN(value) ? 0 : value;
}

interface WaveEffectProps {
  className: string;
  target: HTMLElement;
  component?: string;
}

// FIXME: enabled changed to true, but the wave effect is not shown
const WaveEffect = (props: WaveEffectProps) => {
  const { target } = props;
  let divRef: HTMLDivElement;

  const [color, setWaveColor] = createSignal<string | null>(null);
  const [borderRadius, setBorderRadius] = createSignal<number[]>([]);
  const [left, setLeft] = createSignal(0);
  const [top, setTop] = createSignal(0);
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);
  const [_, setEnabled] = createSignal(false);

  const waveStyle = createMemo(() => {
    const style: Record<string, string> = {
      left: `${left()}px`,
      top: `${top()}px`,
      width: `${width()}px`,
      height: `${height()}px`,
      borderRadius: borderRadius()
        .map((radius) => `${radius}px`)
        .join(' '),
    };

    if (color()) {
      style['--wave-color'] = color();
    }

    return style;
  });

  function syncPos() {
    const nodeStyle = getComputedStyle(target);

    // Get wave color from target
    setWaveColor(getTargetWaveColor(target));

    const isStatic = nodeStyle.position === 'static';

    // Rect
    const { borderLeftWidth, borderTopWidth } = nodeStyle;
    setLeft(isStatic ? target.offsetLeft : validateNum(-parseFloat(borderLeftWidth)));
    setTop(isStatic ? target.offsetTop : validateNum(-parseFloat(borderTopWidth)));
    setWidth(target.offsetWidth);
    setHeight(target.offsetHeight);

    // Get border radius
    const {
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
    } = nodeStyle;

    setBorderRadius(
      [
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomRightRadius,
        borderBottomLeftRadius,
      ].map((radius) => validateNum(parseFloat(radius))),
    );
  }

  createEffect(() => {
    if (target) {
      // We need delay to check position here
      // since UI may change after click
      const id = raf(() => {
        syncPos();

        setEnabled(true);
      });

      // Add resize observer to follow size
      let resizeObserver: ResizeObserver;
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(syncPos);

        resizeObserver.observe(target);
      }

      onCleanup(() => {
        raf.cancel(id);
        resizeObserver?.disconnect();
      });
    }
  });

  return (
    <Transition
      appear
      name="wave-motion"
      enterClass="wave-motion-appear"
      enterActiveClass="wave-motion-appear"
      enterToClass="wave-motion-appear wave-motion-appear-active"
    >
      <div ref={divRef} class={props.className} style={waveStyle()} />
    </Transition>
  );
};

const showWaveEffect: ShowWaveEffect = (target, info) => {
  const { component } = info;

  // Skip for unchecked checkbox
  if (component === 'Checkbox' && !target.querySelector<HTMLInputElement>('input')?.checked) {
    return;
  }

  // Create holder
  const holder = document.createElement('div');
  holder.style.position = 'absolute';
  holder.style.left = '0px';
  holder.style.top = '0px';
  target?.insertBefore(holder, target?.firstChild);

  render(() => <WaveEffect {...info} target={target} />, holder);
};

export default showWaveEffect;
