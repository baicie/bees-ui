import '@bees-ui/button';

import { useLayoutEffect, useState } from 'react';

function App() {
  const [first, setfirst] = useState('none');

  useLayoutEffect(() => {
    setfirst('start');
  }, [first]);

  return (
    <div>
      <bees-button
        type="primary"
        onClick={() => {
          console.log('click');
        }}
      >
        bees-button
      </bees-button>
    </div>
  );
}

export default App;
