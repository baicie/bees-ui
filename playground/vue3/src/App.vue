<script setup lang="ts">
import '@bees-ui/button';
import '@bees-ui/affix';

const handleClick = () => {
  console.log('handleClick');
};
</script>

<template>
  <!-- <bees-button type="primary" @click="handleClick"> Let's have some different text! </bees-button> -->
  <my-web-component></my-web-component>
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
