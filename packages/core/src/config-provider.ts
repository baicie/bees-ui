import { ConfigProvider } from '@bees-ui/antd';
import type { ConfigProviderProps } from '@bees-ui/antd';
import { pregister } from '@bees-ui/register';

export type { ConfigProviderProps };

export const configProviderProps: ConfigProviderProps = {
  getTargetContainer: () => document.body,
  getPopupContainer: (triggerNode?: HTMLElement) => triggerNode?.parentElement || document.body,
  prefixCls: 'bees',
  iconPrefixCls: 'bees-icon',
  children: null,
  renderEmpty: () => null,
  csp: {},
  variant: undefined,
  form: {},
  input: {},
  inputNumber: {},
  textArea: {},
  select: {},
  pagination: {},
  locale: undefined,
  componentSize: undefined,
  componentDisabled: false,
  direction: 'ltr',
  space: {},
  splitter: {},
  virtual: true,
  popupMatchSelectWidth: true,
  popupOverflow: undefined,
  theme: {},
  warning: {},
  alert: {},
  anchor: {},
  button: { autoInsertSpace: true },
  calendar: {},
  carousel: {},
  cascader: {},
};

export default function registerConfigProvider() {
  pregister('bees-config-provider', ConfigProvider, Object.keys(configProviderProps));
}
