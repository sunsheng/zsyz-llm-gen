<template>
  <div class="page-container">
    <PageHeader title="企业详情报告" subtitle="单个企业运行详情报告">
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
        <h4 class="chart-panel__title">企业综合评价</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">经营趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">综合评分</h4>
        <BaseChart :option="gaugeOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">业务构成</h4>
        <BaseChart :option="pieOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockChartData } from '@/api/mock/analysis'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = ref([
  {
    key: 'name',
    label: '企业名称',
    value: '高端装备制造产业园',
    unit: '',
    trend: 'flat' as const,
    trendValue: '',
    icon: 'OfficeBuilding',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'employees',
    label: '员工数',
    value: 2560,
    unit: '人',
    trend: 'up' as const,
    trendValue: '+8.5%',
    icon: 'UserFilled',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'revenue',
    label: '年产值',
    value: 98.5,
    unit: '亿',
    trend: 'up' as const,
    trendValue: '+8.3%',
    icon: 'TrendCharts',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'profit',
    label: '利润率',
    value: 15.8,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+2.1%',
    icon: 'Coin',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
])

const radarOption = ref({})
const trendOption = ref({})
const gaugeOption = ref({})
const pieOption = ref({})

onMounted(() => {
  const radarData = getMockChartData('park-radar')
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['当前', '行业均值'] },
    radar: {
      indicator: [
        { name: '经营能力', max: 100 },
        { name: '盈利能力', max: 100 },
        { name: '成长能力', max: 100 },
        { name: '偿债能力', max: 100 },
        { name: '运营效率', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          { name: '当前', value: [82, 78, 85, 72, 80], areaStyle: { opacity: 0.2 } },
          { name: '行业均值', value: [70, 68, 72, 75, 65], areaStyle: { opacity: 0.1 } },
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

  gaugeOption.value = {
    series: [
      {
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
              [1, '#F56C6C'],
            ],
          },
        },
        pointer: { itemStyle: { color: '#1889E8' } },
        axisTick: { distance: -18, length: 6, lineStyle: { color: '#fff', width: 1 } },
        splitLine: { distance: -18, length: 18, lineStyle: { color: '#fff', width: 2 } },
        axisLabel: { color: '#999', distance: 25, fontSize: 12 },
        detail: {
          valueAnimation: true,
          formatter: '{value}分',
          color: '#303133',
          fontSize: 24,
          offsetCenter: [0, '70%'],
        },
        data: [{ value: 82.6, name: '综合得分' }],
      },
    ],
  }

  const structData = getMockChartData('status-pie')
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
        data: [
          { name: '主营业务', value: 68 },
          { name: '其他业务', value: 18 },
          { name: '投资收益', value: 8 },
          { name: '补贴收入', value: 6 },
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
</style>
