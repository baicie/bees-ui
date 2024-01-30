import './App.css';
import { AccountBookFilled } from '@bees-ui/icons';
import type { ButtonType } from '@bees-ui/button';
import Button from '@bees-ui/button';
import '@bees-ui/button';
import { createSignal } from 'solid-js';

function App() {
  const [type, setType] = createSignal<ButtonType>('primary');
  const handleClick = () => {
    console.log('click', type());

    setType(type() === 'primary' ? 'default' : 'primary');
  };
  return (
    <>
      <solid-button type={type()} onClick={handleClick}>
        solid-button
      </solid-button>
      <Button type={type()} onClick={handleClick}>
        Button
      </Button>
      <AccountBookFilled style={{ color: 'red' }} spin />
    </>
  );
}

export default App;
