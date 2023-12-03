import { PresetColorType } from './presetColors';

export interface SeedToken extends PresetColorType {
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;
  colorTextBase: string;
  colorBgBase: string;
  fontFamily: string;
  fontSize: number;
  lineWidth: number;
  lineType: string;
  motionUnit: number;
  motionBase: number;
  motionEaseOutCirc: string;
  motionEaseInOutCirc: string;
  motionEaseOut: string;
  motionEaseInOut: string;
  motionEaseOutBack: string;
  motionEaseInBack: string;
  motionEaseInQuint: string;
  motionEaseOutQuint: string;
  borderRadius: number;
  sizeUnit: number;
  sizeStep: number;
  sizePopupArrow: number;
  controlHeight: number;
  zIndexBase: number;
  zIndexPopupBase: number;
  opacityImage: number;
  wireframe: boolean;
}
