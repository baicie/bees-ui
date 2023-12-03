import { ColorPalettes } from '../presetColors';
import { SeedToken } from '../seeds';
import { ColorMapToken } from './colors';
import { FontMapToken } from './font';
import { HeightMapToken, SizeMapToken } from './size';
import { StyleMapToken } from './style';

export * from './colors';
export * from './size';
export * from './font';
export * from './style';

export interface CommonMapToken extends StyleMapToken {
  // Motion
  motionDurationFast: string;
  motionDurationMid: string;
  motionDurationSlow: string;
}

export interface MapToken
  extends SeedToken,
    ColorPalettes,
    ColorMapToken,
    SizeMapToken,
    HeightMapToken,
    StyleMapToken,
    FontMapToken,
    CommonMapToken {}
