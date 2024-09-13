import type {
  ConstructableComponent,
  FunctionComponent,
  ICustomElement,
  PropsDefinition,
} from './utils';
import {
  findSlotParent,
  initializeProps,
  isConstructor,
  parseAttributeValue,
  propValues,
} from './utils';

let currentElement: HTMLElement & ICustomElement;
export function getCurrentElement() {
  return currentElement;
}

export function createElementType<T>(
  BaseElement: typeof HTMLElement,
  propDefinition: PropsDefinition<T>,
) {
  const propKeys = Object.keys(propDefinition) as (keyof PropsDefinition<T>)[];
  return class CustomElement extends BaseElement implements ICustomElement {
    [prop: string]: any;
    __initialized?: boolean;
    __released: boolean;
    __releaseCallbacks: any[];
    __propertyChangedCallbacks: any[];
    __updating: Record<string, any>;
    _slot: ICustomElement['_slot'];
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
        default: [],
      };
      this.props = {};
    }

    connectedCallback() {
      if (this.__initialized) return;
      this.__releaseCallbacks = [];
      this.__propertyChangedCallbacks = [];
      this.__updating = {};
      this._slot = {
        default: [],
      };
      this.props = initializeProps(this as any, propDefinition);
      const props = propValues<T>(this.props as PropsDefinition<T>),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        ComponentType = this.Component as Function | (new (...args: any[]) => any),
        outerElement = currentElement;
      try {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        currentElement = this;
        this._slot = this.getLightSlots();

        this.__initialized = true;
        if (isConstructor(ComponentType))
          new (ComponentType as ConstructableComponent<T>)(props, {
            element: this as ICustomElement,
            slots: this._slot,
          });
        else
          (ComponentType as FunctionComponent<T>)(props, {
            element: this as ICustomElement,
            slots: this._slot,
          });
      } finally {
        currentElement = outerElement;
      }
    }

    async disconnectedCallback() {
      // prevent premature releasing when element is only temporarely removed from DOM
      await Promise.resolve();
      if (this.isConnected) return;
      this.__propertyChangedCallbacks.length = 0;
      let callback = null;
      while ((callback = this.__releaseCallbacks.pop())) callback(this);
      delete this.__initialized;
      this.__released = true;
    }

    attributeChangedCallback(name: string, _oldVal: string, newVal: string) {
      if (!this.__initialized) return;
      if (this.__updating[name]) return;
      name = this.lookupProp(name)!;
      if (name in propDefinition) {
        if (newVal == null && !this[name]) return;
        this[name] = propDefinition[name as keyof T].parse ? parseAttributeValue(newVal) : newVal;
      }
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
      const slots: ICustomElement['_slot'] = {
        default: [],
      };
      const queryNamedSlots = this.querySelectorAll('[slot]') as NodeListOf<HTMLSlotElement>;
      for (const candidate of Array.from(queryNamedSlots)) {
        if (!this.isOwnSlot(candidate)) continue;
        if (!candidate.slot) continue;
        slots[candidate.slot] = candidate;
        this.removeChild(candidate);
      }

      slots['default'] = Array.from(this.childNodes) as HTMLElement[];
      return slots;
    }

    isOwnSlot(slot: Element) {
      const slotParent = findSlotParent(slot);
      if (slotParent === null) return false;
      return slotParent === this;
    }
  };
}
