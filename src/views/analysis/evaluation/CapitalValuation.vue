<template>
  <div class="page-container">
    <PageHeader title="资本估值指数" subtitle="产业资本估值与上市公司分析">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">市盈率对比</h4>
        <BaseChart :option="peBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">市净率对比</h4>
        <BaseChart :option="pbBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">市销率对比</h4>
        <BaseChart :option="psBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">上市公司数量趋势</h4>
        <BaseChart :option="listedTrendOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const peBarOption = ref({})
const pbBarOption = ref({})
const psBarOption = ref({})
const listedTrendOption = ref({})

onMounted(() => {
  const industries = ['高端装备制造', '前沿材料', '数字经济', '时尚产业', '现代服务业']

  peBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: industries },
    yAxis: { type: 'value', name: '市盈率' },
    series: [
      {
        name: '产业均值',
        type: 'bar',
        barMaxWidth: 32,
        data: [32.5, 28.3, 45.2, 25.6, 38.1, 42.7],
        barWidth: '30%',
      },
      {
        name: '大盘均值',
        type: 'bar',
        barMaxWidth: 32,
        data: [22.1, 20.5, 30.8, 18.3, 25.6, 28.4],
        barWidth: '30%',
      },
    ],
  }

  pbBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: industries },
    yAxis: { type: 'value', name: '市净率' },
    series: [
      { name: '产业均值', type: 'bar', data: [4.2, 3.8, 5.6, 3.1, 4.5, 5.1], barWidth: '30%' },
      { name: '大盘均值', type: 'bar', data: [2.8, 2.5, 3.5, 2.1, 3.0, 3.2], barWidth: '30%' },
    ],
  }

  psBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: industries },
    yAxis: { type: 'value', name: '市销率' },
    series: [
      { name: '产业均值', type: 'bar', data: [5.8, 4.5, 7.2, 3.8, 6.1, 6.8], barWidth: '30%' },
      { name: '大盘均值', type: 'bar', data: [3.2, 2.8, 4.1, 2.5, 3.5, 3.8], barWidth: '30%' },
    ],
  }

  const years = ['2019', '2020', '2021', '2022', '2023', '2024']
  listedTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增上市', '累计上市'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: [
      { type: 'value', name: '新增(家)' },
      { type: 'value', name: '累计(家)' },
    ],
    series: [
      { name: '新增上市', type: 'bar', data: [5, 8, 12, 10, 15, 18] },
      {
        name: '累计上市',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: [12, 20, 32, 42, 57, 75],
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
