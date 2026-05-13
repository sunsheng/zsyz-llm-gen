<template>
  <div class="page-container">
    <PageHeader title="对比报告" subtitle="区域综合对比分析报告">
      <template #actions>
        <el-button>导出PDF</el-button>
        <el-button type="primary">生成报告</el-button>
      </template>
    </PageHeader>

    <div class="select-section">
      <div class="chart-panel">
        <h4 class="chart-panel__title">选择对比城市</h4>
        <div class="select-row">
          <el-select v-model="selectedCities" multiple placeholder="请选择对比城市（最多4个）" :max-collapse-tags="3" style="width: 500px">
            <el-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-button type="primary" @click="handleCompare">开始对比</el-button>
        </div>
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">综合实力对比</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">经济指标对比</h4>
        <BaseChart :option="economyBarOption" height="360px" />
      </div>
    </div>

    <div class="compare-section">
      <h4 class="chart-panel__title">关键指标对比</h4>
      <ComparisonBar :items="comparisonItems" metric-key="value" name-key="name" />
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">综合对比数据</h4>
      <el-table :data="reportData" stripe border style="width: 100%">
        <el-table-column prop="indicator" label="指标" min-width="160" />
        <el-table-column v-for="(city, idx) in compareCities" :key="idx" :label="city.name" min-width="120">
          <template #default="{ row }">
            <span :style="{ fontWeight: row.values[idx] === Math.max(...row.values.filter(Number.isFinite)) ? 700 : 400, color: row.values[idx] === Math.max(...row.values.filter(Number.isFinite)) ? '#1889E8' : '' }">
              {{ row.values[idx] }}{{ row.unit }}
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
import BaseChart from '@/components/charts/BaseChart.vue'
import ComparisonBar from '@/components/business/ComparisonBar.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const cityOptions = [
  { label: '杭州市', value: 'hz' },
  { label: '宁波市', value: 'nb' },
  { label: '苏州市', value: 'sz' },
  { label: '南京市', value: 'nj' },
  { label: '成都市', value: 'cd' },
  { label: '武汉市', value: 'wh' },
  { label: '长沙市', value: 'cs' },
  { label: '合肥市', value: 'hf' }
]

const selectedCities = ref<string[]>(['hz', 'nb', 'sz'])
const compareCities = ref<any[]>([])
const comparisonItems = ref<any[]>([])
const reportData = ref<any[]>([])
const radarOption = ref({})
const economyBarOption = ref({})

onMounted(() => {
  handleCompare()
})

function handleCompare() {
  const cityNames: Record<string, string> = { hz: '杭州市', nb: '宁波市', sz: '苏州市', nj: '南京市', cd: '成都市', wh: '武汉市', cs: '长沙市', hf: '合肥市' }
  compareCities.value = selectedCities.value.slice(0, 4).map(code => ({
    code,
    name: cityNames[code] || code,
    gdp: Math.floor(Math.random() * 8000 + 6000),
    growth: +(Math.random() * 6 + 3).toFixed(1),
    industryScore: Math.floor(Math.random() * 20 + 70),
    innovationScore: Math.floor(Math.random() * 20 + 68),
    investScore: Math.floor(Math.random() * 20 + 66)
  }))

  comparisonItems.value = compareCities.value.map(c => ({
    name: c.name,
    value: Math.floor((c.industryScore + c.innovationScore + c.investScore) / 3)
  }))

  const indicators = ['GDP(亿元)', 'GDP增速(%)', '产业指数', '创新指数', '招商指数']
  reportData.value = indicators.map((indicator, i) => ({
    indicator,
    unit: i === 0 ? '' : i === 1 ? '' : '分',
    values: compareCities.value.map(c => i === 0 ? c.gdp : i === 1 ? c.growth : i === 2 ? c.industryScore : i === 3 ? c.innovationScore : c.investScore)
  }))

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: compareCities.value.map(c => c.name) },
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
      data: compareCities.value.map((c, idx) => ({
        name: c.name,
        value: [
          Math.floor(Math.random() * 20 + 70),
          c.industryScore,
          c.innovationScore,
          c.investScore,
          Math.floor(Math.random() * 20 + 60)
        ],
        areaStyle: { opacity: 0.15 },
        lineStyle: { color: chartColors[idx] },
        itemStyle: { color: chartColors[idx] }
      }))
    }]
  }

  economyBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: compareCities.value.map(c => c.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['GDP', '产业指数', '创新指数', '招商指数'] },
    yAxis: { type: 'value' },
    series: compareCities.value.map((c, idx) => ({
      name: c.name,
      type: 'bar',
      barWidth: '15%',
      data: [c.gdp / 100, c.industryScore, c.innovationScore, c.investScore]
    }))
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.select-section {
  margin-bottom: 20px;
}
.select-row {
  display: flex;
  gap: 12px;
  align-items: center;
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
.compare-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
  margin-bottom: 20px;
}
.table-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
