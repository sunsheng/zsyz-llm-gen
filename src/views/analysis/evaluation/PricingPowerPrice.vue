<template>
  <div class="page-container">
    <PageHeader title="议价能力指数" subtitle="产业议价能力与价格趋势">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="chart-grid">
      <div class="chart-panel full-width">
        <h4 class="chart-panel__title">PPI 工业生产者出厂价格指数</h4>
        <BaseChart :option="ppiOption" height="320px" />
      </div>
      <div class="chart-panel full-width">
        <h4 class="chart-panel__title">CPI 居民消费价格指数</h4>
        <BaseChart :option="cpiOption" height="320px" />
      </div>
      <div class="chart-panel full-width">
        <h4 class="chart-panel__title">大宗商品价格走势</h4>
        <BaseChart :option="commodityOption" height="360px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const ppiOption = ref({})
const cpiOption = ref({})
const commodityOption = ref({})

onMounted(() => {
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

  ppiOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['PPI同比', 'PPI环比'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months, boundaryGap: false },
    yAxis: { type: 'value', name: '指数', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: 'PPI同比',
        type: 'line',
        smooth: true,
        data: [-0.8, -0.5, 0.2, 0.8, 1.2, 1.5, 1.8, 2.0, 2.3, 2.1, 1.9, 2.2],
      },
      {
        name: 'PPI环比',
        type: 'line',
        smooth: true,
        data: [0.1, 0.2, 0.3, 0.2, 0.1, 0.0, 0.2, 0.3, 0.2, 0.1, 0.0, 0.2],
      },
    ],
  }

  cpiOption.value = {
    color: chartColors.slice(1),
    tooltip: { trigger: 'axis' },
    legend: { data: ['CPI同比', 'CPI环比'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months, boundaryGap: false },
    yAxis: { type: 'value', name: '指数', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: 'CPI同比',
        type: 'line',
        smooth: true,
        data: [2.1, 2.3, 2.0, 1.8, 1.5, 1.2, 1.0, 0.8, 0.5, 0.3, 0.2, 0.5],
      },
      {
        name: 'CPI环比',
        type: 'line',
        smooth: true,
        data: [0.3, 0.2, -0.1, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.1, -0.2, 0.3],
      },
    ],
  }

  commodityOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['原油', '铜', '钢材', '铝'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months, boundaryGap: false },
    yAxis: { type: 'value', name: '价格指数' },
    series: [
      {
        name: '原油',
        type: 'line',
        smooth: true,
        data: [82, 85, 88, 92, 89, 86, 84, 88, 91, 95, 93, 90],
      },
      {
        name: '铜',
        type: 'line',
        smooth: true,
        data: [68, 72, 75, 78, 80, 82, 85, 83, 86, 88, 90, 92],
      },
      {
        name: '钢材',
        type: 'line',
        smooth: true,
        data: [105, 108, 110, 112, 108, 106, 104, 107, 110, 112, 115, 118],
      },
      {
        name: '铝',
        type: 'line',
        smooth: true,
        data: [52, 55, 58, 60, 62, 58, 56, 59, 62, 65, 63, 61],
      },
    ],
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.chart-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-lg;
}
.chart-panel {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  &.full-width {
    grid-column: 1 / -1;
  }
}
.chart-panel__title {
  margin: 0 0 $spacing-base;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
