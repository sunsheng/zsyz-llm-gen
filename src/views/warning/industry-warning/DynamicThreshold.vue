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
      <el-table :data="thresholdData" stripe border style="width: 100%">
        <el-table-column prop="indicator" label="监测指标" min-width="180" />
        <el-table-column prop="warnThreshold" label="预警阈值" width="120" />
        <el-table-column prop="criticalThreshold" label="超限阈值" width="120" />
        <el-table-column prop="type" label="阈值类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.type === '静态' ? 'info' : 'success'" size="small">{{
              row.type
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="triggerCount" label="本月触发" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'" size="small">{{
              row.status
            }}</el-tag>
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
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = [
  {
    key: 'rules',
    label: '阈值规则',
    value: 52,
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
    value: 35,
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
    value: 28,
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
    value: 92.5,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+1.8%',
    icon: 'CircleCheck',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const triggerOption = ref({})
const distributionOption = ref({})

const thresholdData = ref([
  {
    indicator: '产业增加值增速',
    warnThreshold: '≤5.0%',
    criticalThreshold: '≤3.0%',
    type: '动态',
    triggerCount: 3,
    status: '启用',
  },
  {
    indicator: '企业亏损面',
    warnThreshold: '≥18%',
    criticalThreshold: '≥25%',
    type: '动态',
    triggerCount: 5,
    status: '启用',
  },
  {
    indicator: '产能利用率',
    warnThreshold: '≤70%',
    criticalThreshold: '≤60%',
    type: '静态',
    triggerCount: 2,
    status: '启用',
  },
  {
    indicator: 'PMI指数',
    warnThreshold: '≤49.5',
    criticalThreshold: '≤48.0',
    type: '动态',
    triggerCount: 8,
    status: '启用',
  },
  {
    indicator: '工业用电量增速',
    warnThreshold: '≤3.0%',
    criticalThreshold: '≤1.0%',
    type: '静态',
    triggerCount: 1,
    status: '启用',
  },
  {
    indicator: '新开工项目数',
    warnThreshold: '≤80',
    criticalThreshold: '≤50',
    type: '动态',
    triggerCount: 0,
    status: '停用',
  },
])

onMounted(() => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  triggerOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['预警触发', '超限触发'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', name: '次' },
    series: [
      { name: '预警触发', type: 'bar', barMaxWidth: 32, data: [12, 15, 10, 8, 6, 5] },
      { name: '超限触发', type: 'bar', barMaxWidth: 32, data: [5, 8, 6, 4, 3, 2] },
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
        data: [
          { name: '动态阈值', value: 35 },
          { name: '静态阈值', value: 17 },
        ],
      },
    ],
  }
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
