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
        <el-table-column prop="rank" label="排名" width="70" />
        <el-table-column prop="parkName" label="园区名称" min-width="160" />
        <el-table-column prop="chainName" label="产业链" width="120" />
        <el-table-column prop="completeness" label="完整度(%)" width="110" />
        <el-table-column prop="synergyScore" label="协同评分" width="100" />
        <el-table-column prop="upstreamCount" label="上游企业" width="100" />
        <el-table-column prop="downstreamCount" label="下游企业" width="100" />
        <el-table-column prop="rankChange" label="排名变化" width="100">
          <template #default="{ row }">
            <span
              :style="{
                color: row.rankChange > 0 ? '#4ECB73' : row.rankChange < 0 ? '#F2637B' : '#999',
              }"
            >
              {{
                row.rankChange > 0
                  ? `↑${row.rankChange}`
                  : row.rankChange < 0
                    ? `↓${Math.abs(row.rankChange)}`
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
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchChainRanking } from '@/api/modules/regionalMapApi'
import type { ChainRankingSummary } from '@/api/types/regional-map'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const summary = ref<ChainRankingSummary | null>(null)

const kpiCards = computed(() => {
  if (!summary.value) return []
  const kpi = summary.value.kpiCards
  return [
    {
      key: 'chains',
      label: '参评产业链',
      value: kpi.totalChains,
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
      value: kpi.avgCompleteness,
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
      value: kpi.highSynergyParks,
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
      value: kpi.avgScore,
      unit: '分',
      trend: 'up' as const,
      trendValue: '+2.5',
      icon: 'DataLine',
      iconColor: '#975FE5',
      iconBgColor: '#F3ECFF',
    },
  ]
})

const rankingData = computed(() => summary.value?.rankings ?? [])

const chainScoreOption = ref({})
const radarOption = ref({})
const completenessOption = ref({})
const trendOption = ref({})

function updateCharts(data: ChainRankingSummary) {
  const parks = data.chainScores.map((p) => p.park)

  chainScoreOption.value = {
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
        data: data.chainScores.map((p) => p.score),
      },
    ],
  }

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: data.radarSeries.map((s) => s.name) },
    radar: { indicator: data.radarIndicators },
    series: [{ type: 'radar', data: data.radarSeries }],
  }

  completenessOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: parks },
    yAxis: { type: 'value', name: '%' },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        barWidth: '40%',
        data: data.rankings.map((r) => r.completeness),
      },
    ],
  }

  const trend = data.upstreamDownstreamTrend
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['上游协同度', '下游协同度'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: trend.months },
    yAxis: { type: 'value', name: '%' },
    series: [
      { name: '上游协同度', type: 'line', smooth: true, data: trend.upstream },
      { name: '下游协同度', type: 'line', smooth: true, data: trend.downstream },
    ],
  }
}

onMounted(async () => {
  const data = await fetchChainRanking()
  summary.value = data
  updateCharts(data)
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
