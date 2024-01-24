import useCacheToken from './hooks/use-cache-token';
import type { CSSInterpolation, CSSObject } from './hooks/use-style-register';
import useStyleRegister, { extractStyle } from './hooks/use-style-register';
import Keyframes from './key-frames';
import type { Linter } from './linters';
import { legacyNotSelectorLinter, logicalPropertiesLinter, parentSelectorLinter } from './linters';
import type { StyleContextProps } from './style-context';
import { createCache } from './style-context';
import type { DerivativeFunc, TokenType } from './theme';
import { createTheme, Theme } from './theme';
import type { Transformer } from './transformers/interface';
import legacyLogicalPropertiesTransformer from './transformers/legacy-logical-properties';
import px2remTransformer from './transformers/px2rem';
import { supportLogicProps, supportWhere } from './util';

const cssinjs = {
  Theme,
  createTheme,
  useStyleRegister,
  useCacheToken,
  createCache,
  // useStyleInject,
  // useStyleProvider,
  Keyframes,
  extractStyle,

  // Transformer
  legacyLogicalPropertiesTransformer,
  px2remTransformer,

  // Linters
  logicalPropertiesLinter,
  legacyNotSelectorLinter,
  parentSelectorLinter,

  // cssinjs
  // StyleProvider,
};
export {
  Theme,
  createTheme,
  useStyleRegister,
  useCacheToken,
  createCache,
  // useStyleInject,
  // useStyleProvider,
  Keyframes,
  extractStyle,

  // Transformer
  legacyLogicalPropertiesTransformer,
  px2remTransformer,

  // Linters
  logicalPropertiesLinter,
  legacyNotSelectorLinter,
  parentSelectorLinter,

  // cssinjs
  // StyleProvider,
};
export type {
  TokenType,
  CSSObject,
  CSSInterpolation,
  DerivativeFunc,
  Transformer,
  Linter,
  StyleContextProps,
  // StyleProviderProps,
};

export const _experimental = {
  supportModernCSS: () => supportWhere() && supportLogicProps(),
};

export default cssinjs;
