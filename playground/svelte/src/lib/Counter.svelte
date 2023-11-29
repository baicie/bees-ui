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
  <Button on:click={increment}>count is {count}</Button>
</div>
