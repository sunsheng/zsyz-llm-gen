<template>
  <div class="page-container">
    <PageHeader title="预警指标体系" subtitle="企业外迁预警指标体系配置与管理">
      <template #actions>
        <el-button type="primary">新增指标</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <!-- 直接/间接信号 Tab -->
    <div class="filter-bar">
      <el-radio-group v-model="signalFilter" @change="onFilterChange">
        <el-radio-button label="all">全部指标</el-radio-button>
        <el-radio-button label="direct">直接外迁信号</el-radio-button>
        <el-radio-button label="indirect">间接风险信号</el-radio-button>
      </el-radio-group>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">指标维度分布</h4>
        <BaseChart :option="dimensionOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">指标权重分布</h4>
        <BaseChart :option="weightOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">预警指标明细</h4>
      <el-table :data="filteredIndicators" stripe border style="width: 100%">
        <el-table-column prop="name" label="指标名称" min-width="200" />
        <el-table-column label="信号类型" width="140">
          <template #default="{ row }">
            <el-tag :type="row.isDirectSignal ? 'danger' : 'info'" size="small">
              {{ row.isDirectSignal ? '直接信号' : '间接信号' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dimensionName" label="所属维度" width="120" />
        <el-table-column prop="weight" label="权重(%)" width="100" />
        <el-table-column prop="dataSource" label="数据来源" width="140" />
        <el-table-column prop="frequency" label="更新频率" width="120" />
        <el-table-column prop="enabled" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'" size="small">
              {{ row.enabled ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchRelocationIndicators } from '@/api/modules/warningApi'
import type { RelocationIndicatorSummary } from '@/api/types/warning'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const summary = ref<RelocationIndicatorSummary | null>(null)
const signalFilter = ref<string>('all')

const kpiCards = computed(() => {
  if (!summary.value) return []
  const kpi = summary.value.kpiCards
  return [
    {
      key: 'indicators',
      label: '预警指标',
      value: kpi.totalIndicators,
      unit: '项',
      trend: 'up' as const,
      trendValue: '+3',
      icon: 'DataBoard',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'dimensions',
      label: '指标维度',
      value: kpi.dimensionCount,
      unit: '类',
      trend: 'flat' as const,
      trendValue: '',
      icon: 'Grid',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'realtime',
      label: '实时指标',
      value: kpi.realtimeCount,
      unit: '项',
      trend: 'up' as const,
      trendValue: '+2',
      icon: 'Timer',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'coverage',
      label: '数据覆盖率',
      value: kpi.coverage,
      unit: '%',
      trend: 'up' as const,
      trendValue: '+1.5%',
      icon: 'CircleCheck',
      iconColor: '#975FE5',
      iconBgColor: '#F3ECFF',
    },
  ]
})

const filteredIndicators = computed(() => {
  if (!summary.value) return []
  if (signalFilter.value === 'all') return summary.value.indicators
  if (signalFilter.value === 'direct')
    return summary.value.indicators.filter((i) => i.isDirectSignal)
  return summary.value.indicators.filter((i) => !i.isDirectSignal)
})

const dimensionOption = ref({})
const weightOption = ref({})

function buildCharts() {
  if (!summary.value) return

  const { dimensionDistribution, weightDistribution } = summary.value

  dimensionOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c}项' },
        data: dimensionDistribution,
      },
    ],
  }

  weightOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: weightDistribution.map((w) => w.dimension) },
    yAxis: { type: 'value', name: '%' },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: weightDistribution.map((w) => w.weight),
      },
    ],
  }
}

function onFilterChange() {
  // filteredIndicators is computed
}

async function loadData() {
  summary.value = await fetchRelocationIndicators()
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
.filter-bar {
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
