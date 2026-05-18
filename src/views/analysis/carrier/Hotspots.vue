<template>
  <div class="page-container">
    <PageHeader title="投资热点分析" subtitle="产业投资热点与区域分布" />

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">投资领域分布</h4>
        <BaseChart :option="treemapOption" height="420px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">区域投资热力</h4>
        <BaseChart :option="heatmapOption" height="420px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const treemapOption = ref({})
const heatmapOption = ref({})

onMounted(() => {
  treemapOption.value = {
    color: chartColors,
    tooltip: { formatter: '{b}: {c}亿' },
    series: [
      {
        type: 'treemap',
        width: '90%',
        height: '85%',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: { show: true, formatter: '{b}\n{c}亿', fontSize: 13 },
        itemStyle: { borderColor: '#fff', borderWidth: 2, gapWidth: 2 },
        data: [
          {
            name: '高端装备制造',
            value: 86.5,
            children: [{ name: '汽车汽配', value: 86.5 }],
          },
          {
            name: '前沿材料',
            value: 72.3,
            children: [
              { name: '玻纤及复合材料', value: 28.5 },
              { name: '新能源材料', value: 22.8 },
              { name: '碳纤维及复合材料', value: 21.0 },
            ],
          },
          {
            name: '数字经济',
            value: 65.8,
            children: [
              { name: '5G', value: 18.2 },
              { name: '集成电路', value: 22.5 },
              { name: '先进计算', value: 15.1 },
              { name: '智能安防', value: 10.0 },
            ],
          },
          {
            name: '时尚产业',
            value: 48.2,
            children: [
              { name: '服装', value: 28.5 },
              { name: '家居', value: 19.7 },
            ],
          },
          {
            name: '现代服务业',
            value: 42.5,
            children: [
              { name: '金融服务', value: 18.2 },
              { name: '现代物流', value: 14.8 },
              { name: '信息技术服务', value: 9.5 },
            ],
          },
        ],
      },
    ],
  }

  const regions = [
    '凯州新城',
    '辑庆片区',
    '兴隆片区',
    '中江县城',
    '德阳经开区',
    '广汉园区',
    '什邡园区',
    '绵竹园区',
  ]
  const industries = ['高端装备制造', '前沿材料', '数字经济', '时尚产业', '现代服务业']
  const heatData: number[][] = [
    [0, 0, 92],
    [1, 0, 85],
    [2, 0, 78],
    [3, 0, 45],
    [4, 0, 62],
    [0, 1, 68],
    [1, 1, 72],
    [2, 1, 55],
    [3, 1, 82],
    [4, 1, 48],
    [0, 2, 75],
    [1, 2, 58],
    [2, 2, 88],
    [3, 2, 42],
    [4, 2, 65],
    [0, 3, 52],
    [1, 3, 45],
    [2, 3, 38],
    [3, 3, 65],
    [4, 3, 35],
    [0, 4, 88],
    [1, 4, 92],
    [2, 4, 72],
    [3, 4, 55],
    [4, 4, 78],
    [0, 5, 62],
    [1, 5, 48],
    [2, 5, 82],
    [3, 5, 35],
    [4, 5, 52],
    [0, 6, 45],
    [1, 6, 65],
    [2, 6, 58],
    [3, 6, 72],
    [4, 6, 42],
    [0, 7, 38],
    [1, 7, 55],
    [2, 7, 48],
    [3, 7, 62],
    [4, 7, 28],
  ]

  heatmapOption.value = {
    color: chartColors,
    tooltip: {
      formatter: (params: any) =>
        `${industries[params.data[0]]} - ${regions[params.data[1]]}<br/>投资额: ${params.data[2]}亿`,
    },
    grid: { left: '12%', right: '10%', bottom: '10%', top: '5%' },
    xAxis: { type: 'category', data: industries, splitArea: { show: true } },
    yAxis: { type: 'category', data: regions, splitArea: { show: true } },
    visualMap: {
      min: 20,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '2%',
    },
    series: [
      {
        type: 'heatmap',
        data: heatData,
        label: { show: true, fontSize: 11 },
        itemStyle: { borderRadius: 2 },
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
