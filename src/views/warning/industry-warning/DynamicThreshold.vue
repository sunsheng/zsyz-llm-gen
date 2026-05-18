<template>
  <div class="page-container">
    <PageHeader title="动态阈值设定" subtitle="产业预警指标动态阈值配置与管理">
      <template #actions>
        <el-button type="primary">新增阈值规则</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">阈值触发统计</h4>
        <BaseChart :option="triggerOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">阈值分布情况</h4>
        <BaseChart :option="distributionOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">阈值规则配置</h4>
      <el-table :data="summary?.rules ?? []" stripe border style="width: 100%">
        <el-table-column prop="indicator" label="监测指标" min-width="180" />
        <el-table-column prop="warnThreshold" label="预警阈值" width="140" />
        <el-table-column prop="criticalThreshold" label="超限阈值" width="140" />
        <el-table-column prop="type" label="阈值类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.type === 'dynamic' ? 'success' : 'info'" size="small">
              {{ row.type === 'dynamic' ? '动态' : '静态' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="triggerCount" label="本月触发" width="100" />
        <el-table-column prop="enabled" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'" size="small">
              {{ row.enabled ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default>
            <el-link type="primary" :underline="false">编辑</el-link>
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
import { fetchDynamicThreshold } from '@/api/modules/warningApi'
import type { DynamicThresholdSummary } from '@/api/types/warning'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const summary = ref<DynamicThresholdSummary | null>(null)

const kpiCards = computed(() => {
  if (!summary.value) return []
  const kpi = summary.value.kpiCards
  return [
    {
      key: 'rules',
      label: '阈值规则',
      value: kpi.totalRules,
      unit: '条',
      trend: 'up' as const,
      trendValue: '+4',
      icon: 'SetUp',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'dynamic',
      label: '动态阈值',
      value: kpi.dynamicCount,
      unit: '条',
      trend: 'up' as const,
      trendValue: '+6',
      icon: 'RefreshRight',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'triggered',
      label: '本月触发',
      value: kpi.monthlyTriggers,
      unit: '次',
      trend: 'down' as const,
      trendValue: '-5',
      icon: 'Bell',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
    {
      key: 'accuracy',
      label: '准确率',
      value: kpi.accuracy,
      unit: '%',
      trend: 'up' as const,
      trendValue: '+1.8%',
      icon: 'CircleCheck',
      iconColor: '#975FE5',
      iconBgColor: '#F3ECFF',
    },
  ]
})

const triggerOption = ref({})
const distributionOption = ref({})

function buildCharts() {
  if (!summary.value) return

  const { triggerTrend, distribution } = summary.value

  triggerOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['预警触发', '超限触发'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: triggerTrend.months },
    yAxis: { type: 'value', name: '次' },
    series: [
      { name: '预警触发', type: 'bar', barMaxWidth: 32, data: triggerTrend.warnTriggers },
      { name: '超限触发', type: 'bar', barMaxWidth: 32, data: triggerTrend.criticalTriggers },
    ],
  }

  distributionOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c}条' },
        data: distribution,
      },
    ],
  }
}

async function loadData() {
  summary.value = await fetchDynamicThreshold()
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
