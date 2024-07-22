import { useEvent } from '@bees-ui/sc-util';
import { Accessor, createEffect, createMemo, createSignal, JSX, onCleanup } from 'solid-js';

import type { CSSMotionProps } from '../CSSMotion';
import type { MotionEvent, MotionStatus, StepStatus } from '../interface';
import {
  STATUS_APPEAR,
  STATUS_ENTER,
  STATUS_LEAVE,
  STATUS_NONE,
  STEP_ACTIVE,
  STEP_PREPARE,
  STEP_PREPARED,
  STEP_START,
} from '../interface';
import useDomMotionEvents from './useDomMotionEvents';
import useStepQueue, { DoStep, isActive, SkipStep } from './useStepQueue';

export default function useStatus(
  supportMotion: boolean,
  visible: boolean,
  getElement: () => HTMLElement | null,
  {
    motionEnter = true,
    motionAppear = true,
    motionLeave = true,
    motionDeadline,
    motionLeaveImmediately,
    onAppearPrepare,
    onEnterPrepare,
    onLeavePrepare,
    onAppearStart,
    onEnterStart,
    onLeaveStart,
    onAppearActive,
    onEnterActive,
    onLeaveActive,
    onAppearEnd,
    onEnterEnd,
    onLeaveEnd,
    onVisibleChanged,
  }: CSSMotionProps,
): [Accessor<MotionStatus>, Accessor<StepStatus>, JSX.CSSProperties, boolean] {
  const [asyncVisible, setAsyncVisible] = createSignal<boolean>();
  const [status, setStatus] = createSignal<MotionStatus>(STATUS_NONE);
  const [style, setStyle] = createSignal<JSX.CSSProperties | undefined | null>(null);

  const [mountedRef, setMountedRef] = createSignal(false);
  const [deadlineRef, setDeadlineRef] = createSignal<number | null>(null);

  const getDomElement = () => getElement();

  const [activeRef, setActiveRef] = createSignal(false);

  function updateMotionEndStatus() {
    setStatus(STATUS_NONE);
    setStyle(null);
  }

  const onInternalMotionEnd = useEvent((event: MotionEvent) => {
    if (status() === STATUS_NONE) return;

    const element = getDomElement();
    if (event && !event.deadline && event.target !== element) return;

    const currentActive = activeRef();
    let canEnd: boolean = false;
    console.log('onInternalMotionEnd', status(), currentActive);

    if (status() === STATUS_APPEAR && currentActive) {
      canEnd = onAppearEnd?.(element, event);
    } else if (status() === STATUS_ENTER && currentActive) {
      canEnd = onEnterEnd?.(element, event);
    } else if (status() === STATUS_LEAVE && currentActive) {
      canEnd = onLeaveEnd?.(element, event);
    }

    if (currentActive && canEnd !== false) {
      updateMotionEndStatus();
    }
  });

  const [patchMotionEvents] = useDomMotionEvents(onInternalMotionEnd);

  const getEventHandlers = (targetStatus: MotionStatus) => {
    switch (targetStatus) {
      case STATUS_APPEAR:
        return {
          [STEP_PREPARE]: onAppearPrepare,
          [STEP_START]: onAppearStart,
          [STEP_ACTIVE]: onAppearActive,
        };
      case STATUS_ENTER:
        return {
          [STEP_PREPARE]: onEnterPrepare,
          [STEP_START]: onEnterStart,
          [STEP_ACTIVE]: onEnterActive,
        };
      case STATUS_LEAVE:
        return {
          [STEP_PREPARE]: onLeavePrepare,
          [STEP_START]: onLeaveStart,
          [STEP_ACTIVE]: onLeaveActive,
        };
      default:
        return {};
    }
  };

  const eventHandlers = createMemo(() => getEventHandlers(status()));

  const [startStep, step] = useStepQueue(status(), !supportMotion, (newStep) => {
    if (newStep === STEP_PREPARE) {
      const onPrepare = eventHandlers()[STEP_PREPARE];
      if (!onPrepare) {
        return SkipStep;
      }
      return onPrepare(getDomElement());
    }

    if (step() in eventHandlers()) {
      // @ts-ignore
      setStyle(eventHandlers()[step]?.(getDomElement(), null) || null);
    }

    if (step() === STEP_ACTIVE && status() !== STATUS_NONE) {
      patchMotionEvents(getDomElement());
      console.log('patchMotionEvents', motionDeadline);
      if (motionDeadline > 0) {
        clearTimeout(deadlineRef());
        const timer = setTimeout(() => {
          onInternalMotionEnd({
            deadline: true,
          } as MotionEvent);
        }, motionDeadline) as unknown as number;
        setDeadlineRef(timer);
      }
    }

    if (step() === STEP_PREPARED) {
      updateMotionEndStatus();
    }

    return DoStep;
  });

  const active = isActive(step());
  setActiveRef(active);

  createEffect(() => {
    setAsyncVisible(visible);
    const isMounted = mountedRef();
    setMountedRef(true);

    let nextStatus: MotionStatus;

    if (!isMounted && visible && motionAppear) {
      nextStatus = STATUS_APPEAR;
    }
    if (isMounted && visible && motionEnter) {
      nextStatus = STATUS_ENTER;
    }
    if (
      (isMounted && !visible && motionLeave) ||
      (!isMounted && motionLeaveImmediately && !visible && motionLeave)
    ) {
      nextStatus = STATUS_LEAVE;
    }

    const nextEventHandlers = getEventHandlers(nextStatus);

    if (nextStatus && (supportMotion || nextEventHandlers[STEP_PREPARE])) {
      setStatus(nextStatus);
      startStep();
    } else {
      setStatus(STATUS_NONE);
    }
  });

  createEffect(() => {
    if (
      (status() === STATUS_APPEAR && !motionAppear) ||
      (status() === STATUS_ENTER && !motionEnter) ||
      (status() === STATUS_LEAVE && !motionLeave)
    ) {
      setStatus(STATUS_NONE);
    }
  });

  onCleanup(() => {
    setMountedRef(false);
    clearTimeout(deadlineRef());
  });

  const [firstMountChangeRef, setFirstMountChangeRef] = createSignal(false);
  createEffect(() => {
    if (asyncVisible()) {
      setFirstMountChangeRef(true);
    }

    if (asyncVisible() !== undefined && status() === STATUS_NONE) {
      if (firstMountChangeRef() || asyncVisible()) {
        onVisibleChanged?.(asyncVisible());
      }
      setFirstMountChangeRef(true);
    }
  });

  let mergedStyle = style();
  if (eventHandlers()[STEP_PREPARE] && step() === STEP_START) {
    mergedStyle = {
      transition: 'none',
      ...mergedStyle,
    };
  }

  return [status, step, mergedStyle, asyncVisible() ?? visible];
}
