<script setup lang="ts">
import { Button, FloatButton, Space, ConfigProvider } from '@bees-ui/core'
import { Button as Button2 } from 'ant-design-vue'
Button()
FloatButton()
Space()
ConfigProvider()

const handleClick = () => {
  console.log('handleClick')
}

const buttons = Array.from({ length: 3 }, (_, index) => ({
  type: index % 3 === 0 ? 'primary' : index % 3 === 1 ? 'text' : 'dashed',
  label: index % 3 === 0 ? 'Primary Button' : index % 3 === 1 ? 'Text Button' : 'Dashed Button',
}))
</script>

<template>
  <bees-config-provider :button="{ className: 'lzw-buton', autoInsertSpace: true }">
    <bees-button v-for="(button, index) in buttons" :key="index" :type="button.type" @click="handleClick">
      {{ button.label }}
    </bees-button>
  </bees-config-provider>
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
