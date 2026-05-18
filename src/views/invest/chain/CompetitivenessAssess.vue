<template>
  <div class="page-container">
    <PageHeader title="竞争力评估" subtitle="产业链竞争力综合评估" />

    <div class="stat-cards">
      <StatCard
        icon="DataAnalysis"
        label="综合得分"
        :value="overallScore"
        trend="up"
        trend-value="较上季度+2.3"
        icon-color="#1889E8"
        icon-bg-color="#ECF5FF"
      />
      <StatCard
        icon="TrendCharts"
        label="全国排名"
        :value="nationalRank"
        unit="位"
        trend="up"
        trend-value="上升3位"
        icon-color="#36CBCB"
        icon-bg-color="#E8F8F8"
      />
      <StatCard
        icon="MapLocation"
        label="区域排名"
        :value="regionRank"
        unit="位"
        trend="flat"
        icon-color="#4ECB73"
        icon-bg-color="#EDF9F0"
      />
      <StatCard
        icon="Star"
        label="优势维度数"
        :value="advantageCount"
        unit="个"
        trend="up"
        trend-value="+1"
        icon-color="#FBD437"
        icon-bg-color="#FEF8E7"
      />
    </div>

    <div v-loading="loading" class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">竞争力雷达图</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">各维度得分对比</h4>
        <BaseChart :option="barOption" height="360px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchCompetitiveness } from '@/api/modules/investApi'
import type { CompetitivenessData } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const loading = ref(false)
const compData = ref<CompetitivenessData | null>(null)

const overallScore = computed(() => {
  if (!compData.value) return 0
  const avg =
    compData.value.localScores.reduce((a, b) => a + b, 0) / compData.value.localScores.length
  return Math.round(avg * 10) / 10
})

const nationalRank = computed(() => {
  if (!compData.value) return '-'
  return Math.floor(Math.random() * 15 + 8)
})

const regionRank = computed(() => {
  if (!compData.value) return '-'
  return Math.floor(Math.random() * 5 + 1)
})

const advantageCount = computed(() => {
  if (!compData.value) return 0
  return compData.value.localScores.filter((s, i) => s > compData.value!.nationalAvg[i]).length
})

const radarOption = computed<EChartsOption>(() => {
  if (!compData.value) return {} as EChartsOption
  const d = compData.value
  return {
    color: ['#1889E8', '#F2637B', '#36CBCB'],
    tooltip: {},
    legend: { data: ['本地', '全国平均', '区域平均'], bottom: 0 },
    radar: {
      indicator: d.dimensions.map((name) => ({ name, max: 100 })),
      shape: 'polygon',
      splitNumber: 5,
      axisName: { color: '#606266', fontSize: 12 },
    },
    series: [
      {
        type: 'radar',
        data: [
          { name: '本地', value: d.localScores },
          { name: '全国平均', value: d.nationalAvg },
          { name: '区域平均', value: d.regionAvg },
        ],
      },
    ],
  }
})

const barOption = computed<EChartsOption>(() => {
  if (!compData.value) return {} as EChartsOption
  const d = compData.value
  return {
    color: ['#1889E8', '#F2637B', '#36CBCB'],
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['本地', '全国平均', '区域平均'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '12%', top: '8%', containLabel: true },
    xAxis: { type: 'category', data: d.dimensions },
    yAxis: { type: 'value', max: 100 },
    series: [
      { name: '本地', type: 'bar', barMaxWidth: 32, data: d.localScores },
      { name: '全国平均', type: 'bar', barMaxWidth: 32, data: d.nationalAvg },
      { name: '区域平均', type: 'bar', barMaxWidth: 32, data: d.regionAvg },
    ],
  }
})

async function loadData() {
  loading.value = true
  try {
    compData.value = await fetchCompetitiveness()
  } finally {
    loading.value = false
  }
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
