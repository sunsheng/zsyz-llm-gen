<template>
  <div class="page-container">
    <PageHeader title="关键指标看板" subtitle="企业经营关键指标实时监测" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">健康指标仪表盘</h4>
        <BaseChart :option="gaugeOption" height="280px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">各指标趋势</h4>
        <BaseChart :option="trendOption" height="280px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">指标趋势明细</h4>
      <el-table v-loading="loading" :data="trendData" stripe border style="width: 100%">
        <el-table-column prop="month" label="月份" width="100" />
        <el-table-column prop="taxVolatility" label="纳税波动率(%)" width="140" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.taxVolatility > 15 ? '#F2637B' : '#303133' }">
              {{ row.taxVolatility }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="powerCapacityRatio" label="用电产能比(%)" width="140" sortable>
          <template #default="{ row }">{{ row.powerCapacityRatio }}%</template>
        </el-table-column>
        <el-table-column prop="employeeStability" label="员工稳定性(%)" width="140" sortable>
          <template #default="{ row }">{{ row.employeeStability }}%</template>
        </el-table-column>
        <el-table-column prop="healthScore" label="综合健康评分" width="140" sortable>
          <template #default="{ row }">
            <el-tag
              :type="
                row.healthScore >= 80 ? 'success' : row.healthScore >= 60 ? 'warning' : 'danger'
              "
              size="small"
            >
              {{ row.healthScore }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchKeyDashboardKpi, fetchKeyDashboardTrend } from '@/api/modules/monitorApi'
import type { KeyDashboardKpi, KeyDashboardTrend } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const loading = ref(false)
const kpiCards = ref<KeyDashboardKpi[]>([])
const trendData = ref<KeyDashboardTrend[]>([])
const gaugeOption = ref({})
const trendOption = ref({})

async function loadData() {
  loading.value = true
  try {
    const [kpi, trend] = await Promise.all([
      fetchKeyDashboardKpi() as Promise<KeyDashboardKpi[]>,
      fetchKeyDashboardTrend() as Promise<KeyDashboardTrend[]>,
    ])
    kpiCards.value = kpi
    trendData.value = trend
    updateCharts()
  } finally {
    loading.value = false
  }
}

function updateCharts() {
  const healthScore = kpiCards.value.find((k) => k.key === 'health-score')?.value ?? 82

  gaugeOption.value = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: { color: '#1889E8' },
        progress: { show: true, width: 20 },
        pointer: { show: false },
        axisLine: { lineStyle: { width: 20, color: [[1, '#E8ECF1']] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 36,
          fontWeight: 700,
          color: '#1889E8',
          formatter: '{value}分',
          offsetCenter: [0, '0%'],
        },
        title: { offsetCenter: [0, '30%'], fontSize: 14, color: '#909399' },
        data: [{ value: healthScore, name: '综合健康评分' }],
      },
    ],
  }

  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['纳税波动率', '用电产能比', '员工稳定性', '健康评分'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: trendData.value.map((t) => t.month) },
    yAxis: { type: 'value' },
    series: [
      {
        name: '纳税波动率',
        type: 'line',
        smooth: true,
        data: trendData.value.map((t) => t.taxVolatility),
      },
      {
        name: '用电产能比',
        type: 'line',
        smooth: true,
        data: trendData.value.map((t) => t.powerCapacityRatio),
      },
      {
        name: '员工稳定性',
        type: 'line',
        smooth: true,
        data: trendData.value.map((t) => t.employeeStability),
      },
      {
        name: '健康评分',
        type: 'line',
        smooth: true,
        data: trendData.value.map((t) => t.healthScore),
      },
    ],
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
.table-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
