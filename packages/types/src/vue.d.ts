import type { ButtonProps } from '@bees-ui/button';
import type { DividerProps } from '@bees-ui/divider';
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
