import { Color } from './color';
import type {
  ColorGenInput,
  HsbaColorType,
  TransformOffset,
} from './interface';

export const ColorPickerPrefixCls = 'rc-color-picker';

export const generateColor = (color: ColorGenInput): Color => {
  if (color instanceof Color) {
    return color;
  }
  return new Color(color);
};

export const defaultColor = generateColor('#1677ff');

export const calculateColor = (props: {
  offset: TransformOffset;
  containerRef: React.RefObject<HTMLDivElement>;
  targetRef: React.RefObject<HTMLDivElement>;
  color?: Color;
  type?: HsbaColorType;
}): Color => {
  const { offset, targetRef, containerRef, color, type } = props;
  const { width, height } = containerRef.current.getBoundingClientRect();
  const { width: targetWidth, height: targetHeight } =
    targetRef.current.getBoundingClientRect();
  const centerOffsetX = targetWidth / 2;
  const centerOffsetY = targetHeight / 2;
  const saturation = (offset.x + centerOffsetX) / width;
  const bright = 1 - (offset.y + centerOffsetY) / height;
  const hsb = color.toHsb();
  const alphaOffset = saturation;
  const hueOffset = ((offset.x + centerOffsetX) / width) * 360;

  if (type) {
    switch (type) {
      case 'hue':
        return generateColor({
          ...hsb,
          h: hueOffset <= 0 ? 0 : hueOffset,
        });
      case 'alpha':
        return generateColor({
          ...hsb,
          a: alphaOffset <= 0 ? 0 : alphaOffset,
        });
    }
  }

  return generateColor({
    h: hsb.h,
    s: saturation <= 0 ? 0 : saturation,
    b: bright >= 1 ? 1 : bright,
    a: hsb.a,
  });
};

export const calcOffset = (color: Color, type?: HsbaColorType) => {
  const hsb = color.toHsb();

  switch (type) {
    case 'hue':
      return {
        x: (hsb.h / 360) * 100,
        y: 50,
      };
    case 'alpha':
      return {
        x: color.a * 100,
        y: 50,
      };

    // Picker panel
    default:
      return {
        x: hsb.s * 100,
        y: (1 - hsb.b) * 100,
      };
  }
};
