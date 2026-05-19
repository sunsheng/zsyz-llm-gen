<template>
  <div class="page-container">
    <PageHeader title="招商管理数据" subtitle="招商客户统计与变化趋势分析" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">客户招商阶段分布</h4>
        <BaseChart :option="stageOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">客户行业分布</h4>
        <BaseChart :option="industryOption" height="320px" />
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">客户性质分布</h4>
        <BaseChart :option="natureOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">客户变化趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
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
    key: 'totalClients',
    label: '客户总数',
    value: 328,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+15.8%',
    icon: 'OfficeBuilding',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'intentionClients',
    label: '意向客户',
    value: 142,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+8.2%',
    icon: 'ChatDotRound',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'signedClients',
    label: '签约客户',
    value: 86,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+12.4%',
    icon: 'CircleCheckFilled',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'conversionRate',
    label: '签约转化率',
    value: 26.2,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+3.8%',
    icon: 'DataLine',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const stageOption = ref({})
const industryOption = ref({})
const natureOption = ref({})
const trendOption = ref({})

onMounted(() => {
  const stages = ['线索获取', '初步对接', '深度洽谈', '方案制定', '签约落地', '投产运营']
  stageOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: stages },
    yAxis: { type: 'value', name: '家' },
    series: [
      {
        name: '客户数',
        type: 'bar',
        barMaxWidth: 32,
        data: [98, 72, 58, 42, 38, 20],
        barWidth: '40%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}家', fontSize: 11 },
      },
    ],
  }

  industryOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 86, name: '高端装备制造' },
          { value: 62, name: '前沿材料' },
          { value: 58, name: '数字经济' },
          { value: 48, name: '生物医药' },
          { value: 42, name: '新能源' },
          { value: 32, name: '其他' },
        ],
        label: { show: true, formatter: '{b}: {c}家' },
      },
    ],
  }

  natureOption.value = {
    color: chartColors.slice(1),
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 45, name: '国有企业' },
          { value: 168, name: '民营企业' },
          { value: 52, name: '外资企业' },
          { value: 38, name: '合资企业' },
          { value: 25, name: '其他' },
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
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增客户', '签约客户'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', name: '家' },
    series: [
      {
        name: '新增客户',
        type: 'line',
        smooth: true,
        data: [28, 22, 35, 30, 38, 42, 36, 40, 32, 35, 28, 34],
      },
      {
        name: '签约客户',
        type: 'line',
        smooth: true,
        data: [8, 6, 12, 10, 14, 16, 12, 15, 10, 12, 8, 11],
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
