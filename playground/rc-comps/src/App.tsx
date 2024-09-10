import { useLayoutEffect, useState } from 'react';
import Input from 'rc-input';

function App() {
  const [first, setfirst] = useState('none');

  useLayoutEffect(() => {
    setfirst('start');
  }, [first]);

  return <Input placeholder="input" allowClear />;
}

export default App;
