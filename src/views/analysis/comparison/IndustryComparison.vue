<template>
  <div class="page-container">
    <PageHeader title="行业对比" subtitle="各行业综合对比分析">
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
        <h4 class="chart-panel__title">行业产值对比</h4>
        <BaseChart :option="barOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业占比分布</h4>
        <BaseChart :option="pieOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">行业对比详情</h4>
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
import { getMockChartData, getMockTableData } from '@/api/mock/analysis'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = ref([
  {
    key: 'ind1',
    label: '行业总数',
    value: 6,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+1',
    icon: 'DataLine',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'ind2',
    label: '总产值',
    value: 358.7,
    unit: '亿',
    trend: 'up' as const,
    trendValue: '+9.8%',
    icon: 'TrendCharts',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'ind3',
    label: '企业总数',
    value: 1286,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+15.4%',
    icon: 'UserFilled',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'ind4',
    label: '平均增长率',
    value: 8.9,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+2.3%',
    icon: 'Odometer',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
])

const tableData = ref([])
const barOption = ref({})
const pieOption = ref({})

onMounted(() => {
  tableData.value = getMockTableData('industry-comparison')

  const contribData = getMockChartData('contribution-bar')
  barOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['本年度', '上年度'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: contribData.data.xAxis.data },
    yAxis: { type: 'value', name: '产值(亿)' },
    series: [
      { name: '本年度', type: 'bar', data: contribData.data.series[0].data, barWidth: '25%' },
      {
        name: '上年度',
        type: 'bar',
        data: contribData.data.series[0].data.map((v: number) => +(v * 0.88).toFixed(1)),
        barWidth: '25%',
      },
    ],
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
