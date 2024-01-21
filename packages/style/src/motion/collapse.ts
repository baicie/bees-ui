import { TokenWithCommonCls } from '@baicie/theme';
import type { AliasToken, GenerateStyle } from '@baicie/theme';

const genCollapseMotion: GenerateStyle<TokenWithCommonCls<AliasToken>> = (token) => ({
  [token.componentCls]: {
    // For common/openAnimation
    [`${token.antCls}-motion-collapse-legacy`]: {
      overflow: 'hidden',

      '&-active': {
        transition: `height ${token.motionDurationMid} ${token.motionEaseInOut},
        opacity ${token.motionDurationMid} ${token.motionEaseInOut} !important`,
      },
    },

    [`${token.antCls}-motion-collapse`]: {
      overflow: 'hidden',
      transition: `height ${token.motionDurationMid} ${token.motionEaseInOut},
        opacity ${token.motionDurationMid} ${token.motionEaseInOut} !important`,
    },
  },
});

export default genCollapseMotion;
