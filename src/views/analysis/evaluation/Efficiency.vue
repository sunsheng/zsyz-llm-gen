<template>
  <div class="page-container">
    <PageHeader title="效率评价" subtitle="产业运营效率评估">
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
        <h4 class="chart-panel__title">各产业效率对比</h4>
        <BaseChart :option="barOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">综合效率指数</h4>
        <BaseChart :option="gaugeOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">效率明细</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="产业" min-width="180" />
        <el-table-column prop="count" label="企业数" width="100" />
        <el-table-column prop="revenue" label='人均产值(万)' width="120" />
        <el-table-column prop="rate" label="效率指数" width="120" />
        <el-table-column prop="growth" label="同比(%)" width="120">
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
  { key: 'eff', label: '综合效率', value: 73.9, unit: '分', trend: 'up' as const, trendValue: '+2.1%', icon: 'Odometer', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
  { key: 'labor', label: '劳动生产率', value: 28.6, unit: '万/人', trend: 'up' as const, trendValue: '+5.3%', icon: 'UserFilled', iconColor: '#36CBCB', iconBgColor: '#E6F7F7' },
  { key: 'invest', label: '投资回报率', value: 15.8, unit: '%', trend: 'up' as const, trendValue: '+1.8%', icon: 'Coin', iconColor: '#4ECB73', iconBgColor: '#EDFAF0' },
  { key: 'resource', label: '资源利用率', value: 82.3, unit: '%', trend: 'down' as const, trendValue: '-0.5%', icon: 'DataLine', iconColor: '#F2637B', iconBgColor: '#FEF0F0' }
])

const tableData = ref([])
const barOption = ref({})
const gaugeOption = ref({})

onMounted(() => {
  tableData.value = getMockTableData('efficiency')

  barOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['劳动生产率', '投资回报率'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['高端装备', '新材料', '生物医药', '电子信息', '新能源', '现代服务'] },
    yAxis: [
      { type: 'value', name: '万/人' },
      { type: 'value', name: '%' }
    ],
    series: [
      { name: '劳动生产率', type: 'bar', data: [32, 28, 25, 35, 22, 18], barWidth: '25%' },
      { name: '投资回报率', type: 'bar', yAxisIndex: 1, data: [18, 15, 12, 22, 10, 8], barWidth: '25%' }
    ]
  }

  gaugeOption.value = {
    series: [{
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
            [1, '#F56C6C']
          ]
        }
      },
      pointer: { itemStyle: { color: '#1889E8' } },
      axisTick: { distance: -18, length: 6, lineStyle: { color: '#fff', width: 1 } },
      splitLine: { distance: -18, length: 18, lineStyle: { color: '#fff', width: 2 } },
      axisLabel: { color: '#999', distance: 25, fontSize: 12 },
      detail: { valueAnimation: true, formatter: '{value}分', color: '#303133', fontSize: 24, offsetCenter: [0, '70%'] },
      data: [{ value: 73.9, name: '效率指数' }]
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
