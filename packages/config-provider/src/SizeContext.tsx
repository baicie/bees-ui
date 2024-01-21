import { JSXElement } from "solid-js";

export type SizeType = 'small' | 'middle' | 'large' | undefined;

// const SizeContext = createStore<SizeType>(undefined);

export interface SizeContextProps {
  size?: SizeType;
  children?: JSXElement;
}

// export const SizeContextProvider: React.FC<SizeContextProps> = ({ children, size }) => {
//   const originSize = React.useContext<SizeType>(SizeContext);
//   return <SizeContext.Provider value={size || originSize}>{children}</SizeContext.Provider>;
// };

// export default SizeContext;
