import { createEffect, createSignal, onCleanup } from 'solid-js';

import type { MotionStatus, StepStatus } from '../interface';
import {
  STEP_ACTIVATED,
  STEP_ACTIVE,
  STEP_NONE,
  STEP_PREPARE,
  STEP_PREPARED,
  STEP_START,
} from '../interface';
import useNextFrame from './useNextFrame';

const FULL_STEP_QUEUE: StepStatus[] = [STEP_PREPARE, STEP_START, STEP_ACTIVE, STEP_ACTIVATED];

const SIMPLE_STEP_QUEUE: StepStatus[] = [STEP_PREPARE, STEP_PREPARED];

/** Skip current step */
export const SkipStep = false as const;
/** Current step should be update in */
export const DoStep = true as const;

export function isActive(step: StepStatus) {
  return step === STEP_ACTIVE || step === STEP_ACTIVATED;
}

const useStepQueue = (
  _status: MotionStatus,
  prepareOnly: boolean,
  callback: (step: StepStatus) => Promise<void> | void | typeof SkipStep | typeof DoStep,
): [() => void, () => StepStatus] => {
  const [step, setStep] = createSignal<StepStatus>(STEP_NONE);

  const [nextFrame, cancelNextFrame] = useNextFrame();

  function startQueue() {
    setStep(STEP_PREPARE);
  }

  const STEP_QUEUE = prepareOnly ? SIMPLE_STEP_QUEUE : FULL_STEP_QUEUE;

  createEffect(() => {
    const currentStep = step();
    if (currentStep !== STEP_NONE && currentStep !== STEP_ACTIVATED) {
      const index = STEP_QUEUE.indexOf(currentStep);
      const nextStep = STEP_QUEUE[index + 1];

      const result = callback(currentStep);

      if (result === SkipStep) {
        // Skip when no needed
        setStep(nextStep);
      } else if (nextStep) {
        // Do as frame for step update
        nextFrame((info) => {
          function doNext() {
            // Skip since current queue is ood
            if (info.isCanceled()) return;

            setStep(nextStep);
          }

          if (result === true) {
            doNext();
          } else {
            // Only promise should be async
            Promise.resolve(result).then(doNext);
          }
        });
      }
    }
  });

  onCleanup(() => {
    cancelNextFrame();
  });

  return [startQueue, step];
};

export default useStepQueue;
