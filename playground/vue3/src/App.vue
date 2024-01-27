<script setup lang="ts">
import '@baicie/button';
// import { Button } from 'ant-design-vue';

const handleClick = () => {
  console.log('handleClick');
}
</script>

<template>
  <!-- <Button type="primary">Button</Button> -->
  <solid-button type="primary" @click="handleClick">
    Let's have some different text!
  </solid-button>
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
