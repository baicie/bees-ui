import type { SizeType } from '@bees-ui/props';
import type { JSX } from 'solid-js';
import { createContext, useContext } from 'solid-js';

// Create SizeContext using Solid's createContext
const SizeContext = createContext<SizeType>(undefined);

export interface SizeContextProps {
  size?: SizeType;
  children?: JSX.Element;
}

// Solid's version of the SizeContextProvider
export const SizeContextProvider = (props: SizeContextProps): JSX.Element => {
  const originSize = useContext(SizeContext);
  const { children, size } = props;

  return <SizeContext.Provider value={size || originSize}>{children}</SizeContext.Provider>;
};

export default SizeContext;
