import '@bees-ui/button';

import { useEffect, useLayoutEffect, useState } from 'react';

function App() {
  const [first, setfirst] = useState('none');

  useLayoutEffect(() => {
    console.log('first', first);

    setfirst('start');
  }, [first]);

  return (
    <div>
      <button
        onClick={() => {
          setfirst('start');
        }}
      >
        button
      </button>
    </div>
  );
}

export default App;
