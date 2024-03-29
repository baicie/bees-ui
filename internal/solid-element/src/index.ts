/* eslint-disable no-redeclare */
import type {
  ComponentOptions,
  FunctionComponent,
  ICustomElement,
  ComponentType as mComponentType,
  PropsDefinitionInput,
} from '@bees-ui/component-register';
import { register } from '@bees-ui/component-register';
import { createRoot, createSignal } from 'solid-js';
import { insert } from 'solid-js/web';

export { hot, getCurrentElement, noShadowDOM } from '@bees-ui/component-register';
export type { ICustomElement, ComponentOptions };
export type ComponentType<T> = mComponentType<T>;

function createProps<T extends object>(raw: T) {
  const keys = Object.keys(raw) as (keyof T)[];
  const props = {};
  for (let i = 0; i < keys.length; i++) {
    const [get, set] = createSignal(raw[keys[i]]);
    Object.defineProperty(props, keys[i], {
      get,
      set(v) {
        set(() => v);
      },
    });
  }
  return props as T;
}

function lookupContext(el: ICustomElement & { _$owner?: any }) {
  if (el.assignedSlot && el.assignedSlot._$owner) return el.assignedSlot._$owner;
  let next: Element & { _$owner?: any } = el.parentNode;
  while (
    next &&
    !next._$owner &&
    !(next.assignedSlot && (next.assignedSlot as Element & { _$owner?: any })._$owner)
  )
    next = next.parentNode as Element;
  return next && next.assignedSlot
    ? (next.assignedSlot as Element & { _$owner?: any })._$owner
    : el._$owner;
}

function withSolid<T extends object>(ComponentType: ComponentType<T>): ComponentType<T> {
  return (rawProps: T, options: ComponentOptions) => {
    const { element } = options as {
      element: ICustomElement & { _$owner?: any };
    };
    return createRoot((dispose: Function) => {
      const props = createProps<T>(rawProps);

      element.addPropertyChangedCallback((key: string, val: any) => (props[key as keyof T] = val));
      element.addReleaseCallback(() => {
        element.renderRoot.textContent = '';
        dispose();
      });

      const comp = (ComponentType as FunctionComponent<T>)(props as T, options);
      return insert(element.renderRoot, comp);
    }, lookupContext(element));
  };
}

function customElement<T extends object>(
  tag: string,
  ComponentType: ComponentType<T>,
): (ComponentType: ComponentType<T>) => any;
function customElement<T extends object>(
  tag: string,
  props: PropsDefinitionInput<T>,
  ComponentType: ComponentType<T>,
): (ComponentType: ComponentType<T>) => any;
function customElement<T extends object>(
  tag: string,
  props: PropsDefinitionInput<T> | ComponentType<T>,
  ComponentType?: ComponentType<T>,
): (ComponentType: ComponentType<T>) => any {
  if (arguments.length === 2) {
    ComponentType = props as ComponentType<T>;
    props = {} as PropsDefinitionInput<T>;
  }
  console.log('ComponentType', withSolid(ComponentType!));

  // @ts-ignore
  return register<T>(tag, props as PropsDefinitionInput<T>)(withSolid(ComponentType!));
}

export { withSolid, customElement };
