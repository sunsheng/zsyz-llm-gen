<template>
  <div class="page-container">
    <PageHeader title="全局产业分布" subtitle="全国产业空间分布与占比分析">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <!-- 指标维度切换 -->
    <div class="metric-switcher">
      <span class="metric-switcher__label">指标维度：</span>
      <el-radio-group v-model="activeMetric" @change="handleMetricChange">
        <el-radio-button value="output">产值占比</el-radio-button>
        <el-radio-button value="tax">税收贡献</el-radio-button>
        <el-radio-button value="enterprise">企业数量</el-radio-button>
        <el-radio-button value="employment">就业人数</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 饼图 + 堆叠柱状图 -->
    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">{{ metricLabel }} - 产业结构占比</h4>
        <BaseChart :option="pieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">各产业{{ metricLabel }}堆叠对比</h4>
        <BaseChart :option="stackedBarOption" height="320px" />
      </div>
    </div>

    <!-- 排行 + 树状图 -->
    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">{{ metricLabel }} - 产业排行</h4>
        <BaseChart :option="rankingOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业层级结构</h4>
        <BaseChart :option="treemapOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchGlobalProportion } from '@/api/modules/benchmarkingApi'
import type { GlobalProportionData, ProportionMetric } from '@/api/types/benchmarking'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const activeMetric = ref<ProportionMetric>('output')
const data = ref<GlobalProportionData | null>(null)

const metricLabels: Record<ProportionMetric, string> = {
  output: '产值占比',
  tax: '税收贡献',
  enterprise: '企业数量',
  employment: '就业人数',
}

const metricLabel = computed(() => metricLabels[activeMetric.value])

const kpiCards = ref([
  {
    key: 'totalIndustry',
    label: '产业门类',
    value: 0,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+2',
    icon: 'Grid',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'coverage',
    label: '区域覆盖率',
    value: 0,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+3.2%',
    icon: 'MapLocation',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'topIndustry',
    label: '优势产业',
    value: 0,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+1',
    icon: 'Star',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
  {
    key: 'cluster',
    label: '产业集群',
    value: 0,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+3',
    icon: 'Connection',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
])

const pieOption = ref({})
const rankingOption = ref({})
const stackedBarOption = ref({})
const treemapOption = ref({})

function getShareKey(metric: ProportionMetric) {
  const map: Record<ProportionMetric, string> = {
    output: 'outputShare',
    tax: 'taxShare',
    enterprise: 'enterpriseShare',
    employment: 'employmentShare',
  }
  return map[metric]
}

function handleMetricChange() {
  if (!data.value) return
  updateCharts()
}

function updateCharts() {
  if (!data.value) return
  const industries = data.value.industries
  const metric = activeMetric.value
  const shareKey = getShareKey(metric)

  // 饼图/环形图
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
        data: industries.map((i) => ({
          name: i.name,
          value: (i as Record<string, unknown>)[shareKey] as number,
        })),
      },
    ],
  }

  // 排行（横向柱状图）
  const sorted = [...industries].sort(
    (a, b) =>
      Number((a as Record<string, unknown>)[shareKey]) -
      Number((b as Record<string, unknown>)[shareKey]),
  )
  rankingOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: '%' },
    yAxis: { type: 'category', data: sorted.map((i) => i.name) },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: sorted.map((i) => (i as Record<string, unknown>)[shareKey]),
      },
    ],
  }

  // 堆叠柱状图（产值/税收/企业/就业 四个维度）
  stackedBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['产值占比', '税收贡献', '企业数量', '就业人数'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: industries.map((i) => i.name), axisLabel: { rotate: 30 } },
    yAxis: { type: 'value', name: '%' },
    series: [
      {
        name: '产值占比',
        type: 'bar',
        barMaxWidth: 32,
        stack: 'total',
        data: industries.map((i) => i.outputShare),
      },
      {
        name: '税收贡献',
        type: 'bar',
        barMaxWidth: 32,
        stack: 'total',
        data: industries.map((i) => i.taxShare),
      },
      {
        name: '企业数量',
        type: 'bar',
        barMaxWidth: 32,
        stack: 'total',
        data: industries.map((i) => i.enterpriseShare),
      },
      {
        name: '就业人数',
        type: 'bar',
        barMaxWidth: 32,
        stack: 'total',
        data: industries.map((i) => i.employmentShare),
      },
    ],
  }

  // 树状图（treemap）
  treemapOption.value = {
    color: chartColors,
    tooltip: {},
    series: [
      {
        type: 'treemap',
        width: '90%',
        height: '80%',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: { show: true, formatter: '{b}\n{c}%' },
        data: industries.map((i) => ({
          name: i.name,
          value: (i as Record<string, unknown>)[shareKey] as number,
        })),
      },
    ],
  }
}

onMounted(async () => {
  data.value = await fetchGlobalProportion()
  // 更新 KPI 卡片
  kpiCards.value[0].value = data.value.kpiCards.totalIndustry
  kpiCards.value[1].value = data.value.kpiCards.coverageRate
  kpiCards.value[2].value = data.value.kpiCards.advantageIndustry
  kpiCards.value[3].value = data.value.kpiCards.industryCluster
  updateCharts()
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

.metric-switcher {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.metric-switcher__label {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  white-space: nowrap;
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
