import { useState } from 'preact/hooks';

import preactLogo from './assets/preact.svg';
import viteLogo from '/vite.svg';
// import './app.css'
import '@bees-ui/button';

export function App() {
  const [count, setCount] = useState(0);

  return <ant-button type="primary">demo</ant-button>;
}
