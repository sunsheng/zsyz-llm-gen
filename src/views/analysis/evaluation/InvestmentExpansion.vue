<template>
  <div class="page-container">
    <PageHeader title="投资扩张指数" subtitle="产业投资扩张趋势分析" />

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">固定资产投资增速</h4>
        <BaseChart :option="fixedInvestOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业数量趋势</h4>
        <BaseChart :option="enterpriseCountOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">股权投资额</h4>
        <BaseChart :option="equityInvestOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">股权投资额增速</h4>
        <BaseChart :option="equityGrowthOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const fixedInvestOption = ref({})
const enterpriseCountOption = ref({})
const equityInvestOption = ref({})
const equityGrowthOption = ref({})

onMounted(() => {
  const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025']

  fixedInvestOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['产业增速', '全国增速'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years, boundaryGap: false },
    yAxis: { type: 'value', name: '增速(%)', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: '产业增速',
        type: 'line',
        smooth: true,
        data: [8.5, 6.2, 12.3, 9.8, 11.5, 13.2, 10.8],
        areaStyle: { opacity: 0.1 },
      },
      {
        name: '全国增速',
        type: 'line',
        smooth: true,
        data: [5.4, 2.9, 4.9, 5.1, 3.0, 5.2, 4.8],
        lineStyle: { type: 'dashed' },
      },
    ],
  }

  enterpriseCountOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years, boundaryGap: false },
    yAxis: { type: 'value', name: '企业数(家)' },
    series: [
      {
        type: 'line',
        smooth: true,
        data: [386, 412, 458, 502, 548, 602, 658],
        areaStyle: { opacity: 0.15 },
      },
    ],
  }

  equityInvestOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years, boundaryGap: false },
    yAxis: { type: 'value', name: '投资额(亿)' },
    series: [
      {
        type: 'line',
        smooth: true,
        data: [125.3, 98.6, 186.2, 165.8, 210.5, 258.3, 285.6],
        areaStyle: { opacity: 0.15 },
      },
    ],
  }

  equityGrowthOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years, boundaryGap: false },
    yAxis: { type: 'value', name: '增速(%)', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        type: 'line',
        smooth: true,
        data: [null, -21.3, 88.8, -10.9, 27.0, 22.7, 10.6],
        areaStyle: { opacity: 0.1 },
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' },
          ],
        },
      },
    ],
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
}
.chart-panel {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.chart-panel__title {
  margin: 0 0 $spacing-base;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
