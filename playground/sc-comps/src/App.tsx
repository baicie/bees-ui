import { BaseInput } from '@bees-ui/sc-input';
import type { SwitchChangeEventHandler } from '@bees-ui/sc-switch';
import Switch from '@bees-ui/sc-switch';

import './index.less';
import './App.css';

import { createEffect, createSignal, onMount } from 'solid-js';

const onChange: SwitchChangeEventHandler = (value, event) => {
  console.log(`switch checked: ${value}`, event);
};

function App() {
  let holderRef: HTMLElement | null = null;
  const [disabled, setDisabled] = createSignal(false);

  const toggle = () => {
    setDisabled((prev) => !prev);
  };

  createEffect(() => {
    console.log('disabled changed', disabled());
  });

  onMount(() => {
    console.log('onMount', holderRef);
  });

  return (
    <>
      <BaseInput
        prefixCls="rc-input"
        suffix="suffix"
        addonAfter="after"
        ref={(el: HTMLElement) => {
          console.log('ref', el);

          holderRef = el;
        }}
      >
        <input />
      </BaseInput>

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
