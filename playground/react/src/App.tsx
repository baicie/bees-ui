import { useState } from 'react';
import './App.css';
import '@baicie/button';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <solid-button type="primary">Let's have some different text!</solid-button>
    </div>
  );
}

export default App;
