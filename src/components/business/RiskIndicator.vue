<template>
  <div class="risk-indicator" :class="`risk-indicator--${level}`">
    <div class="risk-indicator__bar">
      <div class="risk-indicator__fill" :style="{ width: score + '%', background: barColor }"></div>
    </div>
    <span class="risk-indicator__label" :style="{ color: barColor }">{{ levelText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RISK_LEVELS } from '@/utils/constants'

const props = withDefaults(
  defineProps<{
    level?: 'low' | 'medium' | 'high' | 'critical'
    score?: number
  }>(),
  {
    level: 'low',
    score: 0,
  },
)

const levelColors: Record<string, string> = {
  low: '#67C23A',
  medium: '#E6A23C',
  high: '#F56C6C',
  critical: '#F56C6C',
}

const barColor = computed(() => levelColors[props.level])
const levelText = computed(() => RISK_LEVELS[props.level]?.label || '低风险')
</script>

<style lang="scss" scoped>
.risk-indicator {
  display: flex;
  gap: 8px;
  align-items: center;
}

.risk-indicator__bar {
  flex: 1;
  height: 6px;
  overflow: hidden;
  background: #ebeef5;
  border-radius: 3px;
}

.risk-indicator__fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.risk-indicator__label {
  font-size: 12px;
  font-weight: $font-weight-medium;
  white-space: nowrap;
}
</style>
