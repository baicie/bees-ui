<script setup lang="ts">
import '@baicie/button';
import { Button } from 'ant-design-vue';

const handle = () => {
  console.log('handle');
};
</script>

<template>
  <Button type="primary">Button1</Button>
  <Button type="dashed">Button2</Button>
  <svelte-buton name="parmary" @click="handle">svelte-buton-button</svelte-buton>
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
