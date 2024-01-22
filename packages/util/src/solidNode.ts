import { Fragment } from 'solid-js/h/jsx-runtime';
import type { AnyObject } from './type';
import type { JSXElement } from 'solid-js';

function isValidElement(obj: any) {
  // 判断是否为对象
  if (typeof obj === 'object' && obj !== null) {
    // Solid.js 元素必须包含 render 函数
    return typeof obj.render === 'function';
  }
  return false;
}

export function isFragment(child: any): boolean {
  return child && isValidElement(child) && child.type === Fragment;
}

type RenderProps = AnyObject | ((originProps: AnyObject) => AnyObject | void);

export function replaceElement(
  element: JSXElement,
  replacement: JSXElement,
  props?: RenderProps,
): JSXElement {
  if (!isValidElement(element)) {
    return replacement;
  }
  return cloneElement(
    element,
    typeof props === 'function' ? props({}) : props,
  );
}

export function cloneElement(element: JSXElement, props?: RenderProps): JSXElement {
  return replaceElement(element, element, props) as JSXElement;
}
