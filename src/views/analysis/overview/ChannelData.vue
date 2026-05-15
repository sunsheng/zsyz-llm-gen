<template>
  <div class="page-container">
    <PageHeader title="渠道空间数据" subtitle="招商渠道分布与效果分析">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">渠道来源分布</h4>
        <BaseChart :option="channelPieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">渠道转化率对比</h4>
        <BaseChart :option="conversionOption" height="320px" />
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
    key: 'totalChannels',
    label: '招商渠道',
    value: 56,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+8.2%',
    icon: 'Share',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'activeChannels',
    label: '活跃渠道',
    value: 38,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+5.6%',
    icon: 'Connection',
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
    key: 'newLeads',
    label: '新线索数',
    value: 328,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+15.8%',
    icon: 'UserFilled',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const channelPieOption = ref({})
const conversionOption = ref({})

onMounted(() => {
  channelPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 18, name: '政府推介' },
          { value: 12, name: '行业协会' },
          { value: 10, name: '中介机构' },
          { value: 8, name: '以商招商' },
          { value: 5, name: '展会活动' },
          { value: 3, name: '线上平台' },
        ],
      },
    ],
  }

  const channels = ['政府推介', '行业协会', '中介机构', '以商招商', '展会活动', '线上平台']
  conversionOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: channels },
    yAxis: { type: 'value', name: '%' },
    series: [
      {
        name: '转化率',
        type: 'bar',
        barMaxWidth: 32,
        data: [32, 28, 22, 35, 18, 15],
        barWidth: '40%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
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
