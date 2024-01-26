import { warningOnce } from '@baicie/sc-util';
import type { LinterInfo } from './interface';

export function lintWarning(message: string, info: LinterInfo) {
  const { path, parentSelectors } = info;

  warningOnce(
    false,
    `[Ant Design CSS-in-JS] ${path ? `Error in ${path}: ` : ''}${message}${
      parentSelectors.length ? ` Selector: ${parentSelectors.join(' | ')}` : ''
    }`,
  );
}
