<template>
  <div class="page-container">
    <PageHeader title="园区分析" subtitle="园区运营数据分析">
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
        <h4 class="chart-panel__title">园区对比分析</h4>
        <BaseChart :option="parkBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">入驻率趋势</h4>
        <BaseChart :option="occupancyOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">园区详情</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="园区名称" min-width="180" />
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
const parkBarOption = ref({})
const occupancyOption = ref({})

onMounted(() => {
  const allCards = getMockKpiCards()
  kpiCards.value = allCards.slice(0, 4)
  tableData.value = getMockTableData('park')

  const contribData = getMockChartData('contribution-bar')
  parkBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['企业数', '产值(亿)'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: contribData.data.xAxis.data },
    yAxis: [
      { type: 'value', name: '企业数' },
      { type: 'value', name: '产值(亿)' }
    ],
    series: [
      { name: '企业数', type: 'bar', data: [156, 132, 98, 124, 86, 72], barWidth: '25%' },
      { name: '产值(亿)', type: 'bar', yAxisIndex: 1, data: contribData.data.series[0].data, barWidth: '25%' }
    ]
  }

  const trendData = getMockChartData('trend-line')
  occupancyOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: trendData.data.series.map((s: any) => s.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: trendData.data.xAxis.data, boundaryGap: false },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: trendData.data.series.map((s: any) => ({
      ...s, type: 'line', smooth: true, areaStyle: { opacity: 0.1 }
    }))
  }
})
</script>

<style lang="scss" scoped>
.page-container { padding: 20px; }
.stat-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 20px; }
.chart-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
.chart-panel { background: $bg-card; border-radius: $radius-base; box-shadow: $shadow-card; padding: 20px; }
.chart-panel__title { font-size: 16px; font-weight: $font-weight-semibold; color: $text-primary; margin: 0 0 16px 0; }
.table-section { background: $bg-card; border-radius: $radius-base; box-shadow: $shadow-card; padding: 20px; }
</style>
