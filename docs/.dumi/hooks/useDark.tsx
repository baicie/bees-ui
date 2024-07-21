import React from 'preact/compat';

export const DarkContext = React.createContext(false);

export default function useDark() {
  return React.useContext(DarkContext);
}
