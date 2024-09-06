import { useLayoutEffect, useState } from 'react';
import BeesButton from '@bees-ui/button';
import BeesFlex from '@bees-ui/flex';

BeesButton();
BeesFlex();

function App() {
  const [first, setfirst] = useState('none');

  useLayoutEffect(() => {
    setfirst('start');
  }, [first]);

  return (
    <bees-flex justify={'space-between'} align={'center'} vertical gap="large">
      <bees-button
        type="primary"
        onClick={() => {
          console.log('click');
        }}
      >
        <div>bees-button</div>
      </bees-button>

      <bees-button
        type="primary"
        onClick={() => {
          console.log('click');
        }}
      >
        bees-button
      </bees-button>

      <bees-button
        type="primary"
        onClick={() => {
          console.log('click');
        }}
      >
        bees-button
      </bees-button>

      <bees-button
        type="primary"
        onClick={() => {
          console.log('click');
        }}
      >
        bees-button
      </bees-button>
    </bees-flex>
  );
}

export default App;
