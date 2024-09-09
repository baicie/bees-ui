import Input from '@bees-ui/sc-input';
import type { SwitchChangeEventHandler } from '@bees-ui/sc-switch';
import Switch from '@bees-ui/sc-switch';

import './index.less';
import './App.css';

import { createSignal, onMount } from 'solid-js';

const onChange: SwitchChangeEventHandler = (value, event) => {
  console.log(`switch checked: ${value}`, event);
};

function App() {
  const [disabled, setDisabled] = createSignal(false);
  let ref: HTMLInputElement | null = null;

  const toggle = () => {
    setDisabled((prev) => !prev);
    console.log('disabled', disabled());
  };

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

      <Switch
        onChange={onChange}
        disabled={disabled()}
        checkedChildren="开"
        unCheckedChildren="关"
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
