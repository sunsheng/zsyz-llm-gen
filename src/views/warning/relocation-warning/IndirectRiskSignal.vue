<template>
  <div class="page-container">
    <PageHeader title="间接风险信号" subtitle="企业外迁间接风险信号监测与识别">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary" @click="loadData">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">风险信号趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">信号类型分布</h4>
        <BaseChart :option="typeOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">间接风险信号明细</h4>
      <el-table :data="summary?.signals ?? []" stripe border style="width: 100%">
        <el-table-column prop="enterprise" label="企业名称" min-width="180" />
        <el-table-column prop="signalTypeName" label="信号类型" width="140">
          <template #default="{ row }">
            <el-tag
              :type="
                row.signalType === 'asset_change'
                  ? 'warning'
                  : row.signalType === 'personnel_change'
                    ? 'danger'
                    : 'info'
              "
              size="small"
            >
              {{ row.signalTypeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="signal" label="风险信号" min-width="200" />
        <el-table-column prop="strength" label="信号强度" width="120">
          <template #default="{ row }">
            <el-progress
              :percentage="row.strength"
              :color="row.strength >= 80 ? '#F2637B' : row.strength >= 50 ? '#E6A23C' : '#4ECB73'"
              :stroke-width="8"
            />
          </template>
        </el-table-column>
        <el-table-column prop="time" label="发现时间" width="160" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchRiskSignals } from '@/api/modules/warningApi'
import type { RiskSignalSummary } from '@/api/types/warning'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const summary = ref<RiskSignalSummary | null>(null)

const kpiCards = computed(() => {
  if (!summary.value) return []
  const kpi = summary.value.kpiCards
  return [
    {
      key: 'signals',
      label: '风险信号',
      value: kpi.totalSignals,
      unit: '条',
      trend: 'up' as const,
      trendValue: '+12',
      icon: 'Warning',
      iconColor: '#F2637B',
      iconBgColor: '#FEF0F0',
    },
    {
      key: 'highStrength',
      label: '高强度信号',
      value: kpi.highStrengthCount,
      unit: '条',
      trend: 'up' as const,
      trendValue: '+3',
      icon: 'Bell',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
    {
      key: 'confirmed',
      label: '已确认信号',
      value: kpi.confirmedCount,
      unit: '条',
      trend: 'up' as const,
      trendValue: '+8',
      icon: 'CircleCheck',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'falseAlarm',
      label: '误报率',
      value: kpi.falseAlarmRate,
      unit: '%',
      trend: 'down' as const,
      trendValue: '-2.1%',
      icon: 'CircleClose',
      iconColor: '#975FE5',
      iconBgColor: '#F3ECFF',
    },
  ]
})

const trendOption = ref({})
const typeOption = ref({})

function buildCharts() {
  if (!summary.value) return

  const { trendData, typeDistribution } = summary.value

  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['高强度', '中强度', '低强度'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: trendData.months },
    yAxis: { type: 'value' },
    series: [
      { name: '高强度', type: 'line', smooth: true, data: trendData.high },
      { name: '中强度', type: 'line', smooth: true, data: trendData.medium },
      { name: '低强度', type: 'line', smooth: true, data: trendData.low },
    ],
  }

  typeOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c}条' },
        data: typeDistribution,
      },
    ],
  }
}

async function loadData() {
  summary.value = await fetchRiskSignals()
  buildCharts()
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
