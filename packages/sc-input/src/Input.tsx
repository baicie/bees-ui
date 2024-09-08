import clsx from 'clsx';
import { createEffect, createSignal, splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

import BaseInput from './BaseInput';
import useCount from './hooks/useCount';
import type { ChangeEventInfo, InputProps } from './interface';
import type { InputFocusOptions } from './utils/commonUtils';
import { resolveOnChange, triggerFocus } from './utils/commonUtils';

const Input = (props: InputProps) => {
  const [local, rest] = splitProps(props, [
    'autoComplete',
    'onChange',
    'onFocus',
    'onBlur',
    'onPressEnter',
    'onKeyDown',
    'onKeyUp',
    'prefixCls',
    'disabled',
    'htmlSize',
    'className',
    'maxLength',
    'suffix',
    'showCount',
    'count',
    'type',
    'classes',
    'classNames',
    'styles',
    'onCompositionStart',
    'onCompositionEnd',
    'hidden',
  ]);

  const prefixCls = local.prefixCls || 'rc-input';
  const [focused, setFocused] = createSignal(false);
  const compositionRef = { current: false };
  const keyLockRef = { current: false };

  let inputRef: HTMLInputElement | HTMLTextAreaElement;
  // let holderRef;

  // ====================== Value =======================
  const [value, setValue] = createSignal(props.value ?? props.defaultValue ?? '');

  const formatValue = value === undefined || value === null ? '' : String(value);

  // =================== Select Range ===================
  const [selection, setSelection] = createSignal(null);

  // ====================== Count =======================
  const countConfig = useCount(local.count, local.showCount);
  const mergedMax = countConfig().max || (local.maxLength as number);
  const valueLength = () => countConfig().strategy(formatValue);

  const isOutOfRange = () => !!mergedMax && valueLength() > mergedMax;

  // ====================== Ref =========================
  const focus = (option?: InputFocusOptions) => {
    if (inputRef) {
      triggerFocus(inputRef, option);
    }
  };

  // const blur = () => {
  //   inputRef?.blur();
  // };

  // Watch for disabled state
  createEffect(() => {
    if (local.disabled && focused()) {
      setFocused(false);
    }
  });

  const triggerChange = (
    e: MouseEvent | Event | CompositionEvent,
    currentValue: string,
    info: ChangeEventInfo,
  ) => {
    let cutValue = currentValue;

    if (
      !compositionRef.current &&
      countConfig().exceedFormatter &&
      countConfig().max &&
      countConfig().strategy(currentValue) > countConfig().max
    ) {
      cutValue = countConfig().exceedFormatter(currentValue, {
        max: countConfig().max,
      });

      if (currentValue !== cutValue) {
        setSelection([inputRef.selectionStart || 0, inputRef.selectionEnd || 0]);
      }
    } else if (info.source === 'compositionEnd') {
      return;
    }
    setValue(cutValue);

    if (inputRef) {
      resolveOnChange(inputRef, e, local.onChange as any, cutValue);
    }
  };

  createEffect(() => {
    if (selection()) {
      inputRef?.setSelectionRange(selection()[0], selection()[1]);
    }
  });

  const onInternalChange: JSX.CustomEventHandlersCamelCase<any>['onChange'] = (e) => {
    triggerChange(e, e.target.value, {
      source: 'change',
    });
  };

  const onInternalCompositionEnd: JSX.DOMAttributes<any>['onCompositionEnd'] = (e) => {
    compositionRef.current = false;
    triggerChange(e, e.currentTarget.value, {
      source: 'compositionEnd',
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    local.onCompositionEnd?.(e);
  };

  const handleKeyDown: JSX.CustomEventHandlersCamelCase<any>['onKeyDown'] = (e) => {
    if (local.onPressEnter && e.key === 'Enter' && !keyLockRef.current) {
      keyLockRef.current = true;
      local.onPressEnter(e);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    local.onKeyDown?.(e);
  };

  const handleKeyUp: JSX.CustomEventHandlersCamelCase<any>['onKeyUp'] = (e) => {
    if (e.key === 'Enter') {
      keyLockRef.current = false;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    local.onKeyUp?.(e);
  };

  const handleFocus: JSX.CustomEventHandlersCamelCase<any>['onFocus'] = (e) => {
    setFocused(true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    local.onFocus?.(e);
  };

  const handleBlur: JSX.CustomEventHandlersCamelCase<any>['onBlur'] = (e) => {
    setFocused(false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    local.onBlur?.(e);
  };

  const handleReset = (e: CompositionEvent | Event | MouseEvent) => {
    setValue('');
    focus();
    resolveOnChange(inputRef, e, local.onChange as any);
  };

  const getInputElement = () => {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      <input
        autocomplete={local.autoComplete}
        {...rest}
        onChange={onInternalChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        class={clsx(
          prefixCls,
          { [`${prefixCls}-disabled`]: local.disabled },
          local.classNames?.input,
        )}
        style={local.styles?.input}
        ref={inputRef as any}
        size={local.htmlSize}
        type={local.type || 'text'}
        onCompositionStart={(e) => {
          compositionRef.current = true;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          local.onCompositionStart?.(e);
        }}
        onCompositionEnd={onInternalCompositionEnd}
      />
    );
  };

  const getSuffix = () => {
    const hasMaxLength = Number(mergedMax) > 0;

    if (local.suffix || countConfig().show) {
      const dataCount = countConfig().showFormatter
        ? countConfig().showFormatter({
            value: formatValue,
            count: valueLength(),
            maxLength: mergedMax,
          })
        : `${valueLength()}${hasMaxLength ? ` / ${mergedMax}` : ''}`;

      return (
        <>
          {countConfig().show && (
            <span
              class={clsx(
                `${prefixCls}-show-count-suffix`,
                { [`${prefixCls}-show-count-has-suffix`]: !!local.suffix },
                local.classNames?.count,
              )}
              style={local.styles?.count}
            >
              {dataCount}
            </span>
          )}
          {local.suffix}
        </>
      );
    }
    return null;
  };

  return (
    <BaseInput
      {...rest}
      prefixCls={prefixCls}
      className={clsx(local.className, isOutOfRange() && `${prefixCls}-out-of-range`)}
      handleReset={handleReset}
      value={formatValue}
      focused={focused()}
      triggerFocus={focus}
      suffix={getSuffix()}
      disabled={local.disabled}
      classes={local.classes}
      classNames={local.classNames}
      styles={local.styles}
      hidden={local.hidden}
    >
      {getInputElement()}
    </BaseInput>
  );
};

export default Input;
