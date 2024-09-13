import type { Accessor, Component, JSXElement } from 'solid-js';

/** https://github.com/Microsoft/TypeScript/issues/29729 */
export type LiteralUnion<T extends string> = T | (string & {});

export type AnyObject = Record<PropertyKey, any>;

export type CustomComponent<P = AnyObject> = Component<P> | string;

export type GetProps<T extends Component<any> | object> = T extends Component<infer P>
  ? P
  : T extends object
    ? T
    : never;

export type GetProp<
  T extends Component<any> | object,
  PropName extends keyof GetProps<T>,
> = NonNullable<GetProps<T>[PropName]>;

type ReactRefComponent<Props extends { ref?: Accessor<any> }> = (props: Props) => JSXElement | null;

export type GetRef<T extends ReactRefComponent<any> | Component<any>> = T extends Component<any>
  ? T
  : T extends ReactRefComponent<infer RefType>
    ? RefType
    : never;
