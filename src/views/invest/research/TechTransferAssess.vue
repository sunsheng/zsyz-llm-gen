<template>
  <div class="page-container">
    <PageHeader title="技术转化潜力评估" subtitle="科研成果技术转化潜力评估" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">各技术产业适配度</h4>
        <BaseChart :option="fitChartOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">技术转化路径</h4>
        <BaseChart :option="pathChartOption" height="320px" />
      </div>
    </div>

    <div v-loading="loading" class="content-card">
      <h4 class="chart-panel__title">转化项目列表</h4>
      <div class="transfer-list">
        <div v-for="item in transferItems" :key="item.id" class="transfer-card">
          <div class="transfer-card__header">
            <span class="transfer-card__name">{{ item.technologyName }}</span>
            <el-tag :type="stageTagType(item.commercializableStage) as any" size="small">
              {{ item.commercializableStage }}
            </el-tag>
          </div>
          <div class="transfer-card__body">
            <div class="transfer-card__row">
              <span class="transfer-card__label">来源机构</span>
              <span class="transfer-card__value">{{ item.institutionName }}</span>
            </div>
            <div class="transfer-card__row">
              <span class="transfer-card__label">产业适配度</span>
              <div class="transfer-card__fit">
                <el-progress
                  :percentage="item.industryFit"
                  :stroke-width="8"
                  :color="fitColor(item.industryFit)"
                />
              </div>
            </div>
            <div class="transfer-card__row">
              <span class="transfer-card__label">转化路径</span>
              <span class="transfer-card__value">{{ item.transferPath }}</span>
            </div>
            <div class="transfer-card__row">
              <span class="transfer-card__label">技术链条</span>
              <div class="transfer-card__chain">
                <template v-for="(stage, idx) in item.technologyChain" :key="idx">
                  <el-tag size="small" type="info" class="chain-tag">{{ stage }}</el-tag>
                  <span v-if="idx < item.technologyChain.length - 1" class="chain-arrow">→</span>
                </template>
              </div>
            </div>
          </div>
        </div>
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
import { fetchTechTransferItems } from '@/api/modules/investApi'
import type { TechTransferItem } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const loading = ref(false)
const transferItems = ref<TechTransferItem[]>([])

function stageTagType(stage: string): '' | 'primary' | 'success' | 'warning' | 'danger' | 'info' {
  if (stage === '市场化') return 'success'
  if (stage === '产品原型') return 'warning'
  return 'primary'
}

function fitColor(val: number): string {
  if (val >= 90) return '#67C23A'
  if (val >= 70) return '#1889E8'
  return '#E6A23C'
}

const kpiCards = computed(() => {
  const list = transferItems.value
  const highFitCount = list.filter((i) => i.industryFit >= 80).length
  const pathSet = new Set(list.map((i) => i.transferPath))
  const bridgeCount = list.filter((i) => i.commercializableStage === '市场化').length
  return [
    {
      key: 'total',
      icon: 'Cpu',
      label: '可转化技术数',
      value: list.length,
      unit: '项',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'highFit',
      icon: 'Aim',
      label: '高适配项目',
      value: highFitCount,
      unit: '项',
      iconColor: '#4ECB73',
      iconBgColor: '#EDF8F0',
    },
    {
      key: 'paths',
      icon: 'Share',
      label: '转化路径数',
      value: pathSet.size,
      unit: '条',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'bridge',
      icon: 'Connection',
      label: '产业嫁接方案数',
      value: bridgeCount,
      unit: '个',
      iconColor: '#975FE5',
      iconBgColor: '#F3ECFF',
    },
  ]
})

const fitChartOption = computed<EChartsOption>(() => {
  const list = transferItems.value
  return {
    color: chartColors,
    tooltip: { trigger: 'axis' as const },
    grid: { left: 20, right: 30, bottom: 20, top: 40, containLabel: true },
    xAxis: { type: 'value' as const, name: '适配度(%)', max: 100 },
    yAxis: {
      type: 'category' as const,
      data: list.map((i) => i.technologyName),
      axisLabel: { fontSize: 11, width: 120, overflow: 'truncate' },
    },
    series: [
      {
        type: 'bar' as const,
        barMaxWidth: 32,
        data: list.map((i) => i.industryFit),
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', formatter: '{c}%' },
      },
    ],
  }
})

const pathChartOption = computed<EChartsOption>(() => {
  const stages = ['基础研究', '应用研发', '产品原型', '市场化']
  const list = transferItems.value
  // Build waterfall-style data: count items at each stage
  const stageCounts = stages.map(
    (stage) => list.filter((i) => i.technologyChain.includes(stage)).length,
  )
  const stageColors = ['#1889E8', '#36CBCB', '#FBD437', '#4ECB73']

  return {
    color: stageColors,
    tooltip: { trigger: 'axis' as const },
    grid: { left: 20, right: 20, bottom: 20, top: 40, containLabel: true },
    xAxis: { type: 'category' as const, data: stages },
    yAxis: { type: 'value' as const, name: '项目数' },
    series: [
      {
        type: 'bar' as const,
        barMaxWidth: 32,
        data: stageCounts.map((val, idx) => ({
          value: val,
          itemStyle: { color: stageColors[idx] },
        })),
        label: { show: true, position: 'top' },
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  }
})

async function loadData() {
  loading.value = true
  try {
    transferItems.value = await fetchTechTransferItems()
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
.content-card {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.transfer-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.transfer-card {
  padding: 16px;
  border: 1px solid $border-color-lighter;
  border-radius: $radius-base;
  transition: box-shadow 200ms ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}
.transfer-card__header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}
.transfer-card__name {
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.transfer-card__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.transfer-card__row {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
}
.transfer-card__label {
  flex-shrink: 0;
  width: 80px;
  color: $text-secondary;
}
.transfer-card__value {
  color: $text-regular;
}
.transfer-card__fit {
  flex: 1;
}
.transfer-card__chain {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}
.chain-tag {
  font-size: 11px;
}
.chain-arrow {
  font-size: 12px;
  color: $text-placeholder;
}
</style>
