<template>
  <div class="page-container">
    <PageHeader title="产业规模" subtitle="各区域产业规模对比分析" />

    <ComparisonSelector @compare="handleCompare" />

    <template v-if="compareData.length >= 2">
      <!-- 维度对比条 -->
      <div class="compare-matrix">
        <h4 class="section-title">核心指标对比</h4>
        <div class="compare-matrix__grid">
          <div v-for="metric in compareMetrics" :key="metric.key" class="compare-matrix__item">
            <div class="compare-matrix__metric-name">{{ metric.label }}</div>
            <ComparisonBar
              :items="
                compareData.map((d) => ({
                  name: d.regionName,
                  [metric.key]: d[metric.key as keyof ScaleIndicators],
                }))
              "
              :metric-key="metric.key"
              :name-key="'name'"
            />
          </div>
        </div>
      </div>

      <!-- 雷达图对比 -->
      <div class="chart-grid">
        <div class="chart-panel">
          <h4 class="chart-panel__title">产业规模综合雷达</h4>
          <BaseChart :option="radarOption" height="360px" />
        </div>
        <div class="chart-panel">
          <h4 class="chart-panel__title">规模增长趋势</h4>
          <BaseChart :option="trendOption" height="360px" />
        </div>
      </div>

      <!-- 对比柱状图 -->
      <div class="chart-grid">
        <div class="chart-panel">
          <h4 class="chart-panel__title">总产值对比</h4>
          <BaseChart :option="barOption" height="320px" />
        </div>
        <div class="chart-panel">
          <h4 class="chart-panel__title">企业数量与税收贡献</h4>
          <BaseChart :option="multiBarOption" height="320px" />
        </div>
      </div>

      <!-- 并排对比表格 -->
      <div class="table-section">
        <h4 class="section-title">产业规模指标明细</h4>
        <el-table :data="compareData" stripe border style="width: 100%">
          <el-table-column prop="regionName" label="区域" width="100" fixed />
          <el-table-column prop="enterpriseCount" label="企业数量(家)" width="130" sortable />
          <el-table-column prop="totalOutput" label="总产值(亿元)" width="130" sortable />
          <el-table-column prop="addedValue" label="增加值(亿元)" width="130" sortable />
          <el-table-column prop="taxContribution" label="税收贡献(亿元)" width="140" sortable />
          <el-table-column prop="fixedAssetInvestment" label="固投(亿元)" width="120" sortable />
          <el-table-column
            prop="outputPerArea"
            label="单位面积产值(亿元/km²)"
            width="180"
            sortable
          />
          <el-table-column prop="outputPerCapita" label="人均产值(万元)" width="130" sortable />
          <el-table-column prop="growth" label="增速(%)" width="100" sortable>
            <template #default="{ row }">
              <span :style="{ color: row.growth >= 0 ? '#4ECB73' : '#F2637B' }">
                {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>

    <el-empty v-else description="请选择至少2个区域进行对比" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ComparisonSelector from '@/components/business/ComparisonSelector.vue'
import ComparisonBar from '@/components/business/ComparisonBar.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchScaleCompare, fetchScaleTrend } from '@/api/modules/benchmarkingApi'
import type { ScaleIndicators } from '@/api/types/benchmarking'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const compareData = ref<ScaleIndicators[]>([])
const selectedNames = ref<string[]>([])

const compareMetrics = [
  { key: 'totalOutput', label: '总产值(亿元)' },
  { key: 'enterpriseCount', label: '企业数量(家)' },
  { key: 'addedValue', label: '增加值(亿元)' },
  { key: 'taxContribution', label: '税收贡献(亿元)' },
  { key: 'fixedAssetInvestment', label: '固定资产投资(亿元)' },
  { key: 'outputPerArea', label: '单位面积产值' },
  { key: 'outputPerCapita', label: '人均产值(万元)' },
]

const radarOption = ref({})
const trendOption = ref({})
const barOption = ref({})
const multiBarOption = ref({})

async function handleCompare(regionIds: string[], regionNames: string[]) {
  if (regionIds.length < 2) {
    compareData.value = []
    return
  }
  selectedNames.value = regionNames
  compareData.value = await fetchScaleCompare(regionIds)
  const trendData = await fetchScaleTrend(regionNames)

  // 雷达图
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: regionNames },
    radar: {
      indicator: [
        { name: '总产值', max: 30000 },
        { name: '增加值', max: 10000 },
        { name: '税收贡献', max: 3500 },
        { name: '固投', max: 4500 },
        { name: '企业数量', max: 7000 },
        { name: '人均产值', max: 70 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: compareData.value.map((d) => ({
          value: [
            d.totalOutput,
            d.addedValue,
            d.taxContribution,
            d.fixedAssetInvestment,
            d.enterpriseCount,
            d.outputPerCapita,
          ],
          name: d.regionName,
        })),
      },
    ],
  }

  // 趋势线
  const years = trendData.map((t) => t.year)
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: regionNames },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value', name: '亿元' },
    series: regionNames.map((name) => ({
      name,
      type: 'line',
      smooth: true,
      data: trendData.map((t) => t[name] as number),
    })),
  }

  // 总产值柱状图
  barOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: compareData.value.map((d) => d.regionName) },
    yAxis: { type: 'value', name: '亿元' },
    series: [
      {
        name: '总产值',
        type: 'bar',
        barMaxWidth: 32,
        barWidth: '40%',
        data: compareData.value.map((d) => d.totalOutput),
      },
    ],
  }

  // 企业数量与税收双轴柱状图
  multiBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['企业数量', '税收贡献'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: compareData.value.map((d) => d.regionName) },
    yAxis: [
      { type: 'value', name: '家' },
      { type: 'value', name: '亿元' },
    ],
    series: [
      {
        name: '企业数量',
        type: 'bar',
        barMaxWidth: 32,
        data: compareData.value.map((d) => d.enterpriseCount),
      },
      {
        name: '税收贡献',
        type: 'bar',
        barMaxWidth: 32,
        yAxisIndex: 1,
        data: compareData.value.map((d) => d.taxContribution),
      },
    ],
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.compare-matrix {
  padding: 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.compare-matrix__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.compare-matrix__item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.compare-matrix__metric-name {
  margin-bottom: 8px;
  font-size: 13px;
  color: $text-secondary;
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
