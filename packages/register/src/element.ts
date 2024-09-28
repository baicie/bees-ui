import { cloneElement, h, hydrate, render } from 'preact';

import type { PCustomElement, PropsDefinition } from './utils';
import { findSlotParent, initializeProps, parseAttributeValue, propValues } from './utils';

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
    __updateQueue: Record<string, any>;
    __updateScheduled: boolean;

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
      this.__updateQueue = {};
      this.__updateScheduled = false;
    }

    connectedCallback() {
      if (this.__initialized) return;
      this.__releaseCallbacks = [];
      this.__propertyChangedCallbacks = [];
      this.__updating = {};
      this._slot = {
        children: [],
      };
      this._slot = this.getLightSlots();
      this.props = initializeProps(this as any, propDefinition);
      const props = propValues<T>(this.props as PropsDefinition<T>),
        outerElement = currentElement;
      try {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        currentElement = this;
        const event = new CustomEvent('_preact', {
          detail: {},
          bubbles: true,
          cancelable: true,
        });
        this.dispatchEvent(event);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const context = event.detail.context;
        this.__initialized = true;
        this._vdom = h(this.ContextProvider, {
          context,
          children: h(this.Component, { ...props, ...this._slot }, this._slot.children),
        });
        (this.hasAttribute('hydrate') ? hydrate : render)(this._vdom, this);
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

      const propName = this.lookupProp(name);
      if (propName && propDefinition[propName]) {
        this.queueUpdateProps(); // 批量更新
        this.__updateQueue[propName] = newVal; // 将更新放入队列中
      }
    }

    queueUpdateProps() {
      if (!this.__updateScheduled) {
        this.__updateScheduled = true;
        Promise.resolve().then(() => this.batchUpdateProps());
      }
    }

    batchUpdateProps() {
      this.__updateScheduled = false;
      this._vdom = cloneElement(this._vdom, {
        ...this.props,
        ...this._slot,
        ...this.__updateQueue,
      });
      render(this._vdom, this);
      this.__updateQueue = {}; // 清空更新队列
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

    // ToFix do current element children
    getLightSlots() {
      const slots: Record<string, any> = {
        children: [],
      };

      const queryNamedSlots = this.querySelectorAll('[slot]') as NodeListOf<HTMLSlotElement>;

      for (const candidate of Array.from(queryNamedSlots)) {
        if (!this.isOwnSlot(candidate)) continue;
        slots[candidate.slot] = candidate;
      }

      // 父组件不再直接递归处理子节点，而是简单收集节点并交给子组件处理
      slots['children'] = Array.from(this.childNodes)
        .map((child) => {
          if (child.nodeType === Node.ELEMENT_NODE && (child as any).processChildNodes) {
            return (child as any).processChildNodes();
          } else {
            return child.nodeType === Node.TEXT_NODE ? child.textContent : null;
          }
        })
        .filter(Boolean);

      return slots;
    }

    isOwnSlot(slot: Element) {
      const slotParent = findSlotParent(slot);
      if (slotParent === null) return false;
      return slotParent === this;
    }

    ContextProvider(props: Record<string, any>) {
      this.getChildContext = () => props.context;
      // eslint-disable-next-line no-unused-vars
      const { context, children, ...rest } = props;
      return cloneElement(children, rest);
    }
  };
}
