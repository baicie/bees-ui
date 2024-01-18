
import { cloneElement, isFragment } from '@baicie/util';
import type { BaseButtonProps, LegacyButtonType } from './button';
import type { JSXElement } from 'solid-js';

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
export const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);

export function convertLegacyProps(
  type?: LegacyButtonType,
): Pick<BaseButtonProps, 'danger' | 'type'> {
  if (type === 'danger') {
    return { danger: true };
  }
  return { type };
}

export function isString(str: any): str is string {
  return typeof str === 'string';
}

export function isUnBorderedButtonType(type?: ButtonType) {
  return type === 'text' || type === 'link';
}

function splitCNCharsBySpace(child: JSXElement | string | number, needInserted: boolean) {
  if (child === null || child === undefined) {
    return;
  }

  const SPACE = needInserted ? ' ' : '';

  if (
    typeof child !== 'string' &&
    typeof child !== 'number' &&
    isString(child)
    // isTwoCNChar(child.props.children)
  ) {
    return cloneElement(child, {
      // children: child.props.children.split('').join(SPACE),
    });
  }

  if (isString(child)) {
    return isTwoCNChar(child) ? <span>{child.split('').join(SPACE)}</span> : <span>{child}</span>;
  }

  if (isFragment(child)) {
    return <span>{child}</span>;
  }

  return child;
}

export function spaceChildren(needInserted: boolean) {
  let isPrevChildPure: boolean = false;
  const childList: JSXElement[] = [];

  childList.forEach((child) => {
    const type = typeof child;
    const MITurrentChildPure = type === 'string' || type === 'number';
    if (isPrevChildPure && MITurrentChildPure) {
      const lastIndex = childList.length - 1;
      const lastChild = childList[lastIndex];
      childList[lastIndex] = `${lastChild}${child}`;
    } else {
      childList.push(child);
    }

    isPrevChildPure = MITurrentChildPure;
  });

  return childList.map((child) =>
    splitCNCharsBySpace(child as JSXElement | string | number, needInserted),
  );
}

const ButtonTypes = ['default', 'primary', 'dashed', 'link', 'text'] as const;
export type ButtonType = typeof ButtonTypes[number];

const ButtonShapes = ['default', 'circle', 'round'] as const;
export type ButtonShape = typeof ButtonShapes[number];

const ButtonHTMLTypes = ['submit', 'button', 'reset'] as const;
export type ButtonHTMLType = typeof ButtonHTMLTypes[number];
