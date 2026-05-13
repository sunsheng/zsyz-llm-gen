<template>
  <div class="page-container">
    <PageHeader title="强弱快照" subtitle="产业强弱项快速总览">
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
        <h4 class="chart-panel__title">强弱项雷达图</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">强弱项对比</h4>
        <BaseChart :option="barOption" height="360px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockStrengthData } from '@/api/mock/analysis'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const strengthData = ref<any>({})
const kpiCards = ref<any[]>([])
const radarOption = ref({})
const barOption = ref({})

onMounted(() => {
  strengthData.value = getMockStrengthData()
  const data = strengthData.value

  kpiCards.value = data.details.map((d: any) => ({
    key: d.name,
    label: d.name,
    value: d.strength,
    unit: '分',
    trend: d.trend === 'up' ? 'up' as const : d.trend === 'down' ? 'down' as const : 'flat' as const,
    trendValue: d.trend === 'up' ? '优势' : d.trend === 'down' ? '弱势' : '持平',
    icon: 'TrendCharts',
    iconColor: d.strength >= 75 ? '#4ECB73' : d.strength >= 65 ? '#FBD437' : '#F2637B',
    iconBgColor: d.strength >= 75 ? '#EDFAF0' : d.strength >= 65 ? '#FFF8E6' : '#FEF0F0'
  }))

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['优势指数', '弱势指数'] },
    radar: {
      indicator: data.industries.map((i: string) => ({ name: i, max: 100 })),
      shape: 'polygon',
      splitNumber: 5
    },
    series: [{
      type: 'radar',
      data: [
        { name: '优势指数', value: data.strengthScores, areaStyle: { opacity: 0.2 } },
        { name: '弱势指数', value: data.weaknessScores, areaStyle: { opacity: 0.1 } }
      ]
    }]
  }

  barOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['优势指数', '弱势指数'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: data.industries },
    yAxis: { type: 'value', name: '指数', max: 100 },
    series: [
      { name: '优势指数', type: 'bar', data: data.strengthScores, barWidth: '25%', itemStyle: { borderRadius: [4, 4, 0, 0] } },
      { name: '弱势指数', type: 'bar', data: data.weaknessScores, barWidth: '25%', itemStyle: { borderRadius: [4, 4, 0, 0] } }
    ]
  }
})
</script>

<style lang="scss" scoped>
.page-container { padding: 20px; }
.stat-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 20px; }
.chart-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
.chart-panel { background: $bg-card; border-radius: $radius-base; box-shadow: $shadow-card; padding: 20px; }
.chart-panel__title { font-size: 16px; font-weight: $font-weight-semibold; color: $text-primary; margin: 0 0 16px 0; }
</style>
