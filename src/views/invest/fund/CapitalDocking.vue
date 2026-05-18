<template>
  <div class="page-container">
    <PageHeader title="资本对接" subtitle="产业资本对接服务平台" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div v-loading="loading" class="match-section">
      <h4 class="chart-panel__title">对接匹配</h4>
      <div class="card-grid">
        <el-card v-for="item in matchList" :key="item.id" shadow="hover" class="match-card">
          <div class="match-card__header">
            <span class="match-card__enterprise">{{ item.enterpriseName }}</span>
            <el-tag :type="matchStatusTag(item.status) as any" size="small">
              {{ matchStatusLabel(item.status) }}
            </el-tag>
          </div>
          <div class="match-card__body">
            <div class="match-card__row">
              <span class="label">投资机构</span>
              <span class="value">{{ item.institutionName }}</span>
            </div>
            <div class="match-card__row">
              <span class="label">匹配度</span>
              <ScoreRing :value="item.matchScore" :size="40" :stroke-width="4" />
            </div>
            <div class="match-card__row">
              <span class="label">融资阶段</span>
              <span class="value">{{ item.financingStage }}</span>
            </div>
            <div class="match-card__row">
              <span class="label">金额</span>
              <span class="value">{{ item.amount.toLocaleString() }}万</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <div class="chart-panel">
      <h4 class="chart-panel__title">融资阶段分布</h4>
      <BaseChart :option="stageBarOption" height="300px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import { fetchCapitalMatches } from '@/api/modules/investApi'
import type { CapitalMatch } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']
const loading = ref(false)
const matchList = ref<CapitalMatch[]>([])
const kpiCards = ref<any[]>([])
const stageBarOption = ref({})

const matchStatusMap: Record<string, { label: string; type: string }> = {
  pending: { label: '待对接', type: 'info' },
  contacting: { label: '对接中', type: 'warning' },
  negotiating: { label: '谈判中', type: '' },
  closed: { label: '已签约', type: 'success' },
}

function matchStatusLabel(s: string) {
  return matchStatusMap[s]?.label || s
}

function matchStatusTag(s: string): 'info' | 'primary' | 'success' | 'warning' | 'danger' | '' {
  return (matchStatusMap[s]?.type || 'info') as
    | 'info'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | ''
}

onMounted(async () => {
  loading.value = true
  try {
    matchList.value = await fetchCapitalMatches()

    const pending = matchList.value.filter((m) => m.status === 'pending').length
    const contacting = matchList.value.filter((m) => m.status === 'contacting').length
    const negotiating = matchList.value.filter((m) => m.status === 'negotiating').length
    const closed = matchList.value.filter((m) => m.status === 'closed').length

    kpiCards.value = [
      {
        key: 'pending',
        icon: 'Clock',
        label: '待对接',
        value: pending,
        unit: '个',
        iconColor: '#1889E8',
        iconBgColor: '#ECF5FF',
      },
      {
        key: 'contacting',
        icon: 'Connection',
        label: '对接中',
        value: contacting,
        unit: '个',
        iconColor: '#FBD437',
        iconBgColor: '#FFFBE6',
      },
      {
        key: 'negotiating',
        icon: 'ChatDotRound',
        label: '谈判中',
        value: negotiating,
        unit: '个',
        iconColor: '#36CBCB',
        iconBgColor: '#E6FFFB',
      },
      {
        key: 'closed',
        icon: 'CircleCheck',
        label: '已签约',
        value: closed,
        unit: '个',
        trend: 'up' as const,
        trendValue: '15.2%',
        iconColor: '#4ECB73',
        iconBgColor: '#EDFFF3',
      },
    ]

    const stageMap = new Map<string, number>()
    matchList.value.forEach((m) => {
      stageMap.set(m.financingStage, (stageMap.get(m.financingStage) || 0) + 1)
    })
    const stageNames = Array.from(stageMap.keys())
    const stageValues = Array.from(stageMap.values())

    stageBarOption.value = {
      color: chartColors,
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: stageNames },
      yAxis: { type: 'value', name: '项目数' },
      series: [
        {
          type: 'bar',
          barMaxWidth: 32,
          data: stageValues,
          itemStyle: {
            color: (params: any) => chartColors[params.dataIndex % chartColors.length],
          },
        },
      ],
    }
  } finally {
    loading.value = false
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
.match-section {
  padding: 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.match-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.match-card__enterprise {
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.match-card__body {
  .match-card__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 13px;
    .label {
      color: $text-secondary;
    }
    .value {
      font-weight: $font-weight-medium;
      color: $text-primary;
    }
  }
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
</style>
