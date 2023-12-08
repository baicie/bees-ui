import type { ComponentToken as ButtonComponentToken } from '@components/button/style';
import type { ComponentToken as WaveToken } from '@components/wave/style';
import type { ComponentToken as LayoutComponentToken } from '@components/layout/style';
import type { ComponentToken as SpinComponentToken } from '@components/spin/style';

export interface ComponentTokenMap {
  Button?: ButtonComponentToken;
  ConfigProvider?: {};
  Layout?: LayoutComponentToken;
  Spin?: SpinComponentToken;
  Wave?: WaveToken;
}
