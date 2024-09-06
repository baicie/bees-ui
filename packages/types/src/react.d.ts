import type { ButtonProps } from '@bees-ui/button';
import type { FlexProps } from '@bees-ui/flex';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'bees-button': React.HTMLAttributes<HTMLElement> & ButtonProps;
      'bees-flex': React.HTMLAttributes<HTMLElement> & FlexProps;
    }
  }
}
