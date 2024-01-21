import type { CSSInterpolation, CSSObject } from '@baicie/cssinjs';
import type { FullToken, GenerateStyle } from '@baicie/theme';
import { genComponentStyleHook, mergeToken } from '@baicie/theme';
import genGroupStyle from './group';
import { genFocusStyle, genCompactItemStyle, } from '@baicie/style';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken { }

export type { ComponentToken };

// ============================== Shared ==============================
const genSharedButtonStyle: GenerateStyle<ButtonToken, CSSObject> = (token): CSSObject => {
  const { componentCls, iconCls, fontWeight } = token;

  return {
    [componentCls]: {
      outline: 'none',
      position: 'relative',
      display: 'inline-block',
      fontWeight,
      whiteSpace: 'nowrap',
      textAlign: 'center',
      backgroundImage: 'none',
      background: 'transparent',
      border: `${unit(token.lineWidth)} ${token.lineType} transparent`,
      cursor: 'pointer',
      transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
      userSelect: 'none',
      touchAction: 'manipulation',
      color: token.colorText,

      '&:disabled > *': {
        pointerEvents: 'none',
      },

      '> span': {
        display: 'inline-block',
      },

      [`${componentCls}-icon`]: {
        lineHeight: 0,
      },

      // Leave a space between icon and text.
      [`> ${iconCls} + span, > span + ${iconCls}`]: {
        marginInlineStart: token.marginXS,
      },

      [`&:not(${componentCls}-icon-only) > ${componentCls}-icon`]: {
        [`&${componentCls}-loading-icon, &:not(:last-child)`]: {
          marginInlineEnd: token.marginXS,
        },
      },

      '> a': {
        color: 'currentColor',
      },

      '&:not(:disabled)': {
        ...genFocusStyle(token),
      },

      [`&${componentCls}-two-chinese-chars::first-letter`]: {
        letterSpacing: '0.34em',
      },

      [`&${componentCls}-two-chinese-chars > *:not(${iconCls})`]: {
        marginInlineEnd: '-0.34em',
        letterSpacing: '0.34em',
      },

      // make `btn-icon-only` not too narrow
      [`&-icon-only${componentCls}-compact-item`]: {
        flex: 'none',
      },
      // Special styles for Primary Button
      [`&-compact-item${componentCls}-primary`]: {
        [`&:not([disabled]) + ${componentCls}-compact-item${componentCls}-primary:not([disabled])`]:
        {
          position: 'relative',

          '&:before': {
            position: 'absolute',
            top: -token.lineWidth,
            insetInlineStart: -token.lineWidth,
            display: 'inline-block',
            width: token.lineWidth,
            height: `calc(100% + ${token.lineWidth * 2}px)`,
            backgroundColor: token.colorPrimaryHover,
            content: '""',
          },
        },
      },
      // Special styles for Primary Button
      '&-compact-vertical-item': {
        [`&${componentCls}-primary`]: {
          [`&:not([disabled]) + ${componentCls}-compact-vertical-item${componentCls}-primary:not([disabled])`]:
          {
            position: 'relative',

            '&:before': {
              position: 'absolute',
              top: -token.lineWidth,
              insetInlineStart: -token.lineWidth,
              display: 'inline-block',
              width: `calc(100% + ${token.lineWidth * 2}px)`,
              height: token.lineWidth,
              backgroundColor: token.colorPrimaryHover,
              content: '""',
            },
          },
        },
      },
    },
  };
};

const genHoverActiveButtonStyle = (
  btnCls: string,
  hoverStyle: CSSObject,
  activeStyle: CSSObject,
): CSSObject => ({
  [`&:not(:disabled):not(${btnCls}-disabled)`]: {
    '&:hover': hoverStyle,
    '&:active': activeStyle,
  },
});

// ============================== Shape ===============================
const genCircleButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  minWidth: token.controlHeight,
  paddingInlineStart: 0,
  paddingInlineEnd: 0,
  borderRadius: '50%',
});

const genRoundButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  borderRadius: token.controlHeight,
  paddingInlineStart: token.calc(token.controlHeight).div(2).equal(),
  paddingInlineEnd: token.calc(token.controlHeight).div(2).equal(),
});

// =============================== Type ===============================
const genDisabledStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  cursor: 'not-allowed',
  borderColor: token.borderColorDisabled,
  color: token.colorTextDisabled,
  background: token.colorBgContainerDisabled,
  boxShadow: 'none',
});

const genGhostButtonStyle = (
  btnCls: string,
  background: string,
  textColor: string | false,
  borderColor: string | false,
  textColorDisabled: string | false,
  borderColorDisabled: string | false,
  hoverStyle?: CSSObject,
  activeStyle?: CSSObject,
): CSSObject => ({
  [`&${btnCls}-background-ghost`]: {
    color: textColor || undefined,
    background,
    borderColor: borderColor || undefined,
    boxShadow: 'none',

    ...genHoverActiveButtonStyle(
      btnCls,
      {
        background,
        ...hoverStyle,
      },
      {
        background,
        ...activeStyle,
      },
    ),

    '&:disabled': {
      cursor: 'not-allowed',
      color: textColorDisabled || undefined,
      borderColor: borderColorDisabled || undefined,
    },
  },
});

const genSolidDisabledButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  '&:disabled': {
    ...genDisabledStyle(token),
  },
});

const genSolidButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genSolidDisabledButtonStyle(token),
});

const genPureDisabledButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  '&:disabled': {
    cursor: 'not-allowed',
    color: token.colorTextDisabled,
  },
});

// Type: Default
const genDefaultButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genSolidButtonStyle(token),

  background: token.defaultBg,
  borderColor: token.defaultBorderColor,
  color: token.defaultColor,

  boxShadow: token.defaultShadow,

  ...genHoverActiveButtonStyle(
    token.componentCls,
    {
      color: token.colorPrimaryHover,
      borderColor: token.colorPrimaryHover,
    },
    {
      color: token.colorPrimaryActive,
      borderColor: token.colorPrimaryActive,
    },
  ),

  ...genGhostButtonStyle(
    token.componentCls,
    token.ghostBg,
    token.defaultGhostColor,
    token.defaultGhostBorderColor,
    token.colorTextDisabled,
    token.colorBorder,
  ),

  [`&${token.componentCls}-dangerous`]: {
    color: token.colorError,
    borderColor: token.colorError,

    ...genHoverActiveButtonStyle(
      token.componentCls,
      {
        color: token.colorErrorHover,
        borderColor: token.colorErrorBorderHover,
      },
      {
        color: token.colorErrorActive,
        borderColor: token.colorErrorActive,
      },
    ),

    ...genGhostButtonStyle(
      token.componentCls,
      token.ghostBg,
      token.colorError,
      token.colorError,
      token.colorTextDisabled,
      token.colorBorder,
    ),
    ...genSolidDisabledButtonStyle(token),
  },
});

// Type: Primary
const genPrimaryButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genSolidButtonStyle(token),

  color: token.primaryColor,
  background: token.colorPrimary,

  boxShadow: token.primaryShadow,

  ...genHoverActiveButtonStyle(
    token.componentCls,
    {
      color: token.colorTextLightSolid,
      background: token.colorPrimaryHover,
    },
    {
      color: token.colorTextLightSolid,
      background: token.colorPrimaryActive,
    },
  ),

  ...genGhostButtonStyle(
    token.componentCls,
    token.ghostBg,
    token.colorPrimary,
    token.colorPrimary,
    token.colorTextDisabled,
    token.colorBorder,
    {
      color: token.colorPrimaryHover,
      borderColor: token.colorPrimaryHover,
    },
    {
      color: token.colorPrimaryActive,
      borderColor: token.colorPrimaryActive,
    },
  ),

  [`&${token.componentCls}-dangerous`]: {
    background: token.colorError,
    boxShadow: token.dangerShadow,
    color: token.dangerColor,

    ...genHoverActiveButtonStyle(
      token.componentCls,
      {
        background: token.colorErrorHover,
      },
      {
        background: token.colorErrorActive,
      },
    ),

    ...genGhostButtonStyle(
      token.componentCls,
      token.ghostBg,
      token.colorError,
      token.colorError,
      token.colorTextDisabled,
      token.colorBorder,
      {
        color: token.colorErrorHover,
        borderColor: token.colorErrorHover,
      },
      {
        color: token.colorErrorActive,
        borderColor: token.colorErrorActive,
      },
    ),
    ...genSolidDisabledButtonStyle(token),
  },
});

// Type: Dashed
const genDashedButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genDefaultButtonStyle(token),
  borderStyle: 'dashed',
});

// Type: Link
const genLinkButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  color: token.colorLink,

  ...genHoverActiveButtonStyle(
    token.componentCls,
    {
      color: token.colorLinkHover,
      background: token.linkHoverBg,
    },
    {
      color: token.colorLinkActive,
    },
  ),

  ...genPureDisabledButtonStyle(token),

  [`&${token.componentCls}-dangerous`]: {
    color: token.colorError,

    ...genHoverActiveButtonStyle(
      token.componentCls,
      {
        color: token.colorErrorHover,
      },
      {
        color: token.colorErrorActive,
      },
    ),

    ...genPureDisabledButtonStyle(token),
  },
});

// Type: Text
const genTextButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genHoverActiveButtonStyle(
    token.componentCls,
    {
      color: token.colorText,
      background: token.textHoverBg,
    },
    {
      color: token.colorText,
      background: token.colorBgTextActive,
    },
  ),

  ...genPureDisabledButtonStyle(token),

  [`&${token.componentCls}-dangerous`]: {
    color: token.colorError,

    ...genPureDisabledButtonStyle(token),
    ...genHoverActiveButtonStyle(
      token.componentCls,
      {
        color: token.colorErrorHover,
        background: token.colorErrorBg,
      },
      {
        color: token.colorErrorHover,
        background: token.colorErrorBg,
      },
    ),
  },
});

// Href and Disabled
const genDisabledButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genDisabledStyle(token),
  [`&${token.componentCls}:hover`]: {
    ...genDisabledStyle(token),
  },
});

const genTypeButtonStyle: GenerateStyle<ButtonToken> = token => {
  const { componentCls } = token;

  return {
    [`${componentCls}-default`]: genDefaultButtonStyle(token),
    [`${componentCls}-primary`]: genPrimaryButtonStyle(token),
    [`${componentCls}-dashed`]: genDashedButtonStyle(token),
    [`${componentCls}-link`]: genLinkButtonStyle(token),
    [`${componentCls}-text`]: genTextButtonStyle(token),
    [`${componentCls}-ghost`]: genGhostButtonStyle(
      token.componentCls,
      token.ghostBg,
      token.colorBgContainer,
      token.colorBgContainer,
      token.colorTextDisabled,
      token.colorBorder,
    ),
  };
};

// =============================== Size ===============================
const genSizeButtonStyle = (token: ButtonToken, sizePrefixCls: string = ''): CSSInterpolation => {
  const {
    componentCls,
    controlHeight,
    fontSize,
    lineHeight,
    borderRadius,
    buttonPaddingHorizontal,
    iconCls,
    buttonPaddingVertical,
  } = token;

  const iconOnlyCls = `${componentCls}-icon-only`;

  return [
    // Size
    {
      [`${componentCls}${sizePrefixCls}`]: {
        fontSize,
        lineHeight,
        height: controlHeight,
        padding: `${unit(buttonPaddingVertical!)} ${unit(buttonPaddingHorizontal!)}`,
        borderRadius,

        [`&${iconOnlyCls}`]: {
          width: controlHeight,
          paddingInlineStart: 0,
          paddingInlineEnd: 0,
          [`&${componentCls}-round`]: {
            width: 'auto',
          },
          [iconCls]: {
            fontSize: token.buttonIconOnlyFontSize,
          },
        },

        // Loading
        [`&${componentCls}-loading`]: {
          opacity: token.opacityLoading,
          cursor: 'default',
        },

        [`${componentCls}-loading-icon`]: {
          transition: `width ${token.motionDurationSlow} ${token.motionEaseInOut}, opacity ${token.motionDurationSlow} ${token.motionEaseInOut}`,
        },
      },
    },

    // Shape - patch prefixCls again to override solid border radius style
    {
      [`${componentCls}${componentCls}-circle${sizePrefixCls}`]: genCircleButtonStyle(token),
    },
    {
      [`${componentCls}${componentCls}-round${sizePrefixCls}`]: genRoundButtonStyle(token),
    },
  ];
};

const genSizeBaseButtonStyle: GenerateStyle<ButtonToken> = token => genSizeButtonStyle(token);

const genSizeSmallButtonStyle: GenerateStyle<ButtonToken> = token => {
  const smallToken = mergeToken<ButtonToken>(token, {
    controlHeight: token.controlHeightSM,
    fontSize: token.contentFontSizeSM,
    lineHeight: token.contentLineHeightSM,
    padding: token.paddingXS,
    buttonPaddingHorizontal: token.paddingInlineSM,
    buttonPaddingVertical: token.paddingBlockSM,
    borderRadius: token.borderRadiusSM,
    buttonIconOnlyFontSize: token.onlyIconSizeSM,
  });

  return genSizeButtonStyle(smallToken, `${token.componentCls}-sm`);
};

const genSizeLargeButtonStyle: GenerateStyle<ButtonToken> = token => {
  const largeToken = mergeToken<ButtonToken>(token, {
    controlHeight: token.controlHeightLG,
    fontSize: token.contentFontSizeLG,
    lineHeight: token.contentLineHeightLG,
    buttonPaddingHorizontal: token.paddingInlineLG,
    buttonPaddingVertical: token.paddingBlockLG,
    borderRadius: token.borderRadiusLG,
    buttonIconOnlyFontSize: token.onlyIconSizeLG,
  });

  return genSizeButtonStyle(largeToken, `${token.componentCls}-lg`);
};

const genBlockButtonStyle: GenerateStyle<ButtonToken> = token => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      [`&${componentCls}-block`]: {
        width: '100%',
      },
    },
  };
};

// ============================== Export ==============================
// @ts-ignore
export default genComponentStyleHook('Button', token => {
  const { controlTmpOutline, paddingContentHorizontal } = token;
  const buttonToken = mergeToken<ButtonToken>(token, {
    colorOutlineDefault: controlTmpOutline,
    buttonPaddingHorizontal: paddingContentHorizontal,
  });

  // Size
  genSizeSmallButtonStyle(buttonToken),
    genSizeBaseButtonStyle(buttonToken),
    genSizeLargeButtonStyle(buttonToken),

    // Block
    genBlockButtonStyle(buttonToken),

    // Group (type, ghost, danger, loading)
    genTypeButtonStyle(buttonToken),

    // Group (type, ghost, danger, disabled, loading)
    genTypeButtonStyle(buttonToken),

    // Button Group
    genGroupStyle(buttonToken),

    // Space Compact
    genCompactItemStyle(token, { focus: false }),
    // genCompactItemVerticalStyle(token),
  ];
});
