import { cloneElement, h, render } from 'preact';

/**
 * @typedef {import('preact').FunctionComponent<any> | import('preact').ComponentClass<any> | import('preact').FunctionalComponent<any>} ComponentDefinition
 * @typedef {HTMLElement & { _vdomComponent: ComponentDefinition, _vdom: ReturnType<typeof import("preact").h> | null }} PreactCustomElement
 */

/**
 * Register a preact component as web-component.
 * @param {ComponentDefinition} Component The preact component to register
 * @param {string} [tagName] The HTML element tag-name (must contain a hyphen and be lowercase)
 * @param {string[]} [propNames] HTML element attributes to observe
 * @example
 * ```ts
 * // use a preact component
 * function PreactComponent({ prop }) {
 *   return <p>Hello {prop}!</p>
 * }
 *
 * register(PreactComponent, 'my-component');
 * register(PreactComponent, 'my-component', ['prop']);
 * ```
 */
export default function register(Component, tagName, propNames) {
  console.log('register', Component, tagName, propNames);

  function PreactElement() {
    const inst = /** @type {PreactCustomElement} */ (
      Reflect.construct(HTMLElement, [], PreactElement)
    );
    inst._vdomComponent = Component;
    return inst;
  }
  PreactElement.prototype = Object.create(HTMLElement.prototype);
  PreactElement.prototype.constructor = PreactElement;
  PreactElement.prototype.connectedCallback = connectedCallback;
  PreactElement.prototype.attributeChangedCallback = attributeChangedCallback;
  PreactElement.prototype.disconnectedCallback = disconnectedCallback;

  propNames = propNames || Component.observedAttributes || Object.keys(Component.propTypes || {});
  PreactElement.observedAttributes = propNames;

  // Keep DOM properties and Preact props in sync
  propNames.forEach((name) => {
    Object.defineProperty(PreactElement.prototype, name, {
      get() {
        return this._vdom.props[name];
      },
      set(v) {
        if (this._vdom) {
          this.attributeChangedCallback(name, null, v);
        } else {
          if (!this._props) this._props = {};
          this._props[name] = v;
          this.connectedCallback();
        }

        // Reflect property changes to attributes if the value is a primitive
        const type = typeof v;
        if (v == null || type === 'string' || type === 'boolean' || type === 'number') {
          this.setAttribute(name, v);
        }
      },
    });
  });

  return customElements.define(
    tagName || Component.tagName || Component.displayName || Component.name,
    PreactElement,
  );
}

/**
 * @this {PreactCustomElement}
 */
function connectedCallback() {
  this._vdom = h(this._vdomComponent, { ...this._props });
  render(this._vdom, this);
}

/**
 * Changed whenever an attribute of the HTML element changed
 * @this {PreactCustomElement}
 * @param {string} name The attribute name
 * @param {unknown} oldValue The old value or undefined
 * @param {unknown} newValue The new value
 */
function attributeChangedCallback(name, oldValue, newValue) {
  if (!this._vdom) return;
  newValue = newValue == null ? undefined : newValue;
  const props = {};
  props[name] = newValue;
  props[toCamelCase(name)] = newValue;
  this._vdom = cloneElement(this._vdom, props);
  render(this._vdom, this);
}

/**
 * @this {PreactCustomElement}
 */
function disconnectedCallback() {
  render((this._vdom = null), this);
}

/**
 * Camel-cases a string
 * @param {string} str The string to transform to camelCase
 * @returns camel case version of the string
 */
function toCamelCase(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}
