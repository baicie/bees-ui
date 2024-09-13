import type { ButtonProps } from '@bees-ui/button';
import type { DividerProps } from '@bees-ui/divider';
import type { FlexProps } from '@bees-ui/flex';

declare namespace JSX {
  interface IntrinsicElements {
    'bees-button': ButtonProps;
    'bees-divider': DividerProps;
    'bees-flex': FlexProps;
  }
}
