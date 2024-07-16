// Style as inline component
import {
  genCompactItemStyle,
  genCompactItemVerticalStyle,
  genSubStyleComponent,
} from '@bees-ui/core';
import type { GenerateStyle } from '@bees-ui/core';
import { unit } from '@bees-ui/sc-cssinjs';

import type { ButtonToken } from './token';
import { prepareComponentToken, prepareToken } from './token';

const genButtonCompactStyle: GenerateStyle<ButtonToken> = (token) => {
  const { componentCls, calc } = token;

  return {
    [componentCls]: {
      // Special styles for Primary Button
      [`&-compact-item${componentCls}-primary`]: {
        [`&:not([disabled]) + ${componentCls}-compact-item${componentCls}-primary:not([disabled])`]:
          {
            position: 'relative',

            '&:before': {
              position: 'absolute',
              top: calc(token.lineWidth).mul(-1).equal(),
              insetInlineStart: calc(token.lineWidth).mul(-1).equal(),
              display: 'inline-block',
              width: token.lineWidth,
              height: `calc(100% + ${unit(token.lineWidth)} * 2)`,
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
                top: calc(token.lineWidth).mul(-1).equal(),
                insetInlineStart: calc(token.lineWidth).mul(-1).equal(),
                display: 'inline-block',
                width: `calc(100% + ${unit(token.lineWidth)} * 2)`,
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

// ============================== Export ==============================
export default genSubStyleComponent(
  ['Button', 'compact'],
  (token) => {
    const buttonToken = prepareToken(token);

    return [
      // Space Compact
      genCompactItemStyle(buttonToken),
      genCompactItemVerticalStyle(buttonToken),
      genButtonCompactStyle(buttonToken),
    ];
  },
  prepareComponentToken,
);
