import { normalizeTwoToneColors } from '../utils';
import SolidIcon from './IconBase';

export type TwoToneColor = string | [string, string];

export function setTwoToneColor(twoToneColor: TwoToneColor): void {
  const [primaryColor, secondaryColor] = normalizeTwoToneColors(twoToneColor);
  return SolidIcon.setTwoToneColors({
    primaryColor,
    secondaryColor,
  });
}

export function getTwoToneColor(): TwoToneColor {
  const colors = SolidIcon.getTwoToneColors();
  if (!colors.calculated) {
    return colors.primaryColor;
  }
  return [colors.primaryColor, colors.secondaryColor!];
}
