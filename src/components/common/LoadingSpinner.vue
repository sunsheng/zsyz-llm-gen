<template>
  <div v-if="loading" class="loading-spinner">
    <el-skeleton v-if="type === 'skeleton'" :rows="rows" animated />
    <div v-else class="loading-spinner__center">
      <el-icon :size="32" class="loading-spinner__icon" color="#1889E8"><Loading /></el-icon>
      <p v-if="text" class="loading-spinner__text">{{ text }}</p>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

withDefaults(defineProps<{
  loading: boolean
  type?: 'skeleton' | 'spinner'
  rows?: number
  text?: string
}>(), {
  type: 'skeleton',
  rows: 5,
  text: ''
})
</script>

<style lang="scss" scoped>
.loading-spinner {
  padding: 20px;
}

.loading-spinner__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner__icon {
  animation: spin 1s linear infinite;
}

.loading-spinner__text {
  margin-top: 12px;
  font-size: 14px;
  color: $text-secondary;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
