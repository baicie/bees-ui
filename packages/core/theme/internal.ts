<<<<<<< HEAD
<<<<<<< HEAD
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
=======
import createTheme from '@cssinjs/theme/create-theme';
import Theme from '@cssinjs/theme/theme';
import { inject, provide } from '@utils/store';
import { StencilVode } from '@utils/type';
import { version } from '../index';
=======
import { useCacheToken, CSSInterpolation, Theme, createTheme } from '@baicie/cssinjs';
import { version } from '@baicie/version';
>>>>>>> ebe2878 (feat: button show)
import { AliasToken, GlobalToken, MapToken, OverrideToken } from './interface';
import { PresetColorKey, PresetColorType, PresetColors } from './interface/presetColors';
import { SeedToken } from './interface/seeds';
import defaultDerivative from './themes/default';
import defaultSeedToken from './themes/seed';
import formatToken from './util/alias';
import genComponentStyleHook from './util/gen-component-style-hooks';
import statisticToken, { merge as mergeToken, statistic } from './util/statistic';
<<<<<<< HEAD
import { CSSInterpolation } from '@cssinjs/index';
>>>>>>> d2b3de8 (refactor: files)
=======
import { Accessor, Context, JSXElement, createContext, createMemo, useContext } from 'solid-js';
import { token } from 'stylis';
>>>>>>> ebe2878 (feat: button show)

const defaultTheme = createTheme(defaultDerivative);

export {
  // colors
  PresetColors,
<<<<<<< HEAD
<<<<<<< HEAD
  // // hooks
  // useStyleRegister,
  genComponentStyleHook, mergeToken,
  // Statistic
  statistic,
  statisticToken
};

export type { AliasToken, AliasToken as DerivativeToken, PresetColorKey, PresetColorType, SeedToken };

export type UseComponentStyleResult = [(node: JSXElement) => JSXElement, Accessor<string>];
=======
  // Statistic
  statistic,
  statisticToken,
  mergeToken,
=======
>>>>>>> ebe2878 (feat: button show)
  // // hooks
  // useStyleRegister,
  genComponentStyleHook, mergeToken,
  // Statistic
  statistic,
  statisticToken
};

export type { AliasToken, AliasToken as DerivativeToken, PresetColorKey, PresetColorType, SeedToken };

<<<<<<< HEAD
export type UseComponentStyleResult = [(node: StencilVode) => StencilVode, Ref<string>];
>>>>>>> d2b3de8 (refactor: files)
=======
export type UseComponentStyleResult = [(node: JSXElement) => JSXElement, Accessor<string>];
>>>>>>> ebe2878 (feat: button show)

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

<<<<<<< HEAD
<<<<<<< HEAD
let DesignTokenContext = createContext<DesignTokenContext>({
  token: {}
})
=======
const DesignTokenContextKey = Symbol('DesignTokenContext');
>>>>>>> d2b3de8 (refactor: files)
=======
let DesignTokenContext = createContext<DesignTokenContext>({
  token: {}
})
>>>>>>> ebe2878 (feat: button show)

export let globalDesignTokenApi: DesignTokenContext | undefined = undefined;

export const useDesignTokenProvider = (value: DesignTokenContext) => {
<<<<<<< HEAD
<<<<<<< HEAD
  DesignTokenContext = createContext(value);
=======
  provide(DesignTokenContextKey, value);
>>>>>>> d2b3de8 (refactor: files)
=======
  DesignTokenContext = createContext(value);
>>>>>>> ebe2878 (feat: button show)
  globalDesignTokenApi = value;
};

export const useDesignTokenInject = () => {
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
  return inject(DesignTokenContextKey, globalDesignTokenApi || defaultConfig);
=======
  return useContext(DesignTokenContext);
>>>>>>> ebe2878 (feat: button show)
};

export function useToken(): [Accessor<Theme<SeedToken, MapToken>>, Accessor<GlobalToken>, Accessor<string>] {
  // globalDesignTokenApi || defaultConfig
  const designTokenContext = useContext(DesignTokenContext);

  const salt = createMemo(() => `${version}-${designTokenContext.hashed || ''}`);

  const mergedTheme = createMemo(() => designTokenContext.theme || defaultTheme);

  const cacheToken = useCacheToken<GlobalToken, SeedToken>(
    mergedTheme,
<<<<<<< HEAD
    computed(() => [defaultSeedToken, designTokenContext.token]),
    computed(() => ({
      salt: salt.value,
>>>>>>> d2b3de8 (refactor: files)
=======
    createMemo(() => [defaultSeedToken, designTokenContext.token]),
    createMemo(() => ({
      salt: salt(),
>>>>>>> ebe2878 (feat: button show)
      override: { override: designTokenContext.token, ...designTokenContext.components },
      formatToken,
    })),
  );

  return [
    mergedTheme,
<<<<<<< HEAD
<<<<<<< HEAD
    createMemo(() => cacheToken?.()[0]),
    createMemo(() => (designTokenContext.hashed ? cacheToken()[1] : '')),
=======
    computed(() => cacheToken?.value[0]),
    computed(() => (designTokenContext.hashed ? cacheToken.value[1] : '')),
>>>>>>> d2b3de8 (refactor: files)
=======
    createMemo(() => cacheToken?.()[0]),
    createMemo(() => (designTokenContext.hashed ? cacheToken()[1] : '')),
>>>>>>> ebe2878 (feat: button show)
  ];
}

export type GenerateStyle<ComponentToken extends object = AliasToken, ReturnType = CSSInterpolation> = (
  token: ComponentToken,
) => ReturnType;
