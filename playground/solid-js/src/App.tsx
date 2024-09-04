import Button from '@bees-ui/button';
import { createEffect, createSignal } from 'solid-js';

import './App.css';

function App() {
  const [state, setState] = createSignal('none');

  createEffect(() => {
    setState('start');
  });

  return <Button type="primary">Button</Button>;
}

export default App;
