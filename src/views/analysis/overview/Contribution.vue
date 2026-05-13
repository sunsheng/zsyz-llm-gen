<template>
  <div class="page-container">
    <PageHeader title="贡献分析" subtitle="各产业贡献度详细分析">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">各产业贡献度</h4>
        <BaseChart :option="contributionOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">贡献占比</h4>
        <BaseChart :option="ratioPieOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">贡献明细</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="产业名称" min-width="180" />
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
const contributionOption = ref({})
const ratioPieOption = ref({})

onMounted(() => {
  tableData.value = getMockTableData('contribution')

  const contribData = getMockChartData('contribution-bar')
  contributionOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: contribData.data.xAxis.data },
    yAxis: { type: 'value', name: '产值(亿)' },
    series: [{
      name: '产值(亿)',
      type: 'bar',
      data: contribData.data.series[0].data,
      barWidth: '40%',
      itemStyle: { borderRadius: [4, 4, 0, 0] }
    }]
  }

  const structData = getMockChartData('structure-pie')
  ratioPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item', formatter: '{b}: {c}亿 ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {d}%' },
      data: structData.data
    }]
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
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
.chart-panel__title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
.table-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
