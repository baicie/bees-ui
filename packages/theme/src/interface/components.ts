<<<<<<< HEAD
// import type { ComponentToken as ButtonComponentToken } from '@baicie/button';
// import type { ComponentToken as WaveToken } from '@components/wave/style';

export interface ComponentTokenMap {
  Button?: {};
  ConfigProvider?: {};
  // Wave?: WaveToken;
=======
import type { ComponentToken as ButtonComponentToken } from '@components/button/style';
import type { ComponentToken as WaveToken } from '@components/wave/style';

export interface ComponentTokenMap {
  Button?: ButtonComponentToken;
  ConfigProvider?: {};
  Wave?: WaveToken;
>>>>>>> d2b3de8 (refactor: files)
}
