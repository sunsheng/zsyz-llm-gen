<template>
  <div class="page-container">
    <PageHeader title="预警分析模型" subtitle="产业发展预警模型配置与运行管理">
      <template #actions>
        <el-button>导出报告</el-button>
        <el-button type="primary">新建模型</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">模型预警趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">模型准确率对比</h4>
        <BaseChart :option="accuracyOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">预警模型列表</h4>
      <el-table :data="modelData" stripe border style="width: 100%">
        <el-table-column prop="name" label="模型名称" min-width="180" />
        <el-table-column prop="type" label="模型类型" width="140">
          <template #default="{ row }">
            <el-tag size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="accuracy" label="准确率" width="100" />
        <el-table-column prop="recall" label="召回率" width="100" />
        <el-table-column prop="lastRun" label="最近运行" width="160" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '运行中' ? 'success' : 'info'" size="small">{{
              row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default>
            <el-link type="primary" :underline="false">运行</el-link>
            <el-link type="primary" :underline="false" style="margin-left: 8px">编辑</el-link>
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
    key: 'models',
    label: '预警模型',
    value: 12,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+2',
    icon: 'Cpu',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'running',
    label: '运行中',
    value: 8,
    unit: '个',
    trend: 'flat' as const,
    trendValue: '',
    icon: 'VideoPlay',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'avgAccuracy',
    label: '平均准确率',
    value: 91.2,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+2.5%',
    icon: 'CircleCheck',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
  {
    key: 'predictions',
    label: '本月预测',
    value: 256,
    unit: '次',
    trend: 'up' as const,
    trendValue: '+15%',
    icon: 'DataLine',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const trendOption = ref({})
const accuracyOption = ref({})

const modelData = ref([
  {
    name: '产业增速预警模型',
    type: '时序预测',
    accuracy: '93.5%',
    recall: '88.2%',
    lastRun: '2025-05-14 08:00',
    status: '运行中',
  },
  {
    name: '产能过剩识别模型',
    type: '异常检测',
    accuracy: '91.8%',
    recall: '85.6%',
    lastRun: '2025-05-14 07:30',
    status: '运行中',
  },
  {
    name: '产业链断裂预警',
    type: '关联分析',
    accuracy: '89.5%',
    recall: '82.3%',
    lastRun: '2025-05-14 06:00',
    status: '运行中',
  },
  {
    name: '市场需求衰退模型',
    type: '回归分析',
    accuracy: '92.0%',
    recall: '87.5%',
    lastRun: '2025-05-13 22:00',
    status: '运行中',
  },
  {
    name: '政策风险评估模型',
    type: 'NLP分析',
    accuracy: '88.2%',
    recall: '80.8%',
    lastRun: '2025-05-13 18:00',
    status: '停用',
  },
  {
    name: '综合风险预警模型',
    type: '集成模型',
    accuracy: '94.5%',
    recall: '90.1%',
    lastRun: '2025-05-14 09:00',
    status: '运行中',
  },
])

onMounted(() => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['预警次数', '确认次数'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      { name: '预警次数', type: 'line', smooth: true, data: [42, 38, 45, 35, 32, 28] },
      { name: '确认次数', type: 'line', smooth: true, data: [35, 32, 38, 30, 28, 25] },
    ],
  }

  const models = ['增速预警', '产能过剩', '断裂预警', '需求衰退', '政策风险', '综合风险']
  accuracyOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: models },
    yAxis: { type: 'value', name: '%', max: 100 },
    series: [
      { name: '准确率', type: 'bar', barMaxWidth: 32, data: [93.5, 91.8, 89.5, 92.0, 88.2, 94.5] },
      { name: '召回率', type: 'bar', barMaxWidth: 32, data: [88.2, 85.6, 82.3, 87.5, 80.8, 90.1] },
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
