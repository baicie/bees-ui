<script lang="ts">
  import { IkunButton } from "@ikunorg/svelte";
  import {KButton} from '@ikun-ui/core';
  import { Button } from "carbon-components-svelte";

  let count: number = 0
  const increment = () => {
    count += 1
  }
</script>

<div>
  <IkunButton on:ikunClick={increment}>count is {count}</IkunButton>
  <KButton on:click={increment}>count is {count}</KButton>
  <Button on:click={increment}>count is {count}</Button>
</div>
