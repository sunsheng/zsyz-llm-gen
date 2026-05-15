<template>
  <div class="page-container">
    <PageHeader title="企业综合榜" subtitle="园区企业综合实力排名与评估">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">园区综合评分对比</h4>
        <BaseChart :option="scoreOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">多维度评价</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">企业综合排行</h4>
      <el-table :data="rankingData" stripe border style="width: 100%">
        <el-table-column prop="rank" label="排名" width="80">
          <template #default="{ row }">
            <span :style="{ fontWeight: 'bold', color: row.rank <= 3 ? '#FBD437' : '#303133' }">{{
              row.rank
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="park" label="园区名称" min-width="180" />
        <el-table-column prop="score" label="综合评分" width="120">
          <template #default="{ row }">
            <span style="font-weight: bold">{{ row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="economy" label="经济规模" width="100" />
        <el-table-column prop="innovation" label="创新能力" width="100" />
        <el-table-column prop="chain" label="产业链" width="100" />
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
    key: 'parks',
    label: '参评园区',
    value: 156,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+8',
    icon: 'OfficeBuilding',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'enterprises',
    label: '入库企业',
    value: 24862,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+5.2%',
    icon: 'DataBoard',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'topScore',
    label: '最高评分',
    value: 95.8,
    unit: '分',
    trend: 'up' as const,
    trendValue: '+1.5',
    icon: 'Trophy',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
  {
    key: 'avgScore',
    label: '平均评分',
    value: 72.5,
    unit: '分',
    trend: 'up' as const,
    trendValue: '+0.8',
    icon: 'DataLine',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const scoreOption = ref({})
const radarOption = ref({})

const rankingData = ref([
  {
    rank: 1,
    park: '张江高科技园区',
    score: 95.8,
    economy: 96,
    innovation: 98,
    chain: 92,
    change: 0,
  },
  { rank: 2, park: '苏州工业园区', score: 93.2, economy: 94, innovation: 92, chain: 90, change: 1 },
  {
    rank: 3,
    park: '中关村科技园',
    score: 92.5,
    economy: 90,
    innovation: 96,
    chain: 88,
    change: -1,
  },
  { rank: 4, park: '深圳高新区', score: 91.8, economy: 92, innovation: 94, chain: 86, change: 0 },
  {
    rank: 5,
    park: '武汉东湖高新区',
    score: 89.5,
    economy: 88,
    innovation: 90,
    chain: 85,
    change: 2,
  },
  { rank: 6, park: '成都高新区', score: 88.2, economy: 86, innovation: 88, chain: 84, change: -1 },
  { rank: 7, park: '杭州高新区', score: 87.5, economy: 85, innovation: 91, chain: 82, change: 1 },
  { rank: 8, park: '合肥高新区', score: 85.8, economy: 82, innovation: 89, chain: 80, change: 3 },
])

onMounted(() => {
  const parks = ['张江', '苏州', '中关村', '深圳', '武汉', '成都', '杭州', '合肥']
  scoreOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: parks },
    yAxis: { type: 'value', name: '分', max: 100 },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        barWidth: '40%',
        data: [95.8, 93.2, 92.5, 91.8, 89.5, 88.2, 87.5, 85.8],
      },
    ],
  }

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['张江', '苏州', '中关村'] },
    radar: {
      indicator: [
        { name: '经济规模', max: 100 },
        { name: '创新能力', max: 100 },
        { name: '产业链', max: 100 },
        { name: '营商环境', max: 100 },
        { name: '绿色发展', max: 100 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: [
          { value: [96, 98, 92, 88, 85], name: '张江' },
          { value: [94, 92, 90, 90, 88], name: '苏州' },
          { value: [90, 96, 88, 85, 82], name: '中关村' },
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
