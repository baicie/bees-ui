import { AliasToken, FullToken, mergeToken } from '@bees-ui/core';
import { InputComponentToken } from '@bees-ui/token';

export interface SharedInputToken {
  inputAffixPadding: number;
}

export interface InputToken extends FullToken<'Input'>, SharedInputToken {}

export function initInputToken(token: AliasToken): SharedInputToken {
  return mergeToken<InputToken>(token, {
    inputAffixPadding: token.paddingXXS,
  });
}

export const initComponentToken = (token: AliasToken): InputComponentToken => {
  const {
    controlHeight,
    fontSize,
    lineHeight,
    lineWidth,
    controlHeightSM,
    controlHeightLG,
    fontSizeLG,
    lineHeightLG,
    paddingSM,
    controlPaddingHorizontalSM,
    controlPaddingHorizontal,
    colorFillAlter,
    colorPrimaryHover,
    colorPrimary,
    controlOutlineWidth,
    controlOutline,
    colorErrorOutline,
    colorWarningOutline,
    colorBgContainer,
  } = token;

  return {
    paddingBlock: Math.max(
      Math.round(((controlHeight - fontSize * lineHeight) / 2) * 10) / 10 - lineWidth,
      0,
    ),
    paddingBlockSM: Math.max(
      Math.round(((controlHeightSM - fontSize * lineHeight) / 2) * 10) / 10 - lineWidth,
      0,
    ),
    paddingBlockLG:
      Math.ceil(((controlHeightLG - fontSizeLG * lineHeightLG) / 2) * 10) / 10 - lineWidth,
    paddingInline: paddingSM - lineWidth,
    paddingInlineSM: controlPaddingHorizontalSM - lineWidth,
    paddingInlineLG: controlPaddingHorizontal - lineWidth,
    addonBg: colorFillAlter,
    activeBorderColor: colorPrimary,
    hoverBorderColor: colorPrimaryHover,
    activeShadow: `0 0 0 ${controlOutlineWidth}px ${controlOutline}`,
    errorActiveShadow: `0 0 0 ${controlOutlineWidth}px ${colorErrorOutline}`,
    warningActiveShadow: `0 0 0 ${controlOutlineWidth}px ${colorWarningOutline}`,
    hoverBg: colorBgContainer,
    activeBg: colorBgContainer,
    inputFontSize: fontSize,
    inputFontSizeLG: fontSizeLG,
    inputFontSizeSM: fontSize,
  };
};
