<template>
  <div class="page-container">
    <PageHeader title="监测仪表盘" subtitle="企业关键指标实时监控">
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
        <h4 class="chart-panel__title">营收TOP10企业</h4>
        <BaseChart :option="revenueBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业增长趋势</h4>
        <BaseChart :option="growthTrendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">综合评价指数</h4>
        <BaseChart :option="gaugeOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">健康度雷达图</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业规模分布</h4>
        <BaseChart :option="scalePieOption" height="280px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业增长对比</h4>
        <BaseChart :option="industryBarOption" height="280px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockMonitorKpi, getMockRevenueRanking, getMockEvaluationData } from '@/api/mock/monitor'
import type { MonitorKpi } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = ref<MonitorKpi[]>([])
const revenueBarOption = ref({})
const growthTrendOption = ref({})
const gaugeOption = ref({})
const radarOption = ref({})
const scalePieOption = ref({})
const industryBarOption = ref({})

onMounted(() => {
  kpiCards.value = getMockMonitorKpi()

  const revenueData = getMockRevenueRanking(10)
  revenueBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: revenueData.map((r: any) => r.name), inverse: true },
    series: [{ type: 'bar', barWidth: '50%', data: revenueData.map((r: any) => r.value) }],
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
  growthTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['营收增速', '利润增速'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: '营收增速',
        type: 'line',
        smooth: true,
        data: [8.2, 9.1, 7.8, 10.5, 11.2, 9.8, 12.3, 10.6, 11.8, 13.2, 12.5, 14.1],
      },
      {
        name: '利润增速',
        type: 'line',
        smooth: true,
        data: [6.5, 7.8, 5.9, 8.3, 9.1, 7.6, 10.2, 8.8, 9.5, 11.3, 10.1, 12.6],
      },
    ],
  }

  gaugeOption.value = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        detail: { formatter: '{value}' },
        data: [{ value: 78.5, name: '综合得分' }],
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.3, '#F56C6C'],
              [0.7, '#E6A23C'],
              [1, '#67C23A'],
            ],
          },
        },
        pointer: { width: 5 },
      },
    ],
  }

  const evalData = getMockEvaluationData()
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: evalData.enterprises.map((e: any) => e.name) },
    radar: {
      indicator: evalData.dimensions.map((d: string) => ({ name: d, max: 100 })),
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: evalData.enterprises.map((e: any) => ({
          name: e.name,
          value: e.scores,
          areaStyle: { opacity: 0.2 },
        })),
      },
    ],
  }

  scalePieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: [
          { name: '大型企业', value: 186 },
          { name: '中型企业', value: 456 },
          { name: '小型企业', value: 486 },
          { name: '微型企业', value: 158 },
        ],
      },
    ],
  }

  const industries = ['高端装备', '新材料', '生物医药', '电子信息', '新能源', '现代服务']
  industryBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: industries },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: '同比增长', type: 'bar', barWidth: '30%', data: [12.5, 8.3, 15.2, 18.6, 10.8, 6.5] },
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
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
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
