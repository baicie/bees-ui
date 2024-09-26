<script setup lang="ts">
import { Button, FloatButton, Space } from '@bees-ui/core'
Button()
FloatButton()
Space()
const handleClick = () => {
  console.log('handleClick');
};
</script>

<template>
  <bees-space direction="vertical">
    <bees-button type="primary" @click="handleClick">Primary Button</bees-button>
    <bees-button type="text" @click="handleClick">text Button</bees-button>
    <bees-button type="dashed" @click="handleClick">dashed Button</bees-button>
    <bees-float-button @click="handleClick" />
  </bees-space>
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
