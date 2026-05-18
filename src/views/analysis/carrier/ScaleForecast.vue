<template>
  <div class="page-container">
    <PageHeader title="产业规模及预测" subtitle="产业规模趋势与预测分析">
      <template #actions>
        <el-radio-group v-model="dimension" size="small">
          <el-radio-button value="region">按区域</el-radio-button>
          <el-radio-button value="industry">按行业</el-radio-button>
        </el-radio-group>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="chart-section">
      <div class="chart-panel full-width">
        <h4 class="chart-panel__title">产业产值及增速趋势</h4>
        <BaseChart :option="scaleTrendOption" height="400px" />
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">
          {{ dimension === 'region' ? '各区域产值' : '各行业产值' }}
        </h4>
        <BaseChart :option="breakdownOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">预测置信区间</h4>
        <BaseChart :option="forecastOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const dimension = ref('region')
const scaleTrendOption = ref({})
const breakdownOption = ref({})
const forecastOption = ref({})

function buildScaleTrendOption() {
  const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025(预)', '2026(预)', '2027(预)']
  const output = [856, 912, 1058, 1185, 1285, 1398, null, null, null]
  const forecastOutput = [null, null, null, null, null, 1398, 1520, 1658, 1812]
  const growth = [null, 6.5, 16.0, 12.0, 8.4, 8.8, 8.7, 9.1, 9.3]

  scaleTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['产值(亿)', '同比增速(%)'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years, axisPointer: { show: true } },
    yAxis: [
      { type: 'value', name: '产值(亿)' },
      { type: 'value', name: '增速(%)', axisLabel: { formatter: '{value}%' } },
    ],
    series: [
      {
        name: '产值(亿)',
        type: 'bar',
        barMaxWidth: 32,
        data: output,
        barWidth: '35%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        markArea: {
          silent: true,
          data: [
            [
              { xAxis: '2024', itemStyle: { color: 'rgba(24,137,232,0.05)' } },
              { xAxis: '2027(预)' },
            ],
          ],
        },
      },
      {
        name: '产值(预)',
        type: 'bar',
        barMaxWidth: 32,
        data: forecastOutput,
        barWidth: '35%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: 'rgba(24,137,232,0.4)',
          borderType: 'dashed',
        },
      },
      {
        name: '同比增速(%)',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: growth,
        lineStyle: { type: 'dashed' },
        itemStyle: { color: '#F2637B' },
      },
    ],
  }
}

function buildBreakdownOption() {
  if (dimension.value === 'region') {
    breakdownOption.value = {
      color: chartColors,
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['浦东新区', '松江区', '闵行区', '嘉定区', '徐汇区', '宝山区'],
      },
      yAxis: { type: 'value', name: '产值(亿)' },
      series: [
        {
          type: 'bar',
          barMaxWidth: 32,
          data: [358, 285, 245, 198, 168, 144],
          barWidth: '40%',
          itemStyle: { borderRadius: [4, 4, 0, 0] },
        },
      ],
    }
  } else {
    breakdownOption.value = {
      color: chartColors,
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['高端装备制造', '前沿材料', '数字经济', '时尚产业', '现代服务业'],
      },
      yAxis: { type: 'value', name: '产值(亿)' },
      series: [
        {
          type: 'bar',
          barMaxWidth: 32,
          data: [328, 285, 245, 198, 175],
          barWidth: '40%',
          itemStyle: { borderRadius: [4, 4, 0, 0] },
        },
      ],
    }
  }
}

function buildForecastOption() {
  const years = ['2024', '2025', '2026', '2027']
  forecastOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value', name: '产值(亿)' },
    series: [
      {
        name: '乐观',
        type: 'line',
        smooth: true,
        data: [1398, 1580, 1790, 2020],
        lineStyle: { type: 'dashed' },
      },
      { name: '基准', type: 'line', smooth: true, data: [1398, 1520, 1658, 1812] },
      {
        name: '保守',
        type: 'line',
        smooth: true,
        data: [1398, 1460, 1530, 1610],
        lineStyle: { type: 'dashed' },
      },
    ],
  }
}

onMounted(() => {
  buildScaleTrendOption()
  buildBreakdownOption()
  buildForecastOption()
})

watch(dimension, buildBreakdownOption)
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.chart-section {
  margin-bottom: $spacing-lg;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
