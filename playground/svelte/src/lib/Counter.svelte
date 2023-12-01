<script lang="ts">
  import { IkunButton } from "@bees-ui/svelte";
  import {KButton} from '@ikun-ui/core';
  import { Button } from "carbon-components-svelte";
  import '@baicie/vite-svelte-test/dist/es/index';
  import 'vite_svelte_comps/dist/custom-counter.es';

  let count: number = 0
  const increment = () => {
    count += 1
  }
</script>

<div>
  <my-custom-counter url="svelte"/>
  <my-element  >my-element</my-element>
  <IkunButton on:ikunClick={increment}>count is {count}</IkunButton>
  <KButton on:click={increment}>count is {count}</KButton>
  <Button on:click={increment}>count is {count}</Button>
</div>
