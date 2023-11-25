import React from 'react';
import { ConfigProvider } from '@ikunorg/react';

const App: React.FC = () => {
  const [top, setTop] = React.useState<number>(100);
  const [bottom, setBottom] = React.useState<number>(100);
  return (
    <>
    <ConfigProvider>ConfigProvider</ConfigProvider>
    </>
  );
};

export default App;
