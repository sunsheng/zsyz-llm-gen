<template>
  <div class="page-container">
    <PageHeader title="政策实施监测" subtitle="政策执行效果跟踪与评估监测" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">政策执行进度</h4>
        <BaseChart :option="progressOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">惠及企业与资金分布</h4>
        <BaseChart :option="benefitOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">政策监测明细</h4>
      <el-table :data="monitorData" stripe border style="width: 100%">
        <el-table-column prop="policy" label="政策名称" min-width="200" />
        <el-table-column prop="progress" label="执行进度" width="160">
          <template #default="{ row }">
            <el-progress
              :percentage="row.progress"
              :color="row.progress >= 80 ? '#4ECB73' : row.progress >= 50 ? '#FBD437' : '#F2637B'"
            />
          </template>
        </el-table-column>
        <el-table-column prop="benefitedEnterprises" label="惠及企业数" width="120" />
        <el-table-column prop="fundScale" label="资金规模" width="120" />
        <el-table-column prop="jobsCreated" label="就业岗位" width="120" />
        <el-table-column prop="keyNode" label="关键节点" width="120">
          <template #default="{ row }">
            <el-tag :type="row.keyNode === '资金拨付' ? 'warning' : 'success'" size="small">
              {{ row.keyNode }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="截止日期" width="120" />
        <el-table-column prop="responsible" label="责任单位" width="140" />
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
    key: 'enterprises',
    label: '惠及企业',
    value: 1286,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+128',
    icon: 'OfficeBuilding',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'fundScale',
    label: '资金规模',
    value: 15.6,
    unit: '亿元',
    trend: 'up' as const,
    trendValue: '+2.3亿',
    icon: 'Money',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
  {
    key: 'jobs',
    label: '就业岗位',
    value: 8560,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+960',
    icon: 'User',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'overdue',
    label: '逾期预警',
    value: 8,
    unit: '项',
    trend: 'down' as const,
    trendValue: '-3',
    icon: 'Warning',
    iconColor: '#F2637B',
    iconBgColor: '#FEF0F0',
  },
]

const progressOption = ref({})
const benefitOption = ref({})

const monitorData = ref([
  {
    policy: '"人工智能+制造"专项行动方案',
    progress: 92,
    benefitedEnterprises: 320,
    fundScale: '3.2亿',
    jobsCreated: 1860,
    keyNode: '项目验收',
    deadline: '2025-12-31',
    responsible: '工信局',
  },
  {
    policy: '电子信息制造业稳增长行动方案',
    progress: 78,
    benefitedEnterprises: 256,
    fundScale: '2.8亿',
    jobsCreated: 1520,
    keyNode: '资金拨付',
    deadline: '2025-09-30',
    responsible: '发改委',
  },
  {
    policy: '生物医药创新发展若干措施',
    progress: 65,
    benefitedEnterprises: 198,
    fundScale: '1.5亿',
    jobsCreated: 980,
    keyNode: '资金拨付',
    deadline: '2025-11-30',
    responsible: '科技局',
  },
  {
    policy: '新材料产业发展专项行动方案',
    progress: 45,
    benefitedEnterprises: 142,
    fundScale: '0.8亿',
    jobsCreated: 520,
    keyNode: '项目验收',
    deadline: '2025-08-31',
    responsible: '工信局',
  },
  {
    policy: '高端装备制造业转型升级意见',
    progress: 88,
    benefitedEnterprises: 285,
    fundScale: '2.6亿',
    jobsCreated: 1680,
    keyNode: '项目验收',
    deadline: '2025-10-31',
    responsible: '发改委',
  },
  {
    policy: '绿色低碳产业发展扶持政策',
    progress: 55,
    benefitedEnterprises: 85,
    fundScale: '4.7亿',
    jobsCreated: 2000,
    keyNode: '资金拨付',
    deadline: '2025-12-31',
    responsible: '科技局',
  },
])

onMounted(() => {
  const policies = [
    'AI+制造方案',
    '电子信息方案',
    '生物医药措施',
    '新材料方案',
    '高端装备意见',
    '绿色低碳政策',
  ]
  progressOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: policies },
    yAxis: { type: 'value', max: 100 },
    series: [{ name: '执行进度', type: 'bar', barWidth: '40%', data: [92, 78, 65, 45, 88, 55] }],
  }

  benefitOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['惠及企业数', '就业岗位数'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: policies },
    yAxis: [
      { type: 'value', name: '企业数', position: 'left' },
      { type: 'value', name: '岗位数', position: 'right' },
    ],
    series: [
      {
        name: '惠及企业数',
        type: 'bar',
        barMaxWidth: 32,
        barWidth: '30%',
        data: [320, 256, 198, 142, 285, 85],
      },
      {
        name: '就业岗位数',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: [1860, 1520, 980, 520, 1680, 2000],
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
