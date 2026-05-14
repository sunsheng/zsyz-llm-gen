<template>
  <div class="page-container">
    <PageHeader title="产业结构" subtitle="产业结构分布与贡献分析">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业结构分布</h4>
        <BaseChart :option="structurePieOption" height="380px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">各产业贡献度</h4>
        <BaseChart :option="contributionBarOption" height="380px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockChartData } from '@/api/mock/analysis'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const structurePieOption = ref({})
const contributionBarOption = ref({})

onMounted(() => {
  const structData = getMockChartData('structure-pie')
  structurePieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left', top: 'middle' },
    series: [
      {
        type: 'pie',
        radius: ['35%', '65%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}\n{d}%' },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: 'bold' },
        },
        data: structData.data,
      },
    ],
  }

  const contribData = getMockChartData('contribution-bar')
  contributionBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: contribData.data.xAxis.data },
    yAxis: { type: 'value', name: '产值(亿)' },
    series: [
      {
        name: '产值(亿)',
        type: 'bar',
        data: contribData.data.series[0].data,
        barWidth: '40%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
        },
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
</style>
