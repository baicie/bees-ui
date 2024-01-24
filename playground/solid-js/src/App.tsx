import { createSignal } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { button as MyButton } from '@bees-ui/button';
>>>>>>> 58279a3 (feat: button build)
=======
import '@baicie/button';
>>>>>>> 1c7ff74 (feat: button start)
=======
>>>>>>> 53c3d2d (feat: fangqi)

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        <solid-button type='primary'>solid</solid-button>
=======
        <MyButton></MyButton>
>>>>>>> 58279a3 (feat: button build)
=======
        {/* <solid-button type='primary'></solid-button> */}
>>>>>>> 1c7ff74 (feat: button start)
=======
        <solid-button type='primary'>solid</solid-button>
>>>>>>> 53c3d2d (feat: fangqi)
=======
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
>>>>>>> 4542458 (feat: add core)
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </>
  )
}

export default App
