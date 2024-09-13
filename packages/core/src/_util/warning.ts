import { resetWarned as rcResetWarned, warningOnce } from '@bees-ui/sc-util';
import { createContext, useContext } from 'solid-js';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

let deprecatedWarnList: Record<string, string[]> | null = null;

export function resetWarned() {
  deprecatedWarnList = null;
  rcResetWarned();
}

type Warning = (valid: boolean, component: string, message?: string) => void;

let warning: Warning = noop;
if (process.env.NODE_ENV !== 'production') {
  warning = (valid, component, message) => {
    warningOnce(valid, `[antd: ${component}] ${message}`);

    if (process.env.NODE_ENV === 'test') {
      resetWarned();
    }
  };
}

type BaseTypeWarning = (
  valid: boolean,
  type: 'deprecated' | 'usage' | 'breaking',
  message?: string,
) => void;

type TypeWarning = BaseTypeWarning & {
  deprecated: (valid: boolean, oldProp: string, newProp: string, message?: string) => void;
};

export interface WarningContextProps {
  strict?: boolean;
}

export const WarningContext = createContext<WarningContextProps>({});

/**
 * This hook is used only in development mode.
 * Always wrap this in `if (import.meta.env.MODE !== 'production')` condition.
 */
export const devUseWarning: (component: string) => TypeWarning =
  process.env.NODE_ENV !== 'production'
    ? (component) => {
        const { strict } = useContext(WarningContext);

        const typeWarning: TypeWarning = (valid, type, message) => {
          if (!valid) {
            if (strict === false && type === 'deprecated') {
              const existWarning = deprecatedWarnList;

              if (!deprecatedWarnList) {
                deprecatedWarnList = {};
              }

              deprecatedWarnList[component] = deprecatedWarnList[component] || [];
              if (!deprecatedWarnList[component].includes(message || '')) {
                deprecatedWarnList[component].push(message || '');
              }

              if (!existWarning) {
                // eslint-disable-next-line no-console
                console.warn(
                  '[😁] There exists deprecated usage in your code:',
                  deprecatedWarnList,
                );
              }
            } else {
              warning(valid, component, message);
            }
          }
        };

        typeWarning.deprecated = (valid, oldProp, newProp, message) => {
          typeWarning(
            valid,
            'deprecated',
            `\`${oldProp}\` is deprecated. Please use \`${newProp}\` instead.${
              message ? ` ${message}` : ''
            }`,
          );
        };

        return typeWarning;
      }
    : () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const noopWarning: TypeWarning = () => {};

        noopWarning.deprecated = noop;

        return noopWarning;
      };

export default warning;
