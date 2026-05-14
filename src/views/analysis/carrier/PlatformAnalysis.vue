<template>
  <div class="page-container">
    <PageHeader title="平台分析" subtitle="公共服务平台运营分析">
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
        <h4 class="chart-panel__title">平台服务能力评估</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">平台使用趋势</h4>
        <BaseChart :option="trendOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">平台详情</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="平台名称" min-width="180" />
        <el-table-column prop="count" label="服务企业数" width="120" />
        <el-table-column prop="revenue" label="服务收入(万)" width="120" />
        <el-table-column prop="rate" label="满意度(%)" width="120" />
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
    key: 'platform',
    label: '平台数量',
    value: 28,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+16.7%',
    icon: 'Monitor',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'service',
    label: '服务企业数',
    value: 862,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+22.3%',
    icon: 'UserFilled',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'satisfaction',
    label: '服务满意度',
    value: 92.5,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+3.8%',
    icon: 'Star',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'income',
    label: '服务收入',
    value: 3580,
    unit: '万',
    trend: 'up' as const,
    trendValue: '+15.6%',
    icon: 'Coin',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
])

const tableData = ref([])
const radarOption = ref({})
const trendOption = ref({})

onMounted(() => {
  tableData.value = getMockTableData('platform')

  const radarData = getMockChartData('park-radar')
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['当前水平', '目标水平'] },
    radar: {
      indicator: [
        { name: '技术支持', max: 100 },
        { name: '人才培养', max: 100 },
        { name: '融资服务', max: 100 },
        { name: '市场拓展', max: 100 },
        { name: '政策咨询', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          { name: '当前水平', value: [85, 72, 68, 78, 90], areaStyle: { opacity: 0.2 } },
          { name: '目标水平', value: [95, 90, 85, 88, 92], areaStyle: { opacity: 0.1 } },
        ],
      },
    ],
  }

  const trendData = getMockChartData('trend-line')
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: trendData.data.series.map((s: any) => s.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: trendData.data.xAxis.data, boundaryGap: false },
    yAxis: { type: 'value' },
    series: trendData.data.series.map((s: any) => ({
      ...s,
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.1 },
    })),
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
