<template>
  <div class="page-container">
    <PageHeader title="创新力评价" subtitle="产业创新力评估分析">
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
        <h4 class="chart-panel__title">创新力分布</h4>
        <BaseChart :option="scatterOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">创新力趋势</h4>
        <BaseChart :option="trendOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">创新力排名</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column type="index" label="排名" width="60" />
        <el-table-column prop="name" label="产业" min-width="180" />
        <el-table-column prop="count" label="专利数" width="100" />
        <el-table-column prop="revenue" label='研发投入(亿)' width="120" />
        <el-table-column prop="rate" label="创新指数" width="120" />
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
import { getMockChartData, getMockTableData } from '@/api/mock/analysis'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = ref([
  { key: 'patent', label: '专利数量', value: 3586, unit: '件', trend: 'up' as const, trendValue: '+18.5%', icon: 'Document', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
  { key: 'rd', label: '研发投入', value: 52.8, unit: '亿', trend: 'up' as const, trendValue: '+12.3%', icon: 'Coin', iconColor: '#36CBCB', iconBgColor: '#E6F7F7' },
  { key: 'innov', label: '创新指数', value: 85.1, unit: '', trend: 'up' as const, trendValue: '+6.8%', icon: 'Opportunity', iconColor: '#4ECB73', iconBgColor: '#EDFAF0' },
  { key: 'transform', label: '成果转化率', value: 68.3, unit: '%', trend: 'up' as const, trendValue: '+4.5%', icon: 'Switch', iconColor: '#975FE5', iconBgColor: '#F3ECFF' }
])

const tableData = ref([])
const scatterOption = ref({})
const trendOption = ref({})

onMounted(() => {
  tableData.value = getMockTableData('innovation')

  const scatterData = getMockChartData('scatter-distribution')
  scatterOption.value = {
    color: chartColors,
    tooltip: {
      formatter: (params: any) => `研发投入: ${params.value[0]}<br/>产出指数: ${params.value[1]}<br/>规模: ${params.value[2]}`
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: '研发投入指数', splitLine: { show: true, lineStyle: { type: 'dashed' } } },
    yAxis: { type: 'value', name: '产出指数', splitLine: { show: true, lineStyle: { type: 'dashed' } } },
    series: [{
      type: 'scatter',
      symbolSize: (val: number[]) => val[2] / 2,
      data: scatterData.data,
      itemStyle: { opacity: 0.7 }
    }]
  }

  const trendData = getMockChartData('growth-line')
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: trendData.data.series.map((s: any) => s.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: trendData.data.xAxis.data, boundaryGap: false },
    yAxis: { type: 'value' },
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
