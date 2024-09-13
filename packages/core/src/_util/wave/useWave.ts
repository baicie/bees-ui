import { raf, useEvent } from '@bees-ui/sc-util';
import { onCleanup, useContext } from 'solid-js';

import { ConfigContext } from '../../config-provider';
import useToken from '../../theme/useToken';
import type { ShowWave } from './interface';
import { TARGET_CLS } from './interface';
import showWaveEffect from './WaveEffect';

const useWave = (
  nodeRef: HTMLElement,
  className: string,
  component: 'Tag' | 'Button' | 'Checkbox' | 'Radio' | 'Switch',
) => {
  const { wave } = useContext(ConfigContext);
  const [, token, hashId] = useToken();

  const showWave = useEvent<ShowWave>((event) => {
    const node = nodeRef;

    if (wave?.disabled || !node) {
      return;
    }
    const targetNode = node.querySelector<HTMLElement>(`.${TARGET_CLS}`) || node;

    const { showEffect } = wave || {};
    // Customize wave effect
    (showEffect || showWaveEffect)(targetNode, { className, token, component, event, hashId });
  });

  let rafId: number;

  // Merge trigger event into one for each frame
  const showDebounceWave: ShowWave = (event) => {
    raf.cancel(rafId);

    rafId = raf(() => {
      showWave(event);
    });
  };

  onCleanup(() => {
    raf.cancel(rafId);
  });

  return showDebounceWave;
};

export default useWave;
