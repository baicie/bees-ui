export interface ICustomElement {
  [prop: string]: any;
  __initialized?: boolean;
  __released: boolean;
  __releaseCallbacks: any[];
  __propertyChangedCallbacks: any[];
  __updating: { [prop: string]: any };
  props: { [prop: string]: any };
  lookupProp(attrName: string): string | undefined;
  renderRoot: Element | Document | ShadowRoot | DocumentFragment;
  addReleaseCallback(fn: () => void): void;
  addPropertyChangedCallback(fn: (name: string, value: any) => void): void;
}

export interface ComponentOptions {
  element: ICustomElement;
}
