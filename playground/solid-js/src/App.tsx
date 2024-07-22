import { createEffect, createSignal } from 'solid-js';

import './App.css';

function App() {
  const [state, setState] = createSignal('none');

  createEffect(() => {
    console.log('state', state());
    setState('start');
  });

  return <button onclick={() => setState('start')}>button</button>;
}

export default App;
