<template>
  <div class="page-container">
    <PageHeader title="五维评价模型" subtitle="经营质量·创新能力·产业协同·风险韧性·政策适配" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">五维雷达图</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">维度对比</h4>
        <BaseChart :option="comparisonOption" height="360px" />
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-panel full-width">
        <h4 class="chart-panel__title">评价趋势</h4>
        <BaseChart :option="trendOption" height="280px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">各维度详细指标</h4>
      <el-table v-loading="loading" :data="dimensionTableData" stripe border style="width: 100%">
        <el-table-column prop="dimension" label="评价维度" width="120" />
        <el-table-column prop="score" label="综合评分" width="100" sortable>
          <template #default="{ row }">
            <el-tag
              :type="row.score >= 80 ? 'success' : row.score >= 60 ? 'warning' : 'danger'"
              size="small"
            >
              {{ row.score }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="indicator1" label="指标1" min-width="180" />
        <el-table-column prop="indicator2" label="指标2" min-width="180" />
        <el-table-column prop="indicator3" label="指标3" min-width="180" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchFiveDimensionData } from '@/api/modules/monitorApi'
import type { FiveDimensionData } from '@/api/mock/monitor'
import type { MonitorKpi } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const dimensionIconMap: Record<string, string> = {
  operation: 'TrendCharts',
  innovation: 'MagicStick',
  collaboration: 'Connection',
  resilience: 'Shield',
  policy: 'Document',
}

const loading = ref(false)
const kpiCards = ref<MonitorKpi[]>([])
const dimensionTableData = ref<any[]>([])
const radarOption = ref({})
const comparisonOption = ref({})
const trendOption = ref({})

async function loadData() {
  loading.value = true
  try {
    const data = (await fetchFiveDimensionData()) as FiveDimensionData

    // KPI cards from dimensions
    kpiCards.value = data.dimensions.map((d, _i) => ({
      key: d.key,
      label: d.label,
      value: d.score,
      unit: '分',
      trend: d.score >= 80 ? 'up' : d.score >= 60 ? 'flat' : 'down',
      trendValue: d.score >= 80 ? '优秀' : d.score >= 60 ? '良好' : '待提升',
      icon: dimensionIconMap[d.key] || 'DataLine',
      iconColor: chartColors[_i % chartColors.length],
      iconBgColor: chartColors[_i % chartColors.length] + '20',
    }))

    // Table data
    dimensionTableData.value = data.dimensions.map((d) => ({
      dimension: d.label,
      score: d.score,
      indicator1: `${d.indicators[0].name}: ${d.indicators[0].value}${d.indicators[0].unit} (基准${d.indicators[0].benchmark})`,
      indicator2: `${d.indicators[1].name}: ${d.indicators[1].value}${d.indicators[1].unit} (基准${d.indicators[1].benchmark})`,
      indicator3: `${d.indicators[2].name}: ${d.indicators[2].value}${d.indicators[2].unit} (基准${d.indicators[2].benchmark})`,
    }))

    // Radar chart
    radarOption.value = {
      color: chartColors,
      radar: {
        indicator: data.dimensions.map((d) => ({
          name: d.label,
          max: 100,
        })),
      },
      legend: {
        data: data.enterprises.map((e) => e.name).slice(0, 3),
      },
      series: [
        {
          type: 'radar',
          data: data.enterprises.slice(0, 3).map((e) => ({
            value: e.scores,
            name: e.name,
            areaStyle: { opacity: 0.1 },
          })),
        },
      ],
    }

    // Comparison bar
    comparisonOption.value = {
      color: chartColors,
      tooltip: { trigger: 'axis' },
      legend: { data: ['企业评分', '基准值'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value', max: 100 },
      yAxis: {
        type: 'category',
        data: data.dimensions.map((d) => d.label),
        inverse: true,
      },
      series: [
        {
          name: '企业评分',
          type: 'bar',
          barMaxWidth: 24,
          data: data.dimensions.map((d) => d.score),
        },
        {
          name: '基准值',
          type: 'bar',
          barMaxWidth: 24,
          data: data.dimensions.map((d) => {
            const avg = d.indicators.reduce((s, ind) => s + ind.benchmark, 0) / d.indicators.length
            return +avg.toFixed(1)
          }),
          itemStyle: { color: '#E8ECF1' },
        },
      ],
    }

    // Trend chart
    trendOption.value = {
      color: chartColors,
      tooltip: { trigger: 'axis' },
      legend: { data: data.dimensions.map((d) => d.label) },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: data.trend.map((t) => t.year),
      },
      yAxis: { type: 'value', max: 100 },
      series: data.dimensions.map((d, i) => ({
        name: d.label,
        type: 'line',
        smooth: true,
        data: data.trend.map((t) => t.scores[i]),
      })),
    }
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
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
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
</style>
