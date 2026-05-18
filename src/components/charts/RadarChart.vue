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
    indicators?: { name: string; max: number }[]
    seriesData?: { name: string; data: number[] }[]
    height?: string
    loading?: boolean
  }>(),
  {
    indicators: () => [],
    seriesData: () => [],
    height: '400px',
    loading: false,
  },
)

const chartOption = computed<EChartsOption>(() => ({
  color: CHART_COLORS,
  tooltip: {},
  legend: { bottom: 0 },
  radar: {
    indicator: props.indicators,
    shape: 'polygon',
    splitNumber: 5,
    axisName: { color: '#606266' },
    splitArea: { areaStyle: { color: ['rgba(24,137,232,0.02)', 'rgba(24,137,232,0.05)'] } },
  },
  series: [
    {
      type: 'radar',
      data: props.seriesData.map((s) => ({
        name: s.name,
        value: s.data,
        areaStyle: { opacity: 0.15 },
        lineStyle: { width: 2 },
      })),
    },
  ],
}))
</script>
