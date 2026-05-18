<template>
  <div class="page-container">
    <PageHeader title="生态构建与协同" subtitle="龙头企业生态构建与产业协同" />

    <!-- StatCard×3 -->
    <div class="stat-cards">
      <StatCard
        icon="Connection"
        label="缺口环节数"
        :value="statData.gapCount"
        unit="个"
        trend="down"
        trend-value="较上月减少2"
        icon-color="#F2637B"
        icon-bg-color="#FEF0F0"
      />
      <StatCard
        icon="OfficeBuilding"
        label="推荐企业数"
        :value="statData.recommendCount"
        unit="家"
        trend="up"
        trend-value="较上月增加5"
        icon-color="#36CBCB"
        icon-bg-color="#E6F7F7"
      />
      <StatCard
        icon="TrendCharts"
        label="集群潜力指数"
        :value="statData.clusterIndex"
        trend="up"
        trend-value="较上月提升3.2"
        icon-color="#1889E8"
        icon-bg-color="#ECF5FF"
      />
    </div>

    <!-- ChartGrid 2列 -->
    <div v-loading="loading" class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">各环节集群潜力</h4>
        <BaseChart :option="barOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">协同度分布</h4>
        <BaseChart :option="pieOption" height="360px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchEcoSynergyItems } from '@/api/modules/investApi'
import type { EcoSynergyItem } from '@/api/types/invest'

const loading = ref(false)
const items = ref<EcoSynergyItem[]>([])

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const statData = reactive({
  gapCount: 0,
  recommendCount: 0,
  clusterIndex: 0,
})

// 柱状图: 各环节集群潜力
const barOption = computed<EChartsOption>(() => {
  const names = items.value.map((i) => i.chainGap)
  const clusterData = items.value.map((i) => i.clusterPotential)
  const synergyData = items.value.map((i) => i.synergyScore)
  return {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['集群潜力', '协同度'] },
    grid: { left: 50, right: 20, top: 40, bottom: 40 },
    xAxis: { type: 'category', data: names, axisLabel: { rotate: 20 } },
    yAxis: { type: 'value', max: 100 },
    series: [
      {
        name: '集群潜力',
        type: 'bar',
        barMaxWidth: 32,
        data: clusterData,
      },
      {
        name: '协同度',
        type: 'bar',
        barMaxWidth: 32,
        data: synergyData,
      },
    ],
  }
})

// 饼图: 协同度分布
const pieOption = computed<EChartsOption>(() => {
  // 按协同度区间分组
  const high = items.value.filter((i) => i.synergyScore >= 85).length
  const medium = items.value.filter((i) => i.synergyScore >= 70 && i.synergyScore < 85).length
  const low = items.value.filter((i) => i.synergyScore < 70).length
  const data = [
    { name: '高协同(≥85)', value: high },
    { name: '中协同(70-84)', value: medium },
    { name: '低协同(<70)', value: low },
  ]
  return {
    color: [chartColors[2], chartColors[0], chartColors[4]],
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: 10, top: 'center' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        data,
        label: { formatter: '{b}\n{d}%' },
      },
    ],
  }
})

async function loadData() {
  loading.value = true
  try {
    items.value = await fetchEcoSynergyItems()
    // 计算统计数据
    statData.gapCount = items.value.length
    const allRecommended = items.value.flatMap((i) => i.recommendedEnterprises)
    statData.recommendCount = new Set(allRecommended).size
    const avgCluster = items.value.length
      ? Math.round(
          (items.value.reduce((s, i) => s + i.clusterPotential, 0) / items.value.length) * 10,
        ) / 10
      : 0
    statData.clusterIndex = avgCluster
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
