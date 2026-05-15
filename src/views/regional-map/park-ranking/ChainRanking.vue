<template>
  <div class="page-container">
    <PageHeader title="产业链协同榜" subtitle="园区产业链协同发展水平排名">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业链协同评分</h4>
        <BaseChart :option="chainScoreOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">协同维度分析</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业链完整度对比</h4>
        <BaseChart :option="completenessOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">上下游协同趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">产业链协同排行</h4>
      <el-table :data="rankingData" stripe border style="width: 100%">
        <el-table-column prop="rank" label="排名" width="80" />
        <el-table-column prop="park" label="园区名称" min-width="180" />
        <el-table-column prop="chainName" label="产业链" width="140" />
        <el-table-column prop="completeness" label="完整度(%)" width="120" />
        <el-table-column prop="synergyScore" label="协同评分" width="120" />
        <el-table-column prop="upstream" label="上游企业" width="100" />
        <el-table-column prop="downstream" label="下游企业" width="100" />
        <el-table-column prop="change" label="排名变化" width="100">
          <template #default="{ row }">
            <span
              :style="{ color: row.change > 0 ? '#4ECB73' : row.change < 0 ? '#F2637B' : '#999' }"
            >
              {{
                row.change > 0
                  ? `↑${row.change}`
                  : row.change < 0
                    ? `↓${Math.abs(row.change)}`
                    : '-'
              }}
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

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = [
  {
    key: 'chains',
    label: '参评产业链',
    value: 68,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+5',
    icon: 'Share',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'avgCompleteness',
    label: '平均完整度',
    value: 72.5,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+3.2%',
    icon: 'Connection',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'highSynergy',
    label: '高协同园区',
    value: 18,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+2',
    icon: 'Star',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
  {
    key: 'avgScore',
    label: '平均协同分',
    value: 78.2,
    unit: '分',
    trend: 'up' as const,
    trendValue: '+2.5',
    icon: 'DataLine',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const chainScoreOption = ref({})
const radarOption = ref({})
const completenessOption = ref({})
const trendOption = ref({})

const rankingData = ref([
  {
    rank: 1,
    park: '张江高科技园区',
    chainName: '集成电路',
    completeness: 95,
    synergyScore: 96,
    upstream: 42,
    downstream: 86,
    change: 0,
  },
  {
    rank: 2,
    park: '苏州工业园区',
    chainName: '生物医药',
    completeness: 92,
    synergyScore: 93,
    upstream: 35,
    downstream: 72,
    change: 1,
  },
  {
    rank: 3,
    park: '深圳高新区',
    chainName: '电子信息',
    completeness: 90,
    synergyScore: 91,
    upstream: 48,
    downstream: 92,
    change: -1,
  },
  {
    rank: 4,
    park: '中关村科技园',
    chainName: '人工智能',
    completeness: 88,
    synergyScore: 90,
    upstream: 32,
    downstream: 65,
    change: 0,
  },
  {
    rank: 5,
    park: '武汉东湖高新区',
    chainName: '光电子',
    completeness: 85,
    synergyScore: 88,
    upstream: 28,
    downstream: 56,
    change: 2,
  },
  {
    rank: 6,
    park: '合肥高新区',
    chainName: '新型显示',
    completeness: 82,
    synergyScore: 85,
    upstream: 25,
    downstream: 48,
    change: -1,
  },
])

onMounted(() => {
  const parks = ['张江', '苏州', '深圳', '中关村', '武汉', '合肥']
  chainScoreOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: parks },
    yAxis: { type: 'value', name: '分', max: 100 },
    series: [{ type: 'bar', barMaxWidth: 32, barWidth: '40%', data: [96, 93, 91, 90, 88, 85] }],
  }

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['张江', '苏州', '深圳'] },
    radar: {
      indicator: [
        { name: '上游协同', max: 100 },
        { name: '下游协同', max: 100 },
        { name: '横向协同', max: 100 },
        { name: '技术协同', max: 100 },
        { name: '人才协同', max: 100 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: [
          { value: [92, 95, 88, 96, 90], name: '张江' },
          { value: [88, 92, 85, 90, 88], name: '苏州' },
          { value: [90, 93, 82, 88, 86], name: '深圳' },
        ],
      },
    ],
  }

  completenessOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: parks },
    yAxis: { type: 'value', name: '%' },
    series: [{ type: 'bar', barMaxWidth: 32, barWidth: '40%', data: [95, 92, 90, 88, 85, 82] }],
  }

  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['上游协同度', '下游协同度'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', name: '%' },
    series: [
      { name: '上游协同度', type: 'line', smooth: true, data: [78, 80, 82, 83, 85, 86] },
      { name: '下游协同度', type: 'line', smooth: true, data: [82, 84, 85, 86, 88, 89] },
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
