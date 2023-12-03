import { TokenType, DerivativeFunc } from './interface';
import Theme from './theme';
import ThemeCache from './theme-cache';

const cacheThemes = new ThemeCache();

export default function createTheme<DesignToken extends TokenType, DerivativeToken extends TokenType>(
  derivatives: DerivativeFunc<DesignToken, DerivativeToken>[] | DerivativeFunc<DesignToken, DerivativeToken>,
) {
  const derivativeArr = Array.isArray(derivatives) ? derivatives : [derivatives];
  // Create new theme if not exist
  if (!cacheThemes.has(derivativeArr)) {
    cacheThemes.set(derivativeArr, new Theme(derivativeArr));
  }

  // Get theme from cache and return
  return cacheThemes.get(derivativeArr)!;
}
