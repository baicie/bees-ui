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
import { AliasToken, GlobalToken, MapToken, OverrideToken } from './interface';
import { SeedToken } from './interface/seeds';
import defaultDerivative from './themes/default';
import defaultSeedToken from './themes/seed';
import { PresetColorKey, PresetColorType, PresetColors } from './interface/presetColors';
import genComponentStyleHook, { FullToken } from './util/gen-component-style-hooks';
import { ComputedRef, Ref, computed } from '@vue/reactivity';
import useCacheToken from '@cssinjs/hooks/use-cache-token';
import formatToken from './util/alias';
import statisticToken, { merge as mergeToken, statistic } from './util/statistic';
import { CSSInterpolation } from '@cssinjs/index';
>>>>>>> d2b3de8 (refactor: files)

const defaultTheme = createTheme(defaultDerivative);

export {
  // colors
  PresetColors,
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
  // // hooks
  // useStyleRegister,
  genComponentStyleHook,
};

export type { SeedToken, AliasToken, PresetColorType, PresetColorKey, AliasToken as DerivativeToken, FullToken };

export type UseComponentStyleResult = [(node: StencilVode) => StencilVode, Ref<string>];
>>>>>>> d2b3de8 (refactor: files)

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
let DesignTokenContext = createContext<DesignTokenContext>({
  token: {}
})
=======
const DesignTokenContextKey = Symbol('DesignTokenContext');
>>>>>>> d2b3de8 (refactor: files)

export let globalDesignTokenApi: DesignTokenContext | undefined = undefined;

export const useDesignTokenProvider = (value: DesignTokenContext) => {
<<<<<<< HEAD
  DesignTokenContext = createContext(value);
=======
  provide(DesignTokenContextKey, value);
>>>>>>> d2b3de8 (refactor: files)
  globalDesignTokenApi = value;
};

export const useDesignTokenInject = () => {
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
};

export function useToken(): [ComputedRef<Theme<SeedToken, MapToken>>, ComputedRef<GlobalToken>, ComputedRef<string>] {
  const designTokenContext = inject<DesignTokenContext>(DesignTokenContextKey, globalDesignTokenApi || defaultConfig);

  const salt = computed(() => `${version}-${designTokenContext.hashed || ''}`);

  const mergedTheme = computed(() => designTokenContext.theme || defaultTheme);

  const cacheToken = useCacheToken<GlobalToken, SeedToken>(
    mergedTheme,
    computed(() => [defaultSeedToken, designTokenContext.token]),
    computed(() => ({
      salt: salt.value,
>>>>>>> d2b3de8 (refactor: files)
      override: { override: designTokenContext.token, ...designTokenContext.components },
      formatToken,
    })),
  );

  return [
    mergedTheme,
<<<<<<< HEAD
    createMemo(() => cacheToken?.()[0]),
    createMemo(() => (designTokenContext.hashed ? cacheToken()[1] : '')),
=======
    computed(() => cacheToken?.value[0]),
    computed(() => (designTokenContext.hashed ? cacheToken.value[1] : '')),
>>>>>>> d2b3de8 (refactor: files)
  ];
}

export type GenerateStyle<ComponentToken extends object = AliasToken, ReturnType = CSSInterpolation> = (
  token: ComponentToken,
) => ReturnType;
