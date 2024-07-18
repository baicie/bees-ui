<script setup lang="ts">
import '@bees-ui/button';

const handleClick = () => {
  console.log('handleClick');
};
</script>

<template>
  <ant-button type="primary" @click="handleClick"> Let's have some different text! </ant-button>
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
