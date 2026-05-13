<template>
  <div class="comparison-bar">
    <div v-for="(item, index) in items" :key="index" class="comparison-bar__row">
      <span class="comparison-bar__label">{{ item.name }}</span>
      <div class="comparison-bar__track">
        <div
          class="comparison-bar__fill"
          :style="{ width: barWidth(item) + '%', background: colors[index % colors.length] }"
        />
      </div>
      <span class="comparison-bar__value">{{ item[metricKey] }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CHART_COLORS } from '@/utils/constants'

const props = withDefaults(defineProps<{
  items: Record<string, unknown>[]
  metricKey: string
  maxValue?: number
  nameKey?: string
}>(), {
  maxValue: 0,
  nameKey: 'name'
})

const colors = CHART_COLORS

function barWidth(item: Record<string, unknown>) {
  const max = props.maxValue || Math.max(...props.items.map(i => Number(i[props.metricKey]) || 0))
  if (!max) return 0
  return ((Number(item[props.metricKey]) || 0) / max) * 100
}
</script>

<style lang="scss" scoped>
.comparison-bar__row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
}

.comparison-bar__label {
  width: 120px;
  flex-shrink: 0;
  font-size: 13px;
  color: $text-regular;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.comparison-bar__track {
  flex: 1;
  height: 16px;
  background: #F5F7FA;
  border-radius: 8px;
  overflow: hidden;
}

.comparison-bar__fill {
  height: 100%;
  border-radius: 8px;
  min-width: 4px;
  transition: width 0.6s ease;
}

.comparison-bar__value {
  width: 60px;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  text-align: right;
}
</style>
