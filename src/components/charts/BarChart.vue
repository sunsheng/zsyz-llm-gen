<template>
  <BaseChart :option="chartOption" :height="height" :loading="loading" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import { CHART_COLORS } from '@/utils/constants'
import type { EChartsOption } from 'echarts'

const props = withDefaults(defineProps<{
  xAxisData?: string[]
  seriesData?: { name: string; data: number[] }[]
  height?: string
  loading?: boolean
  horizontal?: boolean
}>(), {
  xAxisData: () => [],
  seriesData: () => [],
  height: '400px',
  loading: false,
  horizontal: false
})

const chartOption = computed<EChartsOption>(() => ({
  color: CHART_COLORS,
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: {},
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: props.horizontal ? 'value' : 'category', data: props.horizontal ? undefined : props.xAxisData },
  yAxis: { type: props.horizontal ? 'category' : 'value', data: props.horizontal ? props.xAxisData : undefined },
  series: props.seriesData.map((s) => ({
    name: s.name,
    type: 'bar',
    data: s.data,
    barMaxWidth: 40,
    emphasis: { focus: 'series' }
  }))
}))
</script>
