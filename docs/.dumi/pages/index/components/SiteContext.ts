import * as React from 'preact/compat';

export interface SiteContextProps {
  isMobile: boolean;
}

const SiteContext = React.createContext<SiteContextProps>({
  isMobile: false,
});

export default SiteContext;
