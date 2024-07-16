import { useState } from 'react';

import './App.css';
import '@bees-ui/button';

import { Button } from 'antd';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <bees-button label="Click Me">
        <div slot="pre">pre</div>
        demo
        <div>dome222</div>
        <div slot="post">post</div>
      </bees-button>
    </div>
  );
}

export default App;
