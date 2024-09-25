import { cloneElement, h, render } from 'preact';
import type {
  PCustomElement,
  PropsDefinition,
} from './utils';
import {
  findSlotParent,
  initializeProps,
  parseAttributeValue,
  propValues,
} from './utils';

let currentElement: HTMLElement & PCustomElement;
export function getCurrentElement() {
  return currentElement;
}

export function createElementType<T>(
  BaseElement: typeof HTMLElement,
  propDefinition: PropsDefinition<T>,
) {
  const propKeys = Object.keys(propDefinition) as (keyof PropsDefinition<T>)[];
  return class CustomElement extends BaseElement implements PCustomElement {
    [prop: string]: any;
    __initialized?: boolean;
    __released: boolean;
    __releaseCallbacks: any[];
    __propertyChangedCallbacks: any[];
    __updating: Record<string, any>;
    _slot: PCustomElement['_slot'];
    props: Record<string, any>;

    static get observedAttributes() {
      return propKeys.map((k) => propDefinition[k].attribute);
    }

    constructor() {
      super();
      this.__initialized = false;
      this.__released = false;
      this.__releaseCallbacks = [];
      this.__propertyChangedCallbacks = [];
      this.__updating = {};
      this._slot = {
        children: [],
      };
      this.props = {};
    }

    connectedCallback() {
      if (this.__initialized) return;
      this.__releaseCallbacks = [];
      this.__propertyChangedCallbacks = [];
      this.__updating = {};
      this._slot = {
        children: [],
      };
      this.props = initializeProps(this as any, propDefinition);
      const props = propValues<T>(this.props as PropsDefinition<T>),
        outerElement = currentElement;
      try {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        currentElement = this;
        this._slot = this.getLightSlots();

        this.__initialized = true;
        this._vdom = h(this.Component, { ...props, ...this._slot }, this._slot.children);
        render(this._vdom, this);
      } finally {
        currentElement = outerElement;
      }
    }

    async disconnectedCallback() {
      // prevent premature releasing when element is only temporarely removed from DOM
      await Promise.resolve();
      if (this.isConnected) return;
      this.__propertyChangedCallbacks.length = 0;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      let callback: Function | null = null;
      while ((callback = this.__releaseCallbacks.pop())) callback(this);
      delete this.__initialized;
      this.__released = true;
      render((this._vdom = null), this);
    }

    attributeChangedCallback(name: string, _oldVal: string, newVal: string) {
      if (!this.__initialized) return;
      if (this.__updating[name]) return;
      name = this.lookupProp(name)!;
      if (name in propDefinition) {
        if (newVal == null && !this[name]) return;
        this[name] = propDefinition[name as keyof T].parse ? parseAttributeValue(newVal) : newVal;
      }
      this._vdom = cloneElement(this._vdom, { ...this.props, ...this._slot });
      render(this._vdom, this);
    }

    lookupProp(attrName: string) {
      if (!propDefinition) return;
      return propKeys.find((k) => attrName === k || attrName === propDefinition[k].attribute) as
        | string
        | undefined;
    }

    addReleaseCallback(fn: () => void) {
      this.__releaseCallbacks.push(fn);
    }

    addPropertyChangedCallback(fn: (name: string, value: any) => void) {
      this.__propertyChangedCallbacks.push(fn);
    }

    getLightSlots() {
      const slots: PCustomElement['_slot'] = {
        children: [],
      };
      const queryNamedSlots = this.querySelectorAll('[slot]') as NodeListOf<HTMLSlotElement>;
      for (const candidate of Array.from(queryNamedSlots)) {
        if (!this.isOwnSlot(candidate)) continue;
        if (!candidate.slot) continue;
        slots[candidate.slot] = candidate;
        this.removeChild(candidate);
      }

      // 将 childNodes 转换为可以渲染的内容，并从 DOM 中移除
      slots['children'] = Array.from(this.childNodes).map((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const textContent = child.textContent;
          this.removeChild(child);
          return textContent;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const outerHTML = child.outerHTML;
          this.removeChild(child);
          return outerHTML;
        }
        return null;
      }).filter(Boolean);

      return slots;
    }

    isOwnSlot(slot: Element) {
      const slotParent = findSlotParent(slot);
      if (slotParent === null) return false;
      return slotParent === this;
    }
  };
}
