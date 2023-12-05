import React from 'react';
import { BeesButton } from '@bees-ui/react';

const App: React.FC = () => {
  const [top, setTop] = React.useState<number>(100);
  const [bottom, setBottom] = React.useState<number>(100);
  return (
    <>
      <BeesButton type="primary">primary</BeesButton>
    </>
  );
};

export default App;
