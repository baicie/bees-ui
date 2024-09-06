import type { ButtonProps } from '@bees-ui/button';
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
  }
}
