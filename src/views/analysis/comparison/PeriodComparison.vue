<template>
  <div class="page-container">
    <PageHeader title="时期对比" subtitle="不同时期运营数据对比">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">产值趋势对比</h4>
        <BaseChart :option="trendOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">入驻率趋势对比</h4>
        <BaseChart :option="occupancyOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业增长对比</h4>
        <BaseChart :option="growthOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">综合指数对比</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">时期对比详情</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="指标" min-width="180" />
        <el-table-column prop="count" label="本时期" width="120" />
        <el-table-column prop="revenue" label="上时期" width="120" />
        <el-table-column prop="rate" label="变化(%)" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.rate >= 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.rate >= 0 ? '+' : '' }}{{ row.rate }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="growth" label="趋势" width="100">
          <template #default="{ row }">
            <el-tag :type="row.growth >= 0 ? 'success' : 'danger'" size="small">
              {{ row.growth >= 0 ? '上升' : '下降' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockChartData, getMockTableData } from '@/api/mock/analysis'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']
const months = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]

const tableData = ref([])
const trendOption = ref({})
const occupancyOption = ref({})
const growthOption = ref({})
const radarOption = ref({})

onMounted(() => {
  tableData.value = getMockTableData('period-comparison')

  const trendData = getMockChartData('trend-line')
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['本年度', '上年度'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months, boundaryGap: false },
    yAxis: { type: 'value', name: '产值(亿)' },
    series: [
      {
        name: '本年度',
        type: 'line',
        smooth: true,
        data: trendData.data.series[0].data,
        areaStyle: { opacity: 0.1 },
      },
      {
        name: '上年度',
        type: 'line',
        smooth: true,
        data: trendData.data.series[0].data.map((v: number) => Math.floor(v * 0.9)),
        areaStyle: { opacity: 0.05 },
      },
    ],
  }

  occupancyOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['本年度', '上年度'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months, boundaryGap: false },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: '本年度',
        type: 'line',
        smooth: true,
        data: [72, 73, 75, 76, 78, 79, 81, 82, 84, 85, 86, 88],
      },
      {
        name: '上年度',
        type: 'line',
        smooth: true,
        data: [65, 66, 68, 70, 71, 72, 73, 75, 76, 77, 78, 79],
      },
    ],
  }

  growthOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增企业', '退出企业'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', name: '家' },
    series: [
      {
        name: '新增企业',
        type: 'bar',
        data: [45, 38, 52, 35, 48, 42, 56, 39, 45, 38, 50, 43],
        barWidth: '25%',
      },
      {
        name: '退出企业',
        type: 'bar',
        data: [12, 15, 10, 18, 13, 16, 11, 14, 12, 15, 10, 13],
        barWidth: '25%',
      },
    ],
  }

  const radarData = getMockChartData('park-radar')
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['本年度', '上年度'] },
    radar: {
      indicator: radarData.data.indicator,
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          { name: '本年度', value: [85, 78, 90, 82, 88], areaStyle: { opacity: 0.2 } },
          { name: '上年度', value: [72, 70, 78, 75, 72], areaStyle: { opacity: 0.1 } },
        ],
      },
    ],
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
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
