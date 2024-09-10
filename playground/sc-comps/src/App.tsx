import Input from '@bees-ui/sc-input';
import type { SwitchChangeEventHandler } from '@bees-ui/sc-switch';
import Switch from '@bees-ui/sc-switch';

import { Count } from './count';

import './index.less';
import './App.css';

import { createEffect, createSignal } from 'solid-js';

const onChange: SwitchChangeEventHandler = (value, event) => {
  console.log(`switch checked: ${value}`, event);
};

function App() {
  const [disabled, setDisabled] = createSignal(false);
  const [value, setValue] = createSignal('');
  const [count, setCount] = createSignal(1);

  const toggle = () => {
    setDisabled((prev) => !prev);
  };

  createEffect(() => {
    console.log('disabled changed', disabled());
  });

  return (
    <>
      <Count nums={count()} />
      <button onclick={() => setCount((prev) => prev + 1)}>+</button>
      <button onclick={() => setCount((prev) => prev - 1)}>-</button>

      <Input
        allowClear
        placeholder="sc-input"
        value={value()}
        onChange={(e) => setValue(e.currentTarget.value)}
      ></Input>

      <Switch
        onChange={onChange}
        disabled={disabled()}
        checkedChildren="开"
        unCheckedChildren="关"
        onFocus={() => console.log('focus')}
        autofocus
      />
      <div style={{ 'margin-left': '20px' }}>
        <button type="button" onClick={toggle}>
          toggle disabled
        </button>
      </div>
    </>
  );
}

export default App;
