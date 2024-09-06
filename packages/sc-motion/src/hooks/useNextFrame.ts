import { raf } from '@bees-ui/sc-util';
import { createSignal, onCleanup } from 'solid-js';

const useNextFrame = (): [
  (callback: (info: { isCanceled: () => boolean }) => void, delay?: number) => void,
  () => void,
] => {
  const [nextFrameRef, setNextFrameRef] = createSignal<number | null>(null);

  function cancelNextFrame() {
    const currentFrame = nextFrameRef();
    if (currentFrame !== null) {
      raf.cancel(currentFrame);
      setNextFrameRef(null);
    }
  }

  function nextFrame(callback: (info: { isCanceled: () => boolean }) => void, delay = 2) {
    cancelNextFrame();

    const nextFrameId = raf(() => {
      if (delay <= 1) {
        callback({ isCanceled: () => nextFrameId !== nextFrameRef() });
      } else {
        nextFrame(callback, delay - 1);
      }
    });

    setNextFrameRef(nextFrameId);
  }

  onCleanup(() => {
    cancelNextFrame();
  });

  return [nextFrame, cancelNextFrame];
};

export default useNextFrame;
