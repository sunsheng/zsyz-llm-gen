<template>
  <div class="page-container">
    <PageHeader title="竞争力评价" subtitle="产业竞争力多维评估">
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
        <h4 class="chart-panel__title">竞争力雷达图</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">竞争力对比</h4>
        <BaseChart :option="barOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">竞争力排名</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column type="index" label="排名" width="60" />
        <el-table-column prop="name" label="产业" min-width="180" />
        <el-table-column prop="count" label="企业数" width="100" />
        <el-table-column prop="revenue" label="产值(亿)" width="120" />
        <el-table-column prop="rate" label="竞争力指数" width="120" />
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
  {
    key: 'comp',
    label: '综合竞争力',
    value: 82.6,
    unit: '分',
    trend: 'up' as const,
    trendValue: '+4.2%',
    icon: 'TrendCharts',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'res',
    label: '资源竞争力',
    value: 78.3,
    unit: '分',
    trend: 'up' as const,
    trendValue: '+3.5%',
    icon: 'DataLine',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'innov',
    label: '创新竞争力',
    value: 85.1,
    unit: '分',
    trend: 'up' as const,
    trendValue: '+6.8%',
    icon: 'Opportunity',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'eff',
    label: '效率竞争力',
    value: 73.9,
    unit: '分',
    trend: 'down' as const,
    trendValue: '-1.2%',
    icon: 'Odometer',
    iconColor: '#F2637B',
    iconBgColor: '#FEF0F0',
  },
])

const tableData = ref([])
const radarOption = ref({})
const barOption = ref({})

onMounted(() => {
  tableData.value = getMockTableData('competitiveness')

  const radarData = getMockChartData('park-radar')
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['当前水平', '行业均值'] },
    radar: {
      indicator: [
        { name: '资源禀赋', max: 100 },
        { name: '产业基础', max: 100 },
        { name: '创新能力', max: 100 },
        { name: '市场活力', max: 100 },
        { name: '营商环境', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          { name: '当前水平', value: [85, 78, 90, 82, 76], areaStyle: { opacity: 0.2 } },
          { name: '行业均值', value: [72, 75, 68, 70, 73], areaStyle: { opacity: 0.1 } },
        ],
      },
    ],
  }

  barOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['竞争力指数', '增长指数'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['高端装备', '新材料', '生物医药', '电子信息', '新能源', '现代服务'],
    },
    yAxis: { type: 'value', name: '指数' },
    series: [
      { name: '竞争力指数', type: 'bar', data: [85, 78, 72, 68, 65, 62], barWidth: '25%' },
      { name: '增长指数', type: 'bar', data: [78, 82, 65, 85, 58, 55], barWidth: '25%' },
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
