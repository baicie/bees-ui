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
      <my-web-component propA=""></my-web-component>
    </div>
  );
}

export default App;
