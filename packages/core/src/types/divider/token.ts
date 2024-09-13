import type { CSSProperties } from '../base';

export interface DividerComponentToken {
  /**
   * @desc 文本横向内间距
   * @descEN Horizontal padding of text
   */
  textPaddingInline: CSSProperties['padding-inline'];
  /**
   * @desc 文本与边缘距离，取值 0 ～ 1
   * @descEN Distance between text and edge, which should be a number between 0 and 1.
   */
  orientationMargin: number;
  /**
   * @desc 纵向分割线的横向外间距
   * @descEN Horizontal margin of vertical Divider
   */
  verticalMarginInline: CSSProperties['margin-inline'];
}
