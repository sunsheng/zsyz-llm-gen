<template>
  <div class="page-container">
    <PageHeader title="核心监测指标" subtitle="产业发展核心指标实时监测与预警">
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
        <h4 class="chart-panel__title">指标趋势监测</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">指标健康度分布</h4>
        <BaseChart :option="healthOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">核心监测指标明细</h4>
      <el-table :data="indicatorData" stripe border style="width: 100%">
        <el-table-column prop="name" label="指标名称" min-width="180" />
        <el-table-column prop="current" label="当前值" width="120" />
        <el-table-column prop="threshold" label="预警阈值" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === '正常' ? 'success' : row.status === '预警' ? 'warning' : 'danger'
              "
              size="small"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="change" label="变化趋势" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.change >= 0 ? '#4ECB73' : '#F2637B' }"
              >{{ row.change >= 0 ? '+' : '' }}{{ row.change }}%</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="160" />
      </el-table>
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
    key: 'monitoring',
    label: '监测指标',
    value: 36,
    unit: '项',
    trend: 'up' as const,
    trendValue: '+2',
    icon: 'Monitor',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'normal',
    label: '正常指标',
    value: 28,
    unit: '项',
    trend: 'up' as const,
    trendValue: '+3',
    icon: 'CircleCheck',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'warning',
    label: '预警指标',
    value: 6,
    unit: '项',
    trend: 'down' as const,
    trendValue: '-2',
    icon: 'Warning',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
  {
    key: 'critical',
    label: '超限指标',
    value: 2,
    unit: '项',
    trend: 'down' as const,
    trendValue: '-1',
    icon: 'CircleClose',
    iconColor: '#F2637B',
    iconBgColor: '#FEF0F0',
  },
]

const trendOption = ref({})
const healthOption = ref({})

const indicatorData = ref([
  {
    name: '产业增加值增速',
    current: '8.5%',
    threshold: '5.0%',
    status: '正常',
    change: 1.2,
    updateTime: '2025-05-14 10:00',
  },
  {
    name: '企业亏损面',
    current: '18.2%',
    threshold: '20.0%',
    status: '预警',
    change: -2.5,
    updateTime: '2025-05-14 10:00',
  },
  {
    name: '产能利用率',
    current: '76.8%',
    threshold: '70.0%',
    status: '正常',
    change: 0.8,
    updateTime: '2025-05-14 10:00',
  },
  {
    name: 'PMI指数',
    current: '48.5',
    threshold: '50.0',
    status: '超限',
    change: -1.5,
    updateTime: '2025-05-14 09:00',
  },
  {
    name: '工业用电量增速',
    current: '6.2%',
    threshold: '3.0%',
    status: '正常',
    change: 0.5,
    updateTime: '2025-05-14 09:00',
  },
  {
    name: '新开工项目数',
    current: '125',
    threshold: '100',
    status: '正常',
    change: 8.0,
    updateTime: '2025-05-14 08:00',
  },
])

onMounted(() => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['产业增加值', '产能利用率', 'PMI'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      { name: '产业增加值', type: 'line', smooth: true, data: [7.2, 7.8, 8.0, 8.2, 8.5, 8.5] },
      {
        name: '产能利用率',
        type: 'line',
        smooth: true,
        data: [75.2, 75.8, 76.0, 76.5, 76.8, 76.8],
      },
      { name: 'PMI', type: 'line', smooth: true, data: [50.2, 49.8, 49.5, 49.0, 48.8, 48.5] },
    ],
  }

  healthOption.value = {
    color: ['#4ECB73', '#FBD437', '#F2637B'],
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c}项' },
        data: [
          { name: '正常', value: 28 },
          { name: '预警', value: 6 },
          { name: '超限', value: 2 },
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
.table-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
