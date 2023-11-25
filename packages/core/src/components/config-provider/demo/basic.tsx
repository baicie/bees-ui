import React from 'react';
import { IkunConfigProvider } from '@ikunorg/react';

const App: React.FC = () => {
  const [top, setTop] = React.useState<number>(100);
  const [bottom, setBottom] = React.useState<number>(100);
  return (
    <>
      <IkunConfigProvider>ConfigProvider</IkunConfigProvider>
    </>
  );
};

export default App;
