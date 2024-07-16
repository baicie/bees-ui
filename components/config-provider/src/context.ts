// import type { ValidateMessages } from 'rc-field-form/lib/interface';
// import type { Options } from 'scroll-into-view-if-needed';

// import type { WarningContextProps } from '../_util/warning';
// import type { ShowWaveEffect } from '../_util/wave/interface';
// import type { BadgeProps } from '../badge';
// import type { ButtonProps } from '@bees-ui/button';
// import type { DrawerProps } from '../drawer';
// import type { FlexProps } from '../flex/interface';
// import type { RequiredMark } from '../form/Form';
// import type { InputProps } from '../input';
// import type { Locale } from '../locale';
// import type { ModalProps } from '../modal';
// import type { SpaceProps } from '../space';
// import type { TabsProps } from '../tabs';
// import type { AliasToken, MappingAlgorithm, OverrideToken } from '@bees-ui/core';
// import type { RenderEmptyHandler } from './defaultRenderEmpty';
// import type { SizeType } from './SizeContext';
import type { CSSProperties } from '@bees-ui/type';
import type { JSX } from 'solid-js';
import { createContext } from 'solid-js';

export const defaultIconPrefixCls = 'anticon';

export interface Theme {
  primaryColor?: string;
  infoColor?: string;
  successColor?: string;
  processingColor?: string;
  errorColor?: string;
  warningColor?: string;
}

export interface CSPConfig {
  nonce?: string;
}

export type DirectionType = 'ltr' | 'rtl' | undefined;

export interface ComponentStyleConfig {
  className?: string;
  style?: JSX.CSSProperties;
}

export interface ModalConfig extends ComponentStyleConfig {
  // classNames?: ModalProps['classNames'];
  // styles?: ModalProps['styles'];
}

export interface BadgeConfig extends ComponentStyleConfig {
  // classNames?: BadgeProps['classNames'];
  // styles?: BadgeProps['styles'];
}

export interface ButtonConfig extends ComponentStyleConfig {
  className?: string;
  styles?: { icon: CSSProperties };
}

export interface DrawerConfig extends ComponentStyleConfig {
  // classNames?: DrawerProps['classNames'];
  // styles?: DrawerProps['styles'];
}

export interface FlexConfig extends ComponentStyleConfig {
  // vertical?: FlexProps['vertical'];
}

export type PopupOverflow = 'viewport' | 'scroll';

export interface WaveConfig {
  disabled?: boolean;
  // showEffect?: ShowWaveEffect;
}

export interface ConfigConsumerProps {
  getTargetContainer?: () => HTMLElement;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  rootPrefixCls?: string;
  iconPrefixCls: string;
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  // renderEmpty?: RenderEmptyHandler;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
  input?: ComponentStyleConfig & {
    autoComplete?: string;
    // classNames?: InputProps['classNames'];
    // styles?: InputProps['styles'];
  };
  pagination?: ComponentStyleConfig & { showSizeChanger?: boolean };
  // locale?: Locale;
  pageHeader?: {
    ghost: boolean;
  };
  direction?: DirectionType;
  // space?: {
  //   size?: SizeType | number;
  //   className?: SpaceProps['className'];
  //   classNames?: SpaceProps['classNames'];
  //   style?: SpaceProps['style'];
  //   styles?: SpaceProps['styles'];
  // };
  virtual?: boolean;
  popupMatchSelectWidth?: boolean;
  popupOverflow?: PopupOverflow;
  // form?: ComponentStyleConfig & {
  //   requiredMark?: RequiredMark;
  //   colon?: boolean;
  //   scrollToFirstError?: Options | boolean;
  //   validateMessages?: ValidateMessages;
  // };
  theme?: {};
  select?: ComponentStyleConfig & {
    showSearch?: boolean;
  };
  alert?: ComponentStyleConfig;
  anchor?: ComponentStyleConfig;
  button?: ButtonConfig;
  divider?: ComponentStyleConfig;
  drawer?: DrawerConfig;
  calendar?: ComponentStyleConfig;
  carousel?: ComponentStyleConfig;
  cascader?: ComponentStyleConfig;
  collapse?: ComponentStyleConfig;
  typography?: ComponentStyleConfig;
  skeleton?: ComponentStyleConfig;
  spin?: ComponentStyleConfig;
  segmented?: ComponentStyleConfig;
  steps?: ComponentStyleConfig;
  statistic?: ComponentStyleConfig;
  image?: ComponentStyleConfig;
  layout?: ComponentStyleConfig;
  list?: ComponentStyleConfig;
  mentions?: ComponentStyleConfig;
  modal?: ModalConfig;
  progress?: ComponentStyleConfig;
  result?: ComponentStyleConfig;
  slider?: ComponentStyleConfig;
  breadcrumb?: ComponentStyleConfig;
  menu?: ComponentStyleConfig;
  checkbox?: ComponentStyleConfig;
  descriptions?: ComponentStyleConfig;
  empty?: ComponentStyleConfig;
  badge?: BadgeConfig;
  radio?: ComponentStyleConfig;
  rate?: ComponentStyleConfig;
  switch?: ComponentStyleConfig;
  transfer?: ComponentStyleConfig;
  avatar?: ComponentStyleConfig;
  message?: ComponentStyleConfig;
  tag?: ComponentStyleConfig;
  table?: ComponentStyleConfig;
  card?: ComponentStyleConfig;
  // tabs?: ComponentStyleConfig & Pick<TabsProps, 'indicator' | 'indicatorSize'>;
  timeline?: ComponentStyleConfig;
  timePicker?: ComponentStyleConfig;
  upload?: ComponentStyleConfig;
  notification?: ComponentStyleConfig;
  tree?: ComponentStyleConfig;
  colorPicker?: ComponentStyleConfig;
  datePicker?: ComponentStyleConfig;
  rangePicker?: ComponentStyleConfig;
  dropdown?: ComponentStyleConfig;
  flex?: FlexConfig;
  wave?: WaveConfig;
  // warning?: WarningContextProps;
}

const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) {
    return customizePrefixCls;
  }
  return suffixCls ? `baicie-${suffixCls}` : 'baicie';
};

// zombieJ: 🚨 Do not pass `defaultRenderEmpty` here since it will cause circular dependency.
export const ConfigContext = createContext<ConfigConsumerProps>({
  // We provide a default function for Context without provider
  getPrefixCls: defaultGetPrefixCls,
  iconPrefixCls: defaultIconPrefixCls,
});
