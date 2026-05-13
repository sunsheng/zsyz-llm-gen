<template>
  <BaseChart :option="chartOption" :height="height" :loading="loading" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import { CHART_COLORS } from '@/utils/constants'
import type { EChartsOption } from 'echarts'

const props = withDefaults(defineProps<{
  seriesData?: { name: string; data: [number, number, number?][] }[]
  height?: string
  loading?: boolean
  symbolSize?: number | ((val: number[]) => number)
}>(), {
  seriesData: () => [],
  height: '400px',
  loading: false
})

const defaultSymbolSize = (val: number[]) => Math.max(6, Math.min(30, (val[2] || 1) / 10))

const chartOption = computed<EChartsOption>(() => ({
  color: CHART_COLORS,
  tooltip: {
    formatter: (params: any) => {
      const d = (params as any).data as number[]
      return `${(params as any).seriesName}<br/>X: ${d[0]}<br/>Y: ${d[1]}${d[2] != null ? '<br/>值: ' + d[2] : ''}`
    }
  } as any,
  grid: { left: '3%', right: '7%', bottom: '7%', containLabel: true },
  xAxis: { type: 'value' as const, splitLine: { lineStyle: { type: 'dashed' as const } } },
  yAxis: { type: 'value' as const, splitLine: { lineStyle: { type: 'dashed' as const } } },
  series: props.seriesData.map((s) => ({
    name: s.name,
    type: 'scatter' as const,
    data: s.data,
    symbolSize: props.symbolSize || defaultSymbolSize,
    emphasis: { focus: 'series' as const }
  }))
}))
</script>
