import type { JSX } from 'solid-js';

import type { InputFocusOptions } from './utils/commonUtils';

export interface CommonInputProps {
  prefix?: string;
  suffix?: JSX.Element;
  addonBefore?: JSX.Element;
  addonAfter?: JSX.Element;
  classes?: {
    affixWrapper?: string;
    group?: string;
    wrapper?: string;
  };
  classNames?: {
    affixWrapper?: string;
    prefix?: string;
    suffix?: string;
    groupWrapper?: string;
    wrapper?: string;
    variant?: string;
  };
  styles?: {
    affixWrapper?: JSX.CSSProperties;
    prefix?: JSX.CSSProperties;
    suffix?: JSX.CSSProperties;
  };
  allowClear?: boolean | { clearIcon?: JSX.Element };
}

type DataAttr = Record<`data-${string}`, string>;

export type ValueType = JSX.InputHTMLAttributes<HTMLInputElement>['value'];

export interface BaseInputProps extends CommonInputProps {
  value?: ValueType;
  prefixCls?: string;
  className?: string;
  style?: JSX.CSSProperties | string;
  disabled?: boolean;
  focused?: boolean;
  triggerFocus?: () => void;
  readOnly?: boolean;
  handleReset?: (e: MouseEvent) => void;
  onClear?: () => void;
  hidden?: JSX.HTMLAttributes<HTMLDivElement>['hidden'];
  dataAttrs?: {
    affixWrapper?: DataAttr;
  };
  components?: {
    affixWrapper?: 'span' | 'div';
    groupWrapper?: 'span' | 'div';
    wrapper?: 'span' | 'div';
    groupAddon?: 'span' | 'div';
  };
  children?: JSX.Element;
}

export type ShowCountFormatter = (args: {
  value: string;
  count: number;
  maxLength?: number;
}) => JSX.Element;

export type ExceedFormatter = (value: string, config: { max: number }) => string;

export interface CountConfig {
  max?: number;
  strategy?: (value: string) => number;
  show?: boolean | ShowCountFormatter;
  exceedFormatter?: ExceedFormatter;
}

export interface InputProps
  extends CommonInputProps,
    Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type' | 'value'> {
  value?: ValueType;
  prefixCls?: string;
  type?:
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week';
  onPressEnter?: (e: KeyboardEvent) => void;
  showCount?: boolean | { formatter: ShowCountFormatter };
  autoComplete?: string;
  htmlSize?: number;
  classNames?: CommonInputProps['classNames'] & {
    input?: string;
    count?: string;
  };
  className?: string;
  styles?: CommonInputProps['styles'] & {
    input?: JSX.CSSProperties;
    count?: JSX.CSSProperties;
  };
  count?: CountConfig;
  defaultValue?: string | number | readonly string[] | undefined;
  onClear?: () => void;
}

export interface InputRef {
  focus: (options?: InputFocusOptions) => void;
  blur: () => void;
  setSelectionRange: (
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none',
  ) => void;
  select: () => void;
  input: HTMLInputElement | null;
  nativeElement: HTMLElement | null;
}

export interface ChangeEventInfo {
  source: 'compositionEnd' | 'change';
}
