import { useCacheToken, CSSInterpolation, Theme, createTheme } from '@baicie/cssinjs';
import { version } from '@baicie/version';
import { AliasToken, GlobalToken, MapToken, OverrideToken } from './interface';
import { PresetColorKey, PresetColorType, PresetColors } from './interface/presetColors';
import { SeedToken } from './interface/seeds';
import defaultDerivative from './themes/default';
import defaultSeedToken from './themes/seed';
import formatToken from './util/alias';
import genComponentStyleHook from './util/gen-component-style-hooks';
import statisticToken, { merge as mergeToken, statistic } from './util/statistic';
import { Accessor, Context, JSXElement, createContext, createMemo, useContext } from 'solid-js';
import { token } from 'stylis';

const defaultTheme = createTheme(defaultDerivative);

export {
  // colors
  PresetColors,
  // // hooks
  // useStyleRegister,
  genComponentStyleHook, mergeToken,
  // Statistic
  statistic,
  statisticToken
};

export type { AliasToken, AliasToken as DerivativeToken, PresetColorKey, PresetColorType, SeedToken };

export type UseComponentStyleResult = [(node: JSXElement) => JSXElement, Accessor<string>];

export const defaultConfig = {
  token: defaultSeedToken,
  hashed: true,
};

export interface DesignTokenContext {
  token: Partial<AliasToken>;
  theme?: Theme<SeedToken, MapToken>;
  components?: OverrideToken;
  hashed?: string | boolean;
}

let DesignTokenContext = createContext<DesignTokenContext>({
  token: {}
})

export let globalDesignTokenApi: DesignTokenContext | undefined = undefined;

export const useDesignTokenProvider = (value: DesignTokenContext) => {
  DesignTokenContext = createContext(value);
  globalDesignTokenApi = value;
};

export const useDesignTokenInject = () => {
  return useContext(DesignTokenContext);
};

export function useToken(): [Accessor<Theme<SeedToken, MapToken>>, Accessor<GlobalToken>, Accessor<string>] {
  // globalDesignTokenApi || defaultConfig
  const designTokenContext = useContext(DesignTokenContext);

  const salt = createMemo(() => `${version}-${designTokenContext.hashed || ''}`);

  const mergedTheme = createMemo(() => designTokenContext.theme || defaultTheme);

  const cacheToken = useCacheToken<GlobalToken, SeedToken>(
    mergedTheme,
    createMemo(() => [defaultSeedToken, designTokenContext.token]),
    createMemo(() => ({
      salt: salt(),
      override: { override: designTokenContext.token, ...designTokenContext.components },
      formatToken,
    })),
  );

  return [
    mergedTheme,
    createMemo(() => cacheToken?.()[0]),
    createMemo(() => (designTokenContext.hashed ? cacheToken()[1] : '')),
  ];
}

export type GenerateStyle<ComponentToken extends object = AliasToken, ReturnType = CSSInterpolation> = (
  token: ComponentToken,
) => ReturnType;
