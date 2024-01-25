import type { Component, JSXElement } from 'solid-js';
import { createContext, useContext } from 'solid-js';

export type SizeType = 'small' | 'middle' | 'large' | undefined;

const SizeContext = createContext<SizeType>(undefined);

export interface SizeContextProps {
  size?: SizeType;
  children?: JSXElement;
}

export const SizeContextProvider: Component<SizeContextProps> = (props) => {
  const originSize = useContext<SizeType>(SizeContext);
  return (
    <SizeContext.Provider value={props.size || originSize}>{props.children}</SizeContext.Provider>
  );
};

export default SizeContext;
