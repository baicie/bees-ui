import createContext from '@utils/createContext';
import { SizeType } from '@components/config-provider/size-context';

const ButtonTypes = ['default', 'primary', 'dashed', 'link', 'text'] as const;
export type ButtonType = (typeof ButtonTypes)[number];

const ButtonShapes = ['default', 'circle', 'round'] as const;
export type ButtonShape = (typeof ButtonShapes)[number];

const ButtonHTMLTypes = ['submit', 'button', 'reset'] as const;
export type ButtonHTMLType = (typeof ButtonHTMLTypes)[number];

export type Loading = boolean | number;

export const GroupSizeContext = createContext<{
  size: SizeType;
}>();
