<template>
  <BaseChart :option="chartOption" :height="height" :loading="loading" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import { CHART_COLORS } from '@/utils/constants'
import type { EChartsOption } from 'echarts'

const props = withDefaults(
  defineProps<{
    xAxisData?: string[]
    seriesData?: { name: string; data: number[] }[]
    height?: string
    loading?: boolean
    smooth?: boolean
    area?: boolean
  }>(),
  {
    xAxisData: () => [],
    seriesData: () => [],
    height: '400px',
    loading: false,
    smooth: true,
    area: false,
  },
)

const chartOption = computed<EChartsOption>(() => ({
  color: CHART_COLORS,
  tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
  legend: {},
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: props.xAxisData, boundaryGap: false },
  yAxis: { type: 'value' },
  series: props.seriesData.map((s, i) => ({
    name: s.name,
    type: 'line',
    data: s.data,
    smooth: props.smooth,
    areaStyle: props.area ? { opacity: 0.15 } : undefined,
    emphasis: { focus: 'series' },
  })),
}))
</script>
