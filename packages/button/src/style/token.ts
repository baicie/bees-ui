import type { FullToken, GetDefaultToken, GenStyleFn, CSSProperties } from '@baicie/core';
import { getLineHeight, mergeToken } from '@baicie/core';

export interface ButtonToken extends FullToken<'Button'> {
  buttonPaddingHorizontal: CSSProperties['paddingInline'];
  buttonPaddingVertical: CSSProperties['paddingBlock'];
  buttonIconOnlyFontSize: number;
}

export const prepareToken: (token: Parameters<GenStyleFn<'Button'>>[0]) => ButtonToken = (
  token,
) => {
  const { paddingInline, onlyIconSize, paddingBlock } = token;

  const buttonToken = mergeToken<ButtonToken>(token, {
    buttonPaddingHorizontal: paddingInline,
    buttonPaddingVertical: paddingBlock,
    buttonIconOnlyFontSize: onlyIconSize,
  });

  return buttonToken;
};

export const prepareComponentToken: GetDefaultToken<'Button'> = (token) => {
  const contentFontSize = token.contentFontSize ?? token.fontSize;
  const contentFontSizeSM = token.contentFontSizeSM ?? token.fontSize;
  const contentFontSizeLG = token.contentFontSizeLG ?? token.fontSizeLG;
  const contentLineHeight = token.contentLineHeight ?? getLineHeight(contentFontSize);
  const contentLineHeightSM = token.contentLineHeightSM ?? getLineHeight(contentFontSizeSM);
  const contentLineHeightLG = token.contentLineHeightLG ?? getLineHeight(contentFontSizeLG);

  return {
    fontWeight: 400,
    defaultShadow: `0 ${token.controlOutlineWidth}px 0 ${token.controlTmpOutline}`,
    primaryShadow: `0 ${token.controlOutlineWidth}px 0 ${token.controlOutline}`,
    dangerShadow: `0 ${token.controlOutlineWidth}px 0 ${token.colorErrorOutline}`,
    primaryColor: token.colorTextLightSolid,
    dangerColor: token.colorTextLightSolid,
    borderColorDisabled: token.colorBorder,
    defaultGhostColor: token.colorBgContainer,
    ghostBg: 'transparent',
    defaultGhostBorderColor: token.colorBgContainer,
    paddingInline: token.paddingContentHorizontal - token.lineWidth,
    paddingInlineLG: token.paddingContentHorizontal - token.lineWidth,
    paddingInlineSM: 8 - token.lineWidth,
    onlyIconSize: token.fontSizeLG,
    onlyIconSizeSM: token.fontSizeLG - 2,
    onlyIconSizeLG: token.fontSizeLG + 2,
    groupBorderColor: token.colorPrimaryHover,
    linkHoverBg: 'transparent',
    textHoverBg: token.colorBgTextHover,
    defaultColor: token.colorText,
    defaultBg: token.colorBgContainer,
    defaultBorderColor: token.colorBorder,
    defaultBorderColorDisabled: token.colorBorder,
    contentFontSize,
    contentFontSizeSM,
    contentFontSizeLG,
    contentLineHeight,
    contentLineHeightSM,
    contentLineHeightLG,
    paddingBlock: Math.max(
      (token.controlHeight - contentFontSize * contentLineHeight) / 2 - token.lineWidth,
      0,
    ),
    paddingBlockSM: Math.max(
      (token.controlHeightSM - contentFontSizeSM * contentLineHeightSM) / 2 - token.lineWidth,
      0,
    ),
    paddingBlockLG: Math.max(
      (token.controlHeightLG - contentFontSizeLG * contentLineHeightLG) / 2 - token.lineWidth,
      0,
    ),
  };
};
