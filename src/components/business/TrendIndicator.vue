<template>
  <span class="trend-indicator" :class="`trend-indicator--${direction}`">
    <el-icon :size="12">
      <Top v-if="direction === 'up'" />
      <Bottom v-else-if="direction === 'down'" />
      <Minus v-else />
    </el-icon>
    <span class="trend-indicator__value">{{ value }}</span>
  </span>
</template>

<script setup lang="ts">
import { Top, Bottom, Minus } from '@element-plus/icons-vue'

withDefaults(defineProps<{
  direction?: 'up' | 'down' | 'flat'
  value?: string
  isGood?: boolean
}>(), {
  direction: 'flat',
  value: '',
  isGood: undefined
})
</script>

<style lang="scss" scoped>
.trend-indicator {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-weight: $font-weight-medium;
}

.trend-indicator--up {
  color: $color-success;
}

.trend-indicator--down {
  color: $color-danger;
}

.trend-indicator--flat {
  color: $text-secondary;
}
</style>
