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

const defaultTheme = createTheme(defaultDerivative);

export {
  // colors
  PresetColors,
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

const DesignTokenContextKey = Symbol('DesignTokenContext');

export let globalDesignTokenApi: DesignTokenContext | undefined = undefined;

export const useDesignTokenProvider = (value: DesignTokenContext) => {
  provide(DesignTokenContextKey, value);
  globalDesignTokenApi = value;
};

export const useDesignTokenInject = () => {
  return inject(DesignTokenContextKey, globalDesignTokenApi || defaultConfig);
};

export function useToken(): [ComputedRef<Theme<SeedToken, MapToken>>, ComputedRef<GlobalToken>, ComputedRef<string>] {
  const designTokenContext = inject<DesignTokenContext>(
    DesignTokenContextKey,
    globalDesignTokenApi || (defaultConfig as any),
  );

  const salt = computed(() => `${version}-${designTokenContext.hashed || ''}`);

  const mergedTheme = computed(() => designTokenContext.theme || defaultTheme);

  const cacheToken = useCacheToken<GlobalToken, SeedToken>(
    mergedTheme,
    computed(() => [defaultSeedToken, designTokenContext.token]),
    computed(() => ({
      salt: salt.value,
      override: { override: designTokenContext.token, ...designTokenContext.components },
      formatToken,
    })),
  );

  return [
    mergedTheme,
    computed(() => cacheToken?.value[0]),
    computed(() => (designTokenContext.hashed ? cacheToken.value[1] : '')),
  ];
}

export type GenerateStyle<ComponentToken extends object = AliasToken, ReturnType = CSSInterpolation> = (
  token: ComponentToken,
) => ReturnType;
