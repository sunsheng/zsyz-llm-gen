<template>
  <BaseChart :option="chartOption" :height="height" :loading="loading" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import { CHART_COLORS } from '@/utils/constants'
import type { EChartsOption } from 'echarts'

const props = withDefaults(defineProps<{
  data?: { name: string; value: number }[]
  height?: string
  loading?: boolean
  shape?: string
}>(), {
  data: () => [],
  height: '400px',
  loading: false,
  shape: 'circle'
})

const chartOption = computed<EChartsOption>(() => ({
  tooltip: { show: true },
  series: [{
    type: 'wordCloud' as any,
    shape: props.shape,
    left: 'center',
    top: 'center',
    width: '90%',
    height: '90%',
    sizeRange: [14, 48],
    rotationRange: [-45, 45],
    rotationStep: 15,
    gridSize: 8,
    drawOutOfBound: false,
    textStyle: {
      fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
      fontWeight: 'bold',
      color: function () {
        return CHART_COLORS[Math.floor(Math.random() * CHART_COLORS.length)]
      }
    },
    emphasis: {
      textStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.15)', color: '#0970F0' }
    },
    data: props.data.map(d => ({
      name: d.name,
      value: d.value,
      textStyle: {
        fontSize: Math.max(14, Math.min(48, d.value / 2))
      }
    }))
  } as any]
}))
</script>
