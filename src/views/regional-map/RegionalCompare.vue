<template>
  <div class="page-container">
    <PageHeader title="区域对比" subtitle="多区域产业发展对比分析">
      <template #actions>
        <el-button>导出PDF</el-button>
      </template>
    </PageHeader>

    <div class="select-section">
      <div class="chart-panel">
        <h4 class="chart-panel__title">选择对比区域</h4>
        <div class="select-row">
          <el-select
            v-model="selectedRegions"
            multiple
            placeholder="请选择区域（最多4个）"
            :max-collapse-tags="3"
            style="width: 500px"
          >
            <el-option
              v-for="item in regionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
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
        <h4 class="chart-panel__title">GDP及增速对比</h4>
        <BaseChart :option="gdpBarOption" height="360px" />
      </div>
    </div>

    <div class="compare-section">
      <h4 class="chart-panel__title">关键指标对比</h4>
      <ComparisonBar :items="comparisonItems" metric-key="value" name-key="name" />
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">区域对比详情</h4>
      <el-table :data="compareTableData" stripe border style="width: 100%">
        <el-table-column prop="indicator" label="指标" min-width="160" />
        <el-table-column
          v-for="(region, idx) in compareRegions"
          :key="idx"
          :label="region.name"
          min-width="120"
        >
          <template #default="{ row }">
            <span
              :style="{
                fontWeight:
                  row.values[idx] === Math.max(...row.values.filter(Number.isFinite)) ? 700 : 400,
                color:
                  row.values[idx] === Math.max(...row.values.filter(Number.isFinite))
                    ? '#1889E8'
                    : '',
              }"
            >
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

const regionOptions = [
  { label: '杭州市', value: 'hz' },
  { label: '宁波市', value: 'nb' },
  { label: '温州市', value: 'wz' },
  { label: '嘉兴市', value: 'jx' },
  { label: '湖州市', value: 'hz2' },
  { label: '绍兴市', value: 'sx' },
  { label: '金华市', value: 'jh' },
  { label: '台州市', value: 'tz' },
]

const selectedRegions = ref<string[]>(['hz', 'nb', 'wz'])
const compareRegions = ref<any[]>([])
const comparisonItems = ref<any[]>([])
const compareTableData = ref<any[]>([])
const radarOption = ref({})
const gdpBarOption = ref({})

onMounted(() => {
  handleCompare()
})

function handleCompare() {
  const regionNames: Record<string, string> = {
    hz: '杭州市',
    nb: '宁波市',
    wz: '温州市',
    jx: '嘉兴市',
    hz2: '湖州市',
    sx: '绍兴市',
    jh: '金华市',
    tz: '台州市',
  }
  compareRegions.value = selectedRegions.value.slice(0, 4).map((code) => ({
    code,
    name: regionNames[code] || code,
    gdp: Math.floor(Math.random() * 8000 + 1000),
    growth: +(Math.random() * 8 + 3).toFixed(1),
    enterprises: Math.floor(Math.random() * 2000 + 200),
    investAmount: Math.floor(Math.random() * 500 + 50),
  }))

  comparisonItems.value = compareRegions.value.map((r) => ({
    name: r.name,
    value: r.gdp,
  }))

  const indicators = ['GDP(亿元)', 'GDP增速(%)', '企业数(家)', '引资额(亿元)', '高新企业数(家)']
  compareTableData.value = indicators.map((indicator, i) => ({
    indicator,
    unit: '',
    values: compareRegions.value.map((r) =>
      i === 0
        ? r.gdp
        : i === 1
          ? r.growth
          : i === 2
            ? r.enterprises
            : i === 3
              ? r.investAmount
              : Math.floor(Math.random() * 1000 + 100),
    ),
  }))

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: compareRegions.value.map((r) => r.name) },
    radar: {
      indicator: [
        { name: '经济实力', max: 100 },
        { name: '产业水平', max: 100 },
        { name: '创新能力', max: 100 },
        { name: '招商环境', max: 100 },
        { name: '人才密度', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: compareRegions.value.map((r, idx) => ({
          name: r.name,
          value: Array.from({ length: 5 }, () => Math.floor(Math.random() * 30 + 60)),
          areaStyle: { opacity: 0.15 },
          lineStyle: { color: chartColors[idx] },
          itemStyle: { color: chartColors[idx] },
        })),
      },
    ],
  }

  gdpBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['GDP(亿元)', '增速(%)'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: compareRegions.value.map((r) => r.name) },
    yAxis: [
      { type: 'value', name: 'GDP' },
      { type: 'value', name: '增速', axisLabel: { formatter: '{value}%' } },
    ],
    series: [
      {
        name: 'GDP(亿元)',
        type: 'bar',
        barWidth: '25%',
        data: compareRegions.value.map((r) => r.gdp),
      },
      {
        name: '增速(%)',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: compareRegions.value.map((r) => r.growth),
      },
    ],
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
.compare-section {
  padding: 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.table-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
