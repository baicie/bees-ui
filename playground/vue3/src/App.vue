<script setup lang="ts">
import '@baicie/button';
import { Button } from 'ant-design-vue';
</script>

<template>
  <Button>Button</Button>
  <solid-button type="parmary">solid-button</solid-button>
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
