import { AliasToken, DerivativeToken, GenerateStyle, PresetColorKey, PresetColors, mergeToken, useToken, } from './internal';
import genComponentStyleHook, { FullToken, OverrideComponent, TokenWithCommonCls } from './util/gen-component-style-hooks';

export {
  PresetColors, mergeToken, genComponentStyleHook, useToken
}

export type {
  AliasToken,
  OverrideComponent,
  PresetColorKey,
  GenerateStyle,

  DerivativeToken,
  FullToken,
  TokenWithCommonCls
}
