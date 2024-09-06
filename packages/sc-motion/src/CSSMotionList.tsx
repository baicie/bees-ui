import { Component, createEffect, createSignal, For, JSX, JSXElement } from 'solid-js';

import CSSMotion, { CSSMotionProps } from './CSSMotion';
import {
  diffKeys,
  KeyObject,
  parseKeys,
  STATUS_ADD,
  STATUS_KEEP,
  STATUS_REMOVE,
  STATUS_REMOVED,
} from './util/diff';
import { supportTransition } from './util/motion';

const MOTION_PROP_NAMES = [
  'eventProps',
  'visible',
  'children',
  'motionName',
  'motionAppear',
  'motionEnter',
  'motionLeave',
  'motionLeaveImmediately',
  'motionDeadline',
  'removeOnLeave',
  'leavedClassName',
  'onAppearPrepare',
  'onAppearStart',
  'onAppearActive',
  'onAppearEnd',
  'onEnterStart',
  'onEnterActive',
  'onEnterEnd',
  'onLeaveStart',
  'onLeaveActive',
  'onLeaveEnd',
];

export interface CSSMotionListProps
  extends Omit<CSSMotionProps, 'onVisibleChanged' | 'children'>,
    Omit<JSX.HTMLAttributes<any>, 'children'> {
  keys: KeyObject[];
  component?: Component;

  /** This will always trigger after final visible changed. Even if no motion configured. */
  onVisibleChanged?: (visible: boolean, info: { key: React.Key }) => void;
  /** All motion leaves in the screen */
  onAllRemoved?: () => void;
  children?: (
    props: {
      visible?: boolean;
      className?: string;
      style?: JSX.CSSProperties;
      index?: number;
      [key: string]: any;
    },
    ref: (node: any) => void,
  ) => JSXElement;
}

export interface CSSMotionListState {
  keyEntities: KeyObject[];
}

export function genCSSMotionList(_transitionSupport: boolean, CSSMotionComponent = CSSMotion) {
  return (props: CSSMotionListProps) => {
    const [keyEntities, setKeyEntities] = createSignal([]);

    const removeKey = (removeKey: string) => {
      const nextKeyEntities = keyEntities().map((entity) => {
        if (entity.key !== removeKey) return entity;
        return {
          ...entity,
          status: STATUS_REMOVED,
        };
      });
      setKeyEntities(nextKeyEntities);
      return nextKeyEntities.filter(({ status }) => status !== STATUS_REMOVED).length;
    };

    createEffect(() => {
      const parsedKeyObjects = parseKeys(props.keys);
      const mixedKeyEntities = diffKeys(keyEntities(), parsedKeyObjects);

      setKeyEntities(
        mixedKeyEntities.filter((entity) => {
          const prevEntity = keyEntities().find(({ key }) => entity.key === key);

          if (
            prevEntity &&
            prevEntity.status === STATUS_REMOVED &&
            entity.status === STATUS_REMOVE
          ) {
            return false;
          }
          return true;
        }),
      );
    });

    const Component = props.component || 'div';

    const motionProps = {};
    MOTION_PROP_NAMES.forEach((prop) => {
      // @ts-ignore
      motionProps[prop] = props[prop];
    });

    return (
      <Component {...props}>
        <For each={keyEntities()}>
          {({ status, ...eventProps }, index) => {
            const visible = status === STATUS_ADD || status === STATUS_KEEP;
            return (
              <CSSMotionComponent
                {...motionProps}
                // @ts-ignore
                key={eventProps.key}
                visible={visible}
                eventProps={eventProps}
                onVisibleChanged={(changedVisible) => {
                  props.onVisibleChanged?.(changedVisible, { key: eventProps.key });

                  if (!changedVisible) {
                    const restKeysCount = removeKey(eventProps.key);

                    if (restKeysCount === 0 && props.onAllRemoved) {
                      props.onAllRemoved();
                    }
                  }
                }}
              >
                {(motionProps, ref) => props.children({ ...motionProps, index: index() }, ref)}
              </CSSMotionComponent>
            );
          }}
        </For>
      </Component>
    );
  };
}

export default genCSSMotionList(supportTransition);
