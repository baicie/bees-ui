import clsx from 'clsx';
import { children, Show, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type { BaseInputProps } from './interface';
import { cloneChildren, hasAddon, hasPrefixSuffix } from './utils/commonUtils';

const BaseInput = (props: BaseInputProps) => {
  const [local] = splitProps(props, [
    'children',
    'prefixCls',
    'prefix',
    'suffix',
    'addonBefore',
    'addonAfter',
    'className',
    'style',
    'disabled',
    'readOnly',
    'focused',
    'triggerFocus',
    'allowClear',
    'value',
    'handleReset',
    'hidden',
    'classes',
    'classNames',
    'dataAttrs',
    'styles',
    'components',
    'onClear',
  ]);

  const AffixWrapperComponent = local.components?.affixWrapper || 'span';
  const GroupWrapperComponent = local.components?.groupWrapper || 'span';
  const WrapperComponent = local.components?.wrapper || 'span';
  const GroupAddonComponent = local.components?.groupAddon || 'span';

  const inputElement = children(() => local.children);

  const containerRef: HTMLDivElement | null = null;

  const onInputClick = (e: MouseEvent) => {
    if (containerRef?.contains(e.target as Element)) {
      local.triggerFocus?.();
    }
  };

  const hasAffix = hasPrefixSuffix(local);

  let element = cloneChildren(inputElement, {
    value: local.value,
    class: clsx(!hasAffix && local.classNames?.variant) || null,
  });

  // ================== Prefix & Suffix ================== //
  if (hasAffix) {
    let clearIcon = null;
    if (local.allowClear) {
      const needClear = !local.disabled && !local.readOnly && local.value;
      const clearIconCls = `${local.prefixCls}-clear-icon`;
      const iconNode =
        typeof local.allowClear === 'object' && local.allowClear?.clearIcon
          ? local.allowClear.clearIcon
          : '✖';

      clearIcon = (
        <span
          onClick={(e) => {
            local.handleReset?.(e);
            local.onClear?.();
          }}
          onMouseDown={(e) => e.preventDefault()}
          class={clsx(clearIconCls, {
            [`${clearIconCls}-hidden`]: !needClear,
            [`${clearIconCls}-has-suffix`]: !!local.suffix,
          })}
          role="button"
          tabIndex={-1}
        >
          {iconNode}
        </span>
      );
    }

    element = (
      <Dynamic
        component={AffixWrapperComponent}
        class={clsx(
          `${local.prefixCls}-affix-wrapper`,
          {
            [`${local.prefixCls}-disabled`]: local.disabled,
            [`${local.prefixCls}-focused`]: local.focused,
            [`${local.prefixCls}-readonly`]: local.readOnly,
          },
          local.classes?.affixWrapper,
          local.classNames?.affixWrapper,
        )}
        style={local.styles?.affixWrapper}
        onClick={onInputClick}
        ref={containerRef}
        {...local.dataAttrs?.affixWrapper}
      >
        <Show when={local.prefix}>
          <span
            class={clsx(`${local.prefixCls}-prefix`, local.classNames?.prefix)}
            style={local.styles?.prefix}
          >
            {local.prefix}
          </span>
        </Show>

        {element}

        <Show when={local.suffix || local.allowClear}>
          <span
            class={clsx(`${local.prefixCls}-suffix`, local.classNames?.suffix)}
            style={local.styles?.suffix}
          >
            {clearIcon}
            {local.suffix}
          </span>
        </Show>
      </Dynamic>
    );
  }

  // ================== Addon ================== //
  if (hasAddon(local)) {
    const wrapperCls = `${local.prefixCls}-group`;
    const mergedWrapperClassName = clsx(
      `${local.prefixCls}-wrapper`,
      wrapperCls,
      local.classes?.wrapper,
      local.classNames?.wrapper,
    );

    element = (
      <Dynamic
        component={GroupWrapperComponent}
        class={clsx(
          `${wrapperCls}-wrapper`,
          { [`${wrapperCls}-disabled`]: local.disabled },
          local.classes?.group,
          local.classNames?.groupWrapper,
        )}
      >
        <Dynamic component={WrapperComponent} class={mergedWrapperClassName}>
          {local.addonBefore && (
            <Dynamic component={GroupAddonComponent} class={`${wrapperCls}-addon`}>
              {local.addonBefore}
            </Dynamic>
          )}
          {element}
          {local.addonAfter && (
            <Dynamic component={GroupAddonComponent} class={`${wrapperCls}-addon`}>
              {local.addonAfter}
            </Dynamic>
          )}
        </Dynamic>
      </Dynamic>
    );
  }

  return element;
};

export default BaseInput;
