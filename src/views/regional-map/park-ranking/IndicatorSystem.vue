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
        <h4 class="chart-panel__title">指标权重分布</h4>
        <BaseChart :option="weightOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">指标体系明细</h4>
      <el-table :data="indicatorData" stripe border style="width: 100%">
        <el-table-column prop="name" label="指标名称" min-width="200" />
        <el-table-column prop="dimension" label="所属维度" width="120" />
        <el-table-column prop="weight" label="权重(%)" width="100" />
        <el-table-column prop="calcMethod" label="计算方式" width="140" />
        <el-table-column prop="dataSource" label="数据来源" width="140" />
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
    label: '评价指标',
    value: 32,
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
    value: 5,
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
    value: 24,
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
    value: 96.8,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+1.2%',
    icon: 'CircleCheck',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const dimensionOption = ref({})
const weightOption = ref({})

const indicatorData = ref([
  {
    name: '园区GDP总量',
    dimension: '经济规模',
    weight: 12,
    calcMethod: '直接统计',
    dataSource: '统计局',
    status: '启用',
  },
  {
    name: '规上企业数量',
    dimension: '经济规模',
    weight: 8,
    calcMethod: '直接统计',
    dataSource: '工商系统',
    status: '启用',
  },
  {
    name: 'R&D投入占比',
    dimension: '创新能力',
    weight: 10,
    calcMethod: '比值计算',
    dataSource: '科技局',
    status: '启用',
  },
  {
    name: '专利授权量',
    dimension: '创新能力',
    weight: 8,
    calcMethod: '直接统计',
    dataSource: '知识产权局',
    status: '启用',
  },
  {
    name: '产业链完整度',
    dimension: '产业链',
    weight: 12,
    calcMethod: '模型评估',
    dataSource: '产业数据库',
    status: '启用',
  },
  {
    name: '上下游配套率',
    dimension: '产业链',
    weight: 8,
    calcMethod: '关联分析',
    dataSource: '企业数据库',
    status: '启用',
  },
  {
    name: '基础设施评分',
    dimension: '营商环境',
    weight: 6,
    calcMethod: '专家打分',
    dataSource: '调研数据',
    status: '启用',
  },
  {
    name: '人才密度',
    dimension: '营商环境',
    weight: 6,
    calcMethod: '比值计算',
    dataSource: '人社局',
    status: '启用',
  },
])

onMounted(() => {
  const dimensions = ['经济规模', '创新能力', '产业链', '营商环境', '绿色发展']
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
          { name: '经济规模', value: 8 },
          { name: '创新能力', value: 7 },
          { name: '产业链', value: 8 },
          { name: '营商环境', value: 5 },
          { name: '绿色发展', value: 4 },
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
    series: [{ type: 'bar', barMaxWidth: 32, barWidth: '40%', data: [20, 18, 20, 12, 10] }],
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
