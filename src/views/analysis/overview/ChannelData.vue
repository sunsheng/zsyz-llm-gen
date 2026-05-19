<template>
  <div class="page-container">
    <PageHeader title="渠道空间数据" subtitle="招商渠道人员与客户数据分析" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">各渠道人员数量</h4>
        <BaseChart :option="staffPieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">各渠道带来客户数量</h4>
        <BaseChart :option="clientPieOption" height="320px" />
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">渠道人员变化趋势</h4>
        <BaseChart :option="staffTrendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">渠道带来客户变化趋势</h4>
        <BaseChart :option="clientTrendOption" height="320px" />
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
    key: 'totalStaff',
    label: '渠道人员',
    value: 86,
    unit: '人',
    trend: 'up' as const,
    trendValue: '+12.3%',
    icon: 'User',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'totalClients',
    label: '引入客户',
    value: 328,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+15.8%',
    icon: 'OfficeBuilding',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'avgConversion',
    label: '平均转化率',
    value: 24.3,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+2.1%',
    icon: 'TrendCharts',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'activeChannels',
    label: '活跃渠道',
    value: 38,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+5.6%',
    icon: 'Connection',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const staffPieOption = ref({})
const clientPieOption = ref({})
const staffTrendOption = ref({})
const clientTrendOption = ref({})

onMounted(() => {
  const channels = ['政府推介', '行业协会', '中介机构', '以商招商', '展会活动', '线上平台']

  staffPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 22, name: '政府推介' },
          { value: 18, name: '行业协会' },
          { value: 15, name: '中介机构' },
          { value: 12, name: '以商招商' },
          { value: 10, name: '展会活动' },
          { value: 9, name: '线上平台' },
        ],
        label: { show: true, formatter: '{b}: {c}人' },
      },
    ],
  }

  clientPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 86, name: '政府推介' },
          { value: 62, name: '行业协会' },
          { value: 58, name: '中介机构' },
          { value: 52, name: '以商招商' },
          { value: 38, name: '展会活动' },
          { value: 32, name: '线上平台' },
        ],
        label: { show: true, formatter: '{b}: {c}家' },
      },
    ],
  }

  const months = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ]

  staffTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: channels },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', name: '人' },
    series: [
      {
        name: '政府推介',
        type: 'line',
        smooth: true,
        data: [18, 19, 20, 20, 21, 22, 22, 23, 23, 22, 22, 22],
      },
      {
        name: '行业协会',
        type: 'line',
        smooth: true,
        data: [14, 15, 15, 16, 17, 17, 18, 18, 17, 18, 18, 18],
      },
      {
        name: '中介机构',
        type: 'line',
        smooth: true,
        data: [11, 12, 12, 13, 14, 14, 15, 15, 15, 14, 15, 15],
      },
      {
        name: '以商招商',
        type: 'line',
        smooth: true,
        data: [8, 9, 9, 10, 10, 11, 12, 12, 12, 12, 12, 12],
      },
      {
        name: '展会活动',
        type: 'line',
        smooth: true,
        data: [6, 7, 8, 8, 9, 10, 10, 10, 10, 10, 10, 10],
      },
      { name: '线上平台', type: 'line', smooth: true, data: [5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 9, 9] },
    ],
  }

  clientTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: channels },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', name: '家' },
    series: [
      {
        name: '政府推介',
        type: 'line',
        smooth: true,
        data: [68, 72, 75, 78, 80, 82, 84, 86, 85, 86, 86, 86],
      },
      {
        name: '行业协会',
        type: 'line',
        smooth: true,
        data: [48, 50, 52, 55, 56, 58, 60, 62, 61, 62, 62, 62],
      },
      {
        name: '中介机构',
        type: 'line',
        smooth: true,
        data: [42, 45, 48, 50, 52, 54, 55, 56, 57, 58, 58, 58],
      },
      {
        name: '以商招商',
        type: 'line',
        smooth: true,
        data: [35, 38, 40, 42, 45, 48, 50, 52, 51, 52, 52, 52],
      },
      {
        name: '展会活动',
        type: 'line',
        smooth: true,
        data: [25, 28, 30, 32, 34, 36, 37, 38, 38, 38, 38, 38],
      },
      {
        name: '线上平台',
        type: 'line',
        smooth: true,
        data: [20, 22, 24, 26, 28, 30, 31, 32, 32, 32, 32, 32],
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
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
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
