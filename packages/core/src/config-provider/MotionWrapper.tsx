// import { Provider as MotionProvider } from 'rc-motion';
import type { JSX } from 'solid-js';
import { createMemo, createSignal } from 'solid-js';

import { useToken } from '../theme/internal'; // Assuming `useToken` can work similarly in SolidJS

export interface MotionWrapperProps {
  children?: JSX.Element;
}

export default function MotionWrapper(props: MotionWrapperProps): JSX.Element {
  const { children } = props;
  const [, token] = useToken(); // Assuming this hook returns the same in SolidJS
  const { motion } = token;

  const [needWrapMotionProvider, setNeedWrapMotionProvider] = createSignal(false);

  // Setting the needWrapMotionProvider logic
  createMemo(() => {
    if (motion === false) {
      setNeedWrapMotionProvider(true);
    }
  });

  // Conditionally wrap with MotionProvider
  if (needWrapMotionProvider()) {
    // return <MotionProvider motion={motion}>{children}</MotionProvider>;
  }

  return children as JSX.Element;
}
