<template>
  <div class="page-container">
    <PageHeader title="榜单指标体系" subtitle="园区榜单评价指标体系配置与管理">
      <template #actions>
        <el-button type="primary">新增指标</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">指标维度分布</h4>
        <BaseChart :option="dimensionOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">维度权重分布</h4>
        <BaseChart :option="weightOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <div class="table-header">
        <h4 class="chart-panel__title">指标体系明细</h4>
        <el-radio-group v-model="activeDimension" size="small" @change="onDimensionChange">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="economic">经济效益</el-radio-button>
          <el-radio-button label="innovation">创新活力</el-radio-button>
          <el-radio-button label="social">社会贡献</el-radio-button>
          <el-radio-button label="growth">成长潜力</el-radio-button>
        </el-radio-group>
      </div>
      <el-table :data="filteredIndicators" stripe border style="width: 100%">
        <el-table-column prop="name" label="指标名称" min-width="160" />
        <el-table-column prop="dimension" label="所属维度" width="120">
          <template #default="{ row }">
            <el-tag :type="dimensionTagType(row.dimension)" size="small">
              {{ DIMENSION_LABEL[row.dimension as IndicatorDimension] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="权重(%)" width="120">
          <template #default="{ row }">
            <el-progress
              :percentage="row.weight"
              :stroke-width="8"
              :color="dimensionColor(row.dimension)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="calcMethod" label="计算方式" width="120" />
        <el-table-column prop="dataSource" label="数据来源" width="120" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '启用' : '停用' }}
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
import { fetchIndicatorSystem } from '@/api/modules/regionalMapApi'
import {
  DIMENSION_LABEL,
  type IndicatorDimension,
  type IndicatorSystemSummary,
} from '@/api/types/regional-map'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const summary = ref<IndicatorSystemSummary | null>(null)
const activeDimension = ref('all')

const kpiCards = computed(() => {
  if (!summary.value) return []
  const kpi = summary.value.kpiCards
  return [
    {
      key: 'indicators',
      label: '评价指标',
      value: kpi.totalIndicators,
      unit: '项',
      trend: 'up' as const,
      trendValue: '+4',
      icon: 'DataBoard',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'dimensions',
      label: '评价维度',
      value: kpi.dimensions,
      unit: '类',
      trend: 'flat' as const,
      trendValue: '',
      icon: 'Grid',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'quantitative',
      label: '定量指标',
      value: kpi.quantitative,
      unit: '项',
      trend: 'up' as const,
      trendValue: '+3',
      icon: 'TrendCharts',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'coverage',
      label: '数据覆盖率',
      value: kpi.coverageRate,
      unit: '%',
      trend: 'up' as const,
      trendValue: '+1.2%',
      icon: 'CircleCheck',
      iconColor: '#975FE5',
      iconBgColor: '#F3ECFF',
    },
  ]
})

const filteredIndicators = computed(() => {
  if (!summary.value) return []
  if (activeDimension.value === 'all') return summary.value.indicators
  return summary.value.indicators.filter((i) => i.dimension === activeDimension.value)
})

const dimensionOption = ref({})
const weightOption = ref({})

function dimensionTagType(dim: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    economic: 'primary',
    innovation: 'success',
    social: 'warning',
    growth: 'danger',
  }
  return map[dim] || 'info'
}

function dimensionColor(dim: string): string {
  const map: Record<string, string> = {
    economic: '#1889E8',
    innovation: '#4ECB73',
    social: '#FBD437',
    growth: '#F2637B',
  }
  return map[dim] || '#1889E8'
}

function updateCharts(data: IndicatorSystemSummary) {
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
        data: data.dimensionDistribution,
      },
    ],
  }

  weightOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: data.weightDistribution.map((d) => d.dimension) },
    yAxis: { type: 'value', name: '%' },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        barWidth: '40%',
        data: data.weightDistribution.map((d) => d.weight),
      },
    ],
  }
}

function onDimensionChange() {
  // 筛选由 computed 自动处理
}

onMounted(async () => {
  const data = await fetchIndicatorSystem()
  summary.value = data
  updateCharts(data)
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
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>
