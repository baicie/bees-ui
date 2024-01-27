import { ConfigContext, clsx, devUseWarning } from '@baicie/core';
import { omit } from '@baicie/sc-util';
// import Wave from '../_util/wave';
import { useSize } from '@baicie/config-provider';
import type { CSSProperties, SizeType } from '@baicie/core';
import { DisabledContext, useCompactItemContext } from '@baicie/core';
import type { ComponentOptions } from '@baicie/solid-element';
import {
  createEffect,
  createMemo,
  createSignal,
  useContext,
  type JSX,
  type JSXElement,
} from 'solid-js';
import IconWrapper from './IconWrapper';
import LoadingIcon from './LoadingIcon';
import { GroupSizeContext } from './button-group';
import type { ButtonHTMLType, ButtonShape, ButtonType } from './buttonHelpers';
import { isTwoCNChar, isUnBorderedButtonType } from './buttonHelpers';
import useStyle from './style';
// import CompactCmp from './style/compactCmp';

export type LegacyButtonType = ButtonType | 'danger';

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: JSXElement;
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
  children?: JSXElement;
  [key: `data-${string}`]: string;
  classNames?: { icon: string };
  styles?: { icon: CSSProperties };
}

type MergedHTMLAttributes = Omit<
  JSX.HTMLAttributes<HTMLElement> &
    JSX.ButtonHTMLAttributes<HTMLElement> &
    JSX.AnchorHTMLAttributes<HTMLElement>,
  'type'
>;

export interface ButtonProps extends BaseButtonProps, MergedHTMLAttributes {
  href?: string;
  htmlType?: ButtonHTMLType;
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

const InternalButton = (props: ButtonProps, { element }: ComponentOptions) => {
  const {
    loading = false,
    prefixCls: customizePrefixCls,
    type = 'default',
    danger,
    shape = 'default',
    size: customizeSize,
    styles,
    disabled: customDisabled,
    className,
    rootClassName,
    children,
    icon,
    ghost = false,
    block = false,
    htmlType = 'button',
    classNames: customClassNames,
    style: customStyle = {},
    ...rest
  } = props;

  const { getPrefixCls, autoInsertSpaceInButton, direction, button } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('btn', customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(
    prefixCls,
    element.renderRoot as HTMLElement | ShadowRoot,
  );

  const disabled = useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const groupSize = useContext(GroupSizeContext);

  const loadingOrDelay = createMemo<LoadingConfigType>(() => getLoadingConfig(loading));

  const [innerLoading, setLoading] = createSignal<boolean>(loadingOrDelay().loading);

  const [hasTwoCNChar, setHasTwoCNChar] = createSignal<boolean>(false);

  let buttonRef: any;

  const needInserted = !icon && !isUnBorderedButtonType(type);

  createEffect(() => {
    let delayTimer: ReturnType<typeof setTimeout> | null = null;
    if (loadingOrDelay().delay > 0) {
      delayTimer = setTimeout(() => {
        delayTimer = null;
        setLoading(true);
      }, loadingOrDelay().delay);
    } else {
      setLoading(loadingOrDelay().loading);
    }

    function cleanupTimer() {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
      }
    }

    return cleanupTimer;
  });

  createEffect(() => {
    // FIXME: for HOC usage like <FormatMessage />
    if (!buttonRef || !(buttonRef as any).current || autoInsertSpaceInButton === false) {
      return;
    }
    const buttonText = (buttonRef as any).current.textContent;
    if (needInserted && isTwoCNChar(buttonText)) {
      if (!hasTwoCNChar) {
        setHasTwoCNChar(true);
      }
    } else if (hasTwoCNChar()) {
      setHasTwoCNChar(false);
    }
  });

  const handleClick = (e: any) => {
    const { onClick } = props;
    if (innerLoading() || mergedDisabled) {
      e.preventDefault();
      return;
    }
    (onClick as any)?.(e);
  };

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Button');

    warning(
      !(typeof icon === 'string' && icon.length > 2),
      'breaking',
      `\`icon\` is using ReactNode instead of string naming in v4. Please check \`${icon}\` at https://ant.design/components/icon`,
    );

    warning(
      !(ghost && isUnBorderedButtonType(type)),
      'usage',
      "`link` or `text` button can't be a `ghost` button.",
    );
  }

  const autoInsertSpace = autoInsertSpaceInButton !== false;
  const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);

  const sizeClassNameMap = { large: 'lg', small: 'sm', middle: undefined };

  const sizeFullName = useSize((ctxSize) => customizeSize ?? compactSize ?? groupSize ?? ctxSize);

  const sizeCls = sizeFullName ? sizeClassNameMap[sizeFullName()!] || '' : '';

  const iconType = innerLoading() ? 'loading' : icon;

  const linkButtonRestProps = omit(rest as ButtonProps & { navigate: any }, ['navigate']);

  const classes = clsx(
    prefixCls,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-${shape}`]: shape !== 'default' && shape,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
      [`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonType(type),
      [`${prefixCls}-loading`]: innerLoading,
      [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar() && autoInsertSpace && !innerLoading,
      [`${prefixCls}-block`]: block,
      [`${prefixCls}-dangerous`]: !!danger,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    compactItemClassnames,
    className,
    rootClassName,
    button?.className,
  );

  const fullStyle: CSSProperties = {
    ...button?.style,
    ...(typeof customStyle === 'object' ? customStyle : {}),
  };

  const iconClasses = clsx(customClassNames?.icon, button?.className);
  const iconStyle: CSSProperties = {
    ...(styles?.icon || {}),
    ...(button?.style || {}),
  };

  const iconNode =
    icon && !innerLoading ? (
      <IconWrapper prefixCls={prefixCls} className={iconClasses as any} style={iconStyle as any}>
        {icon as any}
      </IconWrapper>
    ) : (
      <LoadingIcon existIcon={!!icon} prefixCls={prefixCls} loading={!!innerLoading} />
    );

  const kids = null;
  // children || children === 0 ? spaceChildren(children, needInserted && autoInsertSpace) : null;

  if (linkButtonRestProps.href !== undefined) {
    return wrapCSSVar(
      <a
        {...linkButtonRestProps}
        class={clsx(classes, {
          [`${prefixCls}-disabled`]: mergedDisabled,
        })}
        href={mergedDisabled ? undefined : linkButtonRestProps.href}
        style={fullStyle as any}
        onClick={handleClick}
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
      style={fullStyle as any}
      onClick={handleClick}
      disabled={mergedDisabled}
      ref={buttonRef}
    >
      {/* {iconNode}
      {kids} */}
      <p>
        <slot name="my-text">My default text</slot>
      </p>
      {/* Styles: compact */}
      {/* {!!compactItemClassnames && <CompactCmp prefixCls={prefixCls} />} */}
    </button>
  );

  // if (!isUnBorderedButtonType(type)) {
  //   buttonNode =
  //   (
  //     <Wave component="Button" disabled={!!innerLoading}>
  //     { buttonNode }
  //     </Wave>
  //   );
  // }

  return wrapCSSVar(buttonNode);
};

const Button = InternalButton;

export default Button;
