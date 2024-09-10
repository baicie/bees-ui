import { raf } from '@bees-ui/sc-util';
import { createMemo } from 'solid-js';

import Input from '../Input';
import type { InputProps, InputRef } from '../Input';

export interface OTPInputProps extends Omit<InputProps, 'onChange'> {
  index: number;
  onChange: (index: number, value: string) => void;
  onActiveChange: (nextIndex: number) => void;
  mask?: boolean | string;
}

const OTPInput = (props: OTPInputProps) => {
  const { value, onChange, onActiveChange, index, mask, ...restProps } = props;

  const internalValue = createMemo(() => (value && typeof mask === 'string' ? mask : value));

  // Ref
  const inputRef: HTMLInputElement | null = null;

  // ========================= Focus ==========================
  const syncSelection = () => {
    raf(() => {
      const inputEle = inputRef;
      if (document.activeElement === inputEle && inputEle) {
        inputEle.select();
      }
    });
  };

  // ======================== Keyboard ========================
  const onInternalKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      onActiveChange(index - 1);
    } else if (e.key === 'ArrowRight') {
      onActiveChange(index + 1);
    }

    syncSelection();
  };

  const onInternalKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !value) {
      onActiveChange(index - 1);
    }

    syncSelection();
  };

  // ========================== Event Handlers ===========================
  const onInternalChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onChange(index, target.value);
  };

  // ========================= Render =========================
  return (
    <Input
      {...restProps}
      ref={inputRef}
      value={internalValue()}
      onInput={onInternalChange}
      onFocus={syncSelection}
      onKeyDown={onInternalKeyDown}
      onKeyUp={onInternalKeyUp}
      onMouseDown={syncSelection}
      onMouseUp={syncSelection}
      type={mask === true ? 'password' : 'text'}
    />
  );
};

export default OTPInput;
