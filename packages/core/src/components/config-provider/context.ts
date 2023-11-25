import { Locale } from '@ikunorg/core/src/locale';
import { AliasToken, OverrideToken } from '../theme/interface';
import { createStore } from '@stencil/store';

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export interface ThemeConfig {
  token?: Partial<AliasToken>;
  components?: OverrideToken;
  hashed?: boolean;
  inherit?: boolean;
}

interface Store {
  componentSize: SizeType;
  theme: ThemeConfig;
  locale: Locale;
}

export const useConfigContext = createStore<Store>({
  theme: {},
  componentSize: 'middle',
  locale: {
    locale: 'zh-CN',
  },
});

export const configContextKey = Symbol('configContext');
