import { useStyleRegister } from '@bees-ui/sc-cssinjs';

import { resetIcon } from '../../style';
import useToken from '../useToken';

export interface CSPConfig {
  nonce?: string;
}

const useResetIconStyle = (
  iconPrefixCls: string,
  attachTo: HTMLElement | ShadowRoot,
  csp?: CSPConfig,
) => {
  const [theme, token] = useToken(attachTo);

  // Generate style for icons
  return useStyleRegister(
    {
      container: attachTo,
      theme,
      token,
      hashId: '',
      path: ['ant-design-icons', iconPrefixCls],
      nonce: () => csp?.nonce!,
    },
    () => [
      {
        [`.${iconPrefixCls}`]: {
          ...resetIcon(),
          [`.${iconPrefixCls} .${iconPrefixCls}-icon`]: {
            display: 'block',
          },
        },
      },
    ],
  );
};

export default useResetIconStyle;
