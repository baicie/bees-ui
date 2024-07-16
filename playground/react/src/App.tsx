import { useState } from 'react';

import './App.css';
import '@bees-ui/button';

import { Button } from 'antd';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Button type="primary" onClick={() => setCount(count + 1)}>
        demo
        <div>dome222</div>
      </Button>
      <bees-button type="primary">
        <div slot="pre">pre</div>
        demo
        <div>dome222</div>
        <div slot="post">post</div>
      </bees-button>
    </div>
  );
}

export default App;
