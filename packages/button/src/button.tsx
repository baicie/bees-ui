import { Accessor, JSX, JSXElement, createEffect, createMemo, createSignal, useContext } from "solid-js";
import { ButtonHTMLType, ButtonShape, ButtonType, isTwoCNChar, isUnBorderedButtonType, spaceChildren } from "./buttonHelpers";
import type { SizeType } from '@baicie/config-provider';
import { ConfigContext, DisabledContext, useSize } from '@baicie/config-provider';
import useStyle from './style';
import { GroupSizeContext } from "./button-group";
import { warning } from "@baicie/util";
import classNames from "classnames";
import IconWrapper from "./IconWrapper";

export type LegacyButtonType = ButtonType | 'danger';

type MergedHTMLAttributes = Omit<
  JSX.IntrinsicElements['div'] &
  JSX.IntrinsicElements['button'] &
  JSX.IntrinsicElements['a'],
  'type'
>;
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
  styles?: { icon: JSX.CSSProperties };
  htmlType?: ButtonHTMLType;
}

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

export const button = (props: ButtonProps,) => {
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
    // style: customStyle = {},
    ...rest
  } = props;

  const { getPrefixCls, autoInsertSpaceInButton, direction, button } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('btn', customizePrefixCls);

  try {
    const [wrapCSSVar, hashId,] = useStyle(prefixCls);

    const disabled = useContext(DisabledContext);
    const mergedDisabled = customDisabled ?? disabled;

  } catch (error) {
    console.log('errpr', error);
  }
  const [wrapCSSVar, hashId,] = useStyle(prefixCls);

  const disabled = useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const groupSize = useContext(GroupSizeContext);

  const loadingOrDelay = createMemo<LoadingConfigType>(() => getLoadingConfig(loading));

  const [innerLoading, setLoading] = createSignal<boolean>(loadingOrDelay().loading);

  const [hasTwoCNChar, setHasTwoCNChar] = createSignal<boolean>(false);

  let internalRef: HTMLButtonElement | HTMLAnchorElement

  let buttonRef: undefined

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
  }, [loadingOrDelay]);

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
    } else if (hasTwoCNChar) {
      setHasTwoCNChar(false);
    }
  }, [buttonRef]);

  const handleClick = (e: MouseEvent) => {
    const { onClick } = props;

    if (innerLoading() || mergedDisabled) {
      e.preventDefault();
      return;
    }

    //@ts-ignore
    onClick?.(e);
  };

  if (process.env.NODE_ENV !== 'production') {
    // const warning = devUseWarning('Button');

    warning(
      !(typeof icon === 'string' && icon.length > 2),
      `\`icon\` is using ReactNode instead of string naming in v4. Please check \`${icon}\` at https://ant.design/components/icon`,
    );

    warning(
      !(ghost && isUnBorderedButtonType(type)),
      "`link` or `text` button can't be a `ghost` button.",
    );
  }

  const autoInsertSpace = autoInsertSpaceInButton !== false;
  // const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);

  // @ts-ignore
  const sizeClassNameMap = { large: 'lg', small: 'sm', middle: undefined };

  const sizeFullName = useSize<SizeType>((ctxSize) => customizeSize ?? groupSize ?? ctxSize);

  const sizeCls = sizeFullName ? sizeClassNameMap[sizeFullName()] || '' : '';

  const iconType = innerLoading ? 'loading' : icon;

  // const linkButtonRestProps = omit(rest as ButtonProps & { navigate: any }, ['navigate']);

  const classes = classNames(
    prefixCls,
    hashId,
    {
      [`${prefixCls}-${shape}`]: shape !== 'default' && shape,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
      [`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonType(type),
      [`${prefixCls}-loading`]: innerLoading,
      [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && autoInsertSpace && !innerLoading,
      [`${prefixCls}-block`]: block,
      [`${prefixCls}-dangerous`]: !!danger,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    // compactItemClassnames,
    className,
    rootClassName,
    button?.className,
  );

  const fullStyle: JSX.CSSProperties = { ...button?.style, };

  const iconClasses = classNames(customClassNames?.icon, button?.classNames?.icon);
  const iconStyle: JSX.CSSProperties = {
    ...(styles?.icon || {}),
    ...(button?.styles?.icon || {}),
  };

  const iconNode =
    icon && !innerLoading ? (
      <IconWrapper prefixCls={prefixCls} className={iconClasses} style={iconStyle}>
        {icon}
      </IconWrapper>
    ) : (
      // <LoadingIcon existIcon={!!icon} prefixCls={prefixCls} loading={!!innerLoading} />
      null
    );

  // const kids =
  //   children || children === 0 ? spaceChildren(children, needInserted && autoInsertSpace) : null;

  // if (linkButtonRestProps.href !== undefined) {
  //   return wrapCSSVar(
  //     <a
  //       {...linkButtonRestProps}
  //       className={classNames(classes, {
  //         [`${prefixCls}-disabled`]: mergedDisabled,
  //       })}
  //       href={mergedDisabled ? undefined : linkButtonRestProps.href}
  //       style={fullStyle}
  //       onClick={handleClick}
  //       ref={buttonRef as React.Ref<HTMLAnchorElement>}
  //       tabIndex={mergedDisabled ? -1 : 0}
  //     >
  //       {iconNode}
  //       {kids}
  //     </a>,
  //   );
  // }
  console.log('children', children);

  let buttonNode = (
    <button
      {...rest}
      type={htmlType}
      class={classes}
      style={fullStyle}
      onClick={handleClick}
      disabled={mergedDisabled}
      ref={buttonRef as Accessor<HTMLButtonElement>}
    >
      {iconNode}
      {/* {kids} */}
      {children}

      {/* Styles: compact */}
      {/* {!!compactItemClassnames && <CompactCmp key="compact" prefixCls={prefixCls} />} */}
    </button>
  );

  if (!isUnBorderedButtonType(type)) {
    // buttonNode = (
    //   <Wave component="Button" disabled={!!innerLoading}>
    //     {buttonNode}
    //   </Wave>
    // );
  }

  return wrapCSSVar(buttonNode);
  [key: `data-${string}`]: string;
  classNames ?: { icon: string };
  styles ?: { icon: React.CSSProperties };
  htmlType ?: ButtonHTMLType;
}

export interface ButtonProps extends BaseButtonProps {
=======
>>>>>>> ebe2878 (feat: button show)
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

export const button = (props: ButtonProps,) => {
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
    // style: customStyle = {},
    ...rest
  } = props;

  const { getPrefixCls, autoInsertSpaceInButton, direction, button } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('btn', customizePrefixCls);

  try {
    const [wrapCSSVar, hashId,] = useStyle(prefixCls);

    const disabled = useContext(DisabledContext);
    const mergedDisabled = customDisabled ?? disabled;

  } catch (error) {
    console.log('errpr', error);
  }
  const [wrapCSSVar, hashId,] = useStyle(prefixCls);

  const disabled = useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const groupSize = useContext(GroupSizeContext);

  const loadingOrDelay = createMemo<LoadingConfigType>(() => getLoadingConfig(loading));

  const [innerLoading, setLoading] = createSignal<boolean>(loadingOrDelay().loading);

  const [hasTwoCNChar, setHasTwoCNChar] = createSignal<boolean>(false);

  let internalRef: HTMLButtonElement | HTMLAnchorElement

  let buttonRef: undefined

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
  }, [loadingOrDelay]);

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
    } else if (hasTwoCNChar) {
      setHasTwoCNChar(false);
    }
  }, [buttonRef]);

  const handleClick = (e: MouseEvent) => {
    const { onClick } = props;

    if (innerLoading() || mergedDisabled) {
      e.preventDefault();
      return;
    }

    //@ts-ignore
    onClick?.(e);
  };

  if (process.env.NODE_ENV !== 'production') {
    // const warning = devUseWarning('Button');

    warning(
      !(typeof icon === 'string' && icon.length > 2),
      `\`icon\` is using ReactNode instead of string naming in v4. Please check \`${icon}\` at https://ant.design/components/icon`,
    );

    warning(
      !(ghost && isUnBorderedButtonType(type)),
      "`link` or `text` button can't be a `ghost` button.",
    );
  }

  const autoInsertSpace = autoInsertSpaceInButton !== false;
  // const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);

  // @ts-ignore
  const sizeClassNameMap = { large: 'lg', small: 'sm', middle: undefined };

  const sizeFullName = useSize<SizeType>((ctxSize) => customizeSize ?? groupSize ?? ctxSize);

  const sizeCls = sizeFullName ? sizeClassNameMap[sizeFullName()] || '' : '';

  const iconType = innerLoading ? 'loading' : icon;

  // const linkButtonRestProps = omit(rest as ButtonProps & { navigate: any }, ['navigate']);

  const classes = classNames(
    prefixCls,
    hashId,
    {
      [`${prefixCls}-${shape}`]: shape !== 'default' && shape,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
      [`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonType(type),
      [`${prefixCls}-loading`]: innerLoading,
      [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && autoInsertSpace && !innerLoading,
      [`${prefixCls}-block`]: block,
      [`${prefixCls}-dangerous`]: !!danger,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    // compactItemClassnames,
    className,
    rootClassName,
    button?.className,
  );

  const fullStyle: JSX.CSSProperties = { ...button?.style, };

  const iconClasses = classNames(customClassNames?.icon, button?.classNames?.icon);
  const iconStyle: JSX.CSSProperties = {
    ...(styles?.icon || {}),
    ...(button?.styles?.icon || {}),
  };

  const iconNode =
    icon && !innerLoading ? (
      <IconWrapper prefixCls={prefixCls} className={iconClasses} style={iconStyle}>
        {icon}
      </IconWrapper>
    ) : (
      // <LoadingIcon existIcon={!!icon} prefixCls={prefixCls} loading={!!innerLoading} />
      null
    );

  // const kids =
  //   children || children === 0 ? spaceChildren(children, needInserted && autoInsertSpace) : null;

  // if (linkButtonRestProps.href !== undefined) {
  //   return wrapCSSVar(
  //     <a
  //       {...linkButtonRestProps}
  //       className={classNames(classes, {
  //         [`${prefixCls}-disabled`]: mergedDisabled,
  //       })}
  //       href={mergedDisabled ? undefined : linkButtonRestProps.href}
  //       style={fullStyle}
  //       onClick={handleClick}
  //       ref={buttonRef as React.Ref<HTMLAnchorElement>}
  //       tabIndex={mergedDisabled ? -1 : 0}
  //     >
  //       {iconNode}
  //       {kids}
  //     </a>,
  //   );
  // }
  console.log('children', children);

  let buttonNode = (
    <button
      {...rest}
      type={htmlType}
      class={classes}
      style={fullStyle}
      onClick={handleClick}
      disabled={mergedDisabled}
      ref={buttonRef as Accessor<HTMLButtonElement>}
    >
      {iconNode}
      {/* {kids} */}
      {children}

      {/* Styles: compact */}
      {/* {!!compactItemClassnames && <CompactCmp key="compact" prefixCls={prefixCls} />} */}
    </button>
  );

  if (!isUnBorderedButtonType(type)) {
    // buttonNode = (
    //   <Wave component="Button" disabled={!!innerLoading}>
    //     {buttonNode}
    //   </Wave>
    // );
  }

  return wrapCSSVar(buttonNode);
}
