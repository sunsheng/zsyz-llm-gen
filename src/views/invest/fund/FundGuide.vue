<template>
  <div class="page-container">
    <PageHeader title="产业基金引导" subtitle="产业引导基金管理与对接" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div v-loading="loading" class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">各基金规模对比</h4>
        <BaseChart :option="barOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">投向产业分布</h4>
        <BaseChart :option="pieOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchFundItems } from '@/api/modules/investApi'
import type { FundItem } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']
const loading = ref(false)
const fundItems = ref<FundItem[]>([])
const kpiCards = ref<any[]>([])
const barOption = ref({})
const pieOption = ref({})

onMounted(async () => {
  loading.value = true
  try {
    fundItems.value = await fetchFundItems()

    const totalScale = fundItems.value.reduce((s, f) => s + f.scale, 0)
    const totalInvested = fundItems.value.reduce((s, f) => s + f.investedAmount, 0)
    const industrySet = new Set(fundItems.value.map((f) => f.targetIndustry))

    kpiCards.value = [
      {
        key: 'total',
        icon: 'Wallet',
        label: '基金总数',
        value: fundItems.value.length,
        unit: '支',
        iconColor: '#1889E8',
        iconBgColor: '#ECF5FF',
      },
      {
        key: 'scale',
        icon: 'Coin',
        label: '总规模',
        value: totalScale,
        unit: '亿',
        trend: 'up' as const,
        trendValue: '12.5%',
        iconColor: '#36CBCB',
        iconBgColor: '#E6FFFB',
      },
      {
        key: 'invested',
        icon: 'TrendCharts',
        label: '已投资额',
        value: totalInvested,
        unit: '亿',
        trend: 'up' as const,
        trendValue: '8.3%',
        iconColor: '#4ECB73',
        iconBgColor: '#EDFFF3',
      },
      {
        key: 'industries',
        icon: 'OfficeBuilding',
        label: '投向产业数',
        value: industrySet.size,
        unit: '个',
        iconColor: '#FBD437',
        iconBgColor: '#FFFBE6',
      },
    ]

    barOption.value = {
      color: chartColors,
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['已投', '未投'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: fundItems.value.map((f) => f.name),
        axisLabel: { rotate: 20 },
      },
      yAxis: { type: 'value', name: '规模(亿)' },
      series: [
        {
          name: '已投',
          type: 'bar',
          stack: 'total',
          barMaxWidth: 32,
          data: fundItems.value.map((f) => f.investedAmount),
        },
        {
          name: '未投',
          type: 'bar',
          stack: 'total',
          barMaxWidth: 32,
          data: fundItems.value.map((f) => f.scale - f.investedAmount),
        },
      ],
    }

    const industryMap = new Map<string, number>()
    fundItems.value.forEach((f) => {
      industryMap.set(f.targetIndustry, (industryMap.get(f.targetIndustry) || 0) + f.scale)
    })
    const pieData = Array.from(industryMap, ([name, value]) => ({ name, value }))

    pieOption.value = {
      color: chartColors,
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
          label: { show: true, formatter: '{b}: {d}%' },
          data: pieData,
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
