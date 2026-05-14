// ECharts 生命周期管理 composable
import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import * as echarts from 'echarts'

export function useECharts(chartRef: Ref<HTMLElement | null>) {
  const chartInstance = ref<echarts.ECharts | null>(null)
  const loading = ref(false)

  function initChart() {
    if (!chartRef.value) return
    chartInstance.value = echarts.init(chartRef.value)
  }

  function setOption(option: echarts.EChartsOption, notMerge = false) {
    if (!chartInstance.value) initChart()
    chartInstance.value?.setOption(option, notMerge)
  }

  function showLoading() {
    loading.value = true
    chartInstance.value?.showLoading()
  }

  function hideLoading() {
    loading.value = false
    chartInstance.value?.hideLoading()
  }

  function resize() {
    chartInstance.value?.resize()
  }

  function dispose() {
    chartInstance.value?.dispose()
    chartInstance.value = null
  }

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    initChart()
    if (chartRef.value) {
      resizeObserver = new ResizeObserver(() => {
        resize()
      })
      resizeObserver.observe(chartRef.value)
    }
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
    dispose()
  })

  return {
    chartInstance,
    loading,
    setOption,
    showLoading,
    hideLoading,
    resize,
    dispose,
  }
}
