import './App.css';

import Button from '@bees-ui/button';
import { AccountBookFilled } from '@bees-ui/sc-icons';

function App() {
  return (
    <>
      <Button type="primary">Primary Button</Button>
      <AccountBookFilled style={{ color: 'red' }} />
    </>
  );
}

export default App;
