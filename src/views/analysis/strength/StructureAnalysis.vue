<template>
  <div class="page-container">
    <PageHeader title="产业结构分析" subtitle="产业内部结构与效益分析">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业结构占比</h4>
        <BaseChart :option="structurePieOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">劳动生产率与销售利润率</h4>
        <BaseChart :option="scatterOption" height="360px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const structurePieOption = ref({})
const scatterOption = ref({})

onMounted(() => {
  // Industrial structure proportion - Pie/Donut chart
  structurePieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item', formatter: '{b}: {c}亿 ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['35%', '65%'],
        data: [
          { value: 328, name: '数字经济' },
          { value: 285, name: '高端装备制造' },
          { value: 198, name: '前沿材料' },
          { value: 175, name: '现代服务业' },
          { value: 167, name: '时尚产业' },
        ],
        label: { formatter: '{b}\n{d}%' },
      },
    ],
  }

  // Scatter chart: labor productivity vs sales profit rate by region
  const regionData = [
    { name: '凯州新城核心区', productivity: 41.5, profitRate: 7.6, size: 85 },
    { name: '辑庆片区', productivity: 35.2, profitRate: 6.8, size: 62 },
    { name: '兴隆片区', productivity: 32.8, profitRate: 7.2, size: 58 },
    { name: '成巴东片区', productivity: 28.5, profitRate: 5.8, size: 42 },
    { name: '高新区', productivity: 38.2, profitRate: 7.5, size: 75 },
    { name: '经开区', productivity: 30.2, profitRate: 6.2, size: 48 },
    { name: '中江县', productivity: 25.6, profitRate: 5.5, size: 35 },
    { name: '德阳市区', productivity: 36.8, profitRate: 7.1, size: 68 },
  ]

  scatterOption.value = {
    color: chartColors,
    tooltip: {
      formatter: (params: any) => {
        const d = params.data
        return `${d.name}<br/>劳动生产率: ${d.value[0]}万/人<br/>销售利润率: ${d.value[1]}%`
      },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: '劳动生产率(万/人)', min: 20, max: 50 },
    yAxis: { type: 'value', name: '销售利润率(%)', min: 4, max: 10 },
    series: [
      {
        type: 'scatter',
        symbolSize: (data: any) => data[2] / 3,
        data: regionData.map((d) => ({
          name: d.name,
          value: [d.productivity, d.profitRate, d.size],
        })),
        label: {
          show: true,
          formatter: (params: any) => params.data.name,
          position: 'right',
          fontSize: 11,
        },
        itemStyle: {
          color: (params: any) => chartColors[params.dataIndex % chartColors.length],
          opacity: 0.75,
        },
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
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
}

.chart-panel {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.chart-panel__title {
  margin: 0 0 $spacing-base;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
