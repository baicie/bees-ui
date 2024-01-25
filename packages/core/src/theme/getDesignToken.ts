import { createTheme, getComputedToken } from '@baicie/sc-cssinjs';
import type { ThemeConfig } from '../config-provider/context';
import type { AliasToken } from './interface';
import defaultDerivative from './themes/default';
import seedToken from './themes/seed';
import formatToken from './util/alias';

const getDesignToken = (config?: ThemeConfig): AliasToken => {
  const theme = config?.algorithm ? createTheme(config.algorithm) : createTheme(defaultDerivative);
  const mergedToken = {
    ...seedToken,
    ...config?.token,
  };
  return getComputedToken(mergedToken, { override: config?.token }, theme, formatToken);
};

export default getDesignToken;
