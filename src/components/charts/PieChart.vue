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
  roseType?: boolean
  radius?: string[]
}>(), {
  data: () => [],
  height: '400px',
  loading: false,
  roseType: false,
  radius: undefined
})

const chartOption = computed<EChartsOption>(() => ({
  color: CHART_COLORS,
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { orient: 'vertical', left: 'left' },
  series: [{
    type: 'pie',
    radius: props.radius || (props.roseType ? ['20%', '65%'] : '60%'),
    center: ['55%', '50%'],
    roseType: props.roseType ? 'radius' : undefined,
    data: props.data,
    label: { formatter: '{b}: {d}%' },
    emphasis: {
      itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
    },
    animationType: 'scale',
    animationEasing: 'elasticOut'
  }]
}))
</script>
