<template>
  <div class="page-container" :class="{ 'is-fullscreen': isFullscreen }">
    <PageHeader title="动态数据看板" subtitle="产业占比实时动态数据可视化看板">
      <template #actions>
        <el-button @click="toggleFullscreen">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </el-button>
      </template>
    </PageHeader>

    <!-- 自定义指标组合 -->
    <div class="metric-config">
      <span class="metric-config__label">指标组合：</span>
      <el-checkbox-group v-model="selectedMetrics" @change="handleMetricChange">
        <el-checkbox value="output">产值占比</el-checkbox>
        <el-checkbox value="tax">税收贡献</el-checkbox>
        <el-checkbox value="enterprise">企业数量</el-checkbox>
        <el-checkbox value="employment">就业人数</el-checkbox>
      </el-checkbox-group>
      <el-divider direction="vertical" />
      <span class="metric-config__label">自动刷新：</span>
      <el-switch v-model="autoRefresh" active-text="开" inactive-text="关" />
      <span v-if="autoRefresh" class="metric-config__timer">{{ countdown }}s</span>
    </div>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <!-- 第一行：实时趋势 + 区域对比 -->
    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业占比实时变化</h4>
        <BaseChart :option="realtimeOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">区域占比动态</h4>
        <BaseChart :option="regionOption" height="320px" />
      </div>
    </div>

    <!-- 第二行：增长趋势 + 变化排行 -->
    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">增长趋势追踪</h4>
        <BaseChart :option="growthOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">占比变化排行</h4>
        <BaseChart :option="changeOption" height="320px" />
      </div>
    </div>

    <!-- 第三行：自定义指标联动分析 -->
    <div v-if="selectedMetrics.length >= 2" class="chart-grid">
      <div class="chart-panel full-width">
        <h4 class="chart-panel__title">多指标联动分析</h4>
        <BaseChart :option="linkageOption" height="360px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchDashboardData } from '@/api/modules/benchmarkingApi'
import type { DashboardData } from '@/api/types/benchmarking'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const isFullscreen = ref(false)
const autoRefresh = ref(true)
const countdown = ref(30)
let refreshTimer: ReturnType<typeof setInterval> | null = null

const selectedMetrics = ref<string[]>(['output', 'tax'])

const kpiCards = ref([
  {
    key: 'total',
    label: '监测产业',
    value: 0,
    unit: '个',
    trend: 'flat' as const,
    trendValue: '',
    icon: 'Monitor',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'rising',
    label: '占比上升',
    value: 0,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+3',
    icon: 'Top',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'falling',
    label: '占比下降',
    value: 0,
    unit: '个',
    trend: 'down' as const,
    trendValue: '-2',
    icon: 'Bottom',
    iconColor: '#F2637B',
    iconBgColor: '#FEF0F0',
  },
  {
    key: 'stable',
    label: '占比稳定',
    value: 0,
    unit: '个',
    trend: 'flat' as const,
    trendValue: '',
    icon: 'Minus',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
])

const realtimeOption = ref({})
const regionOption = ref({})
const growthOption = ref({})
const changeOption = ref({})
const linkageOption = ref({})

function updateCharts(data: DashboardData) {
  // 实时变化折线图
  realtimeOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: data.industryTrends.map((t) => t.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: data.trendMonths },
    yAxis: { type: 'value', name: '%' },
    series: data.industryTrends.map((t) => ({
      name: t.name,
      type: 'line',
      smooth: true,
      data: t.data,
    })),
  }

  // 区域占比对比
  const regions = data.regionCompares.map((r) => r.name)
  regionOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['当前占比', '去年同期'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: regions },
    yAxis: { type: 'value', name: '%' },
    series: [
      { name: '当前占比', type: 'bar', data: data.regionCompares.map((r) => r.current) },
      { name: '去年同期', type: 'bar', data: data.regionCompares.map((r) => r.lastYear) },
    ],
  }

  // 增长趋势
  growthOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['同比增长', '环比增长'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: data.trendMonths },
    yAxis: { type: 'value', name: '%' },
    series: [
      { name: '同比增长', type: 'bar', data: data.growthTrend.yearOnYear },
      { name: '环比增长', type: 'line', smooth: true, data: data.growthTrend.monthOnMonth },
    ],
  }

  // 变化排行（正负双向柱状图）
  const sorted = [...data.changeRanking].sort((a, b) => a.value - b.value)
  changeOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: '%', min: -5, max: 5 },
    yAxis: { type: 'category', data: sorted.map((s) => s.name) },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: sorted.map((s) => s.value),
        itemStyle: {
          color: (params: any) => (params.value >= 0 ? '#4ECB73' : '#F2637B'),
        },
      },
    ],
  }

  // 多指标联动分析
  updateLinkageChart(data)
}

function updateLinkageChart(data: DashboardData) {
  if (selectedMetrics.value.length < 2) return

  const metricLabels: Record<string, string> = {
    output: '产值占比',
    tax: '税收贡献',
    enterprise: '企业数量',
    employment: '就业人数',
  }

  // 模拟联动数据：以产业趋势为基础，各指标维度使用不同缩放
  const series = selectedMetrics.value.map((metric, idx) => {
    const scale = [1.0, 0.88, 0.72, 0.58][idx] || 1
    return {
      name: metricLabels[metric],
      type: 'line',
      smooth: true,
      yAxisIndex: idx > 1 ? 1 : 0,
      data: data.industryTrends[0].data.map((v) => Math.round(v * scale * 100) / 100),
    }
  })

  linkageOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: selectedMetrics.value.map((m) => metricLabels[m]) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: data.trendMonths },
    yAxis: [
      { type: 'value', name: '%' },
      { type: 'value', name: '指数' },
    ],
    series,
  }
}

function handleMetricChange() {
  // 重新加载联动图
  if (selectedMetrics.value.length >= 2 && kpiCards.value[0].value > 0) {
    fetchDashboardData().then((data) => updateLinkageChart(data))
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

async function handleRefresh() {
  const data = await fetchDashboardData()
  kpiCards.value[0].value = data.kpiCards.monitorCount
  kpiCards.value[1].value = data.kpiCards.risingCount
  kpiCards.value[2].value = data.kpiCards.fallingCount
  kpiCards.value[3].value = data.kpiCards.stableCount
  updateCharts(data)
  countdown.value = 30
}

function startAutoRefresh() {
  refreshTimer = setInterval(() => {
    if (!autoRefresh.value) return
    countdown.value--
    if (countdown.value <= 0) {
      countdown.value = 30
      handleRefresh()
    }
  }, 1000)
}

onMounted(async () => {
  await handleRefresh()
  startAutoRefresh()

  // 监听全屏变化
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.page-container.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  overflow-y: auto;
  background: #f5f7fa;
}

.metric-config {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.metric-config__label {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  white-space: nowrap;
}

.metric-config__timer {
  min-width: 28px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $color-primary;
  text-align: center;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-panel {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.chart-panel.full-width {
  grid-column: 1 / -1;
}

.chart-panel__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
