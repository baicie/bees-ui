import { generate } from '@ant-design/colors';
import { ColorPalettes, MapToken, PresetColorType, SeedToken } from '../../interface';
import { defaultPresetColors } from '../seed';
import genColorMapToken from '../shared/gen-color-map-token';
import { generateColorPalettes, generateNeutralColorPalettes } from './colors';
import genFontMapToken from '../shared/gen-font-map-token';
import genSizeMapToken from '../shared/gen-size-map-token';
import genControlHeight from '../shared/gen-control-height';
import genCommonMapToken from '../shared/gen-common-map-token';

export default function derivative(token: SeedToken): MapToken {
  const colorPalettes = (Object.keys(defaultPresetColors) as (keyof PresetColorType)[])
    .map((colorKey: keyof PresetColorType) => {
      const colors = generate(token[colorKey]);

      return new Array(10).fill(1).reduce((prev, _, i) => {
        prev[`${colorKey}-${i + 1}`] = colors[i];
        return prev;
      }, {}) as ColorPalettes;
    })
    .reduce((prev, cur) => {
      prev = {
        ...prev,
        ...cur,
      };
      return prev;
    }, {} as ColorPalettes);

  return {
    ...token,
    ...colorPalettes,
    // Colors
    ...genColorMapToken(token, {
      generateColorPalettes,
      generateNeutralColorPalettes,
    }),
    // Font
    ...genFontMapToken(token.fontSize),
    // Size
    ...genSizeMapToken(token),
    // Height
    ...genControlHeight(token),
    // Others
    ...genCommonMapToken(token),
  };
}
