<template>
  <div class="page-container">
    <PageHeader title="人才资源" subtitle="各区域产业人才资源对比分析" />

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
                  [metric.key]: d[metric.key as keyof TalentIndicators],
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
          <h4 class="chart-panel__title">人才资源综合雷达</h4>
          <BaseChart :option="radarOption" height="360px" />
        </div>
        <div class="chart-panel">
          <h4 class="chart-panel__title">人才总量趋势</h4>
          <BaseChart :option="trendOption" height="360px" />
        </div>
      </div>

      <!-- 人才结构 + 政策力度 -->
      <div class="chart-grid">
        <div class="chart-panel">
          <h4 class="chart-panel__title">人才结构与政策力度对比</h4>
          <BaseChart :option="talentPolicyOption" height="320px" />
        </div>
        <div class="chart-panel">
          <h4 class="chart-panel__title">高校与科研机构分布</h4>
          <BaseChart :option="univResearchOption" height="320px" />
        </div>
      </div>

      <!-- 并排对比表格 -->
      <div class="table-section">
        <h4 class="section-title">人才资源指标明细</h4>
        <el-table :data="compareData" stripe border style="width: 100%">
          <el-table-column prop="regionName" label="区域" width="100" fixed />
          <el-table-column prop="totalEmployees" label="从业人员(万人)" min-width="140" sortable />
          <el-table-column
            prop="seniorTalentRatio"
            label="高层次人才占比(%)"
            min-width="160"
            sortable
          />
          <el-table-column prop="talentPolicyScore" label="政策力度评分" min-width="130" sortable />
          <el-table-column prop="universities" label="高校(所)" min-width="100" sortable />
          <el-table-column
            prop="researchInstitutes"
            label="科研机构(所)"
            min-width="120"
            sortable
          />
          <el-table-column prop="rdTalentCount" label="研发人才(万人)" min-width="130" sortable />
          <el-table-column prop="netInflowRate" label="净流入率(%)" min-width="120" sortable>
            <template #default="{ row }">
              <span :style="{ color: row.netInflowRate >= 0 ? '#4ECB73' : '#F2637B' }">
                {{ row.netInflowRate >= 0 ? '+' : '' }}{{ row.netInflowRate }}%
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="avgSalary" label="平均薪资(万元)" min-width="140" sortable />
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
import { fetchTalentCompare, fetchTalentTrend } from '@/api/modules/benchmarkingApi'
import type { TalentIndicators } from '@/api/types/benchmarking'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const compareData = ref<TalentIndicators[]>([])
const selectedNames = ref<string[]>([])

const compareMetrics = [
  { key: 'totalEmployees', label: '从业人员(万人)' },
  { key: 'seniorTalentRatio', label: '高层次人才占比(%)' },
  { key: 'talentPolicyScore', label: '政策力度评分' },
  { key: 'universities', label: '高校(所)' },
  { key: 'researchInstitutes', label: '科研机构(所)' },
  { key: 'avgSalary', label: '平均薪资(万元)' },
]

const radarOption = ref({})
const trendOption = ref({})
const talentPolicyOption = ref({})
const univResearchOption = ref({})

async function handleCompare(regionIds: string[], regionNames: string[]) {
  if (regionIds.length < 2) {
    compareData.value = []
    return
  }
  selectedNames.value = regionNames
  compareData.value = await fetchTalentCompare(regionIds)
  const trendData = await fetchTalentTrend(regionNames)

  // 雷达图
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: regionNames },
    radar: {
      indicator: [
        { name: '从业人员', max: 90 },
        { name: '高层次占比', max: 25 },
        { name: '政策力度', max: 100 },
        { name: '高校', max: 110 },
        { name: '科研机构', max: 160 },
        { name: '净流入率', max: 8 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: compareData.value.map((d) => ({
          value: [
            d.totalEmployees,
            d.seniorTalentRatio,
            d.talentPolicyScore,
            d.universities,
            d.researchInstitutes,
            Math.max(d.netInflowRate, 0),
          ],
          name: d.regionName,
        })),
      },
    ],
  }

  // 人才总量趋势
  const years = trendData.map((t) => t.year)
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: regionNames },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value', name: '万人' },
    series: regionNames.map((name) => ({
      name,
      type: 'line',
      smooth: true,
      data: trendData.map((t) => t[name] as number),
    })),
  }

  // 人才结构 + 政策力度（双轴）
  const regions = compareData.value.map((d) => d.regionName)
  talentPolicyOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['高层次人才占比', '政策力度评分'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: regions },
    yAxis: [
      { type: 'value', name: '%' },
      { type: 'value', name: '评分' },
    ],
    series: [
      {
        name: '高层次人才占比',
        type: 'bar',
        barMaxWidth: 32,
        data: compareData.value.map((d) => d.seniorTalentRatio),
      },
      {
        name: '政策力度评分',
        type: 'bar',
        barMaxWidth: 32,
        yAxisIndex: 1,
        data: compareData.value.map((d) => d.talentPolicyScore),
      },
    ],
  }

  // 高校 + 科研机构
  univResearchOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['高校', '科研机构'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: regions },
    yAxis: { type: 'value', name: '所' },
    series: [
      {
        name: '高校',
        type: 'bar',
        barMaxWidth: 32,
        data: compareData.value.map((d) => d.universities),
      },
      {
        name: '科研机构',
        type: 'bar',
        barMaxWidth: 32,
        data: compareData.value.map((d) => d.researchInstitutes),
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
