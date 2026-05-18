<template>
  <div v-loading="loading" class="page-container">
    <PageHeader title="产业链协同招商" subtitle="园区产业链协同招商" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">各环节本地配套率</h4>
        <BaseChart :option="localRateChartOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">协同度评分</h4>
        <BaseChart :option="synergyChartOption" height="320px" />
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
import { fetchParkChainSynergies } from '@/api/modules/investApi'
import type { ParkChainSynergy } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const loading = ref(false)
const synergyList = ref<ParkChainSynergy[]>([])

const kpiCards = computed(() => {
  const list = synergyList.value
  const weakCount = list.filter((s) => s.localRate < 40).length
  const totalRecommended = list.reduce((s, item) => s + item.recommendedEnterprises.length, 0)
  const rewardCount = list.filter((s) => s.chainOwnerReward).length
  return [
    {
      key: 'weakCount',
      icon: 'Warning',
      label: '薄弱环节数',
      value: weakCount,
      unit: '个',
      iconColor: '#F2637B',
      iconBgColor: '#FEF0F0',
    },
    {
      key: 'recommendedCount',
      icon: 'Connection',
      label: '推荐补链企业数',
      value: totalRecommended,
      unit: '家',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'rewardCount',
      icon: 'Trophy',
      label: '链主奖励包数',
      value: rewardCount,
      unit: '个',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E1',
    },
  ]
})

const localRateChartOption = computed<EChartsOption>(() => {
  const list = synergyList.value
  const segments = list.map((s) => s.weakSegment)
  const rates = list.map((s) => s.localRate)
  const markLineData = { yAxis: 40, lineStyle: { color: '#F2637B', type: 'dashed' as const } }
  return {
    color: chartColors,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const p = params[0]
        const rate = p.value
        const flag = rate < 40 ? ' <span style="color:#F2637B;font-weight:bold">薄弱</span>' : ''
        return `${p.name}<br/>本地配套率：${rate}%${flag}`
      },
    },
    grid: { left: '3%', right: '6%', bottom: '3%', top: '8%', containLabel: true },
    xAxis: { type: 'value', max: 100, name: '配套率(%)' },
    yAxis: { type: 'category', data: segments, inverse: true },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: rates.map((r) => ({
          value: r,
          itemStyle: { color: r < 40 ? '#F2637B' : '#1889E8' },
        })),
        label: {
          show: true,
          position: 'right' as const,
          formatter: '{c}%',
          fontSize: 12,
        },
        markLine: {
          silent: true,
          data: [markLineData],
          label: { formatter: '薄弱线 40%', position: 'end' as const },
        },
      },
    ],
  }
})

const synergyChartOption = computed<EChartsOption>(() => {
  const list = synergyList.value
  const segments = list.map((s) => s.weakSegment)
  const scores = list.map((s) => s.synergyScore)
  return {
    color: [chartColors[2]],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
    xAxis: { type: 'category', data: segments, axisLabel: { rotate: 15 } },
    yAxis: { type: 'value', name: '协同度', max: 100 },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: scores,
        label: {
          show: true,
          position: 'top' as const,
          formatter: '{c}',
          fontSize: 12,
        },
      },
    ],
  }
})

async function loadData() {
  loading.value = true
  try {
    synergyList.value = await fetchParkChainSynergies()
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
  grid-template-columns: repeat(3, 1fr);
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
</style>
