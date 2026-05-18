<template>
  <div class="page-container">
    <PageHeader title="核心监测指标" subtitle="产业发展核心指标实时监测与预警">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary" @click="loadData">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <!-- 指标分类 Tab -->
    <div class="filter-bar">
      <el-radio-group v-model="activeCategory" @change="onCategoryChange">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="scale">规模指标</el-radio-button>
        <el-radio-button label="efficiency">效益指标</el-radio-button>
        <el-radio-button label="risk">风险指标</el-radio-button>
        <el-radio-button label="sustainable">可持续指标</el-radio-button>
        <el-radio-button label="innovation">创新指标</el-radio-button>
      </el-radio-group>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">指标趋势监测</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">指标健康度分布</h4>
        <BaseChart :option="healthOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">核心监测指标明细</h4>
      <el-table :data="filteredIndicators" stripe border style="width: 100%">
        <el-table-column prop="name" label="指标名称" min-width="180" />
        <el-table-column prop="categoryName" label="指标分类" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.categoryName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当前值" width="120">
          <template #default="{ row }"> {{ row.currentValue }}{{ row.unit }} </template>
        </el-table-column>
        <el-table-column label="预警阈值" width="120">
          <template #default="{ row }"> {{ row.warnThreshold }}{{ row.unit }} </template>
        </el-table-column>
        <el-table-column label="超限阈值" width="120">
          <template #default="{ row }"> {{ row.criticalThreshold }}{{ row.unit }} </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === 'normal'
                  ? 'success'
                  : row.status === 'warning'
                    ? 'warning'
                    : 'danger'
              "
              size="small"
            >
              {{ row.status === 'normal' ? '正常' : row.status === 'warning' ? '预警' : '超限' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="变化趋势" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.change >= 0 ? '#4ECB73' : '#F2637B' }">
              {{ row.change >= 0 ? '+' : '' }}{{ row.change }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="160" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchCoreIndicators } from '@/api/modules/warningApi'
import type { CoreIndicatorSummary, IndicatorCategory } from '@/api/types/warning'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const summary = ref<CoreIndicatorSummary | null>(null)
const activeCategory = ref<string>('all')

const kpiCards = computed(() => {
  if (!summary.value) return []
  const kpi = summary.value.kpiCards
  return [
    {
      key: 'total',
      label: '监测指标',
      value: kpi.totalIndicators,
      unit: '项',
      trend: 'up' as const,
      trendValue: '+2',
      icon: 'Monitor',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'normal',
      label: '正常指标',
      value: kpi.normalCount,
      unit: '项',
      trend: 'up' as const,
      trendValue: '+3',
      icon: 'CircleCheck',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'warning',
      label: '预警指标',
      value: kpi.warningCount,
      unit: '项',
      trend: 'down' as const,
      trendValue: '-2',
      icon: 'Warning',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
    {
      key: 'critical',
      label: '超限指标',
      value: kpi.criticalCount,
      unit: '项',
      trend: 'down' as const,
      trendValue: '-1',
      icon: 'CircleClose',
      iconColor: '#F2637B',
      iconBgColor: '#FEF0F0',
    },
  ]
})

const filteredIndicators = computed(() => {
  if (!summary.value) return []
  if (activeCategory.value === 'all') return summary.value.indicators
  return summary.value.indicators.filter(
    (i) => i.category === (activeCategory.value as IndicatorCategory),
  )
})

const trendOption = ref({})
const healthOption = ref({})

function buildCharts() {
  if (!summary.value) return

  const { trendData, healthDistribution } = summary.value

  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: trendData.series.map((s) => s.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: trendData.months },
    yAxis: { type: 'value' },
    series: trendData.series.map((s) => ({
      name: s.name,
      type: 'line',
      smooth: true,
      data: s.data,
    })),
  }

  healthOption.value = {
    color: ['#4ECB73', '#FBD437', '#F2637B'],
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c}项' },
        data: healthDistribution,
      },
    ],
  }
}

function onCategoryChange() {
  // 切换分类时不需要重新请求，filteredIndicators 是计算属性
}

async function loadData() {
  summary.value = await fetchCoreIndicators()
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
