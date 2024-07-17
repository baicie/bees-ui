import CSSMotion from '@bees-ui/sc-motion/src/index';
import { raf } from '@bees-ui/sc-util';
import classNames from 'clsx';
import { createSignal, onCleanup, onMount } from 'solid-js';
import { render } from 'solid-js/web';

import { ShowWaveEffect, TARGET_CLS } from './interface';
import { getTargetWaveColor } from './util';

function validateNum(value: number) {
  return Number.isNaN(value) ? 0 : value;
}

export interface WaveEffectProps {
  className: string;
  target: HTMLElement;
  component?: string;
}

const WaveEffect = (props: WaveEffectProps) => {
  const { className, target, component } = props;
  let divRef: HTMLDivElement;

  const [color, setWaveColor] = createSignal(null);
  const [borderRadius, setBorderRadius] = createSignal([]);
  const [left, setLeft] = createSignal(0);
  const [top, setTop] = createSignal(0);
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);
  const [enabled, setEnabled] = createSignal(false);

  const waveStyle = () => {
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
  };

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

  onMount(() => {
    if (target) {
      const id = raf(() => {
        syncPos();
        setEnabled(true);
      });

      console.log('id', id);

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
  console.log('WaveEffect', enabled());

  // if (!enabled()) {
  //   return null;
  // }

  const isSmallComponent =
    (component === 'Checkbox' || component === 'Radio') && target?.classList.contains(TARGET_CLS);

  return (
    <CSSMotion
      visible
      motionAppear
      motionName="wave-motion"
      motionDeadline={5000}
      onAppearEnd={(_, event) => {
        if (event.deadline || (event as TransitionEvent).propertyName === 'opacity') {
          const holder = divRef?.parentElement;
          render(null, holder);
          holder?.remove();
        }
        return false;
      }}
    >
      {({ className: motionClassName }, ref) => (
        <div
          ref={(el) => {
            divRef = el;
            ref(el);
          }}
          class={classNames(className, motionClassName, { 'wave-quick': isSmallComponent })}
          style={waveStyle()}
        />
      )}
    </CSSMotion>
  );
};

const showWaveEffect: ShowWaveEffect = (target, info) => {
  const { component } = info;

  // Skip for unchecked checkbox
  if (component === 'Checkbox' && !target.querySelector('input')?.checked) {
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
