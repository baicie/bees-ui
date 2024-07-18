import type { FullToken, GenerateStyle, GetDefaultToken } from '@bees-ui/core';
import { genStyleHooks } from '@bees-ui/core';
import type { CSSObject } from '@bees-ui/sc-cssinjs';

type AffixToken = FullToken<'Affix'>;

// ============================== Shared ==============================
const genSharedAffixStyle: GenerateStyle<AffixToken> = (token): CSSObject => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      position: 'fixed',
      zIndex: token.zIndexPopup,
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Affix'> = (token) => ({
  zIndexPopup: token.zIndexBase + 10,
});

// ============================== Export ==============================
export default genStyleHooks('Affix', genSharedAffixStyle, prepareComponentToken);
