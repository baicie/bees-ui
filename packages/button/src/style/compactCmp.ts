// Style as inline component
import type { ButtonToken } from './token';
import { prepareComponentToken, prepareToken } from './token';
import { genCompactItemStyle } from '@baicie/core';
import { genCompactItemVerticalStyle } from '@baicie/core';
import type { GenerateStyle } from '@baicie/core';
import { genSubStyleComponent } from '@baicie/core';
import { unit } from '@baicie/sc-cssinjs';

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
