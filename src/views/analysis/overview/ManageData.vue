<template>
  <div class="page-container">
    <PageHeader title="招商管理数据" subtitle="招商项目全流程管理数据">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">项目阶段分布</h4>
        <BaseChart :option="stageOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">月度推进趋势</h4>
        <BaseChart :option="progressOption" height="320px" />
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
    key: 'totalProjects',
    label: '管理项目',
    value: 89,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+6.8%',
    icon: 'FolderOpened',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'completedProjects',
    label: '已完成',
    value: 46,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+12.4%',
    icon: 'CircleCheckFilled',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'avgCycle',
    label: '平均周期',
    value: 68,
    unit: '天',
    trend: 'down' as const,
    trendValue: '-5.2%',
    icon: 'Timer',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'completionRate',
    label: '完成率',
    value: 51.7,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+3.8%',
    icon: 'DataLine',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const stageOption = ref({})
const progressOption = ref({})

onMounted(() => {
  const stages = ['线索获取', '初步对接', '深度洽谈', '方案制定', '签约落地', '投产运营']
  stageOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: stages },
    yAxis: { type: 'value', name: '个' },
    series: [
      {
        name: '项目数',
        type: 'bar',
        barMaxWidth: 32,
        data: [28, 22, 18, 12, 8, 1],
        barWidth: '40%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
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
  progressOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增', '完成'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', name: '个' },
    series: [
      { name: '新增', type: 'line', smooth: true, data: [8, 6, 10, 7, 9, 12, 8, 11, 7, 9, 6, 8] },
      { name: '完成', type: 'line', smooth: true, data: [4, 3, 6, 5, 7, 8, 5, 7, 4, 6, 4, 5] },
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
