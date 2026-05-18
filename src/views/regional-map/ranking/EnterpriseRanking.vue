<template>
  <div class="page-container">
    <PageHeader title="企业综合榜" subtitle="园区企业综合实力排名与评估" />

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
      <div class="table-header">
        <h4 class="chart-panel__title">企业综合排行</h4>
        <el-radio-group v-model="sortBy" size="small" @change="onSortChange">
          <el-radio-button value="total">综合评分</el-radio-button>
          <el-radio-button value="economic">经济效益</el-radio-button>
          <el-radio-button value="innovation">创新活力</el-radio-button>
          <el-radio-button value="social">社会贡献</el-radio-button>
          <el-radio-button value="growth">成长潜力</el-radio-button>
        </el-radio-group>
      </div>
      <el-table :data="sortedRankings" stripe border style="width: 100%">
        <el-table-column prop="rank" label="排名" width="70">
          <template #default="{ row }">
            <span :style="{ fontWeight: 'bold', color: row.rank <= 3 ? '#FBD437' : '#303133' }">
              {{ row.rank }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" min-width="140" />
        <el-table-column prop="parkName" label="所属园区" min-width="140" />
        <el-table-column prop="industry" label="产业" width="100" />
        <el-table-column prop="totalScore" label="综合评分" width="100">
          <template #default="{ row }">
            <span style="font-weight: bold">{{ row.totalScore }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="economicScore" label="经济效益" width="90" />
        <el-table-column prop="innovationScore" label="创新活力" width="90" />
        <el-table-column prop="socialScore" label="社会贡献" width="90" />
        <el-table-column prop="growthScore" label="成长潜力" width="90" />
        <el-table-column prop="rankChange" label="排名变化" width="90">
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
import { fetchEnterpriseRanking } from '@/api/modules/regionalMapApi'
import type { EnterpriseRankingSummary } from '@/api/types/regional-map'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const summary = ref<EnterpriseRankingSummary | null>(null)
const sortBy = ref('total')

const kpiCards = computed(() => {
  if (!summary.value) return []
  const kpi = summary.value.kpiCards
  return [
    {
      key: 'parks',
      label: '参评园区',
      value: kpi.totalParks,
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
      value: kpi.totalEnterprises,
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
      value: kpi.topScore,
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
      value: kpi.avgScore,
      unit: '分',
      trend: 'up' as const,
      trendValue: '+0.8',
      icon: 'DataLine',
      iconColor: '#975FE5',
      iconBgColor: '#F3ECFF',
    },
  ]
})

const sortKeyMap: Record<string, string> = {
  total: 'totalScore',
  economic: 'economicScore',
  innovation: 'innovationScore',
  social: 'socialScore',
  growth: 'growthScore',
}

const sortedRankings = computed(() => {
  if (!summary.value) return []
  const key = sortKeyMap[sortBy.value] || 'totalScore'
  return [...summary.value.rankings].sort((a, b) => {
    const av = a[key as keyof typeof a] as number
    const bv = b[key as keyof typeof b] as number
    return bv - av
  })
})

const scoreOption = ref({})
const radarOption = ref({})

function updateCharts(data: EnterpriseRankingSummary) {
  scoreOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: data.topParks.map((p) => p.park) },
    yAxis: { type: 'value', name: '分', max: 100 },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        barWidth: '40%',
        data: data.topParks.map((p) => p.score),
      },
    ],
  }

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: data.radarSeries.map((s) => s.name) },
    radar: { indicator: data.radarIndicators },
    series: [
      {
        type: 'radar',
        data: data.radarSeries,
      },
    ],
  }
}

function onSortChange() {
  // 排序由 computed 自动处理
}

onMounted(async () => {
  const data = await fetchEnterpriseRanking()
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
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>
