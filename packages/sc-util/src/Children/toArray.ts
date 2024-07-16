import type { JSX } from 'solid-js';

import 'solid-js/web';

export interface Option {
  keepEmpty?: boolean;
}

function toArray(
  children: JSX.Element[] | JSX.Element | string | number | boolean | null | undefined,
  option: Option = {},
): JSX.Element[] {
  let ret: JSX.Element[] = [];

  if (Array.isArray(children)) {
    for (const child of children) {
      ret = ret.concat(toArray(child, option));
    }
  } else if ((children !== undefined && children !== null) || option.keepEmpty) {
    ret.push(children as JSX.Element);
  }

  return ret;
}

export default toArray;
