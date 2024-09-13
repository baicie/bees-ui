import type { JSX } from 'solid-js';

export function isFragment(child: any): boolean {
  // SolidJS doesn't have a direct Fragment API, so you will have to handle it differently
  // Assuming your fragments are arrays in SolidJS
  return Array.isArray(child);
}

type RenderProps =
  | Record<string, any>
  | ((originProps: Record<string, any>) => Record<string, any> | undefined);

// export const replaceElement = (
//   element: Component,
//   replacement: Component,
//   props?: RenderProps,
// ): JSX.Element => {
//   if (typeof element !== 'function' && typeof element !== 'object') {
//     return replacement;
//   }

//   const mergedProps = typeof props === 'function' ? props(element || {}) : props;
//   return createComponent(replacement, mergedProps || {});
// };

export function cloneElement(element: JSX.Element, _props?: RenderProps): JSX.Element {
  return element;
}
