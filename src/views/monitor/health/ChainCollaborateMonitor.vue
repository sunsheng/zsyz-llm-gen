<template>
  <div class="page-container">
    <PageHeader title="产业链协同监测" subtitle="供应链韧性分析与本地配套率评估" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">本地配套率仪表盘</h4>
        <BaseChart :option="gaugeOption" height="280px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">各环节本地配套率</h4>
        <BaseChart :option="barOption" height="280px" />
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-panel full-width">
        <h4 class="chart-panel__title">配套率趋势</h4>
        <BaseChart :option="trendOption" height="280px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">低配环节预警</h4>
      <el-table v-loading="loading" :data="warningItems" stripe border style="width: 100%">
        <el-table-column prop="segment" label="环节" min-width="160" />
        <el-table-column prop="localRate" label="本地配套率(%)" width="160">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #f2637b">{{ row.localRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="预警原因" min-width="300" />
      </el-table>
      <div v-if="!warningItems.length" class="no-warning">
        <el-empty description="暂无预警项，所有环节配套率均达标" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchChainCollaborateData } from '@/api/modules/monitorApi'
import type { ChainCollaborateData } from '@/api/mock/monitor'
import type { MonitorKpi } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const loading = ref(false)
const kpiCards = ref<MonitorKpi[]>([])
const warningItems = ref<{ segment: string; localRate: number; reason: string }[]>([])
const gaugeOption = ref({})
const barOption = ref({})
const trendOption = ref({})

async function loadData() {
  loading.value = true
  try {
    const data = (await fetchChainCollaborateData()) as ChainCollaborateData
    kpiCards.value = [
      {
        key: 'local-rate',
        label: '综合本地配套率',
        value: data.localRate,
        unit: '%',
        trend: data.localRate >= data.industryAvg ? 'up' : 'down',
        trendValue: data.localRate >= data.industryAvg ? '高于行业均值' : '低于行业均值',
        icon: 'Connection',
        iconColor: '#1889E8',
        iconBgColor: '#ECF5FF',
      },
      {
        key: 'industry-avg',
        label: '行业均值',
        value: data.industryAvg,
        unit: '%',
        trend: 'flat',
        trendValue: '基准线',
        icon: 'DataLine',
        iconColor: '#36CBCB',
        iconBgColor: '#E6F7F7',
      },
      {
        key: 'warning-count',
        label: '低配环节',
        value: data.warningItems.length,
        unit: '个',
        trend: data.warningItems.length > 3 ? 'up' : 'down',
        trendValue: data.warningItems.length > 0 ? '需关注' : '全部达标',
        icon: 'Warning',
        iconColor: '#FBD437',
        iconBgColor: '#FFF8E6',
      },
      {
        key: 'segment-count',
        label: '监测环节',
        value: data.segments.length,
        unit: '个',
        trend: 'flat',
        trendValue: '持续监测',
        icon: 'Monitor',
        iconColor: '#4ECB73',
        iconBgColor: '#EDFAF0',
      },
    ]
    warningItems.value = data.warningItems
    updateCharts(data)
  } finally {
    loading.value = false
  }
}

function updateCharts(data: ChainCollaborateData) {
  gaugeOption.value = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: data.localRate >= 60 ? '#4ECB73' : '#F2637B',
        },
        progress: { show: true, width: 20 },
        pointer: { show: false },
        axisLine: { lineStyle: { width: 20, color: [[1, '#E8ECF1']] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 36,
          fontWeight: 700,
          color: data.localRate >= 60 ? '#4ECB73' : '#F2637B',
          formatter: '{value}%',
          offsetCenter: [0, '0%'],
        },
        title: { offsetCenter: [0, '30%'], fontSize: 14, color: '#909399' },
        data: [{ value: data.localRate, name: '本地配套率' }],
      },
    ],
  }

  barOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['本地配套率', '行业均值'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    yAxis: {
      type: 'category',
      data: data.segments.map((s) => s.name),
      inverse: true,
    },
    series: [
      {
        name: '本地配套率',
        type: 'bar',
        barMaxWidth: 32,
        data: data.segments.map((s) => ({
          value: s.localRate,
          itemStyle: { color: s.localRate >= 60 ? '#1889E8' : '#F2637B' },
        })),
      },
      {
        name: '行业均值',
        type: 'bar',
        barMaxWidth: 32,
        data: data.segments.map(() => data.industryAvg),
        itemStyle: { color: '#E8ECF1' },
      },
    ],
  }

  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: data.trend.map((t) => t.month) },
    yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: '本地配套率',
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.15 },
        data: data.trend.map((t) => t.localRate),
        markLine: {
          silent: true,
          data: [{ yAxis: data.industryAvg, name: '行业均值', lineStyle: { color: '#F2637B' } }],
        },
      },
    ],
  }
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
.no-warning {
  padding: 20px 0;
}
</style>
