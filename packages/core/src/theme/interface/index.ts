import { AliasToken } from './alias';
import { ComponentTokenMap } from './components';

export type OverrideToken = {
  [key in keyof ComponentTokenMap]: Partial<ComponentTokenMap[key]> & Partial<AliasToken>;
};

/** Final token which contains the components level override */
export type GlobalToken = AliasToken & ComponentTokenMap;

export type { AliasToken } from './alias';
export type { PresetColorType, ColorPalettes, PresetColorKey } from './presetColors';
export type { SeedToken } from './seeds';

export type {
  MapToken,
  ColorMapToken,
  ColorNeutralMapToken,
  CommonMapToken,
  HeightMapToken,
  SizeMapToken,
  FontMapToken,
  StyleMapToken,
} from './maps';
