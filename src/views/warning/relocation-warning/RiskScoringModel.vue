<template>
  <div class="page-container">
    <PageHeader title="风险评分模型" subtitle="企业外迁风险综合评分与等级评定">
      <template #actions>
        <el-button type="primary" @click="loadData">重新计算</el-button>
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
      <el-table :data="summary?.scores ?? []" stripe border style="width: 100%">
        <el-table-column prop="enterprise" label="企业名称" min-width="180" />
        <el-table-column prop="score" label="风险评分" width="100">
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
        <el-table-column prop="levelName" label="风险等级" width="100">
          <template #default="{ row }">
            <el-tag
              :type="
                row.level === 'high' ? 'danger' : row.level === 'medium' ? 'warning' : 'success'
              "
              size="small"
            >
              {{ row.levelName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="financeScore" label="财务维度" width="100" />
        <el-table-column prop="operationScore" label="运营维度" width="100" />
        <el-table-column prop="assetScore" label="资产维度" width="100" />
        <el-table-column prop="relationScore" label="关联维度" width="100" />
        <el-table-column prop="governanceScore" label="治理维度" width="100" />
        <el-table-column label="趋势" width="80">
          <template #default="{ row }">
            <el-tag
              :type="row.trend === 'up' ? 'danger' : row.trend === 'down' ? 'success' : 'info'"
              size="small"
            >
              {{ row.trend === 'up' ? '↑' : row.trend === 'down' ? '↓' : '→' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchRiskScoring } from '@/api/modules/warningApi'
import type { RiskScoringSummary } from '@/api/types/warning'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const summary = ref<RiskScoringSummary | null>(null)

const kpiCards = computed(() => {
  if (!summary.value) return []
  const kpi = summary.value.kpiCards
  return [
    {
      key: 'evaluated',
      label: '已评估企业',
      value: kpi.evaluatedCount,
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
      value: kpi.highRiskCount,
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
      value: kpi.mediumRiskCount,
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
      value: kpi.lowRiskCount,
      unit: '家',
      trend: 'up' as const,
      trendValue: '+59',
      icon: 'CircleCheck',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
  ]
})

const levelOption = ref({})
const scoreOption = ref({})

function buildCharts() {
  if (!summary.value) return

  const { levelDistribution, scoreDistribution } = summary.value

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
        data: levelDistribution,
      },
    ],
  }

  scoreOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: scoreDistribution.map((s) => s.range) },
    yAxis: { type: 'value', name: '家' },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: scoreDistribution.map((s) => ({
          value: s.count,
          itemStyle: { color: s.color },
        })),
      },
    ],
  }
}

async function loadData() {
  summary.value = await fetchRiskScoring()
  buildCharts()
}

onMounted(() => {
  loadData()
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
