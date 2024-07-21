import type { FC, ReactElement, ReactNode } from 'preact/compat';
import { useLayoutEffect, useState } from 'preact/compat';

export type ClientOnlyProps = {
  children: ReactNode;
};

const ClientOnly: FC<ClientOnlyProps> = ({ children }) => {
  const [clientReady, setClientReady] = useState<boolean>(false);

  useLayoutEffect(() => {
    setClientReady(true);
  }, []);

  return clientReady ? (children as ReactElement) : null;
};

export default ClientOnly;
