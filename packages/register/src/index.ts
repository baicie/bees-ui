import { createElementType } from './element';
import pregister from './register';
import type {
  ComponentType as uComponentType,
  ConstructableComponent as uConstructableComponent,
  FunctionComponent as uFunctionComponent,
  PCustomElement as uPCustomElement,
  PropDefinition as uPropDefinition,
  PropsDefinitionInput as uPropsDefinitionInput,
} from './utils';
import { normalizePropDefs } from './utils';

export type ComponentType<T> = uComponentType<T>;
export type ConstructableComponent<T> = uConstructableComponent<T>;
export type FunctionComponent<T> = uFunctionComponent<T>;
export type PropsDefinitionInput<T> = uPropsDefinitionInput<T>;
export type PCustomElement = uPCustomElement;
export interface RegisterOptions {
  BaseElement?: typeof HTMLElement;
  extension?: { extends: string };
  customElements?: CustomElementRegistry;
}
export type PropDefinition<T> = uPropDefinition<T>;

export function register<T>(
  tag: string,
  ComponentType: ComponentType<T>,
  props = {} as PropsDefinitionInput<T>,
  options: RegisterOptions = {},
) {
  const { BaseElement = HTMLElement, extension, customElements = window.customElements } = options;
  if (!tag) throw new Error('tag is required to register a Component');
  let ElementType = customElements.get(tag);
  if (ElementType) {
    // Consider disabling this in a production mode
    ElementType.prototype.Component = ComponentType;
    return ElementType;
  }

  ElementType = createElementType(BaseElement, normalizePropDefs(props));
  ElementType.prototype.Component = ComponentType;
  ElementType.prototype.registeredTag = tag;
  customElements.define(tag, ElementType, extension);
  return ElementType;
}

export {
  isConstructor,
  isObject,
  isFunction,
  toAttribute,
  toProperty,
  reloadElement,
} from './utils';
export { getCurrentElement } from './element';
export default register;
export { pregister };
