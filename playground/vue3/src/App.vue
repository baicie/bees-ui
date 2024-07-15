<script setup lang="ts">
import "@baicie/button";

const handle = () => {
  console.log("handle");
};
</script>

<template>
  <hello-world name="parmary" @click="handle">
    svelte-buton-button
  </hello-world>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
