<template>
  <div class="page-container">
    <PageHeader title="盈利能力" subtitle="产业盈利能力综合评估">
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
        <h4 class="chart-panel__title">营业收入趋势</h4>
        <BaseChart :option="revenueTrendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">同比增速对比</h4>
        <BaseChart :option="growthCompareOption" height="320px" />
      </div>
      <div class="chart-panel chart-panel--full">
        <h4 class="chart-panel__title">盈利能力综合评价</h4>
        <BaseChart :option="radarOption" height="380px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = [
  {
    key: 'revenue',
    label: '营业收入',
    value: 1285.6,
    unit: '亿',
    trend: 'up' as const,
    trendValue: '+12.5%',
    icon: 'Money',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'revenueGrowth',
    label: '营业收入增长率',
    value: 12.5,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+2.3%',
    icon: 'Top',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'roa',
    label: 'ROA',
    value: 6.8,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+0.5%',
    icon: 'TrendCharts',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'roe',
    label: 'ROE',
    value: 9.2,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+0.8%',
    icon: 'DataLine',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
  {
    key: 'valueAdded',
    label: '行业增加值',
    value: 856.3,
    unit: '亿',
    trend: 'up' as const,
    trendValue: '+8.7%',
    icon: 'Histogram',
    iconColor: '#F2637B',
    iconBgColor: '#FFF0F2',
  },
  {
    key: 'vaGrowth',
    label: '增加值增长率',
    value: 8.7,
    unit: '%',
    trend: 'down' as const,
    trendValue: '-1.2%',
    icon: 'Bottom',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const revenueTrendOption = ref({})
const growthCompareOption = ref({})
const radarOption = ref({})

onMounted(() => {
  const years = ['2020', '2021', '2022', '2023', '2024', '2025']

  // Revenue trend line chart
  revenueTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['营业收入', '行业增加值'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value', name: '亿元' },
    series: [
      {
        name: '营业收入',
        type: 'line',
        smooth: true,
        data: [856.2, 932.5, 1025.8, 1120.3, 1218.5, 1285.6],
        areaStyle: { opacity: 0.1 },
      },
      {
        name: '行业增加值',
        type: 'line',
        smooth: true,
        data: [568.3, 625.7, 698.2, 762.5, 812.8, 856.3],
        areaStyle: { opacity: 0.1 },
      },
    ],
  }

  // YoY growth bar chart
  growthCompareOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['营业收入增长率', '增加值增长率'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years.slice(1) },
    yAxis: { type: 'value', name: '%' },
    series: [
      {
        name: '营业收入增长率',
        type: 'bar',
        barMaxWidth: 32,
        data: [8.9, 10.0, 9.2, 8.8, 5.5],
        barWidth: '30%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
      {
        name: '增加值增长率',
        type: 'bar',
        barMaxWidth: 32,
        data: [10.1, 11.6, 9.2, 6.6, 5.3],
        barWidth: '30%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  }

  // Radar chart
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['当前值', '行业均值'] },
    radar: {
      indicator: [
        { name: '营业收入', max: 100 },
        { name: '增长率', max: 100 },
        { name: 'ROA', max: 100 },
        { name: 'ROE', max: 100 },
        { name: '行业增加值', max: 100 },
        { name: '增加值增长率', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          { value: [82, 68, 75, 72, 78, 65], name: '当前值', areaStyle: { opacity: 0.2 } },
          { value: [70, 55, 60, 58, 65, 50], name: '行业均值', areaStyle: { opacity: 0.1 } },
        ],
      },
    ],
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
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

  &--full {
    grid-column: 1 / -1;
  }
}

.chart-panel__title {
  margin: 0 0 $spacing-base;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
