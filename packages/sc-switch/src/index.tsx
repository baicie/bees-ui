import classNames from 'clsx';
import { createMemo, createSignal, mergeProps, splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

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
}

const Switch = (props: SwitchProps) => {
  props = mergeProps({ prefixCls: 'rc-switch', defaultChecked: false }, props);
  const [_, rest] = splitProps(props, ['onChange']);
  const [innerChecked, setInnerChecked] = createSignal(props.defaultChecked);

  const triggerChange = (newChecked: boolean, event: MouseEvent | KeyboardEvent) => {
    if (!props.disabled) {
      setInnerChecked(newChecked);
      props.onChange?.(newChecked, event);
    }
  };

  const onInternalKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      triggerChange(false, e);
    } else if (e.key === 'ArrowRight') {
      triggerChange(true, e);
    }
    props.onKeyDown?.(e);
  };

  const onInternalClick = (e: MouseEvent) => {
    const ret = !innerChecked();
    triggerChange(ret, e);
    props.onClick?.(ret, e);
  };

  const switchClassName = createMemo(() =>
    classNames(props.prefixCls, props.className, {
      [`${props.prefixCls}-checked`]: innerChecked(),
      [`${props.prefixCls}-disabled`]: props.disabled,
    }),
  );

  return (
    <button
      {...rest}
      type="button"
      role="switch"
      aria-checked={innerChecked()}
      disabled={props.disabled}
      class={switchClassName()}
      onKeyDown={onInternalKeyDown}
      onClick={onInternalClick}
    >
      {props.loadingIcon}
      <span class={`${props.prefixCls}-inner`}>
        <span class={`${props.prefixCls}-inner-checked`}>{props.checkedChildren}</span>
        <span class={`${props.prefixCls}-inner-unchecked`}>{props.unCheckedChildren}</span>
      </span>
    </button>
  );
};

export default Switch;
