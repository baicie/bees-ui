<script lang="ts">
  import { IkunButton } from "@ikunorg/svelte";
  let count: number = 0
  const increment = () => {
    count += 1
  }
</script>

<div>
  <button on:click={increment}>
    count is {count}
  </button>

  <IkunButton>IkunButton</IkunButton>
</div>
