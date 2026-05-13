<template>
  <div class="page-container">
    <PageHeader title="行业布局" subtitle="企业行业分布分析">
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
        <h4 class="chart-panel__title">行业企业分布</h4>
        <BaseChart :option="industryBarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业占比</h4>
        <BaseChart :option="industryPieOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">行业详情</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="行业" min-width="180" />
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
const industryBarOption = ref({})
const industryPieOption = ref({})

onMounted(() => {
  kpiCards.value = getMockKpiCards().slice(0, 4)
  tableData.value = getMockTableData('industry-layout')

  const barData = getMockChartData('contribution-bar')
  industryBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: barData.data.xAxis.data },
    yAxis: { type: 'value' },
    series: [
      { name: '企业数', type: 'bar', data: [286, 224, 168, 198, 132, 108], barWidth: '30%' },
      { name: '新增企业', type: 'bar', data: [45, 38, 28, 35, 22, 18], barWidth: '30%' }
    ]
  }

  const pieData = getMockChartData('structure-pie')
  industryPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {d}%' },
      data: pieData.data
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
