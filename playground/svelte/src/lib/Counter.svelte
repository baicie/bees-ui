<script lang="ts">
  import { IkunButton } from "@ikunorg/svelte";
  import {KButton} from '@ikun-ui/core';

  let count: number = 0
  const increment = () => {
    count += 1
  }
</script>

<div>
  <IkunButton on:click={increment}>count is {count}</IkunButton>
</div>
