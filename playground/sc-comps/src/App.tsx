import Input from '@bees-ui/sc-input';

import './App.css';

import { onMount } from 'solid-js';

function App() {
  let ref: HTMLInputElement | null = null;

  onMount(() => {
    console.log(ref?.focus());
  });
  return (
    <>
      <Input
        ref={(el) => {
          ref = el;
        }}
        allowClear
        placeholder="sc-input"
      ></Input>
      <div>div</div>
    </>
  );
}

export default App;
