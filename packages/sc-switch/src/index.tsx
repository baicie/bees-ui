import { createEffect, type JSX } from 'solid-js';

export type SwitchChangeEventHandler = (
  checked: boolean,
  event: MouseEvent | KeyboardEvent,
) => void;

export type SwitchClickEventHandler = SwitchChangeEventHandler;

interface SwitchProps
  extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onChange'> {
  className?: string;
  prefixCls?: string;
  disabled?: boolean;
  checkedChildren?: JSX.Element;
  unCheckedChildren?: JSX.Element;
  onChange?: SwitchChangeEventHandler;
  onKeyDown?: (event: KeyboardEvent) => void;
  onClick?: SwitchClickEventHandler;
  tabIndex?: number;
  checked?: boolean;
  defaultChecked?: boolean;
  loadingIcon?: JSX.Element;
  style?: JSX.CSSProperties;
  title?: string;
  nums?: number;
}

const Switch = (props: SwitchProps) => {
  createEffect(() => {
    console.log('props', props.nums);
  });
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    <button {...props} type="button">
      {props.loadingIcon}
      <span class={`${props.prefixCls}-inner`}>
        <span class={`${props.prefixCls}-inner-checked`}>{props.checkedChildren}</span>
        <span class={`${props.prefixCls}-inner-unchecked`}>{props.unCheckedChildren}</span>
      </span>
    </button>
  );
};

export default Switch;
