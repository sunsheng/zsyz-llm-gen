<template>
  <div class="page-container">
    <PageHeader title="监测总览" subtitle="企业监测全局概览">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业产业分布</h4>
        <BaseChart :option="distributionOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业健康度分布</h4>
        <BaseChart :option="healthPieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">监测趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">风险等级分布</h4>
        <BaseChart :option="riskBarOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">预警企业列表</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="industry" label="行业" width="140" />
        <el-table-column prop="healthScore" label="健康评分" width="100">
          <template #default="{ row }">
            <span
              :style="{
                color:
                  row.healthScore >= 80 ? '#67C23A' : row.healthScore >= 60 ? '#E6A23C' : '#F56C6C',
              }"
            >
              {{ row.healthScore }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="riskScore" label="风险评分" width="100">
          <template #default="{ row }">
            <span
              :style="{
                color:
                  row.riskScore <= 30 ? '#67C23A' : row.riskScore <= 60 ? '#E6A23C' : '#F56C6C',
              }"
            >
              {{ row.riskScore }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="growth" label="增长率(%)" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
            </span>
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
import {
  getMockMonitorKpi,
  getMockEnterpriseDistribution,
  getMockHealthData,
} from '@/api/mock/monitor'
import type { MonitorKpi } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = ref<MonitorKpi[]>([])
const tableData = ref<any[]>([])
const distributionOption = ref({})
const healthPieOption = ref({})
const trendOption = ref({})
const riskBarOption = ref({})

onMounted(() => {
  kpiCards.value = getMockMonitorKpi()
  const healthData = getMockHealthData(8)
  tableData.value = healthData.map((h) => ({
    name: h.name,
    industry: ['高端装备制造', '新材料', '生物医药', '电子信息', '新能源'][
      Math.floor(Math.random() * 5)
    ],
    healthScore: h.overallScore,
    riskScore: 100 - h.riskScore,
    growth: Math.floor(Math.random() * 40 - 10),
  }))

  const distData = getMockEnterpriseDistribution()
  distributionOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: distData,
      },
    ],
  }

  healthPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: [
          { name: '健康', value: 1024 },
          { name: '预警', value: 186 },
          { name: '风险', value: 76 },
        ],
      },
    ],
  }

  const months = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ]
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['健康企业', '预警企业', '风险企业'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      {
        name: '健康企业',
        type: 'line',
        smooth: true,
        data: [980, 990, 1000, 1005, 1010, 1015, 1020, 1020, 1022, 1023, 1024, 1024],
      },
      {
        name: '预警企业',
        type: 'line',
        smooth: true,
        data: [200, 195, 198, 195, 192, 190, 188, 190, 188, 187, 186, 186],
      },
      {
        name: '风险企业',
        type: 'line',
        smooth: true,
        data: [70, 72, 68, 72, 74, 75, 76, 74, 76, 77, 76, 76],
      },
    ],
  }

  riskBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['低风险', '中风险', '高风险', '极高风险'] },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        barWidth: '40%',
        data: [
          { value: 856, itemStyle: { color: '#67C23A' } },
          { value: 254, itemStyle: { color: '#E6A23C' } },
          { value: 128, itemStyle: { color: '#F56C6C' } },
          { value: 48, itemStyle: { color: '#C45656' } },
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
