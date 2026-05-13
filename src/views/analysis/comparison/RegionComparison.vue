<template>
  <div class="page-container">
    <PageHeader title="区域对比" subtitle="各区域综合对比分析">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">区域综合对比</h4>
        <BaseChart :option="barOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">区域能力雷达</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">区域对比详情</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="区域" min-width="120" />
        <el-table-column prop="count" label="企业数" width="100" />
        <el-table-column prop="revenue" label="产值(亿)" width="120" />
        <el-table-column prop="rate" label="入驻率(%)" width="120" />
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
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockChartData, getMockTableData } from '@/api/mock/analysis'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const tableData = ref([])
const barOption = ref({})
const radarOption = ref({})

onMounted(() => {
  tableData.value = getMockTableData('region-comparison')

  const regions = ['东区', '西区', '南区', '北区', '中心区', '开发区']
  barOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['企业数', '产值(亿)'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: regions },
    yAxis: [
      { type: 'value', name: '企业数' },
      { type: 'value', name: '产值(亿)' }
    ],
    series: [
      { name: '企业数', type: 'bar', data: [286, 198, 245, 176, 312, 269], barWidth: '25%' },
      { name: '产值(亿)', type: 'bar', yAxisIndex: 1, data: [98, 62, 78, 52, 112, 86], barWidth: '25%' }
    ]
  }

  const radarData = getMockChartData('park-radar')
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: regions.slice(0, 3) },
    radar: {
      indicator: radarData.data.indicator,
      shape: 'polygon',
      splitNumber: 5
    },
    series: [{
      type: 'radar',
      data: [
        { name: '东区', value: [85, 78, 82, 76, 90], areaStyle: { opacity: 0.15 } },
        { name: '西区', value: [72, 85, 68, 82, 75], areaStyle: { opacity: 0.15 } },
        { name: '南区', value: [78, 72, 88, 70, 82], areaStyle: { opacity: 0.15 } }
      ]
    }]
  }
})
</script>

<style lang="scss" scoped>
.page-container { padding: 20px; }
.chart-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
.chart-panel { background: $bg-card; border-radius: $radius-base; box-shadow: $shadow-card; padding: 20px; }
.chart-panel__title { font-size: 16px; font-weight: $font-weight-semibold; color: $text-primary; margin: 0 0 16px 0; }
.table-section { background: $bg-card; border-radius: $radius-base; box-shadow: $shadow-card; padding: 20px; }
</style>
