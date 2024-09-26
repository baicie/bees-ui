<script setup lang="ts">
import { Button, Space, FloatButton } from 'ant-design-vue';

const handleClick = () => {
  console.log('handleClick');
};

</script>

<template>
  <Space direction="vertical">
    <Button type="primary" @click="handleClick">Primary Button</Button>
    <Button type="text" @click="handleClick">text Button</Button>
    <Button type="dashed" @click="handleClick">dashed Button</Button>
    <FloatButton @click="handleClick" />
  </Space>
</template>
