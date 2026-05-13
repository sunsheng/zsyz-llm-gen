<template>
  <div class="error-page">
    <div class="error-page__content">
      <h1 class="error-page__code">404</h1>
      <p class="error-page__message">抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style lang="scss" scoped>
.error-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-page__content {
  text-align: center;
}

.error-page__code {
  font-size: 72px;
  font-weight: 700;
  color: $color-primary;
  margin-bottom: 16px;
}

.error-page__message {
  font-size: 18px;
  color: $text-secondary;
  margin-bottom: 32px;
}
</style>
