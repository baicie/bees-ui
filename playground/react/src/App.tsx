import BeesButton from '@bees-ui/button';
import BeesDivider from '@bees-ui/divider';
import BeesFlex from '@bees-ui/flex';
import { useLayoutEffect, useState } from 'react';

BeesButton();
BeesFlex();
BeesDivider();

function App() {
  const [first, setfirst] = useState('none');

  useLayoutEffect(() => {
    setfirst('start');
  }, [first]);

  return (
    <>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
        ista probare, quae sunt a te dicta? Refert tamen, quo modo.
      </p>
      <bees-divider dashed />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
        ista probare, quae sunt a te dicta? Refert tamen, quo modo.
      </p>
    </>
  );
}

export default App;
