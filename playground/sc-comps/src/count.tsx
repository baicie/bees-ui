import { createEffect } from 'solid-js';

export const Count = (props: { nums: number }) => {
  createEffect(() => {
    console.log('nums', props.nums);
  });
  return <div>{props.nums}</div>;
};
