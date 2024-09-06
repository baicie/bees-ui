import type { ButtonProps } from '@bees-ui/button';
import type { FlexProps } from '@bees-ui/flex';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'bees-button': ButtonProps;
      'bees-flex': FlexProps;
    }
  }
}
