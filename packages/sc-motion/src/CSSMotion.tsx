import { findDOMNode } from '@bees-ui/sc-util';
import classNames from 'clsx';
import { createEffect, createSignal, JSX, useContext } from 'solid-js';

import { MotionContext } from './context';
import DomWrapper from './DomWrapper';
import useStatus from './hooks/useStatus';
import { isActive } from './hooks/useStepQueue';
import {
  MotionEndEventHandler,
  MotionEventHandler,
  MotionPrepareEventHandler,
  STATUS_NONE,
  STEP_PREPARE,
  STEP_START,
} from './interface';
import { getTransitionName, supportTransition } from './util/motion';

export type CSSMotionConfig =
  | boolean
  | {
      transitionSupport?: boolean;
      /** @deprecated, no need this anymore since `rc-motion` only support latest react */
      forwardRef?: boolean;
    };

// MotionName Type
export type MotionName =
  | string
  | {
      appear?: string;
      enter?: string;
      leave?: string;
      appearActive?: string;
      enterActive?: string;
      leaveActive?: string;
    };

// CSSMotionProps Interface
export interface CSSMotionProps {
  motionName?: MotionName;
  visible?: boolean;
  motionAppear?: boolean;
  motionEnter?: boolean;
  motionLeave?: boolean;
  motionLeaveImmediately?: boolean;
  motionDeadline: number;
  forceRender?: boolean;
  removeOnLeave?: boolean;
  leavedClassName?: string;
  eventProps?: object;
  // Prepare groups
  /** Prepare phase is used for measure element info. It will always trigger even motion is off */
  onAppearPrepare?: MotionPrepareEventHandler;
  /** Prepare phase is used for measure element info. It will always trigger even motion is off */
  onEnterPrepare?: MotionPrepareEventHandler;
  /** Prepare phase is used for measure element info. It will always trigger even motion is off */
  onLeavePrepare?: MotionPrepareEventHandler;

  // Normal motion groups
  onAppearStart?: MotionEventHandler;
  onEnterStart?: MotionEventHandler;
  onLeaveStart?: MotionEventHandler;

  onAppearActive?: MotionEventHandler;
  onEnterActive?: MotionEventHandler;
  onLeaveActive?: MotionEventHandler;

  onAppearEnd?: MotionEndEventHandler;
  onEnterEnd?: MotionEndEventHandler;
  onLeaveEnd?: MotionEndEventHandler;

  // Special
  /** This will always trigger after final visible changed. Even if no motion configured. */
  onVisibleChanged?: (visible: boolean) => void;

  internalRef?: (node: HTMLElement) => void;
  children?: (
    props: {
      visible?: boolean;
      className?: string;
      style?: JSX.CSSProperties;
      [key: string]: any;
    },
    ref: (node: any) => void,
  ) => JSX.Element;
}

// genCSSMotion Function
function genCSSMotion(config: CSSMotionConfig) {
  const transitionSupport = config;

  function isSupportTransition(props: CSSMotionProps, contextMotion?: boolean) {
    return !!(props.motionName && transitionSupport && contextMotion !== false);
  }

  function CSSMotion(props: CSSMotionProps) {
    const {
      visible = true,
      removeOnLeave = true,
      forceRender,
      children,
      motionName,
      leavedClassName,
      eventProps,
    } = props;
    console.log('CSSMotion', props);

    const { motion: contextMotion } = useContext(MotionContext);
    const supportMotion = isSupportTransition(props, contextMotion);
    const [nodeRef, setNodeRef] = createSignal<HTMLElement | null>(null);
    const [wrapperNodeRef, setWrapperNodeRef] = createSignal(null);

    function getDomElement() {
      try {
        // Here we're avoiding call for findDOMNode since it's deprecated
        // in strict mode. We're calling it only when node ref is not
        // an instance of DOM HTMLElement. Otherwise use
        // findDOMNode as a final resort
        return nodeRef() instanceof HTMLElement
          ? nodeRef()
          : findDOMNode<HTMLElement>(wrapperNodeRef());
      } catch (e) {
        // Only happen when `motionDeadline` trigger but element removed.
        return null;
      }
    }

    const [status, statusStep, statusStyle, mergedVisible] = useStatus(
      supportMotion,
      visible,
      getDomElement,
      props,
    );

    const [renderedRef, setRenderedRef] = createSignal(mergedVisible);
    createEffect(() => {
      if (mergedVisible) setRenderedRef(true);
    });

    const setRef = (node: any) => {
      setNodeRef(node);
      if (props.internalRef) props.internalRef(node);
    };

    const mergedProps = { ...eventProps, visible };

    let motionChildren;
    if (!children) {
      motionChildren = null;
    } else if (status() === STATUS_NONE) {
      if (mergedVisible) {
        motionChildren = children({ ...mergedProps }, setRef);
      } else if (!removeOnLeave && renderedRef() && leavedClassName) {
        motionChildren = children({ ...mergedProps, className: leavedClassName }, setRef);
      } else if (forceRender || (!removeOnLeave && !leavedClassName)) {
        motionChildren = children({ ...mergedProps, style: { display: 'none' } }, setRef);
      } else {
        motionChildren = null;
      }
    } else {
      let statusSuffix;
      if (statusStep() === STEP_PREPARE) {
        statusSuffix = 'prepare';
      } else if (isActive(statusStep())) {
        statusSuffix = 'active';
      } else if (statusStep() === STEP_START) {
        statusSuffix = 'start';
      }

      const motionCls = getTransitionName(motionName, `${status}-${statusSuffix}`);

      motionChildren = children(
        {
          ...mergedProps,
          className: classNames(getTransitionName(motionName, status()), {
            [motionCls]: motionCls && statusSuffix,
            [motionName as string]: typeof motionName === 'string',
          }),
          style: statusStyle,
        },
        setRef,
      );
    }
    console.log('motionChildren', motionChildren);

    return (
      <DomWrapper ref={(el: HTMLElement) => setWrapperNodeRef(el)}>{motionChildren}</DomWrapper>
    );
  }

  return CSSMotion;
}

export default genCSSMotion(supportTransition);
