<template>
  <div class="page-container">
    <PageHeader title="健康度趋势" subtitle="企业健康度变化趋势追踪">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="chart-grid">
      <div class="chart-panel full-width">
        <h4 class="chart-panel__title">整体健康度趋势</h4>
        <BaseChart :option="overallTrendOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">各维度趋势</h4>
        <BaseChart :option="dimensionTrendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">健康度等级变化</h4>
        <BaseChart :option="levelTrendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业健康度对比</h4>
        <BaseChart :option="industryCompareOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">预警企业趋势</h4>
        <BaseChart :option="warningTrendOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const overallTrendOption = ref({})
const dimensionTrendOption = ref({})
const levelTrendOption = ref({})
const industryCompareOption = ref({})
const warningTrendOption = ref({})

onMounted(() => {
  const months = ['2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06']

  overallTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['平均健康分', '目标值'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', min: 60, max: 100 },
    series: [
      { name: '平均健康分', type: 'line', smooth: true, data: [72.5, 73.1, 74.2, 75.0, 74.8, 75.6, 76.2, 75.9, 76.5, 77.1, 76.8, 77.5] },
      { name: '目标值', type: 'line', smooth: true, data: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80], lineStyle: { type: 'dashed' } }
    ]
  }

  dimensionTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['成长力', '盈利力', '创新力', '风控力', '社会贡献'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months.slice(6) },
    yAxis: { type: 'value', min: 50, max: 100 },
    series: [
      { name: '成长力', type: 'line', smooth: true, data: [72, 74, 73, 75, 76, 78] },
      { name: '盈利力', type: 'line', smooth: true, data: [68, 69, 71, 70, 72, 73] },
      { name: '创新力', type: 'line', smooth: true, data: [65, 66, 68, 70, 71, 72] },
      { name: '风控力', type: 'line', smooth: true, data: [78, 79, 80, 81, 82, 83] },
      { name: '社会贡献', type: 'line', smooth: true, data: [70, 71, 70, 72, 73, 74] }
    ]
  }

  levelTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['健康', '亚健康', '不健康'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months.slice(6) },
    yAxis: { type: 'value' },
    series: [
      { name: '健康', type: 'bar', stack: 'total', data: [820, 835, 845, 850, 856, 860] },
      { name: '亚健康', type: 'bar', stack: 'total', data: [280, 270, 262, 258, 254, 250] },
      { name: '不健康', type: 'bar', stack: 'total', data: [140, 135, 133, 132, 128, 126] }
    ]
  }

  const industries = ['高端装备', '新材料', '生物医药', '电子信息', '新能源']
  industryCompareOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['本月', '上月'] },
    radar: {
      indicator: industries.map((name: string) => ({ name, max: 100 })),
      shape: 'polygon',
      splitNumber: 5
    },
    series: [{
      type: 'radar',
      data: [
        { name: '本月', value: [82, 76, 80, 74, 70], areaStyle: { opacity: 0.2 } },
        { name: '上月', value: [78, 74, 77, 71, 68], areaStyle: { opacity: 0.1 } }
      ]
    }]
  }

  warningTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增预警', '解除预警', '累计预警'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months.slice(6) },
    yAxis: { type: 'value' },
    series: [
      { name: '新增预警', type: 'bar', data: [35, 28, 32, 25, 22, 18] },
      { name: '解除预警', type: 'bar', data: [30, 35, 28, 32, 30, 28] },
      { name: '累计预警', type: 'line', smooth: true, data: [186, 179, 183, 176, 168, 158] }
    ]
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.chart-panel {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
.chart-panel.full-width {
  grid-column: 1 / -1;
}
.chart-panel__title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
</style>
