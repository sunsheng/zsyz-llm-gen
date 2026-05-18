<template>
  <div class="page-container">
    <PageHeader title="创新能力" subtitle="各区域产业创新能力对比分析" />

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
                  [metric.key]: d[metric.key as keyof InnovationIndicators],
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
          <h4 class="chart-panel__title">创新能力综合雷达</h4>
          <BaseChart :option="radarOption" height="360px" />
        </div>
        <div class="chart-panel">
          <h4 class="chart-panel__title">创新指数趋势</h4>
          <BaseChart :option="trendOption" height="360px" />
        </div>
      </div>

      <!-- R&D对比 + 技术交易额 -->
      <div class="chart-grid">
        <div class="chart-panel">
          <h4 class="chart-panel__title">研发投入与高新技术对比</h4>
          <BaseChart :option="rdCompareOption" height="320px" />
        </div>
        <div class="chart-panel">
          <h4 class="chart-panel__title">技术交易额与创新平台数量</h4>
          <BaseChart :option="tradePlatformOption" height="320px" />
        </div>
      </div>

      <!-- 并排对比表格 -->
      <div class="table-section">
        <h4 class="section-title">创新能力指标明细</h4>
        <el-table :data="compareData" stripe border style="width: 100%">
          <el-table-column prop="regionName" label="区域" width="100" fixed />
          <el-table-column prop="rdRatio" label="R&D占比(%)" width="120" sortable />
          <el-table-column
            prop="highTechEnterpriseCount"
            label="高新技术企业(家)"
            width="160"
            sortable
          />
          <el-table-column prop="patentCount" label="专利授权量(件)" width="140" sortable />
          <el-table-column prop="techTradeAmount" label="技术交易额(亿元)" width="150" sortable />
          <el-table-column
            prop="innovationPlatformCount"
            label="创新平台(个)"
            width="130"
            sortable
          />
          <el-table-column prop="rdTalentCount" label="研发人员(万人)" width="130" sortable />
          <el-table-column prop="innovationIndex" label="创新指数" width="110" sortable />
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
import { fetchInnovationCompare, fetchInnovationTrend } from '@/api/modules/benchmarkingApi'
import type { InnovationIndicators } from '@/api/types/benchmarking'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const compareData = ref<InnovationIndicators[]>([])
const selectedNames = ref<string[]>([])

const compareMetrics = [
  { key: 'rdRatio', label: 'R&D占比(%)' },
  { key: 'highTechEnterpriseCount', label: '高新技术企业(家)' },
  { key: 'patentCount', label: '专利授权量(件)' },
  { key: 'techTradeAmount', label: '技术交易额(亿元)' },
  { key: 'innovationPlatformCount', label: '创新平台(个)' },
  { key: 'innovationIndex', label: '创新指数' },
]

const radarOption = ref({})
const trendOption = ref({})
const rdCompareOption = ref({})
const tradePlatformOption = ref({})

async function handleCompare(regionIds: string[], regionNames: string[]) {
  if (regionIds.length < 2) {
    compareData.value = []
    return
  }
  selectedNames.value = regionNames
  compareData.value = await fetchInnovationCompare(regionIds)
  const trendData = await fetchInnovationTrend(regionNames)

  // 雷达图
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: regionNames },
    radar: {
      indicator: [
        { name: 'R&D占比', max: 5 },
        { name: '高新技术企业', max: 12000 },
        { name: '专利授权量', max: 60000 },
        { name: '技术交易额', max: 3500 },
        { name: '创新平台', max: 200 },
        { name: '创新指数', max: 100 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: compareData.value.map((d) => ({
          value: [
            d.rdRatio,
            d.highTechEnterpriseCount,
            d.patentCount,
            d.techTradeAmount,
            d.innovationPlatformCount,
            d.innovationIndex,
          ],
          name: d.regionName,
        })),
      },
    ],
  }

  // 创新指数趋势
  const years = trendData.map((t) => t.year)
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: regionNames },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value', name: '指数' },
    series: regionNames.map((name) => ({
      name,
      type: 'line',
      smooth: true,
      data: trendData.map((t) => t[name] as number),
    })),
  }

  // R&D 与高新企业对比（双轴）
  const regions = compareData.value.map((d) => d.regionName)
  rdCompareOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['R&D占比', '高新技术企业'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: regions },
    yAxis: [
      { type: 'value', name: '%' },
      { type: 'value', name: '家' },
    ],
    series: [
      {
        name: 'R&D占比',
        type: 'bar',
        barMaxWidth: 32,
        data: compareData.value.map((d) => d.rdRatio),
      },
      {
        name: '高新技术企业',
        type: 'bar',
        barMaxWidth: 32,
        yAxisIndex: 1,
        data: compareData.value.map((d) => d.highTechEnterpriseCount),
      },
    ],
  }

  // 技术交易额 + 创新平台（双轴）
  tradePlatformOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['技术交易额', '创新平台'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: regions },
    yAxis: [
      { type: 'value', name: '亿元' },
      { type: 'value', name: '个' },
    ],
    series: [
      {
        name: '技术交易额',
        type: 'bar',
        barMaxWidth: 32,
        data: compareData.value.map((d) => d.techTradeAmount),
      },
      {
        name: '创新平台',
        type: 'line',
        yAxisIndex: 1,
        data: compareData.value.map((d) => d.innovationPlatformCount),
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
