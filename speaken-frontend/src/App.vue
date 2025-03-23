<template>
  <div class="app">
    <MainLayout />
  </div>
</template>

<script setup lang="ts">
import MainLayout from './views/MainLayout.vue'
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow: hidden;
}

.app {
  height: 100vh;
  overflow: hidden;
  background-color: #f5f7fa;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* Element Plus 全局样式覆盖 */
:root {
  --el-color-primary: #409EFF;
}

.el-button {
  border-radius: 8px;
}

.el-input__wrapper,
.el-textarea__wrapper {
  border-radius: 8px;
}

.el-select-dropdown {
  border-radius: 8px;
}

/* 响应式字体大小 */
@media (min-width: 1600px) {
  html {
    font-size: 16px;
  }
}

@media (max-width: 1200px) {
  html {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  html {
    font-size: 12px;
  }
}
</style>
