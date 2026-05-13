<template>
  <div class="page-container">
    <PageHeader title="对标总览" subtitle="区域综合对标分析概览">
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
        <h4 class="chart-panel__title">综合实力雷达对比</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">GDP对比趋势</h4>
        <BaseChart :option="gdpTrendOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">关键指标对比</h4>
        <BaseChart :option="barCompareOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">综合评价指数</h4>
        <BaseChart :option="gaugeOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">对标城市综合排名</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="rank" label="排名" width="80">
          <template #default="{ row }">
            <span :style="{ fontWeight: row.rank <= 3 ? 700 : 400, color: row.rank <= 3 ? '#1889E8' : '' }">{{ row.rank }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="城市" min-width="120" />
        <el-table-column prop="gdp" label="GDP(亿元)" width="130" sortable />
        <el-table-column prop="growth" label="GDP增速(%)" width="120" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 0 ? '#67C23A' : '#F56C6C' }">{{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="industryScore" label="产业指数" width="110" sortable />
        <el-table-column prop="innovationScore" label="创新指数" width="110" sortable />
        <el-table-column prop="investScore" label="招商指数" width="110" sortable />
        <el-table-column prop="totalScore" label="综合评分" width="110" sortable>
          <template #default="{ row }">
            <span style="font-weight: 600; color: #1889E8">{{ row.totalScore }}</span>
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
  { key: 'gdp', label: 'GDP总量', value: 18753, unit: '亿元', trend: 'up' as const, trendValue: '+6.8%', icon: 'TrendCharts', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
  { key: 'growth', label: 'GDP增速', value: 6.8, unit: '%', trend: 'up' as const, trendValue: '+0.5%', icon: 'Top', iconColor: '#4ECB73', iconBgColor: '#EDFAF0' },
  { key: 'industry', label: '产业指数', value: 82.5, unit: '', trend: 'up' as const, trendValue: '+2.1', icon: 'OfficeBuilding', iconColor: '#36CBCB', iconBgColor: '#E6F7F7' },
  { key: 'invest', label: '招商指数', value: 76.3, unit: '', trend: 'up' as const, trendValue: '+3.5', icon: 'Money', iconColor: '#FBD437', iconBgColor: '#FFF8E6' }
]

const tableData = ref<any[]>([])
const radarOption = ref({})
const gdpTrendOption = ref({})
const barCompareOption = ref({})
const gaugeOption = ref({})

onMounted(() => {
  const cities = ['杭州市', '宁波市', '苏州市', '南京市', '成都市', '武汉市', '长沙市', '合肥市']
  tableData.value = cities.map((city, i) => ({
    rank: i + 1,
    city,
    gdp: Math.floor(Math.random() * 10000 + 8000),
    growth: +(Math.random() * 8 + 3).toFixed(1),
    industryScore: Math.floor(Math.random() * 20 + 70),
    innovationScore: Math.floor(Math.random() * 25 + 65),
    investScore: Math.floor(Math.random() * 20 + 68),
    totalScore: Math.floor(Math.random() * 15 + 75)
  })).sort((a, b) => b.totalScore - a.totalScore).map((item, i) => ({ ...item, rank: i + 1 }))

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['本地', '对标均值'] },
    radar: {
      indicator: [
        { name: '经济实力', max: 100 },
        { name: '产业水平', max: 100 },
        { name: '创新能力', max: 100 },
        { name: '招商环境', max: 100 },
        { name: '人才密度', max: 100 }
      ],
      shape: 'polygon',
      splitNumber: 5
    },
    series: [{
      type: 'radar',
      data: [
        { name: '本地', value: [82, 78, 85, 76, 80], areaStyle: { opacity: 0.2 } },
        { name: '对标均值', value: [75, 72, 78, 72, 74], areaStyle: { opacity: 0.1 } }
      ]
    }]
  }

  const years = ['2020', '2021', '2022', '2023', '2024']
  gdpTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['本地', '对标城市A', '对标城市B'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value' },
    series: [
      { name: '本地', type: 'line', smooth: true, data: [15200, 16500, 17300, 18100, 18753] },
      { name: '对标城市A', type: 'line', smooth: true, data: [14800, 16200, 17100, 17800, 18500] },
      { name: '对标城市B', type: 'line', smooth: true, data: [13500, 14600, 15300, 16000, 16800] }
    ]
  }

  const indicators = ['GDP增速', '产业指数', '创新指数', '招商指数', '人才密度']
  barCompareOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['本地', '对标均值'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: indicators },
    yAxis: { type: 'value' },
    series: [
      { name: '本地', type: 'bar', barWidth: '25%', data: [6.8, 82.5, 85.2, 76.3, 80.1] },
      { name: '对标均值', type: 'bar', barWidth: '25%', data: [5.5, 72.1, 78.6, 72.0, 74.5] }
    ]
  }

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
