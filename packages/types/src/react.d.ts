import type { ButtonProps } from '@bees-ui/button';
import type { DividerProps } from '@bees-ui/divider';
import type { FlexProps } from '@bees-ui/flex';
import type { SwitchProps } from '@bees-ui/switch';
import type { JSX as SolidJSX } from 'solid-js';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'bees-button': React.HTMLAttributes<HTMLElement> & ButtonProps;
      'bees-flex': React.HTMLAttributes<HTMLElement> & FlexProps;
      'bees-divider': React.HTMLAttributes<HTMLElement> & DividerProps;
      'bees-switch': SolidJSX.ButtonHTMLAttributes<HTMLButtonElement> & SwitchProps;
    }
  }
}
