import { createEffect } from 'solid-js';

import { MotionEvent } from '../interface';
import { animationEndName, transitionEndName } from '../util/motion';

export default (
  onInternalMotionEnd: (event: MotionEvent) => void,
): [(element: HTMLElement) => void, (element: HTMLElement) => void] => {
  let cacheElementRef: HTMLElement | null = null;

  // Remove events
  function removeMotionEvents(element: HTMLElement) {
    if (element) {
      element.removeEventListener(transitionEndName, onInternalMotionEnd);
      element.removeEventListener(animationEndName, onInternalMotionEnd);
    }
  }

  // Patch events
  function patchMotionEvents(element: HTMLElement) {
    if (cacheElementRef && cacheElementRef !== element) {
      removeMotionEvents(cacheElementRef);
    }

    if (element && element !== cacheElementRef) {
      element.addEventListener(transitionEndName, onInternalMotionEnd);
      element.addEventListener(animationEndName, onInternalMotionEnd);

      // Save as cache in case dom removed trigger by `motionDeadline`
      cacheElementRef = element;
    }
  }

  // Clean up when removed
  createEffect(() => {
    return () => {
      if (cacheElementRef) {
        removeMotionEvents(cacheElementRef);
      }
    };
  });

  return [patchMotionEvents, removeMotionEvents];
};
