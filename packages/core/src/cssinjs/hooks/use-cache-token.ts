import StyleContext, { StyleContextProps, useStyleContext } from '@cssinjs/style-context';
import Theme from '@cssinjs/theme/theme';
import { flattenToken, memoResult } from '@cssinjs/util';
import { ObservableMap } from '@stencil/store';
import { Ref, computed, ref } from '@vue/reactivity';
import useGlobalCache from './use-global-cache';

const EMPTY_OVERRIDE = {};

export interface Option<DerivativeToken, DesignToken> {
  /**
   * Generate token with salt.
   * This is used to generate different hashId even same derivative token for different version.
   */
  salt?: string;
  override?: object;
  /**
   * Format token as you need. Such as:
   *
   * - rename token
   * - merge token
   * - delete token
   *
   * This should always be the same since it's one time process.
   * It's ok to useMemo outside but this has better cache strategy.
   */
  formatToken?: (mergedToken: any) => DerivativeToken;
  /**
   * Get final token with origin token, override token and theme.
   * The parameters do not contain formatToken since it's passed by user.
   * @param origin The original token.
   * @param override Extra tokens to override.
   * @param theme Theme instance. Could get derivative token by `theme.getDerivativeToken`
   */
  getComputedToken?: (origin: DesignToken, override: object, theme: Theme<any, any>) => DerivativeToken;

  /**
   * Transform token to css variables.
   */
  cssVar?: {
    /** Prefix for css variables */
    prefix?: string;
    /** Tokens that should not be appended with unit */
    unitless?: Record<string, boolean>;
    /** Tokens that should not be transformed to css variables */
    ignore?: Record<string, boolean>;
    /** Tokens that preserves origin value */
    preserve?: Record<string, boolean>;
    /** Key for current theme. Useful for customizing and should be unique */
    key?: string;
  };
}

export default function useCacheToken<DerivativeToken = object, DesignToken = DerivativeToken>(
  theme: Ref<Theme<any, any>>,
  tokens: Ref<Partial<DesignToken>[]>,
  option: Ref<Option<DerivativeToken, DesignToken>> = ref({}),
) {
  const style = useStyleContext(StyleContext);

  // Basic - We do basic cache here
  const mergedToken = computed(() => Object.assign({}, ...tokens.value));
  const tokenStr = computed(() => flattenToken(mergedToken.value));
  const overrideTokenStr = computed(() => flattenToken(option.value.override || EMPTY_OVERRIDE));

  const cachedToken = useGlobalCache<[DerivativeToken & { _tokenKey: string }, string]>(
    'token',
    computed(() => [option.value.salt || '', theme.value.id, tokenStr.value, overrideTokenStr.value]),
    () => {
      const { salt = '', override = EMPTY_OVERRIDE, formatToken, getComputedToken: compute } = option.value;
      const mergedDerivativeToken = compute
        ? compute(mergedToken.value, override, theme.value)
        : getComputedToken(mergedToken.value, override, theme.value, formatToken);

      // Optimize for `useStyleRegister` performance
      const tokenKey = token2key(mergedDerivativeToken, salt);
      mergedDerivativeToken._tokenKey = tokenKey;
      recordCleanToken(tokenKey);

      const hashId = `${hashPrefix}-${hash(tokenKey)}`;
      mergedDerivativeToken._hashId = hashId; // Not used

      return [mergedDerivativeToken, hashId];
    },
    (cache) => {
      // Remove token will remove all related style
      cleanTokenStyle(cache[0]._tokenKey, style.value?.cache.instanceId);
    },
  );

  return cachedToken;
}
