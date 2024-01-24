import { ComponentType } from "solid-element";

/** https://github.com/Microsoft/TypeScript/issues/29729 */
export type LiteralUnion<T extends string> = T | (string & {});

export type AnyObject = Record<PropertyKey, any>;

export type CustomComponent<P = AnyObject> = ComponentType<P> | string;

export type GetProps<T extends ComponentType<any> | object> = T extends ComponentType<
  infer P
>
  ? P
  : T extends object
  ? T
  : never;

export type GetProp<
  T extends ComponentType<any> | object,
  PropName extends keyof GetProps<T>,
> = NonNullable<GetProps<T>[PropName]>;


