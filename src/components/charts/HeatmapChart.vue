<template>
  <BaseChart :option="chartOption" :height="height" :loading="loading" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import type { EChartsOption } from 'echarts'

const props = withDefaults(defineProps<{
  xAxisData?: string[]
  yAxisData?: string[]
  data?: [number, number, number][]  // [x, y, value]
  height?: string
  loading?: boolean
  min?: number
  max?: number
}>(), {
  xAxisData: () => [],
  yAxisData: () => [],
  data: () => [],
  height: '400px',
  loading: false
})

const chartOption = computed<EChartsOption>(() => ({
  tooltip: { position: 'top' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: props.xAxisData, splitArea: { show: true } },
  yAxis: { type: 'category', data: props.yAxisData, splitArea: { show: true } },
  visualMap: {
    min: props.min ?? Math.min(...props.data.map(d => d[2])),
    max: props.max ?? Math.max(...props.data.map(d => d[2])),
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: 0,
    inRange: { color: ['#E0F0FF', '#1889E8', '#0970F0'] }
  },
  series: [{
    type: 'heatmap',
    data: props.data,
    label: { show: true },
    emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
  }]
}))
</script>
