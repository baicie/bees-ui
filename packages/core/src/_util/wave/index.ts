import { isVisible } from '@bees-ui/sc-util';
import clsx from 'clsx';
import { onCleanup, onMount, useContext } from 'solid-js';
import { mergeProps } from 'solid-js/web';

import { ConfigContext } from '../../config-provider';
import useStyle from './style';
import useWave from './useWave';

export interface WaveProps {
  disabled?: boolean;
  children?: any;
  component?: 'Tag' | 'Button' | 'Checkbox' | 'Radio' | 'Switch';
}

const Wave = (props: WaveProps) => {
  const mergedProps = mergeProps({ disabled: false }, props);
  const { children, disabled, component } = mergedProps;
  const { getPrefixCls } = useContext(ConfigContext);
  const containerRef: HTMLElement = children;

  // ============================== Style ===============================
  const prefixCls = getPrefixCls('wave');
  const [, hashId] = useStyle(prefixCls);

  // =============================== Wave ===============================
  const showWave = useWave(containerRef, clsx(prefixCls, hashId), component);

  // ============================== Effect ==============================
  onMount(() => {
    const node = containerRef;
    if (!node || node.nodeType !== 1 || disabled) {
      return;
    }

    // Click handler
    const onClick = (e: MouseEvent) => {
      // Fix radio button click twice
      if (
        !isVisible(e.target as HTMLElement) ||
        // No need wave
        !node.getAttribute ||
        node.getAttribute('disabled') ||
        (node as HTMLInputElement).disabled ||
        node.className.includes('disabled') ||
        node.className.includes('-leave')
      ) {
        return;
      }
      showWave(e);
    };

    // Bind events
    node.addEventListener('click', onClick, true);
    onCleanup(() => {
      node.removeEventListener('click', onClick, true);
    });
  });

  // ============================== Render ==============================
  if (typeof children !== 'function' && !children) {
    return null;
  }

  return children;
};

export default Wave;
