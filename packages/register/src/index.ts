import Element from './element';
export * from './props';
export * from './types';
import { render } from "solid-js/web";

export default class extends Element {
  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    render(null, this.renderRoot);
  }
  renderer() {
    render(this.render(), this.renderRoot);
  }
}

export function h(name, props, ...chren) {
  if (name.prototype instanceof HTMLElement) {
    name = getName(define(name));
  }
  return createElement(name, props, ...chren);
}

const symRef = Symbol();
export function setProps(domProps, refCallback?) {
  refCallback = refCallback || (refCallback = e => { });
  return (
    refCallback[symRef] ||
    (refCallback[symRef] = e => {
      refCallback(e);
      if (e) {
        Object.assign(e, domProps);
      }
    })
  );
}
