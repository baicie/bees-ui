import { useStyleRegister } from '@bees-ui/sc-cssinjs';

import { resetIcon } from '../../style';
import useToken from '../useToken';

export interface CSPConfig {
  nonce?: string;
}

const useResetIconStyle = (iconPrefixCls: string, csp?: CSPConfig) => {
  const [theme, token] = useToken();

  // Generate style for icons
  return useStyleRegister(
    {
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
