<template>
  <div class="page-container">
    <PageHeader title="风险总览" subtitle="风险预警全局概览">
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
        <h4 class="chart-panel__title">风险等级分布</h4>
        <BaseChart :option="riskPieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">风险趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">风险类型分布</h4>
        <BaseChart :option="typeBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业风险热力</h4>
        <BaseChart :option="heatBarOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">最新预警列表</h4>
      <el-table :data="alertData" stripe border style="width: 100%">
        <el-table-column prop="time" label="预警时间" width="160" />
        <el-table-column prop="enterprise" label="企业名称" min-width="180" />
        <el-table-column prop="type" label="风险类型" width="120">
          <template #default="{ row }">
            <el-tag
              :type="
                (row.type === '企业风险'
                  ? 'danger'
                  : row.type === '行业风险'
                    ? 'warning'
                    : row.type === '政策风险'
                      ? 'info'
                      : 'info') as any
              "
              size="small"
              >{{ row.type }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="level" label="风险等级" width="100">
          <template #default="{ row }">
            <RiskIndicator :level="row.level" :score="row.score" />
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="风险描述" min-width="200" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import RiskIndicator from '@/components/business/RiskIndicator.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = [
  {
    key: 'total',
    label: '风险预警',
    value: 186,
    unit: '条',
    trend: 'down' as const,
    trendValue: '-5.2%',
    icon: 'Warning',
    iconColor: '#F2637B',
    iconBgColor: '#FEF0F0',
  },
  {
    key: 'high',
    label: '高风险',
    value: 28,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+2',
    icon: 'CircleClose',
    iconColor: '#F56C6C',
    iconBgColor: '#FEF0F0',
  },
  {
    key: 'medium',
    label: '中风险',
    value: 86,
    unit: '条',
    trend: 'down' as const,
    trendValue: '-8',
    icon: 'Warning',
    iconColor: '#E6A23C',
    iconBgColor: '#FDF6EC',
  },
  {
    key: 'low',
    label: '低风险',
    value: 72,
    unit: '条',
    trend: 'down' as const,
    trendValue: '-3',
    icon: 'CircleCheck',
    iconColor: '#67C23A',
    iconBgColor: '#EDFAF0',
  },
]

const alertData = ref<any[]>([])
const riskPieOption = ref({})
const trendOption = ref({})
const typeBarOption = ref({})
const heatBarOption = ref({})

onMounted(() => {
  const names = [
    '华创新材料科技',
    '东方精密制造',
    '博远生物医药',
    '天域半导体',
    '绿能新能源',
    '中科智联信息',
    '鼎盛环保科技',
    '创想数字技术',
  ]
  const types = ['企业风险', '行业风险', '政策风险', '供应链风险']
  const levels: Array<'low' | 'medium' | 'high' | 'critical'> = [
    'low',
    'medium',
    'high',
    'critical',
  ]
  alertData.value = names.slice(0, 8).map((name, i) => ({
    time: `2025-05-${String(10 + i).padStart(2, '0')} ${String(8 + i).padStart(2, '0')}:30`,
    enterprise: name,
    type: types[i % 4],
    level: levels[i % 4],
    score: [25, 55, 75, 90][i % 4],
    desc: [
      '经营现金流持续下降',
      '行业产能过剩风险加剧',
      '环保政策趋严影响生产',
      '核心供应商断供风险',
    ][i % 4],
  }))

  riskPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: [
          { name: '低风险', value: 72, itemStyle: { color: '#67C23A' } },
          { name: '中风险', value: 86, itemStyle: { color: '#E6A23C' } },
          { name: '高风险', value: 28, itemStyle: { color: '#F56C6C' } },
        ],
      },
    ],
  }

  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['高风险', '中风险', '低风险'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      { name: '高风险', type: 'line', smooth: true, data: [32, 30, 35, 28, 30, 28] },
      { name: '中风险', type: 'line', smooth: true, data: [95, 92, 88, 90, 85, 86] },
      { name: '低风险', type: 'line', smooth: true, data: [78, 80, 75, 72, 70, 72] },
    ],
  }

  typeBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['企业风险', '行业风险', '政策风险', '供应链风险'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', barWidth: '40%', data: [68, 52, 36, 30] }],
  }

  const industries = ['高端装备', '新材料', '生物医药', '电子信息', '新能源', '现代服务']
  heatBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: industries },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', barWidth: '40%', data: [42, 38, 35, 28, 25, 18] }],
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
