import { useState } from 'react';

import './App.css';
import '@bees-ui/button';

import { Button } from 'antd';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Button type="primary">Button</Button>

      <bees-button label="Click Me" children={<div>children</div>}></bees-button>
    </div>
  );
}

export default App;
