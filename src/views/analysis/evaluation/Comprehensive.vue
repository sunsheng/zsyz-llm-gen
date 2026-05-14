<template>
  <div class="page-container">
    <PageHeader title="综合评价" subtitle="产业综合评价指标体系">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">综合评价指数</h4>
        <BaseChart :option="gaugeOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">五维评价雷达图</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
      <div class="chart-panel" style="grid-column: span 2">
        <h4 class="chart-panel__title">综合评分趋势</h4>
        <BaseChart :option="trendOption" height="300px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockKpiCards, getMockChartData } from '@/api/mock/analysis'
import type { KpiCard } from '@/api/types/analysis'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = ref<KpiCard[]>([])
const gaugeOption = ref({})
const radarOption = ref({})
const trendOption = ref({})

onMounted(() => {
  kpiCards.value = [
    {
      key: 'score',
      label: '综合得分',
      value: 78.5,
      unit: '分',
      trend: 'up' as const,
      trendValue: '+3.2%',
      icon: 'TrendCharts',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'rank',
      label: '全国排名',
      value: 15,
      unit: '名',
      trend: 'up' as const,
      trendValue: '+2位',
      icon: 'Trophy',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
    {
      key: 'growth',
      label: '增长指数',
      value: 82.3,
      unit: '',
      trend: 'up' as const,
      trendValue: '+5.1%',
      icon: 'DataLine',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'potential',
      label: '发展潜力',
      value: 75.8,
      unit: '',
      trend: 'up' as const,
      trendValue: '+2.8%',
      icon: 'Opportunity',
      iconColor: '#975FE5',
      iconBgColor: '#F3ECFF',
    },
  ]

  const gaugeData = getMockChartData('evaluation-gauge')
  gaugeOption.value = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 18,
            color: [
              [0.3, '#67C23A'],
              [0.7, '#E6A23C'],
              [1, '#F56C6C'],
            ],
          },
        },
        pointer: { itemStyle: { color: '#1889E8' } },
        axisTick: { distance: -18, length: 6, lineStyle: { color: '#fff', width: 1 } },
        splitLine: { distance: -18, length: 18, lineStyle: { color: '#fff', width: 2 } },
        axisLabel: { color: '#999', distance: 25, fontSize: 12 },
        detail: {
          valueAnimation: true,
          formatter: '{value}分',
          color: '#303133',
          fontSize: 24,
          offsetCenter: [0, '70%'],
        },
        data: [{ value: gaugeData.data.value, name: gaugeData.data.name }],
      },
    ],
  }

  const radarData = getMockChartData('park-radar')
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: radarData.data.series.map((s: any) => s.name) },
    radar: {
      indicator: radarData.data.indicator,
      shape: 'polygon',
      splitNumber: 5,
      axisName: { color: '#606266' },
    },
    series: [
      {
        type: 'radar',
        data: radarData.data.series.map((s: any) => ({
          name: s.name,
          value: s.value,
          areaStyle: { opacity: 0.2 },
        })),
      },
    ],
  }

  const trendData = getMockChartData('trend-line')
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: trendData.data.series.map((s: any) => s.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: trendData.data.xAxis.data, boundaryGap: false },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}分' } },
    series: trendData.data.series.map((s: any) => ({
      ...s,
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.1 },
    })),
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
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
.chart-panel__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
