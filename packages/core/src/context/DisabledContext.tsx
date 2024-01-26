import type { Component, JSXElement } from 'solid-js';
import { createContext, useContext } from 'solid-js';

export type DisabledType = boolean | undefined;

export const DisabledContext = createContext<DisabledType>(false);

export interface DisabledContextProps {
  disabled?: DisabledType;
  children?: JSXElement;
}

export const DisabledContextProvider: Component<DisabledContextProps> = (props) => {
  const originDisabled = useContext(DisabledContext);
  return (
    <DisabledContext.Provider value={props.disabled ?? originDisabled}>
      {props.children}
    </DisabledContext.Provider>
  );
};
