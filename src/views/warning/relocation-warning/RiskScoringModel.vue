<template>
  <div class="page-container">
    <PageHeader title="风险评分模型" subtitle="企业外迁风险综合评分与等级评定">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">重新计算</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">风险等级分布</h4>
        <BaseChart :option="levelOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">风险评分分布</h4>
        <BaseChart :option="scoreOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">企业风险评分明细</h4>
      <el-table :data="scoringData" stripe border style="width: 100%">
        <el-table-column prop="enterprise" label="企业名称" min-width="180" />
        <el-table-column prop="score" label="风险评分" width="120">
          <template #default="{ row }">
            <span
              :style="{
                color: row.score >= 80 ? '#F2637B' : row.score >= 50 ? '#E6A23C' : '#4ECB73',
                fontWeight: 'bold',
              }"
            >
              {{ row.score }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="风险等级" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.level === '高危' ? 'danger' : row.level === '中危' ? 'warning' : 'success'"
              size="small"
            >
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="financeScore" label="财务维度" width="100" />
        <el-table-column prop="operationScore" label="运营维度" width="100" />
        <el-table-column prop="assetScore" label="资产维度" width="100" />
        <el-table-column prop="trend" label="趋势" width="80">
          <template #default="{ row }">
            <el-tag
              :type="row.trend === '↑' ? 'danger' : row.trend === '↓' ? 'success' : 'info'"
              size="small"
            >
              {{ row.trend }}
            </el-tag>
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
    key: 'evaluated',
    label: '已评估企业',
    value: 2486,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+56',
    icon: 'DataBoard',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'highRisk',
    label: '高危企业',
    value: 42,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+5',
    icon: 'Warning',
    iconColor: '#F2637B',
    iconBgColor: '#FEF0F0',
  },
  {
    key: 'mediumRisk',
    label: '中危企业',
    value: 186,
    unit: '家',
    trend: 'down' as const,
    trendValue: '-8',
    icon: 'InfoFilled',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
  {
    key: 'lowRisk',
    label: '低危企业',
    value: 2258,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+59',
    icon: 'CircleCheck',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
]

const levelOption = ref({})
const scoreOption = ref({})

const scoringData = ref([
  {
    enterprise: '华创新材料科技',
    score: 88,
    level: '高危',
    financeScore: 92,
    operationScore: 85,
    assetScore: 90,
    trend: '↑',
  },
  {
    enterprise: '东方精密制造',
    score: 76,
    level: '高危',
    financeScore: 82,
    operationScore: 78,
    assetScore: 68,
    trend: '↑',
  },
  {
    enterprise: '博远生物医药',
    score: 62,
    level: '中危',
    financeScore: 58,
    operationScore: 72,
    assetScore: 55,
    trend: '→',
  },
  {
    enterprise: '天域半导体',
    score: 58,
    level: '中危',
    financeScore: 65,
    operationScore: 52,
    assetScore: 60,
    trend: '↓',
  },
  {
    enterprise: '绿能新能源',
    score: 35,
    level: '低危',
    financeScore: 30,
    operationScore: 42,
    assetScore: 28,
    trend: '↓',
  },
  {
    enterprise: '中科智联信息',
    score: 28,
    level: '低危',
    financeScore: 25,
    operationScore: 32,
    assetScore: 22,
    trend: '→',
  },
])

onMounted(() => {
  levelOption.value = {
    color: ['#4ECB73', '#E6A23C', '#F2637B'],
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c}家' },
        data: [
          { name: '低危', value: 2258 },
          { name: '中危', value: 186 },
          { name: '高危', value: 42 },
        ],
      },
    ],
  }

  const scoreRanges = ['0-20', '20-40', '40-60', '60-80', '80-100']
  scoreOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: scoreRanges },
    yAxis: { type: 'value', name: '家' },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: [
          { value: 1580, itemStyle: { color: '#4ECB73' } },
          { value: 678, itemStyle: { color: '#4ECB73' } },
          { value: 148, itemStyle: { color: '#E6A23C' } },
          { value: 38, itemStyle: { color: '#E6A23C' } },
          { value: 42, itemStyle: { color: '#F2637B' } },
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
