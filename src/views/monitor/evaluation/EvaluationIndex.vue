<template>
  <div class="page-container">
    <PageHeader title="评价指数" subtitle="企业综合评价指数体系">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard
        icon="TrendCharts"
        label="综合评价指数"
        :value="78.5"
        trend="up"
        trendValue="+2.3"
        iconColor="#1889E8"
        iconBgColor="#ECF5FF"
      />
      <StatCard
        icon="Top"
        label="最高评分"
        :value="95.2"
        unit="分"
        trend="up"
        trendValue="+1.5"
        iconColor="#67C23A"
        iconBgColor="#EDFAF0"
      />
      <StatCard
        icon="Bottom"
        label="最低评分"
        :value="42.8"
        unit="分"
        trend="down"
        trendValue="-3.2"
        iconColor="#F56C6C"
        iconBgColor="#FEF0F0"
      />
      <StatCard
        icon="DataLine"
        label="参评企业"
        :value="1286"
        unit="家"
        trend="up"
        trendValue="+42"
        iconColor="#975FE5"
        iconBgColor="#F3ECFF"
      />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">综合评价指数仪表盘</h4>
        <BaseChart :option="gaugeOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">五维评价雷达图</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业评分分布</h4>
        <BaseChart :option="distBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">评价指数趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">评价排名</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="scores" label="盈利能力" width="100">
          <template #default="{ row }">{{ row.scores[0] }}</template>
        </el-table-column>
        <el-table-column prop="scores" label="成长潜力" width="100">
          <template #default="{ row }">{{ row.scores[1] }}</template>
        </el-table-column>
        <el-table-column prop="scores" label="创新能力" width="100">
          <template #default="{ row }">{{ row.scores[2] }}</template>
        </el-table-column>
        <el-table-column prop="scores" label="市场竞争力" width="110">
          <template #default="{ row }">{{ row.scores[3] }}</template>
        </el-table-column>
        <el-table-column prop="scores" label="风险控制" width="100">
          <template #default="{ row }">{{ row.scores[4] }}</template>
        </el-table-column>
        <el-table-column label="综合评分" width="100">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #1889E8">
              {{ Math.floor(row.scores.reduce((a: number, b: number) => a + b, 0) / row.scores.length) }}
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
import { getMockEvaluationData } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const tableData = ref<any[]>([])
const gaugeOption = ref({})
const radarOption = ref({})
const distBarOption = ref({})
const trendOption = ref({})

onMounted(() => {
  const evalData = getMockEvaluationData()
  tableData.value = evalData.enterprises

  gaugeOption.value = {
    series: [{
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      detail: { formatter: '{value}' },
      data: [{ value: 78.5, name: '综合评价' }],
      axisLine: { lineStyle: { width: 20, color: [[0.3, '#F56C6C'], [0.7, '#E6A23C'], [1, '#67C23A']] } },
      pointer: { width: 5 }
    }]
  }

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: evalData.enterprises.map((e: any) => e.name) },
    radar: {
      indicator: evalData.dimensions.map((d: string) => ({ name: d, max: 100 })),
      shape: 'polygon',
      splitNumber: 5
    },
    series: [{
      type: 'radar',
      data: evalData.enterprises.map((e: any) => ({
        name: e.name,
        value: e.scores,
        areaStyle: { opacity: 0.2 }
      }))
    }]
  }

  const scoreRanges = ['0-20', '20-40', '40-60', '60-80', '80-100']
  distBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: scoreRanges },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      barWidth: '50%',
      data: [18, 56, 186, 520, 506],
      itemStyle: {
        color: (_params: any) => {
          const colors = ['#F56C6C', '#E6A23C', '#FBD437', '#36CBCB', '#67C23A']
          return colors[_params.dataIndex] || '#1889E8'
        }
      }
    }]
  }

  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['综合评价指数'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', min: 60, max: 100 },
    series: [
      { name: '综合评价指数', type: 'line', smooth: true, data: [72.5, 73.1, 74.8, 75.2, 76.0, 75.8, 76.5, 77.1, 76.8, 78.0, 77.5, 78.5] }
    ]
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
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
.chart-panel__title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
.table-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
