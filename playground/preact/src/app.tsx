import Switch from '@bees-ui/switch';
import { useState } from 'preact/hooks';

import preactLogo from './assets/preact.svg';
import viteLogo from '/vite.svg';

// import './app.css'

export function App() {
  const [count, setCount] = useState(0);

  return <Switch type="primary">demo</Switch>;
}
