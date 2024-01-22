import { Component, JSXElement, createContext, useContext } from "solid-js";

export type SizeType = 'small' | 'middle' | 'large' | undefined;

const SizeContext = createContext<SizeType>(undefined);

export interface SizeContextProps {
  size?: SizeType;
  children?: JSXElement;
}

export const SizeContextProvider: Component<SizeContextProps> = ({ children, size }) => {
  const originSize = useContext<SizeType>(SizeContext);
  return <SizeContext.Provider value={size || originSize}>{children}</SizeContext.Provider>;
};

export default SizeContext;
