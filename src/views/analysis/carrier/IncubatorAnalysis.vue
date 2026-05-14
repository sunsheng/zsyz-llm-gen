<template>
  <div class="page-container">
    <PageHeader title="孵化器分析" subtitle="孵化器运营数据分析">
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
        <h4 class="chart-panel__title">孵化成功率分布</h4>
        <BaseChart :option="pieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">孵化趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">孵化器详情</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="孵化器名称" min-width="180" />
        <el-table-column prop="count" label="在孵企业" width="100" />
        <el-table-column prop="revenue" label="孵化收入(万)" width="120" />
        <el-table-column prop="rate" label="成功率(%)" width="120" />
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
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockChartData, getMockTableData } from '@/api/mock/analysis'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = ref([
  {
    key: 'incubator',
    label: '孵化器数量',
    value: 18,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+12.5%',
    icon: 'Home',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'incubating',
    label: '在孵企业',
    value: 356,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+28.6%',
    icon: 'UserFilled',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'success',
    label: '毕业企业',
    value: 128,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+18.3%',
    icon: 'Trophy',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'rate',
    label: '孵化成功率',
    value: 72.5,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+5.2%',
    icon: 'SuccessFilled',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
])

const tableData = ref([])
const pieOption = ref({})
const trendOption = ref({})

onMounted(() => {
  tableData.value = getMockTableData('incubator')

  const statusData = getMockChartData('status-pie')
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
          { name: '成功毕业', value: 128 },
          { name: '持续孵化', value: 156 },
          { name: '中途退出', value: 48 },
          { name: '待评估', value: 24 },
        ],
      },
    ],
  }

  const trendData = getMockChartData('growth-line')
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
.table-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
