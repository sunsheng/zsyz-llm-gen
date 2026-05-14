<template>
  <div class="page-container">
    <PageHeader title="招商对标" subtitle="城市招商环境与成效对比">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">招商环境雷达对比</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">招商引资额对比</h4>
        <BaseChart :option="investBarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">落地项目数趋势</h4>
        <BaseChart :option="projectTrendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">政策吸引力对比</h4>
        <BaseChart :option="policyBarOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">招商指标详情</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="city" label="城市" min-width="120" />
        <el-table-column prop="investAmount" label="引资额(亿元)" width="130" sortable />
        <el-table-column prop="projectCount" label="落地项目数" width="120" sortable />
        <el-table-column prop="growth" label="增速(%)" width="100" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 0 ? '#67C23A' : '#F56C6C' }"
              >{{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="policyScore" label="政策评分" width="100" />
        <el-table-column prop="serviceScore" label="服务评分" width="100" />
        <el-table-column prop="investScore" label="招商指数" width="100" sortable>
          <template #default="{ row }">
            <span style="font-weight: 600; color: #1889e8">{{ row.investScore }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const tableData = ref<any[]>([])
const radarOption = ref({})
const investBarOption = ref({})
const projectTrendOption = ref({})
const policyBarOption = ref({})

onMounted(() => {
  const cities = ['杭州市', '宁波市', '苏州市', '南京市', '成都市', '武汉市']
  tableData.value = cities.map((city) => ({
    city,
    investAmount: Math.floor(Math.random() * 3000 + 500),
    projectCount: Math.floor(Math.random() * 200 + 50),
    growth: +(Math.random() * 30 + 5).toFixed(1),
    policyScore: Math.floor(Math.random() * 20 + 70),
    serviceScore: Math.floor(Math.random() * 20 + 68),
    investScore: Math.floor(Math.random() * 20 + 70),
  }))

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['本地', '对标均值'] },
    radar: {
      indicator: [
        { name: '政策环境', max: 100 },
        { name: '营商环境', max: 100 },
        { name: '人才供给', max: 100 },
        { name: '产业配套', max: 100 },
        { name: '资金扶持', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          { name: '本地', value: [82, 78, 80, 85, 76], areaStyle: { opacity: 0.2 } },
          { name: '对标均值', value: [72, 70, 68, 75, 65], areaStyle: { opacity: 0.1 } },
        ],
      },
    ],
  }

  investBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: cities },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', barWidth: '40%', data: tableData.value.map((d) => d.investAmount) }],
  }

  const years = ['2020', '2021', '2022', '2023', '2024']
  projectTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['本地', '对标城市A'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value' },
    series: [
      { name: '本地', type: 'line', smooth: true, data: [120, 145, 168, 190, 215] },
      { name: '对标城市A', type: 'line', smooth: true, data: [110, 130, 155, 175, 198] },
    ],
  }

  const dimensions = ['税收优惠', '人才政策', '用地支持', '资金扶持', '审批效率']
  policyBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['本地', '对标均值'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: dimensions },
    yAxis: { type: 'value', max: 100 },
    series: [
      { name: '本地', type: 'bar', barWidth: '25%', data: [85, 82, 78, 76, 88] },
      { name: '对标均值', type: 'bar', barWidth: '25%', data: [72, 68, 70, 65, 75] },
    ],
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
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
