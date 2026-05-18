<template>
  <div class="page-container">
    <PageHeader title="产业结构" subtitle="各区域产业结构对比分析" />

    <ComparisonSelector @compare="handleCompare" />

    <template v-if="compareData.length >= 2">
      <!-- 主导产业占比对比 -->
      <div class="compare-matrix">
        <h4 class="section-title">主导产业占比对比</h4>
        <div class="dominant-grid">
          <div v-for="industry in dominantIndustries" :key="industry" class="dominant-item">
            <div class="dominant-item__name">{{ industry }}</div>
            <ComparisonBar
              :items="
                compareData.map((d) => {
                  const found = d.dominantIndustries.find((i) => i.name === industry)
                  return { name: d.regionName, value: found?.value ?? 0 }
                })
              "
              metric-key="value"
              name-key="name"
            />
          </div>
        </div>
      </div>

      <!-- 雷达图 + 产业链完整性 -->
      <div class="chart-grid">
        <div class="chart-panel">
          <h4 class="chart-panel__title">产业结构综合雷达</h4>
          <BaseChart :option="radarOption" height="360px" />
        </div>
        <div class="chart-panel">
          <h4 class="chart-panel__title">产业链完整性对比</h4>
          <BaseChart :option="chainOption" height="360px" />
        </div>
      </div>

      <!-- 细分行业 + 产业占比 -->
      <div class="chart-grid">
        <div class="chart-panel">
          <h4 class="chart-panel__title">细分行业分布（所选区域首位）</h4>
          <BaseChart :option="subIndustryOption" height="360px" />
        </div>
        <div class="chart-panel">
          <h4 class="chart-panel__title">高新技术 vs 传统产业</h4>
          <BaseChart :option="compareBarOption" height="360px" />
        </div>
      </div>

      <!-- 产业结构明细表格 -->
      <div class="table-section">
        <h4 class="section-title">产业结构指标明细</h4>
        <el-table :data="tableData" stripe border style="width: 100%">
          <el-table-column prop="regionName" label="区域" width="100" fixed />
          <el-table-column prop="highTechRatio" label="高新技术占比(%)" width="150" sortable />
          <el-table-column
            prop="advancedManufacturingRatio"
            label="先进制造业占比(%)"
            width="160"
            sortable
          />
          <el-table-column prop="traditionalRatio" label="传统产业占比(%)" width="150" sortable />
          <el-table-column label="产业链完整度(%)" width="130">
            <template #default="{ row }"> {{ row.chainCompleteness.overall }}% </template>
          </el-table-column>
          <el-table-column label="上游(%)" width="100">
            <template #default="{ row }">{{ row.chainCompleteness.upstream }}%</template>
          </el-table-column>
          <el-table-column label="中游(%)" width="100">
            <template #default="{ row }">{{ row.chainCompleteness.midstream }}%</template>
          </el-table-column>
          <el-table-column label="下游(%)" width="100">
            <template #default="{ row }">{{ row.chainCompleteness.downstream }}%</template>
          </el-table-column>
        </el-table>
      </div>
    </template>

    <el-empty v-else description="请选择至少2个区域进行对比" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ComparisonSelector from '@/components/business/ComparisonSelector.vue'
import ComparisonBar from '@/components/business/ComparisonBar.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchStructureCompare } from '@/api/modules/benchmarkingApi'
import type { StructureIndicators } from '@/api/types/benchmarking'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const compareData = ref<StructureIndicators[]>([])
const selectedNames = ref<string[]>([])

// 收集所有主导产业名称（去重）
const dominantIndustries = computed(() => {
  const set = new Set<string>()
  compareData.value.forEach((d) => d.dominantIndustries.forEach((i) => set.add(i.name)))
  return [...set]
})

const radarOption = ref({})
const chainOption = ref({})
const subIndustryOption = ref({})
const compareBarOption = ref({})
const tableData = computed(() => compareData.value)

async function handleCompare(regionIds: string[], regionNames: string[]) {
  if (regionIds.length < 2) {
    compareData.value = []
    return
  }
  selectedNames.value = regionNames
  compareData.value = await fetchStructureCompare(regionIds)

  // 雷达图
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: regionNames },
    radar: {
      indicator: [
        { name: '高新技术占比', max: 50 },
        { name: '先进制造业占比', max: 50 },
        { name: '产业链完整性', max: 100 },
        { name: '主导产业集中度', max: 40 },
        { name: '细分行业丰富度', max: 15 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: compareData.value.map((d) => ({
          value: [
            d.highTechRatio,
            d.advancedManufacturingRatio,
            d.chainCompleteness.overall,
            d.dominantIndustries[0]?.value ?? 0,
            d.subIndustries.length,
          ],
          name: d.regionName,
        })),
      },
    ],
  }

  // 产业链完整性对比（分组柱状图）
  const regions = compareData.value.map((d) => d.regionName)
  chainOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['上游', '中游', '下游'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: regions },
    yAxis: { type: 'value', name: '完整度(%)', max: 100 },
    series: [
      {
        name: '上游',
        type: 'bar',
        data: compareData.value.map((d) => d.chainCompleteness.upstream),
      },
      {
        name: '中游',
        type: 'bar',
        data: compareData.value.map((d) => d.chainCompleteness.midstream),
      },
      {
        name: '下游',
        type: 'bar',
        data: compareData.value.map((d) => d.chainCompleteness.downstream),
      },
    ],
  }

  // 细分行业分布（选第一个区域）
  const firstRegion = compareData.value[0]
  if (firstRegion) {
    const subParents = [...new Set(firstRegion.subIndustries.map((s) => s.parent))]
    subIndustryOption.value = {
      color: chartColors,
      tooltip: { trigger: 'axis' },
      legend: { data: subParents },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: firstRegion.subIndustries.map((s) => s.name),
        axisLabel: { rotate: 30 },
      },
      yAxis: { type: 'value', name: '占比(%)' },
      series: subParents.map((parent, idx) => ({
        name: parent,
        type: 'bar',
        barMaxWidth: 32,
        stack: 'total',
        data: firstRegion.subIndustries.map((s) => (s.parent === parent ? s.share : 0)),
        itemStyle: { color: chartColors[idx % chartColors.length] },
      })),
    }
  }

  // 高新技术 vs 传统产业
  compareBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['高新技术', '先进制造业', '传统产业'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: compareData.value.map((d) => d.regionName) },
    yAxis: { type: 'value', name: '%' },
    series: [
      { name: '高新技术', type: 'bar', data: compareData.value.map((d) => d.highTechRatio) },
      {
        name: '先进制造业',
        type: 'bar',
        data: compareData.value.map((d) => d.advancedManufacturingRatio),
      },
      { name: '传统产业', type: 'bar', data: compareData.value.map((d) => d.traditionalRatio) },
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

.dominant-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.dominant-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.dominant-item__name {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
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
