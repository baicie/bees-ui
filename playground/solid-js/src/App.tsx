import { createEffect, createSignal } from 'solid-js';

import '@bees-ui/button';
import './App.css';

function App() {
  const [state, setState] = createSignal('none');

  createEffect(() => {
    console.log('state', state());
    setState('start');
  });

  return (
    <div>
      <button></button>
    </div>
  );
}

export default App;
