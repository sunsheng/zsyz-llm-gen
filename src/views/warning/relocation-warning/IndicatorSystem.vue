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
      <el-table :data="indicatorData" stripe border style="width: 100%">
        <el-table-column prop="name" label="指标名称" min-width="200" />
        <el-table-column prop="dimension" label="所属维度" width="120" />
        <el-table-column prop="weight" label="权重(%)" width="100" />
        <el-table-column prop="dataSource" label="数据来源" width="140" />
        <el-table-column prop="frequency" label="更新频率" width="120" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'" size="small">{{
              row.status
            }}</el-tag>
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
    key: 'indicators',
    label: '预警指标',
    value: 24,
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
    value: 5,
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
    value: 12,
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
    value: 95.2,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+1.5%',
    icon: 'CircleCheck',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const dimensionOption = ref({})
const weightOption = ref({})

const indicatorData = ref([
  {
    name: '企业纳税额变化率',
    dimension: '财务指标',
    weight: 15,
    dataSource: '税务系统',
    frequency: '月度',
    status: '启用',
  },
  {
    name: '员工人数变动率',
    dimension: '运营指标',
    weight: 12,
    dataSource: '社保系统',
    frequency: '月度',
    status: '启用',
  },
  {
    name: '水电费使用变化率',
    dimension: '运营指标',
    weight: 8,
    dataSource: '公共事业',
    frequency: '月度',
    status: '启用',
  },
  {
    name: '知识产权转移数量',
    dimension: '资产指标',
    weight: 10,
    dataSource: '知识产权局',
    frequency: '季度',
    status: '启用',
  },
  {
    name: '关联企业注销率',
    dimension: '关联指标',
    weight: 12,
    dataSource: '工商系统',
    frequency: '月度',
    status: '启用',
  },
  {
    name: '法定代表人变更频率',
    dimension: '治理指标',
    weight: 8,
    dataSource: '工商系统',
    frequency: '月度',
    status: '启用',
  },
  {
    name: '注册资本减少事件',
    dimension: '财务指标',
    weight: 10,
    dataSource: '工商系统',
    frequency: '月度',
    status: '启用',
  },
  {
    name: '经营地址变更频率',
    dimension: '运营指标',
    weight: 15,
    dataSource: '工商系统',
    frequency: '月度',
    status: '启用',
  },
])

onMounted(() => {
  const dimensions = ['财务指标', '运营指标', '资产指标', '关联指标', '治理指标']
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
        data: [
          { name: '财务指标', value: 6 },
          { name: '运营指标', value: 8 },
          { name: '资产指标', value: 4 },
          { name: '关联指标', value: 3 },
          { name: '治理指标', value: 3 },
        ],
      },
    ],
  }

  weightOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: dimensions },
    yAxis: { type: 'value', name: '%' },
    series: [{ type: 'bar', barMaxWidth: 32, barWidth: '40%', data: [25, 35, 15, 12, 13] }],
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
