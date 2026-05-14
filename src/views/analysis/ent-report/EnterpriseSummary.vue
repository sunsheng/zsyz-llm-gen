<template>
  <div class="page-container">
    <PageHeader title="企业汇总" subtitle="入驻企业总体情况汇总">
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
        <h4 class="chart-panel__title">企业行业分布</h4>
        <BaseChart :option="pieOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业规模分布</h4>
        <BaseChart :option="barOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">企业汇总列表</h4>
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
import { getMockChartData, getMockTableData } from '@/api/mock/analysis'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = ref([
  {
    key: 'total',
    label: '入驻企业',
    value: 1286,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+15.4%',
    icon: 'UserFilled',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'new',
    label: '新增企业',
    value: 198,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+28.6%',
    icon: 'Plus',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'revenue',
    label: '企业总产值',
    value: 358.7,
    unit: '亿',
    trend: 'up' as const,
    trendValue: '+9.8%',
    icon: 'TrendCharts',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'avg',
    label: '人均产值',
    value: 28.6,
    unit: '万',
    trend: 'up' as const,
    trendValue: '+5.3%',
    icon: 'Coin',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
])

const tableData = ref([])
const pieOption = ref({})
const barOption = ref({})

onMounted(() => {
  tableData.value = getMockTableData('enterprise-summary')

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

  barOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['大型', '中型', '小型', '微型'] },
    yAxis: { type: 'value', name: '企业数' },
    series: [
      {
        name: '企业数',
        type: 'bar',
        data: [86, 356, 612, 232],
        barWidth: '40%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
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
