import type { InputStatus } from '@bees-ui/_util';
import { type SizeType, useSize } from '@bees-ui/config-provider/src';
import { ConfigContext, type Variant } from '@bees-ui/context';
import { devUseWarning } from '@bees-ui/core/src';
import classNames from 'clsx';
import { createEffect, createMemo, createSignal, useContext } from 'solid-js';

import type { InputRef } from '../Input';
import useStyle from '../style/otp';
import OTPInput from './OTPInput';
import type { OTPInputProps } from './OTPInput';

export interface OTPRef {
  focus: () => void;
  blur: () => void;
  nativeElement: HTMLDivElement;
}

export interface OTPProps {
  prefixCls?: string;
  length?: number;
  variant?: Variant;
  rootClassName?: string;
  className?: string;
  style?: JSX.IntrinsicElements['div']['style'];
  size?: SizeType;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  formatter?: (value: string) => string;
  disabled?: boolean;
  status?: InputStatus;
  mask?: boolean | string;
}

const strToArr = (str: string) => (str || '').split('');

const OTP = (props: OTPProps, ref: (el: OTPRef | undefined) => void) => {
  const {
    prefixCls: customizePrefixCls,
    length = 6,
    size: customSize,
    defaultValue,
    value,
    onChange,
    formatter,
    variant,
    disabled,
    status: customStatus,
    autoFocus,
    mask,
    ...restProps
  } = props;

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Input.OTP');
    warning(
      !(typeof mask === 'string' && mask.length > 1),
      'usage',
      '`mask` prop should be a single character.',
    );
  }

  const { getPrefixCls, direction } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('otp', customizePrefixCls);

  const domAttrs = pickAttrs(restProps, {
    aria: true,
    data: true,
    attr: true,
  });

  // ========================= Root =========================
  // Style
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, useCSSVarCls(prefixCls));

  // ========================= Size =========================
  const mergedSize = useSize((ctx) => customSize ?? ctx);

  // ======================== Status ========================
  const formContext = useContext(FormItemInputContext);
  const mergedStatus = getMergedStatus(formContext.status, customStatus);

  const proxyFormContext = createMemo<FormItemStatusContextProps>(() => ({
    ...formContext,
    status: mergedStatus,
    hasFeedback: false,
    feedbackIcon: null,
  }));

  // ========================= Refs =========================
  const containerRef = createSignal<HTMLDivElement | undefined>();
  const refs = new Array(length).fill(null).map(() => createSignal<InputRef | null>(null));

  const focus = () => refs[0]?.()[0]?.focus();
  const blur = () => {
    refs.forEach((refSignal) => refSignal()[0]?.blur());
  };

  createEffect(() => {
    ref && ref({ focus, blur, nativeElement: containerRef()[0]! });
  });

  // ======================= Formatter ======================
  const internalFormatter = (txt: string) => (formatter ? formatter(txt) : txt);

  // ======================== Values ========================
  const [valueCells, setValueCells] = createSignal<string[]>(
    strToArr(internalFormatter(defaultValue || '')),
  );

  createEffect(() => {
    if (value !== undefined) {
      setValueCells(strToArr(value));
    }
  });

  const triggerValueCellsChange = (nextValueCells: string[]) => {
    setValueCells(nextValueCells);

    if (
      onChange &&
      nextValueCells.length === length &&
      nextValueCells.every((c) => c) &&
      nextValueCells.some((c, index) => valueCells()[index] !== c)
    ) {
      onChange(nextValueCells.join(''));
    }
  };

  const patchValue = (index: number, txt: string) => {
    let nextCells = [...valueCells()];

    for (let i = 0; i < index; i += 1) {
      if (!nextCells[i]) {
        nextCells[i] = '';
      }
    }

    if (txt.length <= 1) {
      nextCells[index] = txt;
    } else {
      nextCells = nextCells.slice(0, index).concat(strToArr(txt));
    }
    nextCells = nextCells.slice(0, length);

    for (let i = nextCells.length - 1; i >= 0; i -= 1) {
      if (nextCells[i]) {
        break;
      }
      nextCells.pop();
    }

    const formattedValue = internalFormatter(nextCells.map((c) => c || ' ').join(''));
    nextCells = strToArr(formattedValue).map((c, i) => {
      if (c === ' ' && !nextCells[i]) {
        return nextCells[i];
      }
      return c;
    });

    return nextCells;
  };

  const onInputChange: OTPInputProps['onChange'] = (index, txt) => {
    const nextCells = patchValue(index, txt);
    const nextIndex = Math.min(index + txt.length, length - 1);
    if (nextIndex !== index) {
      refs[nextIndex][0]?.focus();
    }

    triggerValueCellsChange(nextCells);
  };

  const onInputActiveChange: OTPInputProps['onActiveChange'] = (nextIndex) => {
    refs[nextIndex][0]?.focus();
  };

  // ======================== Render ========================
  const inputSharedProps: Partial<OTPInputProps> = {
    variant,
    disabled,
    status: mergedStatus as InputStatus,
    mask,
  };

  return wrapCSSVar(
    <div
      {...domAttrs}
      ref={containerRef}
      class={classNames(
        prefixCls,
        {
          [`${prefixCls}-sm`]: mergedSize === 'small',
          [`${prefixCls}-lg`]: mergedSize === 'large',
          [`${prefixCls}-rtl`]: direction === 'rtl',
        },
        cssVarCls,
        hashId,
      )}
    >
      <FormItemInputContext.Provider value={proxyFormContext()}>
        {Array.from({ length }).map((_, index) => {
          const key = `otp-${index}`;
          const singleValue = valueCells()[index] || '';
          return (
            <OTPInput
              ref={(inputEle) => refs[index][1](inputEle)}
              key={key}
              index={index}
              size={mergedSize}
              htmlSize={1}
              class={`${prefixCls}-input`}
              onChange={onInputChange}
              value={singleValue}
              onActiveChange={onInputActiveChange}
              autoFocus={index === 0 && autoFocus}
              {...inputSharedProps}
            />
          );
        })}
      </FormItemInputContext.Provider>
    </div>,
  );
};

export default OTP;
