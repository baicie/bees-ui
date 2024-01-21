import { Component, JSXElement, createContext, useContext } from "solid-js";

export type DisabledType = boolean | undefined;

const DisabledContext = createContext<DisabledType>(false);

export interface DisabledContextProps {
  disabled?: DisabledType;
  children?: JSXElement;
}

export const DisabledContextProvider: Component<DisabledContextProps> = ({ children, disabled }) => {
  const originDisabled = useContext(DisabledContext);
  return (
    <DisabledContext.Provider value={disabled ?? originDisabled}>
      {children}
    </DisabledContext.Provider>
  );
};

export default DisabledContext;
