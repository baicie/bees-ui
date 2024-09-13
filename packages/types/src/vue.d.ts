import type { ButtonProps, DividerProps } from '@bees-ui/core';
import type { DefineComponent } from 'vue';

declare module 'vue' {
  export interface GlobalComponents {
    'bees-button': DefineComponent<
      ButtonProps,
      {},
      {
        click: (event: MouseEvent) => void;
        'custom-event': (data: string) => void;
      }
    >;
    'bees-divider': DefineComponent<
      DividerProps,
      {},
      {
        click: (event: MouseEvent) => void;
        'custom-event': (data: string) => void;
      }
    >;
  }
}
