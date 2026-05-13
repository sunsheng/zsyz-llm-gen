<template>
  <div class="page-container">
    <PageHeader title="区域布局" subtitle="企业区域分布分析">
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
        <h4 class="chart-panel__title">区域企业分布</h4>
        <BaseChart :option="regionBarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业分布散点图</h4>
        <BaseChart :option="scatterOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">区域详情</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="区域" min-width="180" />
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
const regionBarOption = ref({})
const scatterOption = ref({})

onMounted(() => {
  kpiCards.value = getMockKpiCards().slice(0, 4)
  tableData.value = getMockTableData('region-layout')

  const barData = getMockChartData('hot-resource-bar')
  regionBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: barData.data.series.map((s: any) => s.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['东区', '西区', '南区', '北区', '中心区', '开发区'] },
    yAxis: { type: 'value' },
    series: [
      { name: '企业数', type: 'bar', data: [286, 198, 245, 176, 312, 269], barWidth: '30%' },
      { name: '新增企业', type: 'bar', data: [45, 32, 38, 28, 52, 41], barWidth: '30%' }
    ]
  }

  const scatterData = getMockChartData('scatter-distribution')
  scatterOption.value = {
    color: chartColors,
    tooltip: {
      formatter: (params: any) => `企业密度: ${params.value[0]}<br/>产值指数: ${params.value[1]}<br/>规模: ${params.value[2]}`
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: '企业密度', splitLine: { show: true, lineStyle: { type: 'dashed' } } },
    yAxis: { type: 'value', name: '产值指数', splitLine: { show: true, lineStyle: { type: 'dashed' } } },
    series: [{
      type: 'scatter',
      symbolSize: (val: number[]) => val[2] / 2,
      data: scatterData.data,
      itemStyle: { opacity: 0.7 }
    }]
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
