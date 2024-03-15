import { ConfigContext } from '@bees-ui/config-provider';
import type { ConfigConsumerProps, CSSProperties } from '@bees-ui/core';
import { clsx as classNames, throttleByAnimationFrame } from '@bees-ui/core';
import ResizeObserver from '@bees-ui/sc-resize-observer';
import { omit } from '@bees-ui/sc-util';
import type { ComponentOptions } from '@bees-ui/type';
import type { JSXElement, ParentProps, Ref } from 'solid-js';
import { createEffect, createSignal, onMount, Show, useContext } from 'solid-js';

import useStyle from './style';
import { getFixedBottom, getFixedTop, getTargetRect } from './utils';

const TRIGGER_EVENTS = [
  'resize',
  'scroll',
  'touchstart',
  'touchmove',
  'touchend',
  'pageshow',
  'load',
] as const;

function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null;
}

// Affix
export interface AffixProps {
  /** Triggered when the specified offset is reached from the top of the window */
  offsetTop?: number;
  /** Triggered when the specified offset is reached from the bottom of the window */
  offsetBottom?: number;
  style?: CSSProperties;
  /** Callback function triggered when fixed state changes */
  onChange?: (affixed?: boolean) => void;
  /** Set the element that Affix needs to listen to its scroll event, the value is a function that returns the corresponding DOM element */
  target?: () => Window | HTMLElement | null;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  children: JSXElement;
  ref?: Ref<JSXElement & AffixRef>;
}

enum AffixStatus {
  None,
  Prepare,
}

interface AffixState {
  affixStyle?: CSSProperties;
  placeholderStyle?: CSSProperties;
  status: AffixStatus;
  lastAffix: boolean;
  prevTarget: Window | HTMLElement | null;
}

interface AffixRef {
  updatePosition?: ReturnType<typeof throttleByAnimationFrame>;
}

const Affix = (props: ParentProps<AffixProps>, { element }: ComponentOptions) => {
  const {
    style,
    offsetTop,
    offsetBottom,
    prefixCls,
    className,
    rootClassName,
    children,
    target,
    onChange,
  } = props;

  const { getPrefixCls, getTargetContainer } = useContext<ConfigConsumerProps>(ConfigContext);

  const affixPrefixCls = getPrefixCls('affix', prefixCls);

  const [lastAffix, setLastAffix] = createSignal(false);
  const [affixStyle, setAffixStyle] = createSignal<CSSProperties>();
  const [placeholderStyle, setPlaceholderStyle] = createSignal<CSSProperties>();

  const [status, setStatus] = createSignal(AffixStatus.None);
  const [timer, setTimer] = createSignal<ReturnType<typeof setTimeout> | null>(null);
  const [prevTarget, setPrevTarget] = createSignal<Window | HTMLElement | null>(null);
  const [prevListener, setPrevListener] = createSignal<EventListener>();

  let fixedNodeRef: Ref<HTMLDivElement> | undefined;

  const targetFunc = target ?? getTargetContainer ?? getDefaultTarget;

  const internalOffsetTop = offsetBottom === undefined && offsetTop === undefined ? 0 : offsetTop;

  // =================== Measure ===================
  const measure = () => {
    if (status() !== AffixStatus.Prepare || !fixedNodeRef || !props.ref || !targetFunc) {
      return;
    }

    const targetNode = targetFunc();
    if (targetNode) {
      const newState: Partial<AffixState> = {
        status: AffixStatus.None,
      };
      const placeholderRect = getTargetRect(props.ref);

      if (
        placeholderRect.top === 0 &&
        placeholderRect.left === 0 &&
        placeholderRect.width === 0 &&
        placeholderRect.height === 0
      ) {
        return;
      }

      const targetRect = getTargetRect(targetNode as any);
      const fixedTop = getFixedTop(placeholderRect, targetRect, internalOffsetTop);
      const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom);

      if (fixedTop !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          top: `${fixedTop}px`,
          width: `${placeholderRect.width}px`,
          height: `${placeholderRect.height}px`,
        };
        newState.placeholderStyle = {
          width: `${placeholderRect.width}px`,
          height: `${placeholderRect.height}px`,
        };
      } else if (fixedBottom !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          bottom: `${fixedBottom}px`,
          width: `${placeholderRect.width}px`,
          height: `${placeholderRect.height}px`,
        };
        newState.placeholderStyle = {
          width: `${placeholderRect.width}px`,
          height: `${placeholderRect.height}px`,
        };
      }

      newState.lastAffix = !!newState.affixStyle;

      if (lastAffix() !== newState.lastAffix) {
        onChange?.(newState.lastAffix);
      }

      setStatus(newState.status!);
      setAffixStyle(newState.affixStyle);
      setPlaceholderStyle(newState.placeholderStyle);
      setLastAffix(newState.lastAffix);
    }
  };

  const prepareMeasure = () => {
    setStatus(AffixStatus.Prepare);
    measure();
    if (process.env.NODE_ENV === 'test') {
      (props as any)?.onTestUpdatePosition?.();
    }
  };

  const updatePosition = throttleByAnimationFrame(() => {
    prepareMeasure();
  });

  const lazyUpdatePosition = throttleByAnimationFrame(() => {
    // Check position change before measure to make Safari smooth
    if (targetFunc && affixStyle) {
      const targetNode = targetFunc();
      if (targetNode && props.ref) {
        const targetRect = getTargetRect(targetNode as any);
        const placeholderRect = getTargetRect(props.ref);
        const fixedTop = getFixedTop(placeholderRect, targetRect, internalOffsetTop);
        const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom);

        if (
          (fixedTop !== undefined && affixStyle()?.top === fixedTop) ||
          (fixedBottom !== undefined && affixStyle()?.bottom === fixedBottom)
        ) {
          return;
        }
      }
    }

    // Directly call prepare measure since it's already throttled.
    prepareMeasure();
  });

  const addListeners = () => {
    const listenerTarget = targetFunc?.();
    if (!listenerTarget) {
      return;
    }
    TRIGGER_EVENTS.forEach((eventName) => {
      if (prevListener()) {
        prevTarget()?.removeEventListener(eventName, prevListener()!);
      }
      listenerTarget?.addEventListener(eventName, lazyUpdatePosition);
    });
    setPrevTarget(listenerTarget);
    setPrevListener(lazyUpdatePosition as any);
  };

  const removeListeners = () => {
    const _timer = timer();
    if (_timer) {
      clearTimeout(_timer);
      setTimer(null);
    }
    const newTarget = targetFunc?.();
    TRIGGER_EVENTS.forEach((eventName) => {
      newTarget?.removeEventListener(eventName, lazyUpdatePosition);
      if (prevListener()) {
        prevTarget()?.removeEventListener(eventName, prevListener()!);
      }
    });
    updatePosition.cancel();
    lazyUpdatePosition.cancel();
  };

  // mount & unmount
  createEffect(() => {
    // [Legacy] Wait for parent component ref has its value.
    // We should use target as directly element instead of function which makes element check hard.
    setTimer(setTimeout(addListeners));
    return () => removeListeners();
  });

  createEffect(() => {
    addListeners();
  });

  createEffect(() => {
    updatePosition();
  });

  onMount(() => {
    // @ts-ignore
    props.ref.updatePosition = updatePosition;
  });

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(affixPrefixCls, element.renderRoot as any);

  const rootCls = classNames(rootClassName, hashId, affixPrefixCls, cssVarCls);

  const mergedCls = classNames({ [rootCls]: affixStyle });

  let otherProps = omit(props, [
    'prefixCls',
    'offsetTop',
    'offsetBottom',
    'target',
    'onChange',
    'rootClassName',
    'ref',
    'children',
  ]);

  if (process.env.NODE_ENV === 'test') {
    otherProps = omit(otherProps, ['onTestUpdatePosition' as any]);
  }

  return wrapCSSVar(
    <ResizeObserver onResize={updatePosition}>
      <div style={style} className={className} ref={(el) => (props.ref = el)} {...otherProps}>
        <Show when={affixStyle()}>
          <div style={placeholderStyle()} aria-hidden="true" />
        </Show>
        <div class={mergedCls} ref={fixedNodeRef} style={affixStyle()}>
          <ResizeObserver onResize={updatePosition}>{children}</ResizeObserver>
        </div>
      </div>
    </ResizeObserver>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Affix.displayName = 'Affix';
}

export default Affix;

export * from './registe';
