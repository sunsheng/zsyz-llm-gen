<template>
  <div class="page-container">
    <PageHeader title="报告分析" subtitle="多园区运行对比分析报告">
      <template #actions>
        <el-button>导出报告</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="selector-section">
      <span class="selector-label">对比园区:</span>
      <el-checkbox-group v-model="selectedParks">
        <el-checkbox v-for="park in parks" :key="park" :value="park">{{ park }}</el-checkbox>
      </el-checkbox-group>
    </div>

    <div class="dimension-tabs">
      <el-radio-group v-model="currentDimension" size="small">
        <el-radio-button v-for="d in dimensions" :key="d.value" :value="d.value">
          {{ d.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">综合实力对比</h4>
        <BaseChart :option="radarOption" height="380px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">核心指标对比</h4>
        <BaseChart :option="barCompareOption" height="380px" />
      </div>
      <div class="chart-panel chart-panel--full">
        <h4 class="chart-panel__title">趋势对比</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const parks = ['凯州科技创新园', '辑庆产业园', '兴隆工业园', '高端装备产业园']
const selectedParks = ref<string[]>(['凯州科技创新园', '辑庆产业园', '兴隆工业园'])

const dimensions = [
  { label: '基础信息', value: 'basic' },
  { label: '产业发展', value: 'industry' },
  { label: '经济效益', value: 'benefit' },
  { label: '创新能力', value: 'innovation' },
  { label: '人才资源', value: 'talent' },
  { label: '营商环境', value: 'business' },
]
const currentDimension = ref('basic')

const radarOption = ref({})
const barCompareOption = ref({})
const trendOption = ref({})

const parkData: Record<string, number[]> = {
  凯州科技创新园: [92, 85, 88, 78, 82],
  辑庆产业园: [78, 82, 72, 85, 75],
  兴隆工业园: [68, 75, 65, 72, 68],
  高端装备产业园: [55, 62, 58, 65, 60],
}

const parkBarData: Record<string, number[]> = {
  凯州科技创新园: [358, 86, 92, 8.5, 12.3],
  辑庆产业园: [285, 68, 85, 7.2, 10.5],
  兴隆工业园: [245, 55, 78, 6.8, 8.8],
  高端装备产业园: [198, 42, 72, 5.5, 6.5],
}

const parkTrendData: Record<string, number[]> = {
  凯州科技创新园: [258, 285, 312, 338, 358],
  辑庆产业园: [218, 242, 258, 272, 285],
  兴隆工业园: [178, 198, 215, 232, 245],
  高端装备产业园: [142, 158, 172, 185, 198],
}

function buildRadarOption() {
  const selected = selectedParks.value
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: selected },
    radar: {
      indicator: [
        { name: '产值规模', max: 100 },
        { name: '企业质量', max: 100 },
        { name: '创新能力', max: 100 },
        { name: '经济效益', max: 100 },
        { name: '发展潜力', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: selected.map((park) => ({
          value: parkData[park],
          name: park,
          areaStyle: { opacity: 0.15 },
        })),
      },
    ],
  }
}

function buildBarCompareOption() {
  const selected = selectedParks.value
  const indicators = ['产值(亿)', '企业数', '入驻率(%)', '利润率(%)', '增速(%)']
  barCompareOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: selected },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: indicators },
    yAxis: { type: 'value' },
    series: selected.map((park) => ({
      name: park,
      type: 'bar',
      barMaxWidth: 32,
      data: parkBarData[park],
    })),
  }
}

function buildTrendOption() {
  const selected = selectedParks.value
  const years = ['2021', '2022', '2023', '2024', '2025']
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: selected },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value', name: '产值(亿)' },
    series: selected.map((park) => ({
      name: park,
      type: 'line',
      smooth: true,
      data: parkTrendData[park],
    })),
  }
}

onMounted(() => {
  buildRadarOption()
  buildBarCompareOption()
  buildTrendOption()
})

watch(
  selectedParks,
  () => {
    buildRadarOption()
    buildBarCompareOption()
    buildTrendOption()
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}

.selector-section {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
  padding: $spacing-base $spacing-lg;
  margin-bottom: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.selector-label {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $text-primary;
  white-space: nowrap;
}

.dimension-tabs {
  margin-bottom: $spacing-lg;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
}

.chart-panel {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;

  &--full {
    grid-column: 1 / -1;
  }
}

.chart-panel__title {
  margin: 0 0 $spacing-base;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
