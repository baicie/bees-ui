import { Locale } from '@bees-ui/core/src/locale';
import { AliasToken, OverrideToken } from '@theme/interface';
import { createStore } from '@stencil/store';
import { DEFAULT_DIRECTION, ICONPREFIX, PREFIX } from '@utils/constant';
import { inject, provide } from '@utils/store';

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

export const configProviderKey = Symbol('configContext');

export interface ConfigProviderInnerProps {
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  iconPrefixCls: string;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  direction?: 'ltr' | 'rtl';
}

export const defaultConfigProvider: ConfigProviderInnerProps = {
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls ? `${PREFIX}-${suffixCls}` : PREFIX;
  },
  iconPrefixCls: ICONPREFIX,
  getPopupContainer: () => document.body,
  direction: DEFAULT_DIRECTION,
};

export const useConfigContextInject = () => {
  return inject(configProviderKey, defaultConfigProvider);
};

export const useConfigContextProvider = (props: ConfigProviderInnerProps) => {
  return provide(configProviderKey, props);
};
