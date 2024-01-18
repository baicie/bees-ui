import React from 'react';
import { BeesConfigProvider } from '@baicie/react';

const App: React.FC = () => {
  const [top, setTop] = React.useState<number>(100);
  const [bottom, setBottom] = React.useState<number>(100);
  return (
    <>
      <BeesConfigProvider>ConfigProvider</BeesConfigProvider>
    </>
  );
};

export default App;
