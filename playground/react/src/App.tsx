import { useState } from 'react';
import './App.css';
import '@bees-ui/button';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <solid-button type="primary">Let's have some different text!</solid-button>
    </div>
  );
}

export default App;
