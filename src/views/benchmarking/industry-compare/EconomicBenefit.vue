<template>
  <div class="page-container">
    <PageHeader title="经济效益" subtitle="各区域产业经济效益对比分析">
      <template #actions>
        <el-button type="primary" @click="handleExport">导出报告</el-button>
      </template>
    </PageHeader>

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
                  [metric.key]: d[metric.key as keyof EconomicIndicators],
                }))
              "
              :metric-key="metric.key"
              :name-key="'name'"
            />
          </div>
        </div>
      </div>

      <!-- 雷达图 + 趋势 -->
      <div class="chart-grid">
        <div class="chart-panel">
          <h4 class="chart-panel__title">经济效益综合雷达</h4>
          <BaseChart :option="radarOption" height="360px" />
        </div>
        <div class="chart-panel">
          <h4 class="chart-panel__title">利润率趋势</h4>
          <BaseChart :option="trendOption" height="360px" />
        </div>
      </div>

      <!-- 利润率/ROI对比 + 碳排放强度 -->
      <div class="chart-grid">
        <div class="chart-panel">
          <h4 class="chart-panel__title">利润率与投资回报率对比</h4>
          <BaseChart :option="profitRoiOption" height="320px" />
        </div>
        <div class="chart-panel">
          <h4 class="chart-panel__title">单位能耗产值与碳排放强度</h4>
          <BaseChart :option="energyCarbonOption" height="320px" />
        </div>
      </div>

      <!-- 并排对比表格 -->
      <div class="table-section">
        <h4 class="section-title">经济效益指标明细</h4>
        <el-table :data="compareData" stripe border style="width: 100%">
          <el-table-column prop="regionName" label="区域" width="100" fixed />
          <el-table-column prop="profitRate" label="利润率(%)" width="110" sortable />
          <el-table-column prop="revenueGrowth" label="营收增长率(%)" width="130" sortable>
            <template #default="{ row }">
              <span :style="{ color: row.revenueGrowth >= 0 ? '#4ECB73' : '#F2637B' }">
                {{ row.revenueGrowth >= 0 ? '+' : '' }}{{ row.revenueGrowth }}%
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="taxGrowth" label="税收增长率(%)" width="130" sortable>
            <template #default="{ row }">
              <span :style="{ color: row.taxGrowth >= 0 ? '#4ECB73' : '#F2637B' }">
                {{ row.taxGrowth >= 0 ? '+' : '' }}{{ row.taxGrowth }}%
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="roi" label="投资回报率(%)" width="130" sortable />
          <el-table-column
            prop="outputPerEnergy"
            label="单位能耗产值(万元/吨标煤)"
            width="200"
            sortable
          />
          <el-table-column
            prop="carbonIntensity"
            label="碳排放强度(tCO₂/万元)"
            width="180"
            sortable
          />
          <el-table-column prop="taxPerCapita" label="人均纳税(万元)" width="130" sortable />
          <el-table-column prop="outputPerCapita" label="人均产值(万元)" width="130" sortable />
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
import { fetchEconomicCompare, fetchEconomicTrend } from '@/api/modules/benchmarkingApi'
import type { EconomicIndicators } from '@/api/types/benchmarking'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const compareData = ref<EconomicIndicators[]>([])
const selectedNames = ref<string[]>([])

const compareMetrics = [
  { key: 'profitRate', label: '利润率(%)' },
  { key: 'revenueGrowth', label: '营收增长率(%)' },
  { key: 'roi', label: '投资回报率(%)' },
  { key: 'outputPerEnergy', label: '单位能耗产值(万元/吨标煤)' },
  { key: 'carbonIntensity', label: '碳排放强度(tCO₂/万元)' },
  { key: 'taxPerCapita', label: '人均纳税(万元)' },
]

const radarOption = ref({})
const trendOption = ref({})
const profitRoiOption = ref({})
const energyCarbonOption = ref({})

async function handleCompare(regionIds: string[], regionNames: string[]) {
  if (regionIds.length < 2) {
    compareData.value = []
    return
  }
  selectedNames.value = regionNames
  compareData.value = await fetchEconomicCompare(regionIds)
  const trendData = await fetchEconomicTrend(regionNames)

  // 雷达图
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: regionNames },
    radar: {
      indicator: [
        { name: '利润率', max: 18 },
        { name: '营收增长率', max: 18 },
        { name: '税收增长率', max: 15 },
        { name: '投资回报率', max: 20 },
        { name: '单位能耗产值', max: 3.5 },
        { name: '碳排放强度(逆)', max: 0.7 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: compareData.value.map((d) => ({
          value: [
            d.profitRate,
            d.revenueGrowth,
            d.taxGrowth,
            d.roi,
            d.outputPerEnergy,
            d.carbonIntensity,
          ],
          name: d.regionName,
        })),
      },
    ],
  }

  // 利润率趋势
  const years = trendData.map((t) => t.year)
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: regionNames },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value', name: '%' },
    series: regionNames.map((name) => ({
      name,
      type: 'line',
      smooth: true,
      data: trendData.map((t) => t[name] as number),
    })),
  }

  // 利润率 & ROI 对比
  const regions = compareData.value.map((d) => d.regionName)
  profitRoiOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['利润率', '投资回报率'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: regions },
    yAxis: { type: 'value', name: '%' },
    series: [
      {
        name: '利润率',
        type: 'bar',
        barMaxWidth: 32,
        data: compareData.value.map((d) => d.profitRate),
      },
      {
        name: '投资回报率',
        type: 'bar',
        barMaxWidth: 32,
        data: compareData.value.map((d) => d.roi),
      },
    ],
  }

  // 单位能耗产值 + 碳排放强度（双轴）
  energyCarbonOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['单位能耗产值', '碳排放强度'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: regions },
    yAxis: [
      { type: 'value', name: '万元/吨标煤' },
      { type: 'value', name: 'tCO₂/万元' },
    ],
    series: [
      {
        name: '单位能耗产值',
        type: 'bar',
        barMaxWidth: 32,
        data: compareData.value.map((d) => d.outputPerEnergy),
      },
      {
        name: '碳排放强度',
        type: 'line',
        yAxisIndex: 1,
        data: compareData.value.map((d) => d.carbonIntensity),
      },
    ],
  }
}

function handleExport() {
  // 导出报告
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
