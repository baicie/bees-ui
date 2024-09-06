// context-> button -> config-provider
// context-> config-provider
// all in one component
import { ShowWaveEffect } from '@bees-ui/_util/src/wave/interface';
import { AliasToken, MappingAlgorithm, WarningContextProps } from '@bees-ui/core';
import { OverrideToken } from '@bees-ui/core/src/theme/interface';
import { createContext } from 'solid-js';
import type { JSX } from 'solid-js';

import type { ButtonProps } from './button/src';
import { FlexProps } from './flex/src/interface';

export const defaultPrefixCls = 'bees';
const defaultIconPrefixCls = 'anticon';

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

type ComponentsConfig = {
  [key in keyof OverrideToken]?: OverrideToken[key] & {
    algorithm?: boolean | MappingAlgorithm | MappingAlgorithm[];
  };
};

export interface ThemeConfig {
  token?: Partial<AliasToken>;
  components?: ComponentsConfig;
  algorithm?: MappingAlgorithm | MappingAlgorithm[];
  inherit?: boolean;
  hashed?: boolean;
  cssVar?:
    | {
        prefix?: string;
        key?: string;
      }
    | boolean;
}

export interface ComponentStyleConfig {
  className?: string;
  style?: JSX.CSSProperties;
}

// export interface TableConfig extends ComponentStyleConfig {
//   expandable?: {
//     expandIcon?: NonNullable<TableProps['expandable']>['expandIcon'];
//   };
// }

export interface ImageConfig extends ComponentStyleConfig {
  preview?: Partial<Record<'closeIcon', React.ReactNode>>;
}

// export type CollapseConfig = ComponentStyleConfig & Pick<CollapseProps, 'expandIcon'>;

// export type MenuConfig = ComponentStyleConfig & Pick<MenuProps, 'expandIcon'>;

// export type TourConfig = Pick<TourProps, 'closeIcon'>;

// export type ModalConfig = ComponentStyleConfig &
//   Pick<ModalProps, 'classNames' | 'styles' | 'closeIcon' | 'closable'>;

// export type TabsConfig = ComponentStyleConfig &
//   Pick<TabsProps, 'indicator' | 'indicatorSize' | 'more' | 'moreIcon' | 'addIcon' | 'removeIcon'>;

// export type AlertConfig = ComponentStyleConfig & Pick<AlertProps, 'closable' | 'closeIcon'>;

// export type BadgeConfig = ComponentStyleConfig & Pick<BadgeProps, 'classNames' | 'styles'>;

// export type InputConfig = ComponentStyleConfig &
//   Pick<InputProps, 'autoComplete' | 'classNames' | 'styles' | 'allowClear' | 'variant'>;

// export type TextAreaConfig = ComponentStyleConfig &
//   Pick<TextAreaProps, 'autoComplete' | 'classNames' | 'styles' | 'allowClear' | 'variant'>;

export type ButtonConfig = ComponentStyleConfig &
  Pick<ButtonProps, 'classNames' | 'styles' | 'autoInsertSpace'>;

// export type NotificationConfig = ComponentStyleConfig & Pick<ArgsProps, 'closeIcon'>;

// export type TagConfig = ComponentStyleConfig & Pick<TagProps, 'closeIcon' | 'closable'>;

// export type CardConfig = ComponentStyleConfig & Pick<CardProps, 'classNames' | 'styles'>;

// export type DrawerConfig = ComponentStyleConfig &
//   Pick<DrawerProps, 'classNames' | 'styles' | 'closeIcon' | 'closable'>;

export type FlexConfig = ComponentStyleConfig & Pick<FlexProps, 'vertical'>;

// export type TransferConfig = ComponentStyleConfig & Pick<TransferProps, 'selectionsIcon'>;

// export type FormConfig = ComponentStyleConfig &
//   Pick<FormProps, 'requiredMark' | 'colon' | 'scrollToFirstError' | 'validateMessages' | 'variant'>;

// export type FloatButtonGroupConfig = Pick<FloatButtonGroupProps, 'closeIcon'>;

// export type PaginationConfig = ComponentStyleConfig & Pick<PaginationProps, 'showSizeChanger'>;

// export type SelectConfig = ComponentStyleConfig & Pick<SelectProps, 'showSearch' | 'variant'>;

// export type SpaceConfig = ComponentStyleConfig & Pick<SpaceProps, 'size' | 'classNames' | 'styles'>;

// export type InputNumberConfig = ComponentStyleConfig & Pick<InputNumberProps, 'variant'>;

// export type CascaderConfig = ComponentStyleConfig & Pick<CascaderProps, 'variant'>;

// export type TreeSelectConfig = ComponentStyleConfig & Pick<TreeSelectProps, 'variant'>;

// export type DatePickerConfig = ComponentStyleConfig & Pick<DatePickerProps, 'variant'>;

// export type RangePickerConfig = ComponentStyleConfig & Pick<RangePickerProps, 'variant'>;

// export type TimePickerConfig = ComponentStyleConfig & Pick<TimePickerProps, 'variant'>;

// export type MentionsConfig = ComponentStyleConfig & Pick<MentionsProps, 'variant'>;

export type PopupOverflow = 'viewport' | 'scroll';

// export interface ListConfig extends ComponentStyleConfig {
//   item?: Pick<ListItemProps, 'classNames' | 'styles'>;
// }

export const Variants = ['outlined', 'borderless', 'filled'] as const;

export type Variant = (typeof Variants)[number];

export interface WaveConfig {
  disabled?: boolean;
  showEffect?: ShowWaveEffect;
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
  variant?: Variant;
  // input?: InputConfig;
  // textArea?: TextAreaConfig;
  // inputNumber?: InputNumberConfig;
  // pagination?: PaginationConfig;
  // locale?: Locale;
  direction?: DirectionType;
  // space?: SpaceConfig;
  virtual?: boolean;
  popupMatchSelectWidth?: boolean;
  popupOverflow?: PopupOverflow;
  // form?: FormConfig;
  theme?: ThemeConfig;
  // select?: SelectConfig;
  // alert?: AlertConfig;
  anchor?: ComponentStyleConfig;
  button?: ButtonConfig;
  divider?: ComponentStyleConfig;
  // drawer?: DrawerConfig;
  calendar?: ComponentStyleConfig;
  carousel?: ComponentStyleConfig;
  // cascader?: CascaderConfig;
  // treeSelect?: TreeSelectConfig;
  // collapse?: CollapseConfig;
  // floatButtonGroup?: FloatButtonGroupConfig;
  typography?: ComponentStyleConfig;
  skeleton?: ComponentStyleConfig;
  spin?: ComponentStyleConfig;
  segmented?: ComponentStyleConfig;
  steps?: ComponentStyleConfig;
  statistic?: ComponentStyleConfig;
  image?: ImageConfig;
  layout?: ComponentStyleConfig;
  // list?: ListConfig;
  // mentions?: MentionsConfig;
  // modal?: ModalConfig;
  progress?: ComponentStyleConfig;
  result?: ComponentStyleConfig;
  slider?: ComponentStyleConfig;
  breadcrumb?: ComponentStyleConfig;
  // menu?: MenuConfig;
  checkbox?: ComponentStyleConfig;
  descriptions?: ComponentStyleConfig;
  empty?: ComponentStyleConfig;
  // badge?: BadgeConfig;
  radio?: ComponentStyleConfig;
  rate?: ComponentStyleConfig;
  switch?: ComponentStyleConfig;
  // transfer?: TransferConfig;
  avatar?: ComponentStyleConfig;
  message?: ComponentStyleConfig;
  // tag?: TagConfig;
  // table?: TableConfig;
  // card?: CardConfig;
  // tabs?: TabsConfig;
  timeline?: ComponentStyleConfig;
  // timePicker?: TimePickerConfig;
  // tour?: TourConfig;
  upload?: ComponentStyleConfig;
  // notification?: NotificationConfig;
  tree?: ComponentStyleConfig;
  colorPicker?: ComponentStyleConfig;
  // datePicker?: DatePickerConfig;
  // rangePicker?: RangePickerConfig;
  dropdown?: ComponentStyleConfig;
  flex?: FlexConfig;
  wave?: WaveConfig;
  warning?: WarningContextProps;
}

const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) {
    return customizePrefixCls;
  }
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls;
};

// zombieJ: 🚨 Do not pass `defaultRenderEmpty` here since it will cause circular dependency.
export const ConfigContext = createContext<ConfigConsumerProps>({
  // We provide a default function for Context without provider
  getPrefixCls: defaultGetPrefixCls,
  iconPrefixCls: defaultIconPrefixCls,
});
