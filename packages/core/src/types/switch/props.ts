import type { CSSProperties, SolidNode } from '../base';

export type SwitchSize = 'small' | 'default';
export type SwitchChangeEventHandler = (checked: boolean, event: MouseEvent) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;

export interface SwitchProps {
  prefixCls?: string;
  size?: SwitchSize;
  className?: string;
  rootClassName?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  /**
   * Alias for `checked`.
   * @since 5.12.0
   */
  value?: boolean;
  /**
   * Alias for `defaultChecked`.
   * @since 5.12.0
   */
  defaultValue?: boolean;
  onChange?: SwitchChangeEventHandler;
  onClick?: SwitchClickEventHandler;
  checkedChildren?: SolidNode;
  unCheckedChildren?: SolidNode;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  style?: CSSProperties;
  title?: string;
  tabIndex?: number;
  id?: string;
}
