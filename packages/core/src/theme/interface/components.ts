import type { ComponentToken as ButtonComponentToken } from '@components/button/style';
import type { ComponentToken as WaveToken } from '@components/wave/style';
import type { ComponentToken as LayoutComponentToken } from '@components/layout/style';

export interface ComponentTokenMap {
  Button?: ButtonComponentToken;
  ConfigProvider?: {};
  Layout?: LayoutComponentToken;
  Wave?: WaveToken;
}
