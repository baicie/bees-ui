import { JSX, JSXElement, useContext } from "solid-js";
import { ButtonHTMLType, ButtonShape, ButtonType } from "./buttonHelpers";
import type { SizeType } from '@baicie/config-provider';
import { ConfigContext, DisabledContext } from '@baicie/config-provider';

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

export interface ButtonProps extends BaseButtonProps {
  href?: string;
  htmlType?: ButtonHTMLType;
}

export const button = (props: BaseButtonProps,) => {
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
    // React does not recognize the `htmlType` prop on a DOM element. Here we pick it out of `rest`.
    htmlType = 'button',
    classNames: customClassNames,
    // style: customStyle = {},
    ...rest
  } = props;

  const { getPrefixCls, autoInsertSpaceInButton, direction, button } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('btn', customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const disabled = useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const groupSize = useContext(GroupSizeContext);

  const loadingOrDelay = useMemo<LoadingConfigType>(() => getLoadingConfig(loading), [loading]);

  const [innerLoading, setLoading] = useState<boolean>(loadingOrDelay.loading);

  const [hasTwoCNChar, setHasTwoCNChar] = useState<boolean>(false);

  const internalRef = createRef<HTMLButtonElement | HTMLAnchorElement>();

  const buttonRef = composeRef(ref, internalRef);

  const needInserted = Children.count(children) === 1 && !icon && !isUnBorderedButtonType(type);

  useEffect(() => {
    let delayTimer: ReturnType<typeof setTimeout> | null = null;
    if (loadingOrDelay.delay > 0) {
      delayTimer = setTimeout(() => {
        delayTimer = null;
        setLoading(true);
      }, loadingOrDelay.delay);
    } else {
      setLoading(loadingOrDelay.loading);
    }

    function cleanupTimer() {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
      }
    }

    return cleanupTimer;
  }, [loadingOrDelay]);

  useEffect(() => {
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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    const { onClick } = props;
    // FIXME: https://github.com/ant-design/ant-design/issues/30207
    if (innerLoading || mergedDisabled) {
      e.preventDefault();
      return;
    }
    (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)?.(e);
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

  const sizeCls = sizeFullName ? sizeClassNameMap[sizeFullName] || '' : '';

  const iconType = innerLoading ? 'loading' : icon;

  const linkButtonRestProps = omit(rest as ButtonProps & { navigate: any }, ['navigate']);

  const classes = classNames(
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
      [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && autoInsertSpace && !innerLoading,
      [`${prefixCls}-block`]: block,
      [`${prefixCls}-dangerous`]: !!danger,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    compactItemClassnames,
    className,
    rootClassName,
    button?.className,
  );

  const fullStyle: React.CSSProperties = { ...button?.style, ...customStyle };

  const iconClasses = classNames(customClassNames?.icon, button?.classNames?.icon);
  const iconStyle: React.CSSProperties = {
    ...(styles?.icon || {}),
    ...(button?.styles?.icon || {}),
  };

  const iconNode =
    icon && !innerLoading ? (
      <IconWrapper prefixCls={prefixCls} className={iconClasses} style={iconStyle}>
        {icon}
      </IconWrapper>
    ) : (
      <LoadingIcon existIcon={!!icon} prefixCls={prefixCls} loading={!!innerLoading} />
    );

  const kids =
    children || children === 0 ? spaceChildren(children, needInserted && autoInsertSpace) : null;

  if (linkButtonRestProps.href !== undefined) {
    return wrapCSSVar(
      <a
        {...linkButtonRestProps}
        className={classNames(classes, {
          [`${prefixCls}-disabled`]: mergedDisabled,
        })}
        href={mergedDisabled ? undefined : linkButtonRestProps.href}
        style={fullStyle}
        onClick={handleClick}
        ref={buttonRef as React.Ref<HTMLAnchorElement>}
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
      className={classes}
      style={fullStyle}
      onClick={handleClick}
      disabled={mergedDisabled}
      ref={buttonRef as React.Ref<HTMLButtonElement>}
    >
      {iconNode}
      {kids}

      {/* Styles: compact */}
      {!!compactItemClassnames && <CompactCmp key="compact" prefixCls={prefixCls} />}
    </button>
  );

  if (!isUnBorderedButtonType(type)) {
    buttonNode = (
      <Wave component="Button" disabled={!!innerLoading}>
        {buttonNode}
      </Wave>
    );
  }

  return wrapCSSVar(buttonNode);
}
