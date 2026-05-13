<template>
  <div class="page-container">
    <PageHeader title="产业总览" subtitle="产业运行全局概览">
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
        <h4 class="chart-panel__title">入驻率趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">热门房源排行</h4>
        <BaseChart :option="hotResourceOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">租售状态分布</h4>
        <BaseChart :option="statusPieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">各园区综合评分</h4>
        <BaseChart :option="parkRadarOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">园区详情</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="名称" min-width="180" />
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
const hotResourceOption = ref({})
const statusPieOption = ref({})
const parkRadarOption = ref({})

onMounted(() => {
  kpiCards.value = getMockKpiCards()
  tableData.value = getMockTableData('overview')

  const trendData = getMockChartData('trend-line')
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: trendData.data.series.map((s: any) => s.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: trendData.data.xAxis.data },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: trendData.data.series.map((s: any) => ({ ...s, type: 'line', smooth: true }))
  }

  const hotData = getMockChartData('hot-resource-bar')
  hotResourceOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: hotData.data.series.map((s: any) => s.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: hotData.data.xAxis.data },
    yAxis: { type: 'value' },
    series: hotData.data.series.map((s: any) => ({ ...s, type: 'bar', barWidth: '30%' }))
  }

  const statusData = getMockChartData('status-pie')
  statusPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {d}%' },
      data: statusData.data
    }]
  }

  const radarData = getMockChartData('park-radar')
  parkRadarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: radarData.data.series.map((s: any) => s.name) },
    radar: {
      indicator: radarData.data.indicator,
      shape: 'polygon',
      splitNumber: 5
    },
    series: [{
      type: 'radar',
      data: radarData.data.series.map((s: any) => ({
        name: s.name,
        value: s.value,
        areaStyle: { opacity: 0.2 }
      }))
    }]
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
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
.chart-panel__title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
.table-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
