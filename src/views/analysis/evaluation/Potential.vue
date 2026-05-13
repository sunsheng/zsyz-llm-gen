<template>
  <div class="page-container">
    <PageHeader title="潜力评价" subtitle="产业发展潜力评估">
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
        <h4 class="chart-panel__title">发展潜力雷达图</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">增长趋势</h4>
        <BaseChart :option="trendOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">潜力排名</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column type="index" label="排名" width="60" />
        <el-table-column prop="name" label="产业" min-width="180" />
        <el-table-column prop="count" label="企业数" width="100" />
        <el-table-column prop="revenue" label='产值(亿)' width="120" />
        <el-table-column prop="rate" label="潜力指数" width="120" />
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
  { key: 'potential', label: '综合潜力', value: 75.8, unit: '分', trend: 'up' as const, trendValue: '+5.2%', icon: 'Opportunity', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
  { key: 'market', label: '市场空间', value: 82.3, unit: '分', trend: 'up' as const, trendValue: '+8.1%', icon: 'TrendCharts', iconColor: '#36CBCB', iconBgColor: '#E6F7F7' },
  { key: 'policy', label: '政策支持度', value: 88.6, unit: '分', trend: 'up' as const, trendValue: '+3.5%', icon: 'Document', iconColor: '#4ECB73', iconBgColor: '#EDFAF0' },
  { key: 'talent', label: '人才储备', value: 71.2, unit: '分', trend: 'up' as const, trendValue: '+6.8%', icon: 'UserFilled', iconColor: '#975FE5', iconBgColor: '#F3ECFF' }
])

const tableData = ref([])
const radarOption = ref({})
const trendOption = ref({})

onMounted(() => {
  tableData.value = getMockTableData('potential')

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['发展潜力', '行业均值'] },
    radar: {
      indicator: [
        { name: '市场空间', max: 100 },
        { name: '技术前沿', max: 100 },
        { name: '政策支持', max: 100 },
        { name: '人才储备', max: 100 },
        { name: '资本热度', max: 100 }
      ],
      shape: 'polygon',
      splitNumber: 5
    },
    series: [{
      type: 'radar',
      data: [
        { name: '发展潜力', value: [82, 75, 88, 71, 68], areaStyle: { opacity: 0.2 } },
        { name: '行业均值', value: [70, 65, 72, 68, 60], areaStyle: { opacity: 0.1 } }
      ]
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
