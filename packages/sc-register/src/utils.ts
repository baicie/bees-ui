export interface PropDefinition<T> {
  value: T;
  attribute: string;
  notify: boolean;
  reflect: boolean;
  parse?: boolean;
}

type ICustomElementSlot = HTMLSlotElement | HTMLElement[];

export interface ICustomElement {
  [prop: string]: any;
  __initialized?: boolean;
  __released: boolean;
  __releaseCallbacks: any[];
  __propertyChangedCallbacks: any[];
  __updating: Record<string, any>;
  _slot: {
    default: ICustomElementSlot;
    [key: string]: ICustomElementSlot;
  };
  props: Record<string, any>;
  lookupProp(attrName: string): string | undefined;
  addReleaseCallback(fn: () => void): void;
  addPropertyChangedCallback(fn: (name: string, value: any) => void): void;
}
export type UpdateableElement<T> = HTMLElement & ICustomElement & T;
export interface ComponentOptions {
  element: ICustomElement;
  slots?: ICustomElement['_slot'];
}
export type ConstructableComponent<T> = new (props: T, options: ComponentOptions) => unknown;
export type FunctionComponent<T> = (props: T, options: ComponentOptions) => unknown;
export type PropsDefinitionInput<T> = {
  [P in keyof T]: PropDefinition<T[P]> | T[P];
};
export type PropsDefinition<T> = {
  [P in keyof T]: PropDefinition<T[P]>;
};
export type ComponentType<T> = FunctionComponent<T> | ConstructableComponent<T>;

function cloneProps<T>(props: PropsDefinition<T>) {
  const propKeys = Object.keys(props) as (keyof PropsDefinition<T>)[];
  return propKeys.reduce(
    (memo, k) => {
      const prop = props[k];
      memo[k] = Object.assign({}, prop);
      if (isObject(prop.value) && !isFunction(prop.value) && !Array.isArray(prop.value))
        memo[k].value = Object.assign({}, prop.value);
      if (Array.isArray(prop.value)) memo[k].value = prop.value.slice(0) as unknown as T[keyof T];
      return memo;
    },
    {} as PropsDefinition<T>,
  );
}

export function normalizePropDefs<T>(props: PropsDefinitionInput<T>): PropsDefinition<T> {
  if (!props) return {} as PropsDefinition<T>;
  const propKeys = Object.keys(props) as (keyof PropsDefinition<T>)[];
  return propKeys.reduce(
    (memo, k) => {
      const v = props[k];
      memo[k] = !(isObject(v) && 'value' in (v as object))
        ? ({ value: v } as unknown as PropDefinition<T[keyof T]>)
        : (v as PropDefinition<T[keyof T]>);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      memo[k].attribute || (memo[k].attribute = toAttribute(k as string));
      memo[k].parse = 'parse' in memo[k] ? memo[k].parse : typeof memo[k].value !== 'string';
      return memo;
    },
    {} as PropsDefinition<T>,
  );
}

export function propValues<T>(props: PropsDefinition<T>) {
  const propKeys = Object.keys(props) as (keyof PropsDefinition<T>)[];
  return propKeys.reduce((memo, k) => {
    memo[k] = props[k].value;
    return memo;
  }, {} as T);
}

export function initializeProps<T>(
  element: UpdateableElement<T>,
  propDefinition: PropsDefinition<T>,
) {
  const props = cloneProps(propDefinition),
    propKeys = Object.keys(propDefinition) as (keyof PropsDefinition<T>)[];
  propKeys.forEach((key) => {
    const prop = props[key],
      attr = element.getAttribute(prop.attribute),
      value = element[key];
    if (attr !== null) {
      prop.value = prop.parse ? (attr === '' ? true : parseAttributeValue(attr)) : attr;
    }
    if (value != null) {
      prop.value = Array.isArray(value) ? value.slice(0) : value;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    prop.reflect && reflect(element, prop.attribute, prop.value, !!prop.parse);
    Object.defineProperty(element, key, {
      get() {
        return prop.value;
      },
      set(val) {
        const oldValue = prop.value;
        prop.value = val;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        prop.reflect && reflect(this, prop.attribute, prop.value, !!prop.parse);
        for (let i = 0, l = this.__propertyChangedCallbacks.length; i < l; i++) {
          this.__propertyChangedCallbacks[i](key, val, oldValue);
        }
      },
      enumerable: true,
      configurable: true,
    });
  });
  return props;
}

export function parseAttributeValue(value: string) {
  if (!value) return;
  try {
    return JSON.parse(value);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return value;
  }
}

export function reflect<T>(
  node: UpdateableElement<T>,
  attribute: string,
  value: any,
  parse: boolean,
) {
  if (value == null || value === false) return node.removeAttribute(attribute);
  let reflect = parse ? JSON.stringify(value) : value;
  node.__updating[attribute] = true;
  if (reflect === 'true') reflect = '';
  node.setAttribute(attribute, reflect);
  Promise.resolve().then(() => delete node.__updating[attribute]);
}

export function toAttribute(propName: string) {
  return propName
    .replace(/\.?([A-Z]+)/g, (_, y) => '-' + y.toLowerCase())
    .replace('_', '-')
    .replace(/^-/, '');
}

export function toProperty(attr: string) {
  // eslint-disable-next-line regexp/no-unused-capturing-group
  return attr.toLowerCase().replace(/(-)([a-z])/g, (test) => test.toUpperCase().replace('-', ''));
}

export function isObject(obj: any) {
  return obj != null && (typeof obj === 'object' || typeof obj === 'function');
}

export function isFunction(val: any) {
  return Object.prototype.toString.call(val) === '[object Function]';
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isConstructor(f: Function) {
  return typeof f === 'function' && f.toString().indexOf('class') === 0;
}

export function reloadElement(node: ICustomElement) {
  let callback = null;
  while ((callback = node.__releaseCallbacks.pop())) callback(node);
  delete node.__initialized;
  node.renderRoot.textContent = '';
  node.connectedCallback();
}

export function findSlotParent(slot: Element) {
  let parentEl = slot.parentElement;
  while (parentEl) {
    if (parentEl.tagName.indexOf('-') !== -1) return parentEl;
    parentEl = parentEl.parentElement;
  }
  return null;
}
