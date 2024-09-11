import { createMemo } from 'solid-js';

import { devUseWarning } from '../../_util/warning';
import type { OverrideToken } from '../../theme/interface';
import { defaultConfig } from '../../theme/internal';
import type { ThemeConfig } from '../context';
import useThemeKey from './useThemeKey';

export default function useTheme(
  theme?: ThemeConfig,
  parentTheme?: ThemeConfig,
  config?: {
    prefixCls?: string;
  },
): ThemeConfig | undefined {
  const warning = devUseWarning('ConfigProvider');

  const themeConfig = theme || {};
  const parentThemeConfig: ThemeConfig =
    themeConfig.inherit === false || !parentTheme
      ? {
          ...defaultConfig,
          hashed: parentTheme?.hashed ?? defaultConfig.hashed,
          cssVar: parentTheme?.cssVar,
        }
      : parentTheme;

  const themeKey = useThemeKey();

  if (process.env.NODE_ENV !== 'production') {
    const cssVarEnabled = themeConfig.cssVar || parentThemeConfig.cssVar;
    const validKey = !!(
      (typeof themeConfig.cssVar === 'object' && themeConfig.cssVar?.key) ||
      themeKey
    );
    warning(
      !cssVarEnabled || validKey,
      'breaking',
      'Missing key in `cssVar` config. Please upgrade to React 18 or set `cssVar.key` manually in each ConfigProvider inside `cssVar` enabled ConfigProvider.',
    );
  }

  const computedTheme = createMemo(() => {
    if (!theme) {
      return parentTheme;
    }

    // Override
    const mergedComponents = {
      ...parentThemeConfig.components,
    };

    (Object.keys(theme.components || {}) as (keyof OverrideToken)[]).forEach((componentName) => {
      mergedComponents[componentName] = {
        ...mergedComponents[componentName],
        ...theme.components![componentName],
      } as any;
    });

    const cssVarKey = `css-var-${themeKey.replace(/:/g, '')}`;
    const mergedCssVar = (themeConfig.cssVar ?? parentThemeConfig.cssVar) && {
      prefix: config?.prefixCls, // Same as prefixCls by default
      ...(typeof parentThemeConfig.cssVar === 'object' ? parentThemeConfig.cssVar : {}),
      ...(typeof themeConfig.cssVar === 'object' ? themeConfig.cssVar : {}),
      key: (typeof themeConfig.cssVar === 'object' && themeConfig.cssVar?.key) || cssVarKey,
    };

    // Base token
    return {
      ...parentThemeConfig,
      ...themeConfig,

      token: {
        ...parentThemeConfig.token,
        ...themeConfig.token,
      },
      components: mergedComponents,
      cssVar: mergedCssVar,
    };
  });

  return computedTheme();
}
