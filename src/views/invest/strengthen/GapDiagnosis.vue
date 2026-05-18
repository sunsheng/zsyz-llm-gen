<template>
  <div class="page-container">
    <PageHeader title="缺口智能诊断" subtitle="产业链缺口智能诊断分析" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div v-loading="loading" class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">各环节本地配套率 vs 行业平均</h4>
        <BaseChart :option="barOption" height="360px" :loading="loading" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">缺口等级分布</h4>
        <BaseChart :option="pieOption" height="360px" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchGapDiagnosis } from '@/api/modules/investApi'
import type { GapDiagnosisData, Priority } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const loading = ref(false)
const diagnosisData = ref<GapDiagnosisData[]>([])
const barOption = ref<Record<string, unknown>>({})
const pieOption = ref<Record<string, unknown>>({})

const kpiCards = computed(() => {
  const total = diagnosisData.value.length
  const urgent = diagnosisData.value.filter((d) => d.gapLevel === 'urgent').length
  const hidden = diagnosisData.value.filter((d) => d.isHidden).length
  const avgRate =
    total > 0 ? Math.round(diagnosisData.value.reduce((s, d) => s + d.localRate, 0) / total) : 0

  return [
    {
      key: 'total',
      icon: 'Warning',
      label: '缺口总数',
      value: total,
      unit: '个',
      trend: 'flat' as const,
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'urgent',
      icon: 'CircleClose',
      label: '紧急缺口',
      value: urgent,
      unit: '个',
      trend: urgent > 0 ? ('up' as const) : ('flat' as const),
      trendValue: urgent > 0 ? `占比${Math.round((urgent / (total || 1)) * 100)}%` : '',
      iconColor: '#F2637B',
      iconBgColor: '#FEF0F0',
    },
    {
      key: 'hidden',
      icon: 'Hide',
      label: '隐性缺口',
      value: hidden,
      unit: '个',
      trend: 'flat' as const,
      iconColor: '#975FE5',
      iconBgColor: '#F3F0FF',
    },
    {
      key: 'avgRate',
      icon: 'DataLine',
      label: '平均配套率',
      value: avgRate,
      unit: '%',
      trend: avgRate >= 60 ? ('up' as const) : ('down' as const),
      trendValue: avgRate >= 60 ? '配套良好' : '配套不足',
      iconColor: '#4ECB73',
      iconBgColor: '#F0F9EB',
    },
  ]
})

const levelMap: Record<Priority, string> = {
  urgent: '紧急',
  important: '重要',
  normal: '一般',
}

const levelColorMap: Record<Priority, string> = {
  urgent: '#F2637B',
  important: '#FBD437',
  normal: '#4ECB73',
}

function buildBarOption() {
  const segments = diagnosisData.value.map((d) => d.segmentName)
  const localRates = diagnosisData.value.map((d) => d.localRate)
  const importRates = diagnosisData.value.map((d) => d.importRate)

  barOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['本地配套率', '行业平均'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: '%' },
    yAxis: { type: 'category', data: segments },
    series: [
      {
        name: '本地配套率',
        type: 'bar',
        barMaxWidth: 32,
        data: localRates,
      },
      {
        name: '行业平均',
        type: 'bar',
        barMaxWidth: 32,
        data: importRates,
      },
    ],
  }
}

function buildPieOption() {
  const levelCount: Record<string, number> = {}
  for (const d of diagnosisData.value) {
    const label = levelMap[d.gapLevel]
    levelCount[label] = (levelCount[label] || 0) + 1
  }

  const data = Object.entries(levelCount).map(([name, value]) => ({
    name,
    value,
    itemStyle: {
      color:
        name === '紧急'
          ? levelColorMap.urgent
          : name === '重要'
            ? levelColorMap.important
            : levelColorMap.normal,
    },
  }))

  pieOption.value = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}个 ({d}%)' },
    legend: { bottom: 0, data: data.map((d) => d.name) },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        label: { show: true, formatter: '{b}\n{c}个' },
        data,
      },
    ],
  }
}

async function loadData() {
  loading.value = true
  try {
    diagnosisData.value = await fetchGapDiagnosis()
    buildBarOption()
    buildPieOption()
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
