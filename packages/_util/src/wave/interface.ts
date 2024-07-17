import { GlobalToken } from '@bees-ui/core';

import { defaultPrefixCls } from '../../../../components/context';

export const TARGET_CLS = `${defaultPrefixCls}-wave-target`;

export type ShowWaveEffect = (
  element: HTMLElement,
  info: {
    className: string;
    token: GlobalToken;
    component?: string;
    event: MouseEvent;
    hashId: string;
  },
) => void;

export type ShowWave = (event: MouseEvent) => void;
