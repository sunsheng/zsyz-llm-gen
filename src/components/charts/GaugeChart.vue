<template>
  <BaseChart :option="chartOption" :height="height" :loading="loading" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import type { EChartsOption } from 'echarts'

const props = withDefaults(defineProps<{
  value?: number
  name?: string
  min?: number
  max?: number
  height?: string
  loading?: boolean
  colorStops?: { offset: number; color: string }[]
}>(), {
  value: 0,
  name: '',
  min: 0,
  max: 100,
  height: '300px',
  loading: false
})

const defaultColorStops = [
  { offset: 0.2, color: '#67C23A' },
  { offset: 0.5, color: '#E6A23C' },
  { offset: 0.8, color: '#F56C6C' }
]

const chartOption = computed<EChartsOption>(() => ({
  series: [{
    type: 'gauge',
    min: props.min,
    max: props.max,
    progress: { show: true, width: 14 },
    axisLine: { lineStyle: { width: 14 } },
    axisTick: { show: false },
    splitLine: { length: 10, lineStyle: { width: 2, color: '#999' } },
    axisLabel: { distance: 20, fontSize: 12, color: '#909399' },
    anchor: { show: true, showAbove: true, size: 18, itemStyle: { borderWidth: 8 } },
    detail: { valueAnimation: true, fontSize: 24, offsetCenter: [0, '70%'], fontWeight: 'bold', color: '#303133' },
    data: [{ value: props.value, name: props.name }],
    title: { offsetCenter: [0, '90%'], fontSize: 14, color: '#909399' }
  }]
}))
</script>
