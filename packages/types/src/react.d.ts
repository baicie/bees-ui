import type { ButtonHTMLAttributes } from 'react';
import type { ButtonProps } from '@bees-ui/button';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'bees-button': ButtonProps;
    }
  }
}
