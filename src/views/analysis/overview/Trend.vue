<template>
  <div class="page-container">
    <PageHeader title="发展趋势" subtitle="产业发展趋势分析">
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
        <h4 class="chart-panel__title">产业增长趋势</h4>
        <BaseChart :option="growthOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业对比分析</h4>
        <BaseChart :option="comparisonOption" height="360px" />
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
const growthOption = ref({})
const comparisonOption = ref({})

onMounted(() => {
  const allCards = getMockKpiCards()
  kpiCards.value = allCards.slice(0, 4)

  const growthData = getMockChartData('growth-line')
  growthOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: growthData.data.series.map((s: any) => s.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: growthData.data.xAxis.data, boundaryGap: false },
    yAxis: { type: 'value' },
    series: growthData.data.series.map((s: any) => ({
      ...s,
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.1 },
    })),
  }

  const contribData = getMockChartData('contribution-bar')
  comparisonOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['产值(亿)', '同比增速(%)'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: contribData.data.xAxis.data },
    yAxis: [
      { type: 'value', name: '产值(亿)' },
      { type: 'value', name: '增速(%)' },
    ],
    series: [
      {
        name: '产值(亿)',
        type: 'bar',
        data: contribData.data.series[0].data,
        barWidth: '30%',
      },
      {
        name: '同比增速(%)',
        type: 'line',
        yAxisIndex: 1,
        data: [8.3, 12.1, 6.7, 15.4, 9.8, 4.5],
        smooth: true,
      },
    ],
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
