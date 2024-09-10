import { Wave } from '@bees-ui/_util';
import { useSize } from '@bees-ui/config-provider';
import type { CSSProperties, SizeType } from '@bees-ui/core';
import { clsx, devUseWarning, DisabledContext, useCompactItemContext } from '@bees-ui/core';
import type { ComponentOptions } from '@bees-ui/sc-element';
import { omit } from '@bees-ui/sc-util';
import { createSignal, onCleanup, onMount, splitProps, useContext, type JSX } from 'solid-js';

import { ConfigContext } from '../../context';
import { GroupSizeContext } from './button-group';
import type { ButtonHTMLType, ButtonShape, ButtonType } from './buttonHelpers';
import { isTwoCNChar, isUnBorderedButtonType } from './buttonHelpers';
import IconWrapper from './IconWrapper';
import LoadingIcon from './LoadingIcon';
import useStyle from './style';

export type LegacyButtonType = ButtonType | 'danger';

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: JSX.Element;
  iconPosition?: 'start' | 'end';
  shape?: ButtonShape;
  size?: SizeType;
  disabled?: boolean;
  loading?: boolean | { delay?: number };
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  ghost?: boolean;
  danger?: boolean;
  block?: boolean;
  [key: `data-${string}`]: string;
  classNames?: { icon: string };
  styles?: { icon: JSX.CSSProperties };
  style?: JSX.CSSProperties;
}

type MergedHTMLAttributes = Omit<
  JSX.HTMLAttributes<HTMLElement> &
    JSX.ButtonHTMLAttributes<HTMLElement> &
    JSX.AnchorHTMLAttributes<HTMLElement>,
  'type' | 'style' | 'children'
>;

export interface ButtonProps extends BaseButtonProps, MergedHTMLAttributes {
  href?: string;
  htmlType?: ButtonHTMLType;
  autoInsertSpace?: boolean;
}

type LoadingConfigType = {
  loading: boolean;
  delay: number;
};

function getLoadingConfig(loading: BaseButtonProps['loading']): LoadingConfigType {
  if (typeof loading === 'object' && loading) {
    let delay = loading?.delay;
    delay = !Number.isNaN(delay) && typeof delay === 'number' ? delay : 0;
    return {
      loading: delay <= 0,
      delay,
    };
  }

  return {
    loading: !!loading,
    delay: 0,
  };
}

function isArray(value: unknown) {
  return value instanceof Array;
}

const InternalCompoundedButton = (props: ButtonProps, options: ComponentOptions) => {
  const [local, rest] = splitProps(props, [
    'loading',
    'prefixCls',
    'type',
    'danger',
    'shape',
    'size',
    'styles',
    'disabled',
    'className',
    'rootClassName',
    'icon',
    'iconPosition',
    'ghost',
    'block',
    'htmlType',
    'classNames',
    'style',
    'autoInsertSpace',
  ]);

  const {
    loading = false,
    prefixCls: customizePrefixCls,
    type,
    danger = false,
    shape = 'default',
    size: customizeSize,
    styles,
    disabled: customDisabled,
    className,
    rootClassName,
    icon,
    iconPosition = 'start',
    ghost = false,
    block = false,
    htmlType = 'button',
    classNames: customClassNames,
    style: customStyle = {},
    autoInsertSpace,
  } = local;
  const children = options?.slots.default;
  const mergedType = type || 'default';

  const { getPrefixCls, direction, button } = useContext(ConfigContext);

  const mergedInsertSpace = autoInsertSpace ?? button?.autoInsertSpace ?? true;

  const prefixCls = getPrefixCls('btn', customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const disabled = useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const groupSize = useContext(GroupSizeContext);

  const loadingOrDelay = () => getLoadingConfig(loading);

  const [innerLoading, setInnerLoading] = createSignal(loadingOrDelay().loading);

  const [hasTwoCNChar, setHasTwoCNChar] = createSignal(false);

  let buttonRef: HTMLAnchorElement | HTMLButtonElement | undefined;

  const needInserted = () => {
    return (
      isArray(children) &&
      children.length === 1 &&
      !local.icon &&
      !isUnBorderedButtonType(mergedType)
    );
  };

  onMount(() => {
    let delayTimer: ReturnType<typeof setTimeout> | null = null;
    if (loadingOrDelay().delay > 0) {
      delayTimer = setTimeout(() => {
        delayTimer = null;
        setInnerLoading(true);
      }, loadingOrDelay().delay);
    } else {
      setInnerLoading(loadingOrDelay().loading);
    }

    onCleanup(() => {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
      }
    });
  });

  onMount(() => {
    if (!buttonRef || !autoInsertSpace) return;
    const buttonText = buttonRef.textContent;
    if (needInserted() && isTwoCNChar(buttonText)) {
      if (!hasTwoCNChar()) setHasTwoCNChar(true);
    } else if (hasTwoCNChar()) setHasTwoCNChar(false);
  });

  const handleClick = (e: MouseEvent) => {
    const { onClick } = props;
    if (innerLoading() || mergedDisabled) {
      e.preventDefault();
      return;
    }

    (onClick as (e: MouseEvent) => void)?.(e);
  };

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Button');

    warning(
      !(typeof icon === 'string' && icon.length > 2),
      'breaking',
      `\`icon\` is using ReactNode instead of string naming in v4. Please check \`${icon}\` at https://ant.design/components/icon`,
    );

    warning(
      !(ghost && isUnBorderedButtonType(mergedType)),
      'usage',
      "`link` or `text` button can't be a `ghost` button.",
    );
  }

  const { compactSize } = useCompactItemContext(prefixCls, direction);

  const sizeClassNameMap: Record<string, string | undefined> = {
    large: 'lg',
    small: 'sm',
    middle: undefined,
  };

  const sizeFullName = useSize((ctxSize) => customizeSize ?? compactSize ?? groupSize ?? ctxSize);

  const sizeCls = sizeFullName ? sizeClassNameMap[sizeFullName()!] || '' : '';

  const iconType = innerLoading() ? 'loading' : icon;

  const linkButtonRestProps = omit(rest as ButtonProps & { navigate: unknown }, ['navigate']);

  const classes = clsx(
    prefixCls,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-${shape}`]: shape !== 'default' && shape,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-icon-only`]: !children && !!iconType,
      [`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonType(type),
      [`${prefixCls}-loading`]: innerLoading(),
      [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar() && mergedInsertSpace && !innerLoading(),
      [`${prefixCls}-block`]: block,
      [`${prefixCls}-dangerous`]: danger,
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-icon-end`]: iconPosition === 'end',
    },
    className,
    rootClassName,
    button?.className,
  );

  const fullStyle = { ...button?.style, ...customStyle };

  const iconClasses = clsx(customClassNames?.icon, button?.classNames?.icon);
  const iconStyle = {
    ...(styles?.icon || {}),
    ...(button?.styles?.icon || {}),
  };

  const iconNode =
    icon && !innerLoading() ? (
      <IconWrapper prefixCls={prefixCls} className={iconClasses} style={iconStyle}>
        {icon}
      </IconWrapper>
    ) : (
      <LoadingIcon existIcon={!!icon} prefixCls={prefixCls} loading={innerLoading()} />
    );

  const kids = children ? children : null;

  if (linkButtonRestProps.href !== undefined) {
    return wrapCSSVar(
      <a
        {...linkButtonRestProps}
        className={clsx(classes, {
          [`${prefixCls}-disabled`]: mergedDisabled,
        })}
        href={mergedDisabled ? undefined : linkButtonRestProps.href}
        style={fullStyle as CSSProperties}
        onClick={handleClick}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        ref={buttonRef}
        tabIndex={mergedDisabled ? -1 : 0}
      >
        {iconNode}
        {kids}
      </a>,
    );
  }

  let buttonNode = (
    <button
      {...rest}
      type={htmlType}
      class={classes}
      style={fullStyle as CSSProperties}
      onClick={handleClick}
      disabled={mergedDisabled}
      ref={buttonRef as HTMLButtonElement}
    >
      {options?.slots.icon}
      {options?.slots.default}
      {/* {!!compactItemClassnames && <CompactCmp key="compact" prefixCls={prefixCls} />} */}
    </button>
  );

  if (!isUnBorderedButtonType(type)) {
    buttonNode = (
      <Wave component="Button" disabled={innerLoading()}>
        {buttonNode}
      </Wave>
    );
  }
  return wrapCSSVar(buttonNode);
};

const Button = Object.assign(InternalCompoundedButton, {
  // Group,
  __ANT_BUTTON: true,
});

export default Button;
