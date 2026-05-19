<template>
  <div ref="chartRef" class="base-chart" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import type { EChartsOption } from 'echarts'

const props = withDefaults(
  defineProps<{
    option?: EChartsOption
    width?: string
    height?: string
    loading?: boolean
  }>(),
  {
    width: '100%',
    height: '400px',
    loading: false,
  },
)

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const ANIMATION_DEFAULTS = {
  animationDuration: 800,
  animationEasing: 'cubicOut',
} as const

function mergeAnimationDefaults(option: EChartsOption): EChartsOption {
  return {
    ...ANIMATION_DEFAULTS,
    ...option,
  }
}

function init() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  if (props.option) {
    chartInstance.setOption(mergeAnimationDefaults(props.option))
  }
}

function setOption(option: EChartsOption, notMerge = false) {
  if (!chartInstance) init()
  chartInstance?.setOption(mergeAnimationDefaults(option), notMerge)
}

function resize() {
  chartInstance?.resize()
}

function showLoading() {
  chartInstance?.showLoading('default', {
    text: '',
    color: '#1889E8',
    maskColor: 'rgba(255, 255, 255, 0.8)',
  })
}

function hideLoading() {
  chartInstance?.hideLoading()
}

function dispose() {
  chartInstance?.dispose()
  chartInstance = null
}

watch(
  () => props.option,
  (val) => {
    if (val && chartInstance) {
      chartInstance.setOption(val, true)
    }
  },
  { deep: true },
)

watch(
  () => props.loading,
  (val) => {
    if (val) showLoading()
    else hideLoading()
  },
)

onMounted(() => {
  init()
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(chartRef.value)
  }
  if (props.loading) showLoading()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  dispose()
})

defineExpose({ setOption, resize, showLoading, hideLoading, dispose, chartInstance })
</script>

<style lang="scss" scoped>
.base-chart {
  min-height: 200px;
}
</style>
