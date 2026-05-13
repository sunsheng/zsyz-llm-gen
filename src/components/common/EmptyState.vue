<template>
  <div class="empty-state">
    <el-icon :size="64" color="#C0C4CC"><DocumentRemove /></el-icon>
    <p class="empty-state__description">{{ description }}</p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
import { DocumentRemove } from '@element-plus/icons-vue'

withDefaults(defineProps<{
  description?: string
}>(), {
  description: '暂无数据'
})
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-state__description {
  margin-top: 16px;
  font-size: 14px;
  color: $text-secondary;
}
</style>
