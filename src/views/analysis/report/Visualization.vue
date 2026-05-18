<template>
  <div class="page-container">
    <PageHeader title="数据分析与可视化" subtitle="多维度运行数据分析看板">
      <template #actions>
        <el-select v-model="currentDimension" style="width: 160px">
          <el-option v-for="d in dimensions" :key="d.value" :label="d.label" :value="d.value" />
        </el-select>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="dashboard-grid">
      <div v-if="currentDimension === 'all' || currentDimension === 'scale'" class="chart-panel">
        <h4 class="chart-panel__title">产业规模</h4>
        <BaseChart :option="scaleOption" height="280px" />
      </div>
      <div v-if="currentDimension === 'all' || currentDimension === 'scale'" class="chart-panel">
        <h4 class="chart-panel__title">产能利用率</h4>
        <BaseChart :option="gaugeOption" height="280px" />
      </div>
      <div
        v-if="currentDimension === 'all' || currentDimension === 'structure'"
        class="chart-panel"
      >
        <h4 class="chart-panel__title">产业结构</h4>
        <BaseChart :option="structureOption" height="280px" />
      </div>
      <div v-if="currentDimension === 'all' || currentDimension === 'benefit'" class="chart-panel">
        <h4 class="chart-panel__title">经济效益</h4>
        <BaseChart :option="benefitOption" height="280px" />
      </div>
      <div
        v-if="currentDimension === 'all' || currentDimension === 'innovation'"
        class="chart-panel"
      >
        <h4 class="chart-panel__title">创新能力</h4>
        <BaseChart :option="innovationOption" height="280px" />
      </div>
      <div
        v-if="currentDimension === 'all' || currentDimension === 'environment'"
        class="chart-panel full-width"
      >
        <h4 class="chart-panel__title">发展环境</h4>
        <BaseChart :option="environmentOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = [
  {
    key: 'totalOutput',
    label: '总产值',
    value: 1398,
    unit: '亿',
    trend: 'up' as const,
    trendValue: '+8.7%',
    icon: 'Histogram',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'valueAdded',
    label: '增加值',
    value: 558,
    unit: '亿',
    trend: 'up' as const,
    trendValue: '+9.0%',
    icon: 'TrendCharts',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'profitRate',
    label: '利润率',
    value: 7.6,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+0.8%',
    icon: 'Coin',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'patents',
    label: '专利数',
    value: 568,
    unit: '件',
    trend: 'up' as const,
    trendValue: '+16.9%',
    icon: 'Document',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const dimensions = [
  { label: '全部维度', value: 'all' },
  { label: '产业规模', value: 'scale' },
  { label: '产业结构', value: 'structure' },
  { label: '产业效益', value: 'benefit' },
  { label: '创新能力', value: 'innovation' },
  { label: '产业环境', value: 'environment' },
]
const currentDimension = ref('all')

const scaleOption = ref({})
const gaugeOption = ref({})
const structureOption = ref({})
const benefitOption = ref({})
const innovationOption = ref({})
const environmentOption = ref({})

onMounted(() => {
  const years = ['2019', '2020', '2021', '2022', '2023', '2024']

  scaleOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['总产值', '增加值'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value', name: '亿元' },
    series: [
      {
        name: '总产值',
        type: 'bar',
        barMaxWidth: 32,
        data: [856, 912, 1058, 1185, 1285, 1398],
        barWidth: '30%',
      },
      { name: '增加值', type: 'line', smooth: true, data: [325, 358, 415, 468, 512, 558] },
    ],
  }

  gaugeOption.value = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        pointer: { show: true, length: '60%', width: 4 },
        progress: { show: true, width: 12, itemStyle: { color: '#1889E8' } },
        axisLine: { lineStyle: { width: 12, color: [[1, '#E6EBF8']] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: { formatter: '{value}%', fontSize: 20, offsetCenter: [0, '70%'] },
        data: [{ value: 78.5, name: '产能利用率' }],
      },
    ],
  }

  structureOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: [
          { value: 328, name: '数字经济' },
          { value: 285, name: '高端装备制造' },
          { value: 245, name: '前沿材料' },
          { value: 198, name: '现代服务业' },
          { value: 175, name: '时尚产业' },
        ],
      },
    ],
  }

  benefitOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: [
      { type: 'value', name: '利润率(%)' },
      { type: 'value', name: '劳动生产率(万/人)' },
    ],
    series: [
      {
        name: '利润率',
        type: 'bar',
        barMaxWidth: 32,
        data: [6.2, 5.8, 7.5, 7.2, 6.8, 7.6],
        barWidth: '30%',
      },
      {
        name: '劳动生产率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: [28.5, 30.2, 33.8, 36.5, 38.2, 41.5],
      },
    ],
  }

  innovationOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years, boundaryGap: false },
    yAxis: { type: 'value', name: '数量' },
    series: [
      {
        name: '专利数',
        type: 'line',
        smooth: true,
        data: [185, 225, 312, 398, 486, 568],
        areaStyle: { opacity: 0.1 },
      },
      { name: '研发投入(亿)', type: 'line', smooth: true, data: [25, 32, 45, 58, 72, 88] },
    ],
  }

  environmentOption.value = {
    color: chartColors,
    tooltip: {},
    radar: {
      indicator: [
        { name: '政策支持', max: 100 },
        { name: '人才供给', max: 100 },
        { name: '基础设施', max: 100 },
        { name: '金融服务', max: 100 },
        { name: '营商环境', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          { value: [85, 72, 78, 68, 82], name: '当前', areaStyle: { opacity: 0.2 } },
          { value: [70, 60, 65, 55, 68], name: '去年', areaStyle: { opacity: 0.1 } },
        ],
      },
    ],
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}
.dashboard-grid {
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
