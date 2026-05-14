<template>
  <div class="page-container">
    <PageHeader title="年度报告" subtitle="产业运行年度总结报告">
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
        <h4 class="chart-panel__title">年度增长趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">年度产业结构</h4>
        <BaseChart :option="pieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">年度产业贡献</h4>
        <BaseChart :option="barOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">年度综合评价</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">年度综合指数</h4>
        <BaseChart :option="gaugeOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业分布散点</h4>
        <BaseChart :option="scatterOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">年度数据汇总</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="产业" min-width="180" />
        <el-table-column prop="count" label="企业数" width="100" />
        <el-table-column prop="revenue" label="产值(亿)" width="120" />
        <el-table-column prop="rate" label="入驻率(%)" width="120" />
        <el-table-column prop="growth" label="增长率(%)" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockKpiCards, getMockChartData, getMockTableData } from '@/api/mock/analysis'
import type { KpiCard } from '@/api/types/analysis'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = ref<KpiCard[]>([])
const tableData = ref([])
const trendOption = ref({})
const pieOption = ref({})
const barOption = ref({})
const radarOption = ref({})
const gaugeOption = ref({})
const scatterOption = ref({})

onMounted(() => {
  kpiCards.value = getMockKpiCards()
  tableData.value = getMockTableData('annual')

  const trendData = getMockChartData('growth-line')
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: trendData.data.series.map((s: any) => s.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: trendData.data.xAxis.data, boundaryGap: false },
    yAxis: { type: 'value' },
    series: trendData.data.series.map((s: any) => ({
      ...s,
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.1 },
    })),
  }

  const structData = getMockChartData('structure-pie')
  pieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: structData.data,
      },
    ],
  }

  const contribData = getMockChartData('contribution-bar')
  barOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: contribData.data.xAxis.data },
    yAxis: { type: 'value' },
    series: [
      {
        name: '产值(亿)',
        type: 'bar',
        data: contribData.data.series[0].data,
        barWidth: '35%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  }

  const radarData = getMockChartData('park-radar')
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: radarData.data.series.map((s: any) => s.name) },
    radar: { indicator: radarData.data.indicator, shape: 'polygon', splitNumber: 5 },
    series: [
      {
        type: 'radar',
        data: radarData.data.series.map((s: any) => ({
          name: s.name,
          value: s.value,
          areaStyle: { opacity: 0.2 },
        })),
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
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 18,
            color: [
              [0.3, '#67C23A'],
              [0.7, '#E6A23C'],
              [1, '#F56C6C'],
            ],
          },
        },
        pointer: { itemStyle: { color: '#1889E8' } },
        axisTick: { distance: -18, length: 6, lineStyle: { color: '#fff', width: 1 } },
        splitLine: { distance: -18, length: 18, lineStyle: { color: '#fff', width: 2 } },
        axisLabel: { color: '#999', distance: 25, fontSize: 12 },
        detail: {
          valueAnimation: true,
          formatter: '{value}分',
          color: '#303133',
          fontSize: 24,
          offsetCenter: [0, '70%'],
        },
        data: [{ value: 82.3, name: '年度得分' }],
      },
    ],
  }

  const scatterData = getMockChartData('scatter-distribution')
  scatterOption.value = {
    color: chartColors,
    tooltip: {
      formatter: (params: any) =>
        `指标A: ${params.value[0]}<br/>指标B: ${params.value[1]}<br/>规模: ${params.value[2]}`,
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', splitLine: { show: true, lineStyle: { type: 'dashed' } } },
    yAxis: { type: 'value', splitLine: { show: true, lineStyle: { type: 'dashed' } } },
    series: [
      {
        type: 'scatter',
        symbolSize: (val: number[]) => val[2] / 2,
        data: scatterData.data,
        itemStyle: { opacity: 0.7 },
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
.table-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
